<script>
  import { RIVER_CROSSING } from '$lib/config/games.js';

  const { title, intro, ferrymanName, characters, conflicts, scoring, winMessages } = RIVER_CROSSING;
  const charMap = Object.fromEntries(characters.map(c => [c.id, c]));

  // Fight emojis burst out from the bank where a conflict happens
  const FIGHT_EMOJIS = [
    { e: '💥', dx:   4, dy: -60, rot:  15, delay: 0    },
    { e: '⚡', dx:  52, dy: -32, rot: -20, delay: 0.1  },
    { e: '😱', dx: -50, dy: -28, rot:  10, delay: 0.15 },
    { e: '🤜', dx:  34, dy:  24, rot: -30, delay: 0.05 },
    { e: '✨', dx: -64, dy:  14, rot:  45, delay: 0.2  },
    { e: '💢', dx:  18, dy: -66, rot: -10, delay: 0.08 },
    { e: '😤', dx: -28, dy:  34, rot:  25, delay: 0.12 },
    { e: '🔥', dx:  60, dy: -14, rot:  -5, delay: 0.18 },
    { e: '💫', dx: -42, dy: -52, rot:  60, delay: 0.22 },
    { e: '🤛', dx:  -8, dy:  56, rot: -40, delay: 0.07 },
  ];

  // ── Audio ───────────────────────────────────────────────────
  // All sounds live in /static/sounds/ — swap the files there to change them.
  let theme, sfxBoop, sfxBoat, sfxWin, sfxFight;
  let masterVolume = $state(0.7);
  let muted        = $state(false);
  let showIntro    = $state(true);

  import { onMount } from 'svelte';
  onMount(() => {
    theme    = new Audio('/sounds/wen_theme.mp3');
    sfxBoop  = new Audio('/sounds/wen_boop.mp3');
    sfxBoat  = new Audio('/sounds/wen_boat.mp3');
    sfxWin   = new Audio('/sounds/wen_win.mp3');
    sfxFight = new Audio('/sounds/wen_fight.mp3');
    theme.loop = true;
    applyVolume();
    return () => { theme.pause(); };
  });

  // Reactive: whenever masterVolume or muted changes, update all audio
  $effect(() => {
    const vol = muted ? 0 : masterVolume;
    if (theme)    theme.volume    = vol * 0.45;
    if (sfxBoat)  sfxBoat.volume  = vol;
    if (sfxBoop)  sfxBoop.volume  = vol;
    if (sfxWin)   sfxWin.volume   = vol;
    if (sfxFight) sfxFight.volume = vol;
  });

  function applyVolume() {
    const vol = muted ? 0 : masterVolume;
    if (theme)    theme.volume    = vol * 0.45;
    if (sfxBoat)  sfxBoat.volume  = vol;
    if (sfxBoop)  sfxBoop.volume  = vol;
    if (sfxWin)   sfxWin.volume   = vol;
    if (sfxFight) sfxFight.volume = vol;
  }

  function toggleMute() { muted = !muted; }

  function startGame() {
    showIntro = false;
    theme?.play().catch(() => {});
  }

  function playSfx(sfx) { if (!sfx) return; sfx.currentTime = 0; sfx.play().catch(() => {}); }

  // ── Game state ──────────────────────────────────────────────
  let north          = $state([...characters.map(c => c.id)]);
  let south          = $state([]);
  let passenger      = $state(null);
  let boatSide       = $state('north');
  let moves          = $state(0);
  let status         = $state('playing');  // 'playing' | 'fight' | 'won'
  let warning        = $state('');
  let animating      = $state(false);
  let shake          = $state(false);
  let fightSide      = $state('north');
  let fightMessage   = $state('');
  let gameOverVisible = $state(false);
  let winCardVisible  = $state(false);

  function conflictOnBank(ids) {
    return conflicts.find(({ pair }) => pair.every(id => ids.includes(id))) ?? null;
  }
  function getBank(side) { return side === 'north' ? north : south; }
  function setBank(side, v) { if (side === 'north') north = v; else south = v; }

  function warn(msg) {
    warning = msg;
    shake = false;
    requestAnimationFrame(() => { shake = true; });
    setTimeout(() => { shake = false; }, 600);
  }

  // ── Actions ──────────────────────────────────────────────────
  function clickCharacter(id) {
    if (status !== 'playing' || animating) return;

    // Unload — must be checked FIRST because passenger is no longer on the bank
    if (passenger === id) {
      setBank(boatSide, [...getBank(boatSide), id]);
      passenger = null; warning = '';
      playSfx(sfxBoop); return;
    }

    const onThisSide = getBank(boatSide).includes(id);
    if (!onThisSide) { warn(`${charMap[id].name} is on the other bank.`); return; }
    if (passenger !== null) { warn('Boat is full — unload first.'); return; }
    setBank(boatSide, getBank(boatSide).filter(x => x !== id));
    passenger = id; warning = '';
    playSfx(sfxBoop);
  }

  function row() {
    if (status !== 'playing' || animating) return;

    const departingSide = boatSide;
    const dest = boatSide === 'north' ? 'south' : 'north';

    animating = true; moves++; warning = '';
    boatSide = dest; // change immediately so CSS transition fires at once
    playSfx(sfxBoat);

    setTimeout(() => {
      // Boat has arrived — deposit passenger and unlock controls
      if (passenger) {
        setBank(dest, [...getBank(dest), passenger]);
        passenger = null;
        playSfx(sfxBoop);
      }
      animating = false;

      // Win check
      if (south.length === characters.length && boatSide === 'south') {
        status = 'won';
        playSfx(sfxWin);
        setTimeout(() => { winCardVisible = true; }, 1200);
        return;
      }

      // Conflict check on the bank that was left unattended
      const conflict = conflictOnBank(getBank(departingSide));
      if (conflict) {
        const [p1, p2] = conflict.pair;
        fightSide    = departingSide;
        fightMessage = `${charMap[p1].name} and ${charMap[p2].name} were left alone — ${conflict.reason}!`;
        status = 'fight';
        playSfx(sfxFight);
        setTimeout(() => { gameOverVisible = true; }, 2000);
      }
    }, 820);
  }

  function starsEarned() {
    if (moves <= scoring.threeStars) return 3;
    if (moves <= scoring.twoStars) return 2;
    return 1;
  }

  function reset() {
    north = [...characters.map(c => c.id)]; south = []; passenger = null;
    boatSide = 'north'; moves = 0; status = 'playing';
    warning = ''; animating = false; shake = false;
    fightSide = 'north'; fightMessage = '';
    gameOverVisible = false; winCardVisible = false;
  }

  let boatAtNorth = $derived(boatSide === 'north');
