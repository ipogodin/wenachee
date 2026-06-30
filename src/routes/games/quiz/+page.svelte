<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { QUIZ } from '$lib/config/quiz.js';

  const debug = $derived($page.url.searchParams.has('debug'));

  const TIME_PER_Q = QUIZ.timePerQuestion ?? 30;
  const PTS_PER_Q  = QUIZ.pointsPerQuestion ?? 10;

  // ── Audio ──────────────────────────────────────────────────────
  let theme;
  let winSfx;
  let failSfxPool = [];
  let masterVolume = $state(0.7);
  let muted        = $state(false);

  const FAIL_SOUNDS = [
    '/sounds/wen_quiz_failed_1.mp3', '/sounds/wen_quiz_failed_2.mp3',
    '/sounds/wen_quiz_failed_3.mp3', '/sounds/wen_quiz_failed_4.mp3',
    '/sounds/wen_quiz_failed_5.mp3', '/sounds/wen_quiz_failed_6.mp3',
  ];

  onMount(() => {
    theme = new Audio('/sounds/wen_quiz_theme.mp3');
    theme.loop = true;
    winSfx = new Audio('/sounds/wen_quiz_win.mp3');
    failSfxPool = FAIL_SOUNDS.map(src => new Audio(src));
    return () => { theme.pause(); };
  });

  $effect(() => {
    if (theme) theme.volume = (muted ? 0 : masterVolume) * 0.5;
  });

  function toggleMute() { muted = !muted; }

  function playWin() {
    if (!winSfx) return;
    winSfx.currentTime = 0;
    winSfx.volume = muted ? 0 : masterVolume;
    winSfx.play().catch(() => {});
  }

  function playFail() {
    if (!failSfxPool.length) return;
    const sfx = failSfxPool[Math.floor(Math.random() * failSfxPool.length)];
    sfx.currentTime = 0;
    sfx.volume = muted ? 0 : masterVolume;
    sfx.play().catch(() => {});
  }

  let volIcon = $derived(
    muted || masterVolume === 0 ? '🔇' : masterVolume < 0.45 ? '🔉' : '🔊'
  );

  // ── Game state ──────────────────────────────────────────────────
  let questionIndex = $state(0);
  let selected      = $state(null);   // option id | null
  let result        = $state(null);   // 'correct' | 'wrong' | 'timeout' | null
  let timeLeft      = $state(TIME_PER_Q);
  let status        = $state('intro'); // 'intro' | 'playing' | 'won' | 'lost'
  let timerActive   = $state(false);
  let hoveredOpt    = $state(null);
  let points        = $state(0);
  let punchText     = $state('');

  let q            = $derived(QUIZ.questions[questionIndex]);
  let hotspotSize  = $derived(q.hotspotSize ?? 21);
  let timerPct   = $derived(timeLeft / TIME_PER_Q);
  let timerColor = $derived(
    timerPct > 0.5 ? '#06d6a0' : timerPct > 0.25 ? '#ffd23f' : '#ff6b35'
  );
  let hoveredHint = $derived(
    hoveredOpt !== null ? q.options.find(o => o.id === hoveredOpt)?.hint : null
  );

  $effect(() => {
    if (!timerActive) return;
    const id = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(id);
        timerActive = false;
        handleTimeout();
      }
    }, 1000);
    return () => clearInterval(id);
  });


  function startGame() {
    status = 'playing';
    timerActive = true;
    theme?.play().catch(() => {});
  }

  function pick(optId) {
    if (selected !== null || result !== null) return;
    selected = optId;
    timerActive = false;
    hoveredOpt = null;

    const opt = q.options.find(o => o.id === optId);
    punchText = opt?.punch ?? '';

    if (optId === q.correctAnswer) {
      result = 'correct';
      points += PTS_PER_Q;
      setTimeout(advance, 1800);
    } else {
      result = 'wrong';
      playFail();
      setTimeout(() => { status = 'lost'; theme?.pause(); }, 1800);
    }
  }

  function handleTimeout() {
    result = 'timeout';
    punchText = q.timeoutMessage ?? "Time's up!";
    playFail();
    setTimeout(() => { status = 'lost'; theme?.pause(); }, 1800);
  }

  function advance() {
    if (questionIndex < QUIZ.questions.length - 1) {
      questionIndex++;
      selected = null;
      result = null;
      punchText = '';
      timeLeft = TIME_PER_Q;
      hoveredOpt = null;
      timerActive = true;
    } else {
      status = 'won';
      theme?.pause();
      playWin();
    }
  }

  function restart() {
    questionIndex = 0;
    selected = null;
    result = null;
    punchText = '';
    timeLeft = TIME_PER_Q;
    status = 'intro';
    hoveredOpt = null;
    points = 0;
    timerActive = false;
    theme?.pause();
    if (theme) theme.currentTime = 0;
  }

  function hotspotClasses(opt) {
    if (result === null) return { hotspot: true };
    if (result === 'correct') {
      return {
        hotspot: true,
        correct: opt.id === q.correctAnswer,
        dimmed:  opt.id !== q.correctAnswer,
      };
    }
    // wrong or timeout — never reveal the correct answer
    return {
      hotspot: true,
      wrong:  opt.id === selected,
      dimmed: opt.id !== selected,
    };
  }
