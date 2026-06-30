<script>
  let { moves, scoring, winMessages, onreset } = $props();

  function starsEarned() {
    if (moves <= scoring.threeStars) return 3;
    if (moves <= scoring.twoStars) return 2;
    return 1;
  }
</script>

<div class="win-overlay">
  <div class="win-card">
    <div class="stars">
      {#each { length: 3 } as _, i}
        <span class={{ earned: i < starsEarned() }}>⭐</span>
      {/each}
    </div>
    <h2>{winMessages[moves % winMessages.length]}</h2>
    <p>Solved in <strong>{moves} moves</strong>{moves <= scoring.optimal ? ' — perfect! 🎯' : ''}</p>
    <div class="win-actions">
      <button class="pill primary" onclick={onreset}>Play again</button>
      <a href="/games" class="pill">← All games</a>
    </div>
  </div>
</div>

<style>
  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes card-pop { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }

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
