<script>
  import { RIVER_CROSSING } from '$lib/config/games.js';

  const { title, subtitle, intro, ferrymanName, ferrymanEmoji, characters, conflicts, scoring, winMessages } = RIVER_CROSSING;

  const charMap = Object.fromEntries(characters.map(c => [c.id, c]));

  // ── Game state ──────────────────────────────────────────────
  let north       = $state([...characters.map(c => c.id)]);
  let south       = $state([]);
  let passenger   = $state(null);   // character ID in boat, or null
  let boatSide    = $state('north');
  let moves       = $state(0);
  let status      = $state('playing'); // 'playing' | 'won'
  let warning     = $state('');
  let animating   = $state(false);
  let shake       = $state(false);   // triggers warning shake animation

  // ── Helpers ─────────────────────────────────────────────────
  function conflictOnBank(ids) {
    return conflicts.find(({ pair }) => pair.every(id => ids.includes(id))) ?? null;
  }

  function bank(side) {
    return side === 'north' ? north : south;
  }

  function setBank(side, value) {
    if (side === 'north') north = value;
    else south = value;
  }

  function warn(msg) {
    warning = msg;
    shake = false;
    // Trigger re-animation by toggling
    requestAnimationFrame(() => { shake = true; });
    setTimeout(() => { shake = false; }, 600);
  }

  // ── Actions ──────────────────────────────────────────────────
  function clickCharacter(id) {
    if (status !== 'playing' || animating) return;

    const onThisSide = bank(boatSide).includes(id);

    if (!onThisSide) {
      warn(`${charMap[id].name} is on the other bank.`);
      return;
    }

    if (passenger === id) {
      // Already in boat — unload back to bank
      setBank(boatSide, [...bank(boatSide), id]);
      passenger = null;
      warning = '';
      return;
    }

    if (passenger !== null) {
      warn('Boat is full! Unload the current passenger first.');
      return;
    }

    // Board character
    setBank(boatSide, bank(boatSide).filter(x => x !== id));
    passenger = id;
    warning = '';
  }

  function row() {
    if (status !== 'playing' || animating) return;

    // Check who's left on the departing bank (ferryman leaving = unsupervised)
    const conflict = conflictOnBank(bank(boatSide));
    if (conflict) {
      const [p1, p2] = conflict.pair;
      warn(`Can't leave ${charMap[p1].name} and ${charMap[p2].name} alone — ${conflict.reason}!`);
      return;
    }

    animating = true;
    moves++;
    warning = '';

    setTimeout(() => {
      const dest = boatSide === 'north' ? 'south' : 'north';
      if (passenger) {
        setBank(dest, [...bank(dest), passenger]);
        passenger = null;
      }
      boatSide = dest;
      animating = false;

      // Win check: all characters on south and boat is on south
      if (south.length === characters.length && boatSide === 'south') {
        status = 'won';
      }
    }, 750);
  }

  function starsEarned() {
    if (moves <= scoring.threeStars) return 3;
    if (moves <= scoring.twoStars) return 2;
    return 1;
  }

  function reset() {
    north     = [...characters.map(c => c.id)];
    south     = [];
    passenger = null;
    boatSide  = 'north';
    moves     = 0;
    status    = 'playing';
    warning   = '';
    animating = false;
    shake     = false;
  }

  let winMsg = $derived(winMessages[moves % winMessages.length]);
  let boatAtNorth = $derived(boatSide === 'north');
</script>

<svelte:head>
  <title>River Crossing · Camp Games</title>
</svelte:head>

<!-- ── Navigation ──────────────────────────────────────────── -->
<nav class="top-nav">
  <a href="/games" class="back-link">← Games</a>
  <span class="nav-title">🛶 {title}</span>
  <span class="move-counter">Moves: <strong>{moves}</strong></span>
</nav>

