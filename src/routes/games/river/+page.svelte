<script>
  import { RIVER_CROSSING } from '$lib/config/games.js';

  const { title, intro, ferrymanName, characters, conflicts, scoring, winMessages } = RIVER_CROSSING;

  const charMap = Object.fromEntries(characters.map(c => [c.id, c]));

  // ── Game state ──────────────────────────────────────────────
  let north       = $state([...characters.map(c => c.id)]);
  let south       = $state([]);
  let passenger   = $state(null);
  let boatSide    = $state('north');
  let moves       = $state(0);
  let status      = $state('playing');
  let warning     = $state('');
  let animating   = $state(false);
  let shake       = $state(false);

  // ── Helpers ─────────────────────────────────────────────────
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
    const onThisSide = getBank(boatSide).includes(id);
    if (!onThisSide) { warn(`${charMap[id].name} is on the other bank.`); return; }
    if (passenger === id) {
      setBank(boatSide, [...getBank(boatSide), id]);
      passenger = null; warning = ''; return;
    }
    if (passenger !== null) { warn('Boat is full — unload first.'); return; }
    setBank(boatSide, getBank(boatSide).filter(x => x !== id));
    passenger = id; warning = '';
  }

  function row() {
    if (status !== 'playing' || animating) return;
    const conflict = conflictOnBank(getBank(boatSide));
    if (conflict) {
      const [p1, p2] = conflict.pair;
      warn(`Can't leave ${charMap[p1].name} and ${charMap[p2].name} alone — ${conflict.reason}!`);
      return;
    }
    animating = true; moves++; warning = '';
    setTimeout(() => {
      const dest = boatSide === 'north' ? 'south' : 'north';
      if (passenger) { setBank(dest, [...getBank(dest), passenger]); passenger = null; }
      boatSide = dest; animating = false;
      if (south.length === characters.length && boatSide === 'south') status = 'won';
    }, 820);
  }

  function starsEarned() {
    if (moves <= scoring.threeStars) return 3;
    if (moves <= scoring.twoStars) return 2;
    return 1;
  }

  function reset() {
    north = [...characters.map(c => c.id)]; south = []; passenger = null;
    boatSide = 'north'; moves = 0; status = 'playing'; warning = ''; animating = false; shake = false;
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
          class:selectable={boatSide === 'north'}
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
  </div>

  <!-- RIVER + BOAT -->
  <div class="river-zone">
    <div class="boat-wrap" class:at-south={!boatAtNorth} class:crossing={animating}>

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

      <div class="boat-controls">
        <span class="ferryman-tag">⛵ {ferrymanName}</span>
        <button
          class="row-btn"
          onclick={row}
          disabled={animating || status !== 'playing'}
        >
          {boatAtNorth ? 'Row South ↓' : '↑ Row North'}
        </button>
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
          class:selectable={boatSide === 'south'}
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
  </div>
</div>

{#if warning}
  <div class="warning-toast" class:shake>⚠️ {warning}</div>
{/if}

<div class="info-bar">
  <p class="hint">{intro}</p>
  <button class="reset-btn" onclick={reset}>↺ Reset</button>
</div>

{#if status === 'won'}
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
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 30;
    height: 44px;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0 1.2rem;
    background: rgba(5,15,28,0.82);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .back-link { color: rgba(255,255,255,0.55); text-decoration: none; font-size: 0.8rem; font-weight: 700; transition: color .15s; }
  .back-link:hover { color: #fff; }
  .nav-title { font-size: 0.88rem; font-weight: 800; flex: 1; }
  .move-counter { font-size: 0.8rem; opacity: .7; }
  .move-counter strong { color: #ffd23f; }

  /* ── Scene ── */
  .scene {
    position: fixed;
    top: 44px; left: 0; right: 0; bottom: 52px;
    display: flex;
    flex-direction: column;
    background: url('/river_map.png') center/cover no-repeat;
  }

  /* ── Banks ── */
  .bank {
    flex: 0 0 34%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    padding: 0.6rem 1rem;
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
    padding: 0; color: #fff; font: inherit;
    transition: transform 0.15s;
  }
  .char-btn.selectable { cursor: pointer; }
  .char-btn.selectable:hover { transform: translateY(-5px); }

  .portrait-ring {
    width: 82px; height: 82px;
    border-radius: 50%; overflow: hidden;
    border: 3px solid rgba(255,255,255,0.2);
    background: rgba(0,0,0,0.3);
    display: flex; align-items: flex-end; justify-content: center;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-shadow: 0 2px 12px rgba(0,0,0,0.5);
  }
  .char-btn.selectable:hover .portrait-ring {
    border-color: var(--col);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--col) 40%, transparent), 0 2px 12px rgba(0,0,0,0.5);
  }
  .portrait-ring.arrived { border-color: #06d6a0; box-shadow: 0 0 14px rgba(6,214,160,0.45); }

  .portrait { width: 100%; height: 100%; object-fit: cover; object-position: top center; }
  .portrait-fallback { width: 100%; height: 100%; background: var(--col,#888); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; font-weight: 900; color: #0d1b2a; }

  .char-name { font-size: 0.7rem; font-weight: 700; text-shadow: 0 1px 6px rgba(0,0,0,0.9); }

  /* ── River zone ── */
  .river-zone { flex: 1; position: relative; }

  /* ── Boat ── */
  .boat-wrap {
    position: absolute;
    top: 4%;
    left: 50%;
    transform: translateX(-50%);
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    transition: top 0.82s cubic-bezier(0.4,0,0.2,1);
  }
  .boat-wrap.at-south { top: calc(100% - 220px); }

  .boat-dish {
    position: relative;
    width: 184px; height: 134px;
    background: #8dcbe8;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 28px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,255,255,0.12);
    overflow: hidden;
  }
  .boat-img { width: 164px; mix-blend-mode: multiply; pointer-events: none; user-select: none; }

  .passenger-portrait {
    position: absolute; bottom: 6px; right: 12px;
    width: 58px; height: 58px;
    border-radius: 50%; overflow: hidden;
    border: 2.5px solid #fff;
    background: rgba(0,0,0,0.15);
    cursor: pointer; padding: 0;
    display: flex; align-items: flex-end; justify-content: center;
    transition: border-color 0.15s;
  }
  .passenger-portrait img { width: 100%; height: 100%; object-fit: cover; object-position: top center; }
  .passenger-portrait:hover { border-color: #ff6b35; }

  .empty-seat {
    position: absolute; bottom: 12px; right: 12px;
    font-size: 0.58rem; color: rgba(0,0,0,0.45);
    background: rgba(255,255,255,0.55);
    padding: 0.12rem 0.45rem; border-radius: 100px;
    pointer-events: none;
  }

  .boat-controls { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
  .ferryman-tag { font-size: 0.65rem; font-weight: 700; opacity: 0.8; text-shadow: 0 1px 5px rgba(0,0,0,0.9); }
  .row-btn {
    background: #06d6a0; color: #0d1b2a;
    border: none; border-radius: 100px;
    font-size: 0.8rem; font-weight: 800;
    padding: 0.42rem 1.2rem;
    cursor: pointer; white-space: nowrap;
    box-shadow: 0 2px 14px rgba(6,214,160,0.45);
    transition: background 0.15s, opacity 0.15s;
  }
  .row-btn:hover:not(:disabled) { background: #04c090; }
  .row-btn:disabled { opacity: 0.35; cursor: default; }

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

  /* ── Info bar ── */
  .info-bar {
    position: fixed; bottom: 0; left: 0; right: 0; height: 52px;
    background: rgba(5,15,28,0.88); backdrop-filter: blur(12px);
    border-top: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; gap: 1rem; padding: 0 1.2rem; z-index: 20;
  }
  .hint { margin: 0; font-size: 0.72rem; opacity: 0.45; flex: 1; }
  .reset-btn {
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
    color: #fff; padding: 0.3rem 0.8rem; border-radius: 100px;
    font-size: 0.74rem; font-weight: 700; cursor: pointer; white-space: nowrap;
    transition: background 0.15s;
  }
  .reset-btn:hover { background: rgba(255,255,255,0.15); }

  /* ── Win overlay ── */
  .win-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.72); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center; z-index: 50;
  }
  .win-card {
    background: #0d2137; border: 2px solid #06d6a0; border-radius: 24px;
    padding: 2.5rem; text-align: center; max-width: 340px; width: 90%;
  }
  .stars { font-size: 2rem; letter-spacing: 0.15rem; margin-bottom: 0.8rem; }
  .stars span { opacity: 0.2; }
  .stars span.earned { opacity: 1; }
  .win-card h2 { margin: 0 0 0.4rem; font-size: 1.5rem; font-weight: 900; }
  .win-card p { opacity: 0.65; font-size: 0.88rem; margin: 0 0 1.4rem; }
  .win-card p strong { color: #ffd23f; }
  .win-actions { display: flex; gap: 0.7rem; justify-content: center; flex-wrap: wrap; }
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
