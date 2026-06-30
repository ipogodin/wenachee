<script>
  import { onMount }      from 'svelte';
  import { RIVER_CROSSING } from '$lib/config/games.js';
  import IntroOverlay   from '$lib/components/game/IntroOverlay.svelte';
  import SoundPanel     from '$lib/components/game/SoundPanel.svelte';
  import CharacterToken from '$lib/components/game/CharacterToken.svelte';
  import FightBurst     from '$lib/components/game/FightBurst.svelte';
  import RiverCritters  from '$lib/components/game/RiverCritters.svelte';
  import WinSalute      from '$lib/components/game/WinSalute.svelte';
  import WinCard        from '$lib/components/game/WinCard.svelte';
  import GameOverCard   from '$lib/components/game/GameOverCard.svelte';

  const { title, characters, conflicts, scoring, winMessages } = RIVER_CROSSING;
  const charMap = Object.fromEntries(characters.map(c => [c.id, c]));

  // ── Audio ──────────────────────────────────────────────────────
  let theme, sfxBoop, sfxBoat, sfxWin, sfxFight;
  let masterVolume = $state(0.7);
  let muted        = $state(false);
  let showIntro    = $state(true);

  onMount(() => {
    theme    = new Audio('/sounds/wen_theme.mp3');
    sfxBoop  = new Audio('/sounds/wen_boop.mp3');
    sfxBoat  = new Audio('/sounds/wen_boat.mp3');
    sfxWin   = new Audio('/sounds/wen_win.mp3');
    sfxFight = new Audio('/sounds/wen_fight.mp3');
    theme.loop = true;
    return () => { theme.pause(); };
  });

  // Sync all Audio objects whenever volume state changes ($effect is the right
  // tool here — we're driving an external API, not computing derived state)
  $effect(() => {
    const vol = muted ? 0 : masterVolume;
    if (theme)    theme.volume    = vol * 0.45;
    if (sfxBoat)  sfxBoat.volume  = vol;
    if (sfxBoop)  sfxBoop.volume  = vol;
    if (sfxWin)   sfxWin.volume   = vol;
    if (sfxFight) sfxFight.volume = vol;
  });

  function playSfx(sfx) { if (!sfx) return; sfx.currentTime = 0; sfx.play().catch(() => {}); }

  function startGame() {
    showIntro = false;
    theme?.play().catch(() => {});
  }

  // ── Game state ──────────────────────────────────────────────────
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

  let boatAtNorth = $derived(boatSide === 'north');

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

  // ── Actions ────────────────────────────────────────────────────
  function clickCharacter(id) {
    if (status !== 'playing' || animating) return;

    // Unload check FIRST — passenger is no longer in the bank array after boarding
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
    boatSide = dest; // set immediately so CSS top transition fires at once
    playSfx(sfxBoat);

    setTimeout(() => {
      if (passenger) {
        setBank(dest, [...getBank(dest), passenger]);
        passenger = null;
        playSfx(sfxBoop);
      }
      animating = false;

      if (south.length === characters.length && boatSide === 'south') {
        status = 'won';
        playSfx(sfxWin);
        setTimeout(() => { winCardVisible = true; }, 1200);
        return;
      }

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

  function reset() {
    north = [...characters.map(c => c.id)]; south = []; passenger = null;
    boatSide = 'north'; moves = 0; status = 'playing';
    warning = ''; animating = false; shake = false;
    fightSide = 'north'; fightMessage = '';
    gameOverVisible = false; winCardVisible = false;
  }
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
        <CharacterToken
          character={charMap[id]}
          selectable={boatSide === 'north' && status === 'playing'}
          onclick={() => clickCharacter(id)}
        />
      {/each}
    </div>

    {#if status === 'fight' && fightSide === 'north'}
      <FightBurst />
    {/if}
  </div>

  <!-- RIVER + BOAT -->
  <div class="river-zone">
    <RiverCritters />

    <div class={{ 'boat-wrap': true, 'at-south': !boatAtNorth, crossing: animating }}>
      <button
        class={{ 'row-btn': true, 'going-south': boatAtNorth }}
        onclick={row}
        disabled={animating || status !== 'playing'}
        title={boatAtNorth ? 'Row to south bank' : 'Row to north bank'}
      ></button>

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
        <CharacterToken
          character={charMap[id]}
          selectable={boatSide === 'south' && status === 'playing'}
          arrived
          onclick={() => clickCharacter(id)}
        />
      {/each}
    </div>

    {#if status === 'fight' && fightSide === 'south'}
      <FightBurst />
    {/if}
  </div>
</div>

<!-- Warning toast -->
{#if warning}
  <div class={{ 'warning-toast': true, shake }}>⚠️ {warning}</div>
{/if}

<SoundPanel bind:masterVolume bind:muted onreset={reset} />

{#if showIntro}
  <IntroOverlay onstartgame={startGame} />
{/if}

{#if gameOverVisible}
  <GameOverCard {fightMessage} onreset={reset} />
{/if}

{#if status === 'won'}
  <WinSalute cardVisible={winCardVisible} />
  {#if winCardVisible}
    <WinCard {moves} {scoring} {winMessages} onreset={reset} />
  {/if}
{/if}

<style>
  /* game-specific body override: prevents scroll bounce on the fixed-layout game */
  :global(body) { overflow: hidden; }

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

  /* ── River zone ── */
  .river-zone { flex: 1; position: relative; }

  /* ── Boat position config ───────────────────────────────────
   *  top: 1%              → boat y when on north bank
   *  top: calc(100% - 35%) → boat y when on south bank
   * ────────────────────────────────────────────────────────── */
  .boat-wrap {
    position: absolute;
    top: 1%;
    left: 40%;
    transform: translateX(-50%);
    display: flex; flex-direction: row; align-items: center; gap: 0.8rem;
    transition: top 0.82s cubic-bezier(0.4,0,0.2,1);
  }
  .boat-wrap.at-south { top: calc(100% - 35%); }

  /* Row button — triangle arrow, LEFT of the boat */
  .row-btn {
    width: 44px; height: 52px;
    background: #06d6a0;
    border: none; padding: 0;
    cursor: pointer; flex-shrink: 0;
    clip-path: polygon(50% 100%, 0% 0%, 100% 0%); /* ▼ going south */
    filter: drop-shadow(0 4px 10px rgba(6,214,160,0.55));
    transition: filter 0.15s, transform 0.15s;
  }
  .row-btn:not(.going-south) { clip-path: polygon(50% 0%, 0% 100%, 100% 100%); } /* ▲ going north */
  .row-btn:hover:not(:disabled) { filter: drop-shadow(0 4px 14px rgba(6,214,160,0.9)) brightness(1.15); transform: scale(1.1); }
  .row-btn:disabled { opacity: 0.25; cursor: default; }

  /* Boat image */
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

  /* Passenger in boat */
  .passenger-portrait {
    position: absolute;
    top: 50%; left: 50%;
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

  .portrait-fallback {
    width: 100%; height: 100%; background: var(--col, #888);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.6rem; font-weight: 900; color: #0d1b2a;
  }

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
</style>