<!-- ── Game scene ───────────────────────────────────────────── -->
<div class="scene">

  <!-- NORTH BANK -->
  <div class="bank north-bank">
    <div class="bank-label">🌲 North Bank <span class="bank-sub">start</span></div>
    <div class="characters">
      {#each north as id (id)}
        <button
          class="char-card"
          class:clickable={boatSide === 'north'}
          onclick={() => clickCharacter(id)}
          style="--c: {charMap[id].color}"
          title="Click to board {charMap[id].name}"
        >
          {#if charMap[id].image}
            <img src={charMap[id].image} alt={charMap[id].name} class="char-img" />
          {:else}
            <div class="char-avatar">{charMap[id].placeholder}</div>
          {/if}
          <span class="char-name">{charMap[id].name}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- RIVER + BOAT -->
  <div class="river">
    <div class="waves"></div>

    <!-- Boat animates north↔south within the river strip -->
    <div class="boat-track">
      <div class="boat" class:at-south={!boatAtNorth} class:crossing={animating}>
        <div class="boat-label">{ferrymanEmoji} {ferrymanName}</div>
        <div class="boat-hold">
          {#if passenger}
            <button
              class="char-card in-boat"
              onclick={() => clickCharacter(passenger)}
              style="--c: {charMap[passenger].color}"
              title="Click to unload {charMap[passenger].name}"
            >
              {#if charMap[passenger].image}
                <img src={charMap[passenger].image} alt={charMap[passenger].name} class="char-img small" />
              {:else}
                <div class="char-avatar small">{charMap[passenger].placeholder}</div>
              {/if}
              <span class="char-name">{charMap[passenger].name}</span>
            </button>
          {:else}
            <div class="empty-slot">+ passenger</div>
          {/if}
        </div>
        <button
          class="row-btn"
          onclick={row}
          disabled={animating || status !== 'playing'}
        >
          {boatAtNorth ? 'Row South →' : '← Row North'}
        </button>
      </div>
    </div>
  </div>

  <!-- SOUTH BANK -->
  <div class="bank south-bank">
    <div class="bank-label">🏕 South Bank <span class="bank-sub">goal</span></div>
    <div class="characters">
      {#each south as id (id)}
        <button
          class="char-card"
          class:clickable={boatSide === 'south'}
          onclick={() => clickCharacter(id)}
          style="--c: {charMap[id].color}"
          title="Click to re-board {charMap[id].name}"
        >
          {#if charMap[id].image}
            <img src={charMap[id].image} alt={charMap[id].name} class="char-img" />
          {:else}
            <div class="char-avatar">{charMap[id].placeholder}</div>
          {/if}
          <span class="char-name">{charMap[id].name}</span>
        </button>
      {/each}
    </div>
  </div>
</div>

<!-- ── Warning ──────────────────────────────────────────────── -->
{#if warning}
  <div class="warning-bar" class:shake>⚠️ {warning}</div>
{/if}

<!-- ── Win overlay ──────────────────────────────────────────── -->
{#if status === 'won'}
  <div class="win-overlay">
    <div class="win-card">
      <div class="win-stars">
        {#each { length: 3 } as _, i}
          <span class="star" class:earned={i < starsEarned()}>⭐</span>
        {/each}
      </div>
      <h2>{winMsg}</h2>
      <p class="win-moves">Solved in <strong>{moves} moves</strong>{moves <= scoring.optimal ? ' — perfect! 🎯' : ''}</p>
      <div class="win-btns">
        <button class="ctrl-btn primary" onclick={reset}>Play again</button>
        <a href="/games" class="ctrl-btn">← All games</a>
      </div>
    </div>
  </div>
{/if}

<!-- ── Info bar ──────────────────────────────────────────────── -->
<div class="info-bar">
  <p class="intro-text">{intro}</p>
  <button class="ctrl-btn small" onclick={reset}>↺ Reset</button>
</div>

<style>
  :global(body) {
    margin: 0;
    background: #0d1b2a;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    color: #fff;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Nav ── */
  .top-nav {
    position: sticky;
    top: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.7rem 1.5rem;
    background: rgba(13,27,42,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .back-link {
    color: rgba(255,255,255,0.6);
    text-decoration: none;
    font-size: 0.82rem;
    font-weight: 700;
    transition: color 0.15s;
  }
  .back-link:hover { color: #fff; }
  .nav-title { font-size: 0.9rem; font-weight: 800; flex: 1; }
  .move-counter { font-size: 0.82rem; opacity: 0.7; }
  .move-counter strong { color: #ffd23f; }

  /* ── Scene ── */
  .scene {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 48px);
    min-height: 500px;
  }

  /* ── Banks ── */
  .bank {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1.5rem;
  }
  .north-bank { background: linear-gradient(180deg, #0e2010 0%, #152a18 100%); }
  .south-bank { background: linear-gradient(180deg, #1a100a 0%, #0e2010 100%); }

  .bank-label {
    font-size: 0.8rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    opacity: 0.6;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .bank-sub {
    font-size: 0.65rem;
    background: rgba(255,255,255,0.1);
    padding: 0.1rem 0.5rem;
    border-radius: 100px;
    text-transform: uppercase;
  }

  .characters {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  /* ── Character cards ── */
  .char-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
    background: rgba(255,255,255,0.06);
    border: 2px solid var(--c);
    border-radius: 16px;
    padding: 0.7rem 1rem;
    cursor: default;
    transition: transform 0.15s, box-shadow 0.15s;
    color: #fff;
    font: inherit;
  }
  .char-card.clickable {
    cursor: pointer;
  }
  .char-card.clickable:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.4);
  }
  .char-card.in-boat {
    cursor: pointer;
    background: rgba(255,255,255,0.12);
  }

  .char-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--c);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 900;
    color: #0d1b2a;
    flex-shrink: 0;
  }
  .char-avatar.small {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
  }
  .char-img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    object-fit: cover;
  }
  .char-img.small {
    width: 40px;
    height: 40px;
  }
  .char-name {
    font-size: 0.72rem;
    font-weight: 700;
    white-space: nowrap;
  }

  /* ── River ── */
  .river {
    flex: 0 0 180px;
    position: relative;
    background: #0a2a40;
    overflow: hidden;
  }

  .waves {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      90deg,
      transparent,
      transparent 40px,
      rgba(6,214,160,0.06) 40px,
      rgba(6,214,160,0.06) 80px
    );
    animation: flowRight 4s linear infinite;
  }
  @keyframes flowRight {
    from { background-position: 0 0; }
    to   { background-position: 80px 0; }
  }

  /* ── Boat ── */
  .boat-track {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .boat {
    background: #7c4b1f;
    border: 2px solid #a0622a;
    border-radius: 12px 12px 24px 24px;
    padding: 0.7rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    min-width: 160px;
    transition: transform 0.75s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateY(-36px); /* north side of river */
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  }

  .boat.at-south {
    transform: translateY(36px); /* south side of river */
  }

  .boat-label {
    font-size: 0.7rem;
    font-weight: 800;
    opacity: 0.8;
    white-space: nowrap;
  }

  .boat-hold {
    min-height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .empty-slot {
    font-size: 0.7rem;
    opacity: 0.35;
    border: 1.5px dashed rgba(255,255,255,0.2);
    border-radius: 10px;
    padding: 0.4rem 0.8rem;
    white-space: nowrap;
  }

  .row-btn {
    background: #06d6a0;
    color: #0d1b2a;
    border: none;
    border-radius: 100px;
    font-size: 0.75rem;
    font-weight: 800;
    padding: 0.35rem 0.9rem;
    cursor: pointer;
    transition: background 0.15s, opacity 0.15s;
    white-space: nowrap;
  }
  .row-btn:hover:not(:disabled) { background: #04c090; }
  .row-btn:disabled { opacity: 0.4; cursor: default; }

  /* ── Warning ── */
  .warning-bar {
    position: fixed;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    background: #7a1515;
    border: 1px solid #c53030;
    color: #fff;
    padding: 0.6rem 1.2rem;
    border-radius: 100px;
    font-size: 0.83rem;
    font-weight: 600;
    z-index: 30;
    white-space: nowrap;
    max-width: 90vw;
    text-align: center;
  }
  .warning-bar.shake {
    animation: shake 0.5s ease;
  }
  @keyframes shake {
    0%, 100% { transform: translateX(-50%); }
    20%       { transform: translateX(calc(-50% - 8px)); }
    40%       { transform: translateX(calc(-50% + 8px)); }
    60%       { transform: translateX(calc(-50% - 5px)); }
    80%       { transform: translateX(calc(-50% + 5px)); }
  }

  /* ── Info bar ── */
  .info-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(13,27,42,0.95);
    border-top: 1px solid rgba(255,255,255,0.08);
    padding: 0.5rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    z-index: 10;
  }
  .intro-text {
    margin: 0;
    font-size: 0.75rem;
    opacity: 0.5;
    flex: 1;
  }

  /* ── Buttons ── */
  .ctrl-btn {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    padding: 0.4rem 0.9rem;
    border-radius: 100px;
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    transition: background 0.15s;
    white-space: nowrap;
  }
  .ctrl-btn:hover { background: rgba(255,255,255,0.18); }
  .ctrl-btn.primary { background: #06d6a0; color: #0d1b2a; border-color: #06d6a0; }
  .ctrl-btn.primary:hover { background: #04c090; }
  .ctrl-btn.small { font-size: 0.72rem; padding: 0.3rem 0.7rem; }

  /* ── Win overlay ── */
  .win-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }
  .win-card {
    background: #0d2137;
    border: 2px solid #06d6a0;
    border-radius: 24px;
    padding: 2.5rem;
    text-align: center;
    max-width: 360px;
    width: 90%;
  }
  .win-stars {
    font-size: 2rem;
    margin-bottom: 1rem;
    letter-spacing: 0.2rem;
  }
  .star { opacity: 0.2; transition: opacity 0.3s; }
  .star.earned { opacity: 1; }
  .win-card h2 {
    font-size: 1.6rem;
    font-weight: 900;
    margin: 0 0 0.5rem;
  }
  .win-moves {
    opacity: 0.65;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
  .win-moves strong { color: #ffd23f; }
  .win-btns {
    display: flex;
    gap: 0.7rem;
    justify-content: center;
    flex-wrap: wrap;
  }
</style>