</script>

<svelte:head>
  <title>River Crossing · Camp Games</title>
</svelte:head>

<nav class="top-nav">
  <a href="/games" class="back-link">← Games</a>
  <span class="nav-title">🛶 {title}</span>
  <span class="move-counter">Moves: <strong>{moves}</strong></span>
</nav>

<div class="scene">

  <!-- NORTH BANK -->
  <div class="bank north-bank">
    <span class="bank-label">🌲 North Bank <em>start</em></span>
    <div class="chars">
      {#each north as id (id)}
        {@const c = charMap[id]}
        <button
          class="char-btn"
          class:selectable={boatSide === 'north' && status === 'playing'}
          style="--col: {c.color}"
          onclick={() => clickCharacter(id)}
          title="Board {c.name}"
        >
          <div class="portrait-ring">
            {#if c.image}
              <img src={c.image} alt={c.name} class="portrait" />
            {:else}
              <div class="portrait-fallback">{c.placeholder}</div>
            {/if}
          </div>
          <span class="char-name">{c.name}</span>
        </button>
      {/each}
    </div>

    <!-- Fight cloud on north bank -->
    {#if status === 'fight' && fightSide === 'north'}
      <div class="fight-burst">
        {#each FIGHT_EMOJIS as f}
          <span class="fight-emoji" style="--dx:{f.dx}px; --dy:{f.dy}px; --rot:{f.rot}deg; --delay:{f.delay}s">{f.e}</span>
        {/each}
        <div class="fight-word">FIGHT!</div>
      </div>
    {/if}
  </div>

  <!-- RIVER + BOAT -->
  <div class="river-zone">

    <!-- Floating animals — decorative, left↔right -->
    <img src="/wen_moo.png"  alt="" class="critter critter-cow"  aria-hidden="true" />
    <img src="/wen_duck.png" alt="" class="critter critter-duck" aria-hidden="true" />

    <div class="boat-wrap" class:at-south={!boatAtNorth} class:crossing={animating}>

      <!-- Triangle arrow button, LEFT of boat -->
      <button
        class="row-btn"
        class:going-south={boatAtNorth}
        onclick={row}
        disabled={animating || status !== 'playing'}
        title={boatAtNorth ? 'Row to south bank' : 'Row to north bank'}
      ></button>

      <!-- Boat image + passenger -->
      <div class="boat-dish">
        <img src="/boat.png" alt="boat" class="boat-img" />

        {#if passenger}
          {@const c = charMap[passenger]}
          <button
            class="passenger-portrait"
            onclick={() => clickCharacter(passenger)}
            title="Unload {c.name}"
          >
            {#if c.image}
              <img src={c.image} alt={c.name} />
            {:else}
              <div class="portrait-fallback small" style="--col:{c.color}">{c.placeholder}</div>
            {/if}
          </button>
        {:else}
          <div class="empty-seat">+ passenger</div>
        {/if}
      </div>
    </div>
  </div>

  <!-- SOUTH BANK -->
  <div class="bank south-bank">
    <span class="bank-label">🏕 South Bank <em>goal</em></span>
    <div class="chars">
      {#each south as id (id)}
        {@const c = charMap[id]}
        <button
          class="char-btn"
          class:selectable={boatSide === 'south' && status === 'playing'}
          style="--col: {c.color}"
          onclick={() => clickCharacter(id)}
          title="Re-board {c.name}"
        >
          <div class="portrait-ring arrived">
            {#if c.image}
              <img src={c.image} alt={c.name} class="portrait" />
            {:else}
              <div class="portrait-fallback">{c.placeholder}</div>
            {/if}
          </div>
          <span class="char-name">{c.name}</span>
        </button>
      {/each}
    </div>

    <!-- Fight cloud on south bank -->
    {#if status === 'fight' && fightSide === 'south'}
      <div class="fight-burst">
        {#each FIGHT_EMOJIS as f}
          <span class="fight-emoji" style="--dx:{f.dx}px; --dy:{f.dy}px; --rot:{f.rot}deg; --delay:{f.delay}s">{f.e}</span>
        {/each}
        <div class="fight-word">FIGHT!</div>
      </div>
    {/if}
  </div>
</div>

<!-- Warning toast -->
{#if warning}
  <div class="warning-toast" class:shake>⚠️ {warning}</div>
{/if}

<!-- Bottom info bar with sound panel -->
<div class="info-bar">
  <div class="sound-ctrl">
    <button class="sound-icon-btn" onclick={toggleMute} title={muted ? 'Unmute' : 'Mute'}>
      {muted || masterVolume === 0 ? '🔇' : masterVolume < 0.45 ? '🔉' : '🔊'}
    </button>
    <input
      type="range" class="vol-slider"
      min="0" max="1" step="0.05"
      bind:value={masterVolume}
      oninput={() => { if (muted && masterVolume > 0) muted = false; }}
      title="Master volume"
    />
  </div>
  <button class="reset-btn" onclick={reset}>↺ Reset</button>
</div>

<!-- ── INTRO overlay ── -->
{#if showIntro}
  <div class="intro-overlay">
    <div class="intro-card">
      <div class="intro-boat">🛶</div>
      <h2>River Crossing</h2>
      <ul class="rules-list">
        <li><span class="rule-icon">🏕</span> Get <strong>everyone</strong> to the south bank</li>
        <li><span class="rule-icon">🚣</span> The boat fits <strong>1 passenger</strong> at a time</li>
      </ul>
      <button class="start-btn" onclick={startGame}>Let's Go! →</button>
    </div>
  </div>
{/if}

<!-- ── GAME OVER overlay ── -->
{#if gameOverVisible}
  <div class="game-over-overlay">
    <div class="game-over-card">
      <div class="go-icon">💀</div>
      <h2>Game Over!</h2>
      <p>{fightMessage}</p>
      <button class="pill primary" onclick={reset}>↺ Start Over</button>
    </div>
  </div>
{/if}

<!-- ── WIN: salute burst + delayed card ── -->
{#if status === 'won'}
  <div class="win-salute" class:card-visible={winCardVisible}>
    <div class="salute-text">🎉 Yay! You've done it! 🎉</div>
    {#each ['🎊','⛺','🛶','✨','🏕','🎉','🌊','🥳'] as emoji, i}
      <span class="salute-particle" style="--i:{i}">{emoji}</span>
    {/each}
  </div>

  {#if winCardVisible}
    <div class="win-overlay">
      <div class="win-card">
        <div class="stars">
          {#each { length: 3 } as _, i}
            <span class:earned={i < starsEarned()}>⭐</span>
          {/each}
        </div>
        <h2>{winMessages[moves % winMessages.length]}</h2>
        <p>Solved in <strong>{moves} moves</strong>{moves <= scoring.optimal ? ' — perfect! 🎯' : ''}</p>
        <div class="win-actions">
          <button class="pill primary" onclick={reset}>Play again</button>
          <a href="/games" class="pill">← All games</a>
        </div>
      </div>
    </div>
  {/if}
{/if}

<style>
  :global(body) {
    margin: 0;
    background: #0d1b2a;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    color: #fff;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
  }

  /* ── Nav ── */
  .top-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 30;
    height: 44px; display: flex; align-items: center; gap: 1rem; padding: 0 1.2rem;
    background: rgba(5,15,28,0.82); backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .back-link { color: rgba(255,255,255,0.55); text-decoration: none; font-size: 0.8rem; font-weight: 700; transition: color .15s; }
  .back-link:hover { color: #fff; }
  .nav-title { font-size: 0.88rem; font-weight: 800; flex: 1; }
  .move-counter { font-size: 0.8rem; opacity: .7; }
  .move-counter strong { color: #ffd23f; }

  /* ── Scene ── */
  .scene {
    position: fixed; top: 44px; left: 0; right: 0; bottom: 52px;
    display: flex; flex-direction: column;
    background: url('/river_map.png') center/cover no-repeat;
  }

  /* ── Banks ── */
  .bank {
    flex: 0 0 20%; position: relative;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 0.6rem; padding: 0.6rem 1rem;
  }
  .north-bank { background: linear-gradient(to bottom, rgba(5,25,12,0.78) 0%, rgba(5,20,10,0.5) 100%); }
  .south-bank { background: linear-gradient(to top,   rgba(10,20,5,0.82) 0%, rgba(8,18,5,0.5) 100%); }

  .bank-label { font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.75; text-shadow: 0 1px 4px rgba(0,0,0,0.8); }
  .bank-label em { font-style: normal; background: rgba(255,255,255,0.12); padding: 0.05rem 0.4rem; border-radius: 100px; margin-left: 0.3rem; font-size: 0.6rem; }

  .chars { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }

  /* ── Character cards ── */
  .char-btn {
    display: flex; flex-direction: column; align-items: center; gap: 0.35rem;
    background: none; border: none; cursor: default;
    padding: 0; color: #fff; font: inherit; transition: transform 0.15s;
  }
  .char-btn.selectable { cursor: pointer; }
  .char-btn.selectable:hover { transform: translateY(-5px); }

  .portrait-ring {
    width: 82px; height: 82px; border-radius: 50%; overflow: hidden;
    border: 3px solid rgba(255,255,255,0.2);
    background: rgba(0,0,0,0.3);
    display: flex; align-items: flex-end; justify-content: center;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-shadow: 0 2px 12px rgba(0,0,0,0.5);
  }
  /* Golden pulse for clickable characters */
  @keyframes golden-glow {
    0%,100% { border-color: #ffd23f; box-shadow: 0 0 0 0 rgba(255,210,63,0.7), 0 2px 12px rgba(0,0,0,0.5); }
    55%      { border-color: #ffd23f; box-shadow: 0 0 0 7px rgba(255,210,63,0),  0 2px 12px rgba(0,0,0,0.5); }
  }
  .char-btn.selectable .portrait-ring { animation: golden-glow 1.3s ease-in-out infinite; }
  .char-btn.selectable:hover .portrait-ring { animation: none; border-color: var(--col); box-shadow: 0 0 0 4px color-mix(in srgb, var(--col) 45%, transparent), 0 2px 12px rgba(0,0,0,0.5); }
  .portrait-ring.arrived { border-color: #06d6a0; box-shadow: 0 0 14px rgba(6,214,160,0.45); }

  .portrait { width: 100%; height: 100%; object-fit: cover; object-position: top center; }
  .portrait-fallback { width: 100%; height: 100%; background: var(--col,#888); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; font-weight: 900; color: #0d1b2a; }

  .char-name { font-size: 0.7rem; font-weight: 700; text-shadow: 0 1px 6px rgba(0,0,0,0.9); }

  /* ── River zone ── */
  .river-zone { flex: 1; position: relative; }

  /* ── Boat position config ───────────────────────────────────
   *  top: 4%              → boat y when on north bank
   *  top: calc(100% - Xpx) → boat y when on south bank
   *    X ≈ boat-dish height (120) + controls gap (~40) = ~165
   * ────────────────────────────────────────────────────────── */
  .boat-wrap {
    position: absolute;
    top: 1%;                               /* ← north bank position */
    left: 40%;
    transform: translateX(-50%);
    display: flex; flex-direction: row; align-items: center; gap: 0.8rem;
    transition: top 0.82s cubic-bezier(0.4,0,0.2,1);
  }
  .boat-wrap.at-south { top: calc(100% - 35%); } /* ← south bank position */

  /* Row button — triangle arrow to the LEFT of the boat */
  .row-btn {
    width: 44px; height: 52px;
    background: #06d6a0;
    border: none; padding: 0;
    cursor: pointer; flex-shrink: 0;
    /* ↓ pointing down = going south */
    clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
    filter: drop-shadow(0 4px 10px rgba(6,214,160,0.55));
    transition: filter 0.15s, transform 0.15s;
  }
  /* ↑ pointing up = going north */
  .row-btn:not(.going-south) { clip-path: polygon(50% 0%, 0% 100%, 100% 100%); }
  .row-btn:hover:not(:disabled) { filter: drop-shadow(0 4px 14px rgba(6,214,160,0.9)) brightness(1.15); transform: scale(1.1); }
  .row-btn:disabled { opacity: 0.25; cursor: default; }

  /* Boat image — no background oval, multiply removes white against river */
  .boat-dish {
    position: relative;
    width: 164px; height: 120px;
    display: flex; align-items: center; justify-content: center;
  }
  .boat-img {
    width: 164px;
    mix-blend-mode: multiply;
    filter: brightness(1.5) drop-shadow(0 3px 12px rgba(0,0,0,0.8));
    pointer-events: none; user-select: none;
  }

  /* Passenger position config ─────────────────────────────────
   *  top / left = % of boat-dish (164 × 120 px)
   *  50% / 50% = dead centre of the hull
   * ────────────────────────────────────────────────────────── */
  .passenger-portrait {
    position: absolute;
    top: 50%;                              /* ← vertical in hull  */
    left: 50%;                             /* ← horizontal in hull */
    transform: translate(-50%, -50%);
    width: 54px; height: 54px;
    border-radius: 50%; overflow: hidden;
    border: 2.5px solid rgba(255,255,255,0.9);
    background: rgba(0,0,0,0.2);
    cursor: pointer; padding: 0;
    display: flex; align-items: flex-end; justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.6);
    transition: border-color 0.15s;
  }
  .passenger-portrait img { width: 100%; height: 100%; object-fit: cover; object-position: top center; }
  .passenger-portrait:hover { border-color: #ff6b35; }

  .empty-seat {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    font-size: 0.58rem; color: rgba(255,255,255,0.5);
    border: 1px dashed rgba(255,255,255,0.3);
    padding: 0.15rem 0.5rem; border-radius: 100px; pointer-events: none; white-space: nowrap;
  }

  /* ── River critters ── */
  @keyframes critter-lr {
    0%   { left: -120px; }
    100% { left: calc(100% + 120px); }
  }
  @keyframes critter-rl {
    0%   { left: calc(100% + 120px); }
    100% { left: -120px; }
  }
  @keyframes critter-bob {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-5px); }
  }

  .critter {
    position: absolute;
    height: 52px;
    width: auto;
    pointer-events: none;
    user-select: none;
    filter: drop-shadow(0 3px 6px rgba(0,0,0,0.5));
  }
  .critter-cow {
    top: 18%;
    animation:
      critter-rl  var(--cow-dur, 26s) linear     infinite,
      critter-bob  3s                 ease-in-out infinite;
  }
  .critter-duck {
    top: 62%;
    animation:
      critter-lr  var(--duck-dur, 16s) linear     infinite -6s,
      critter-bob  2s                  ease-in-out infinite -1s;
  }

  /* Scale duration with screen width to keep apparent speed constant */
  @media (min-width: 600px) {
    .critter-cow  { --cow-dur:  42s; }
    .critter-duck { --duck-dur: 26s; }
  }
  @media (min-width: 900px) {
    .critter-cow  { --cow-dur:  62s; }
    .critter-duck { --duck-dur: 38s; }
  }
  @media (min-width: 1200px) {
    .critter-cow  { --cow-dur:  82s; }
    .critter-duck { --duck-dur: 50s; }
  }
  @media (min-width: 1500px) {
    .critter-cow  { --cow-dur: 100s; }
    .critter-duck { --duck-dur: 62s; }
  }

  /* ── Fight animation ── */
  .fight-burst {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    z-index: 8; pointer-events: none;
    animation: fight-bg-flash 2s ease forwards;
  }
  @keyframes fight-bg-flash {
    0%    { background: rgba(180,20,10,0);    }
    15%   { background: rgba(180,20,10,0.35); }
    60%   { background: rgba(180,20,10,0.3);  }
    100%  { background: rgba(180,20,10,0.1);  }
  }

  .fight-emoji {
    position: absolute; top: 50%; left: 50%;
    font-size: 1.8rem; line-height: 1;
    animation: emoji-burst 0.7s cubic-bezier(0.2,0,0.8,1) var(--delay) 3 both;
  }
  @keyframes emoji-burst {
    0%   { opacity: 0; transform: translate(0,0) scale(0) rotate(0deg); }
    25%  { opacity: 1; transform: translate(var(--dx), var(--dy)) scale(1.4) rotate(var(--rot)); }
    70%  { opacity: 1; transform: translate(var(--dx), var(--dy)) scale(1)   rotate(calc(var(--rot)*2)); }
    100% { opacity: 0; transform: translate(calc(var(--dx)*1.3), calc(var(--dy)*1.3)) scale(0.6) rotate(calc(var(--rot)*3)); }
  }

  .fight-word {
    font-size: clamp(2rem, 6vw, 3.5rem);
    font-weight: 900;
    color: #ff2020;
    text-shadow: 0 0 20px rgba(255,0,0,0.8), 2px 2px 0 #000;
    letter-spacing: 0.05em;
    animation: fight-word-anim 2s ease forwards;
    z-index: 1;
  }
  @keyframes fight-word-anim {
    0%    { opacity: 0; transform: scale(0.2) rotate(-8deg); }
    15%   { opacity: 1; transform: scale(1.3) rotate(3deg); }
    30%   { transform: scale(0.95) rotate(-2deg); }
    45%   { transform: scale(1.15) rotate(1deg); }
    70%   { opacity: 1; transform: scale(1) rotate(0deg); }
    100%  { opacity: 0; transform: scale(0.8); }
  }

  /* ── Game Over overlay ── */
  .game-over-overlay {
    position: fixed; inset: 0; z-index: 50;
    background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    animation: fade-in 0.4s ease;
  }
  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

  .game-over-card {
    background: #1a0808; border: 2px solid #c53030;
    border-radius: 24px; padding: 2.5rem; text-align: center;
    max-width: 340px; width: 90%;
    animation: card-pop 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes card-pop { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }

  .go-icon { font-size: 3rem; margin-bottom: 0.5rem; }
  .game-over-card h2 { margin: 0 0 0.5rem; font-size: 1.6rem; font-weight: 900; color: #ff6b6b; }
  .game-over-card p { opacity: 0.7; font-size: 0.88rem; margin: 0 0 1.5rem; }

  /* ── Win salute ── */
  .win-salute {
    position: fixed; inset: 0; z-index: 45;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none;
  }
  .salute-text {
    font-size: clamp(1.4rem, 5vw, 2.4rem);
    font-weight: 900;
    text-shadow: 0 0 30px rgba(255,210,63,0.9), 2px 2px 0 rgba(0,0,0,0.6);
    animation: salute-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes salute-pop {
    from { opacity: 0; transform: scale(0.4) rotate(-5deg); }
    to   { opacity: 1; transform: scale(1) rotate(0deg); }
  }
  /* Fade out salute text when card appears */
  .win-salute.card-visible .salute-text { animation: salute-fade-out 0.3s ease forwards; }
  @keyframes salute-fade-out { to { opacity: 0; transform: scale(0.9); } }

  .salute-particle {
    position: absolute;
    font-size: clamp(1.2rem, 3vw, 1.8rem);
    animation: particle-fly 1.1s cubic-bezier(0.2,0,0.8,1) calc(var(--i) * 0.08s) both;
    --angle: calc(var(--i) * 45deg);
    --dist: clamp(80px, 20vw, 180px);
  }
  @keyframes particle-fly {
    0%   { opacity: 0; transform: translate(0,0) scale(0) rotate(0deg); }
    30%  { opacity: 1; }
    60%  { opacity: 1; transform: translate(
             calc(sin(var(--angle)) * var(--dist)),
             calc(cos(var(--angle)) * var(--dist) * -1)
           ) scale(1.2) rotate(calc(var(--i) * 30deg)); }
    100% { opacity: 0; transform: translate(
             calc(sin(var(--angle)) * var(--dist) * 1.4),
             calc(cos(var(--angle)) * var(--dist) * -1.4)
           ) scale(0.6) rotate(calc(var(--i) * 60deg)); }
  }

  /* ── Win overlay (card) ── */
  .win-overlay {
    position: fixed; inset: 0; z-index: 50;
    background: rgba(0,0,0,0.72); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    animation: fade-in 0.35s ease;
  }
  .win-card {
    background: #0d2137; border: 2px solid #06d6a0;
    border-radius: 24px; padding: 2.5rem; text-align: center;
    max-width: 340px; width: 90%;
    animation: card-pop 0.45s cubic-bezier(0.34,1.56,0.64,1);
  }
  .stars { font-size: 2rem; letter-spacing: 0.15rem; margin-bottom: 0.8rem; }
  .stars span { opacity: 0.2; }
  .stars span.earned { opacity: 1; }
  .win-card h2 { margin: 0 0 0.4rem; font-size: 1.5rem; font-weight: 900; }
  .win-card p { opacity: 0.65; font-size: 0.88rem; margin: 0 0 1.4rem; }
  .win-card p strong { color: #ffd23f; }
  .win-actions { display: flex; gap: 0.7rem; justify-content: center; flex-wrap: wrap; }

  /* ── Shared pills ── */
  .pill {
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
    color: #fff; padding: 0.45rem 1rem; border-radius: 100px;
    font-size: 0.82rem; font-weight: 700; cursor: pointer; text-decoration: none;
    display: inline-flex; align-items: center; transition: background 0.15s;
  }
  .pill:hover { background: rgba(255,255,255,0.18); }
  .pill.primary { background: #06d6a0; color: #0d1b2a; border-color: #06d6a0; }
  .pill.primary:hover { background: #04c090; }

  /* ── Warning toast ── */
  .warning-toast {
    position: fixed; bottom: 60px; left: 50%; transform: translateX(-50%);
    background: #7a1515; border: 1px solid #c53030;
    color: #fff; padding: 0.55rem 1.2rem; border-radius: 100px;
    font-size: 0.82rem; font-weight: 600; z-index: 40;
    white-space: nowrap; max-width: 92vw; text-align: center;
  }
  .warning-toast.shake { animation: shake 0.5s ease; }
  @keyframes shake {
    0%,100% { transform: translateX(-50%); }
    20%      { transform: translateX(calc(-50% - 8px)); }
    40%      { transform: translateX(calc(-50% + 8px)); }
    60%      { transform: translateX(calc(-50% - 5px)); }
    80%      { transform: translateX(calc(-50% + 5px)); }
  }

  /* ── Info bar + sound panel ── */
  .info-bar {
    position: fixed; bottom: 0; left: 0; right: 0; height: 52px;
    background: rgba(5,15,28,0.88); backdrop-filter: blur(12px);
    border-top: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; gap: 1rem; padding: 0 1.2rem; z-index: 20;
  }

  .sound-ctrl { display: flex; align-items: center; gap: 0.5rem; flex: 1; }
  .sound-icon-btn {
    background: none; border: none; color: #fff;
    font-size: 1.1rem; cursor: pointer; padding: 0; line-height: 1;
    opacity: 0.8; transition: opacity 0.15s;
  }
  .sound-icon-btn:hover { opacity: 1; }
  .vol-slider {
    -webkit-appearance: none; appearance: none;
    width: 90px; height: 3px;
    background: rgba(255,255,255,0.2); border-radius: 2px;
    cursor: pointer; outline: none;
  }
  .vol-slider::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    width: 13px; height: 13px; border-radius: 50%;
    background: #06d6a0; cursor: pointer;
    box-shadow: 0 0 4px rgba(6,214,160,0.6);
  }
  .vol-slider::-moz-range-thumb {
    width: 13px; height: 13px; border-radius: 50%; border: none;
    background: #06d6a0; cursor: pointer;
  }

  .reset-btn {
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
    color: #fff; padding: 0.3rem 0.8rem; border-radius: 100px;
    font-size: 0.74rem; font-weight: 700; cursor: pointer; white-space: nowrap;
    transition: background 0.15s;
  }
  .reset-btn:hover { background: rgba(255,255,255,0.15); }

  /* ── Intro overlay ── */
  .intro-overlay {
    position: fixed; inset: 0; z-index: 60;
    background: rgba(5,15,28,0.92); backdrop-filter: blur(16px);
    display: flex; align-items: center; justify-content: center;
    animation: fade-in 0.4s ease;
  }
  .intro-card {
    background: linear-gradient(145deg, #0d2137, #091a2c);
    border: 1.5px solid rgba(6,214,160,0.35);
    border-radius: 28px; padding: 2.5rem 2.2rem;
    text-align: center; max-width: 380px; width: 92%;
    animation: card-pop 0.45s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow: 0 0 60px rgba(6,214,160,0.08);
  }
  .intro-boat {
    font-size: 3rem; margin-bottom: 0.4rem;
    animation: icon-bob 2.5s ease-in-out infinite;
  }
  @keyframes icon-bob {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-6px); }
  }
  .intro-card h2 {
    margin: 0 0 1.4rem;
    font-size: 1.6rem; font-weight: 900;
    color: #06d6a0;
    text-shadow: 0 0 20px rgba(6,214,160,0.4);
  }
  .rules-list {
    list-style: none; margin: 0 0 1.8rem; padding: 0;
    display: flex; flex-direction: column; gap: 0.9rem; text-align: left;
  }
  .rules-list li {
    display: flex; align-items: flex-start; gap: 0.7rem;
    font-size: 0.9rem; line-height: 1.4; color: rgba(255,255,255,0.85);
  }
  .rule-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 0.05rem; }
  .rules-list strong { color: #fff; }
  .start-btn {
    background: #06d6a0; color: #0d1b2a;
    border: none; border-radius: 100px;
    padding: 0.75rem 2.2rem;
    font-size: 1rem; font-weight: 900; cursor: pointer;
    box-shadow: 0 4px 20px rgba(6,214,160,0.4);
    transition: background 0.15s, transform 0.1s;
  }
  .start-btn:hover { background: #04c090; transform: scale(1.04); }
  .start-btn:active { transform: scale(0.97); }
</style>
