<script>
  import { GAMES_HUB } from '$lib/config/games.js';
</script>

<svelte:head>
  <title>Camp Games · Wenatchee 2026</title>
</svelte:head>

<nav class="top-nav">
  <a href="/" class="back-link">← Back to camp</a>
  <span class="nav-title">🎮 Camp Games</span>
</nav>

<main class="hub">
  <div class="hub-header">
    <h1>{GAMES_HUB.title}</h1>
    <p class="subtitle">{GAMES_HUB.subtitle}</p>
  </div>

  <div class="game-grid">
    {#each GAMES_HUB.games as game}
      <div class="game-card" class:unavailable={!game.available}>
        <div class="game-emoji">{game.emoji}</div>
        <div class="game-info">
          <h2>{game.title}</h2>
          <p>{game.description}</p>
          <span class="points-badge">up to {game.maxPoints} pts</span>
        </div>
        {#if game.available}
          <a href={game.path} class="play-btn">Play →</a>
        {:else}
          <span class="coming-soon">Coming soon</span>
        {/if}
      </div>
    {/each}
  </div>
</main>

<style>
  .top-nav {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.7rem 1.5rem;
    background: rgba(13,27,42,0.9);
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
  .nav-title {
    font-size: 0.85rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: 0.04em;
  }

  .hub {
    min-height: 100vh;
    background: #0d1b2a;
    color: #fff;
    padding: 4rem 1.5rem;
  }
  .hub-header {
    text-align: center;
    margin-bottom: 3rem;
  }
  .hub-header h1 {
    font-size: clamp(2rem, 6vw, 3.5rem);
    font-weight: 900;
    margin: 0 0 0.5rem;
  }
  .subtitle {
    opacity: 0.55;
    font-size: 1rem;
    margin: 0;
  }

  .game-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .game-card {
    background: rgba(255,255,255,0.05);
    border: 1.5px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.2rem;
    transition: border-color 0.2s;
  }
  .game-card:not(.unavailable):hover {
    border-color: #06d6a0;
  }
  .game-card.unavailable { opacity: 0.4; }

  .game-emoji { font-size: 2.5rem; flex-shrink: 0; }

  .game-info { flex: 1; }
  .game-info h2 { margin: 0 0 0.3rem; font-size: 1.1rem; font-weight: 800; }
  .game-info p { margin: 0 0 0.5rem; font-size: 0.83rem; opacity: 0.65; }

  .points-badge {
    font-size: 0.7rem;
    font-weight: 700;
    background: rgba(255,210,63,0.15);
    color: #ffd23f;
    border: 1px solid rgba(255,210,63,0.3);
    padding: 0.2rem 0.6rem;
    border-radius: 100px;
  }

  .play-btn {
    background: #06d6a0;
    color: #0d1b2a;
    font-weight: 800;
    font-size: 0.9rem;
    padding: 0.6rem 1.4rem;
    border-radius: 100px;
    text-decoration: none;
    flex-shrink: 0;
    transition: background 0.15s;
  }
  .play-btn:hover { background: #04c090; }

  .coming-soon {
    font-size: 0.75rem;
    font-weight: 700;
    opacity: 0.4;
    flex-shrink: 0;
    white-space: nowrap;
  }
</style>