</script>

<svelte:head>
  <title>Camp Quiz · Wenatchee 2026</title>
</svelte:head>

<nav class="top-nav">
  <a href="/games" class="back-link">← Games</a>
  <span class="nav-title">🎯 {QUIZ.title}</span>

  <div class="sound-ctrl">
    <button class="sound-btn" onclick={toggleMute} title={muted ? 'Unmute' : 'Mute'}>{volIcon}</button>
    <input type="range" class="vol-slider" min="0" max="1" step="0.05"
           bind:value={masterVolume}
           oninput={() => { if (muted && masterVolume > 0) muted = false; }} />
  </div>

  <span class="q-counter">{questionIndex + 1} / {QUIZ.questions.length}</span>
</nav>

<div class="scene">

  <!-- Timer bar -->
  <div class="timer-bar">
    <div class="timer-fill" style="width:{timerPct * 100}%; background:{timerColor};"></div>
    <span class="timer-label" style="color:{timerColor}">{timeLeft}s</span>
  </div>

  <!-- Image zone -->
  <div class="image-zone">
    <div class="image-wrap"
         class:flash-correct={result === 'correct'}
         class:flash-wrong={result === 'wrong' || result === 'timeout'}>
      <img src={q.image} alt="Quiz question" class="quiz-img" draggable="false" />

      {#each q.options as opt (opt.id)}
        <button
          class={hotspotClasses(opt)}
          style="left:{opt.x}%; top:{opt.y}%; width:{hotspotSize}%;"
          onmouseenter={() => { if (result === null) hoveredOpt = opt.id; }}
          onmouseleave={() => { hoveredOpt = null; }}
          onclick={() => pick(opt.id)}
          disabled={result !== null}
          aria-label="{opt.id}. {opt.label}"
          class:debug
        >
          {#if debug}<span class="hs-debug-label">{opt.x},{opt.y}</span>{/if}
        </button>
      {/each}
    </div>
  </div>

  <!-- Hint / punch strip -->
  <div class="hint-strip">
    {#if punchText}
      <span class="punch-text" class:punch-correct={result === 'correct'} class:punch-wrong={result === 'wrong' || result === 'timeout'}>{punchText}</span>
    {:else if hoveredHint}
      <span class="hint-text">💬 {hoveredHint}</span>
    {:else if result === null}
      <span class="hint-idle">Tap a circle to answer</span>
    {/if}
  </div>
</div>

<!-- INTRO -->
{#if status === 'intro'}
  <div class="end-overlay">
    <div class="end-card intro-card">
      <div class="end-icon bob">🎯</div>
      <h2 class="intro-title">Camp Quiz</h2>
      <p class="intro-sub">How well do you know the crew?<br>Tap the right circle before time runs out.</p>
      <button class="pill primary big" onclick={startGame}>Let's Go! →</button>
    </div>
  </div>
{/if}

<!-- WIN -->
{#if status === 'won'}
  <div class="end-overlay">
    <div class="end-card win-card">
      <div class="end-icon">🏆</div>
      <h2>You nailed it!</h2>
      <p>All {QUIZ.questions.length} questions correct!</p>
      <div class="points-display">
        <span class="pts-num">+{points}</span>
        <span class="pts-label">points</span>
      </div>
      <div class="end-actions">
        <button class="pill primary" onclick={restart}>Play again</button>
        <a href="/games" class="pill">← All games</a>
      </div>
    </div>
  </div>
{/if}

<!-- LOST -->
{#if status === 'lost'}
  <div class="end-overlay">
    <div class="end-card lost-card">
      <div class="end-icon">💀</div>
      <h2>Game Over</h2>
      {#if points > 0}
        <div class="points-display">
          <span class="pts-num">+{points}</span>
          <span class="pts-label">point{points === 1 ? '' : 's'} earned</span>
        </div>
      {:else}
        <p class="zero-pts">0 points this round</p>
      {/if}
      <div class="end-actions">
        <button class="pill primary" onclick={restart}>Try again</button>
        <a href="/games" class="pill">← All games</a>
      </div>
    </div>
  </div>
{/if}

<style>
  :global(body) { overflow: hidden; }

  /* ── Nav ── */
  .top-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 30;
    height: 44px; display: flex; align-items: center; gap: 0.8rem; padding: 0 1.2rem;
    background: rgba(5,15,28,0.9); backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .back-link { color: rgba(255,255,255,0.55); text-decoration: none; font-size: 0.8rem; font-weight: 700; transition: color .15s; flex-shrink: 0; }
  .back-link:hover { color: #fff; }
  .nav-title { flex: 1; font-size: 0.88rem; font-weight: 800; }
  .q-counter { font-size: 0.8rem; opacity: 0.6; font-weight: 700; flex-shrink: 0; }

  .sound-ctrl { display: flex; align-items: center; gap: 0.4rem; flex-shrink: 0; }
  .sound-btn {
    background: none; border: none; color: #fff;
    font-size: 1rem; cursor: pointer; padding: 0; line-height: 1;
    opacity: 0.75; transition: opacity 0.15s;
  }
  .sound-btn:hover { opacity: 1; }
  .vol-slider {
    -webkit-appearance: none; appearance: none;
    width: 70px; height: 3px;
    background: rgba(255,255,255,0.2); border-radius: 2px;
    cursor: pointer; outline: none;
  }
  .vol-slider::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    width: 11px; height: 11px; border-radius: 50%;
    background: #06d6a0; cursor: pointer;
  }
  .vol-slider::-moz-range-thumb {
    width: 11px; height: 11px; border-radius: 50%; border: none;
    background: #06d6a0; cursor: pointer;
  }

  /* ── Scene ── */
  .scene {
    position: fixed; top: 44px; left: 0; right: 0; bottom: 0;
    display: flex; flex-direction: column;
    background: #060e18;
  }

  /* ── Timer ── */
  .timer-bar {
    position: relative; height: 6px; flex-shrink: 0;
    background: rgba(255,255,255,0.08);
  }
  .timer-fill { height: 100%; transition: width 1s linear, background 0.5s; border-radius: 0 3px 3px 0; }
  .timer-label {
    position: absolute; right: 10px; top: 8px;
    font-size: 0.7rem; font-weight: 800; transition: color 0.5s;
  }

  /* ── Image zone ── */
  .image-zone {
    flex: 1; min-height: 0;
    display: flex; align-items: center; justify-content: center;
    container-type: size;
  }

  .image-wrap {
    position: relative;
    width:  min(100cqw, calc(100cqh * 16 / 9));
    height: min(100cqh, calc(100cqw * 9 / 16));
    flex-shrink: 0;
  }
  .image-wrap.flash-correct { animation: flash-green 0.5s ease; }
  .image-wrap.flash-wrong   { animation: flash-red   0.5s ease; }
  @keyframes flash-green { 40% { box-shadow: inset 0 0 0 6px #06d6a0, 0 0 30px rgba(6,214,160,0.4); } }
  @keyframes flash-red   { 40% { box-shadow: inset 0 0 0 6px #ff4444, 0 0 30px rgba(255,68,68,0.4);  } }

  .quiz-img { width: 100%; height: 100%; display: block; object-fit: fill; user-select: none; }

  /* ── Hotspots ── */
  .hotspot {
    position: absolute;
    width: 21%; aspect-ratio: 1;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    background: transparent;
    border: 2px solid transparent;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.12s;
  }
  .hotspot:hover:not(:disabled) {
    border-color: rgba(255,255,255,0.75);
    background: rgba(255,255,255,0.1);
    transform: translate(-50%, -50%) scale(1.06);
    box-shadow: 0 0 24px rgba(255,255,255,0.25);
  }
  .hotspot:disabled { cursor: default; }

  .hotspot.correct {
    border-color: #06d6a0;
    background: rgba(6,214,160,0.2);
    box-shadow: 0 0 28px rgba(6,214,160,0.5);
  }
  .hotspot.wrong {
    border-color: #ff4444;
    background: rgba(255,68,68,0.2);
    box-shadow: 0 0 28px rgba(255,68,68,0.4);
    animation: hs-shake 0.4s ease;
  }
  .hotspot.dimmed {
    border-color: rgba(0,0,0,0.5);
    background: rgba(0,0,0,0.4);
  }

  @keyframes hs-shake {
    0%,100% { transform: translate(-50%,-50%); }
    25%      { transform: translate(calc(-50% - 6px),-50%); }
    75%      { transform: translate(calc(-50% + 6px),-50%); }
  }

  /* Debug calibration overlay */
  .hotspot.debug {
    border: 2px dashed rgba(255,80,80,0.9) !important;
    background: rgba(255,80,80,0.18) !important;
  }
  .hs-debug-label {
    position: absolute; bottom: 6%; left: 50%;
    transform: translateX(-50%);
    font-size: clamp(0.4rem, 0.8cqw, 0.65rem); font-weight: 900;
    color: #ff5050; background: rgba(0,0,0,0.75);
    padding: 1px 5px; border-radius: 4px;
    white-space: nowrap; pointer-events: none;
  }

  /* ── Hint / punch strip ── */
  .hint-strip {
    flex-shrink: 0; min-height: 38px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(5,15,28,0.88);
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 0.3rem 1.2rem;
  }
  .hint-text {
    font-size: 0.78rem; font-style: italic; color: rgba(255,255,255,0.75);
    animation: hint-in 0.15s ease; text-align: center;
  }
  .hint-idle { font-size: 0.7rem; opacity: 0.3; }

  .punch-text {
    font-size: clamp(0.72rem, 1.5vw, 0.9rem);
    font-weight: 700;
    text-align: center;
    animation: punch-in 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .punch-correct { color: #06d6a0; }
  .punch-wrong   { color: #ff6b6b; }

  @keyframes hint-in  { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
  @keyframes punch-in { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }

  /* ── End overlays ── */
  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes card-pop { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }

  .end-overlay {
    position: fixed; inset: 0; z-index: 50;
    background: rgba(0,0,0,0.8); backdrop-filter: blur(10px);
    display: flex; align-items: center; justify-content: center;
    animation: fade-in 0.3s ease;
  }
  .end-card {
    border-radius: 24px; padding: 2.5rem; text-align: center;
    max-width: 340px; width: 90%;
    animation: card-pop 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }
  .win-card  { background: #0d2137; border: 2px solid #06d6a0; }
  .lost-card { background: #1a0808; border: 2px solid #c53030; }

  @keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
  .bob { animation: bob 2.2s ease-in-out infinite; }

  .intro-card { border-color: rgba(6,214,160,0.35); }
  .intro-title { margin: 0 0 0.5rem; font-size: 1.7rem; font-weight: 900; color: #06d6a0; text-shadow: 0 0 20px rgba(6,214,160,0.4); }
  .intro-sub { opacity: 0.7; font-size: 0.88rem; line-height: 1.5; margin: 0 0 1.6rem; }
  .pill.big { padding: 0.7rem 2.2rem; font-size: 1rem; }

  .end-icon { font-size: 3rem; margin-bottom: 0.5rem; }
  .win-card h2  { margin: 0 0 0.4rem; font-size: 1.5rem; font-weight: 900; color: #06d6a0; }
  .lost-card h2 { margin: 0 0 0.4rem; font-size: 1.5rem; font-weight: 900; color: #ff6b6b; }
  .end-card p   { opacity: 0.7; font-size: 0.88rem; margin: 0 0 1rem; }

  .points-display {
    display: flex; flex-direction: column; align-items: center;
    margin: 0.8rem 0 1.4rem;
  }
  .pts-num {
    font-size: 3rem; font-weight: 900; line-height: 1;
    color: #ffd23f;
    text-shadow: 0 0 20px rgba(255,210,63,0.6);
    animation: pts-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both;
  }
  .pts-label { font-size: 0.75rem; opacity: 0.6; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; margin-top: 0.15rem; }
  @keyframes pts-pop { from { opacity: 0; transform: scale(0.4); } to { opacity: 1; transform: scale(1); } }

  .zero-pts { opacity: 0.45; font-size: 0.85rem; margin: 0.5rem 0 1.2rem; }

  .end-actions { display: flex; gap: 0.7rem; justify-content: center; flex-wrap: wrap; }
  .pill {
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
    color: #fff; padding: 0.45rem 1rem; border-radius: 100px;
    font-size: 0.82rem; font-weight: 700; cursor: pointer; text-decoration: none;
    display: inline-flex; align-items: center; transition: background 0.15s;
  }
  .pill:hover { background: rgba(255,255,255,0.18); }
  .pill.primary { background: #06d6a0; color: #0d1b2a; border-color: #06d6a0; }
  .pill.primary:hover { background: #04c090; }
</style>
