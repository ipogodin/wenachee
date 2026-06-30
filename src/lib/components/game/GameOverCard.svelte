<script>
  let { fightMessage, onreset } = $props();
</script>

<div class="game-over-overlay">
  <div class="game-over-card">
    <div class="go-icon">💀</div>
    <h2>Game Over!</h2>
    <p>{fightMessage}</p>
    <button class="pill primary" onclick={onreset}>↺ Start Over</button>
  </div>
</div>

<style>
  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes card-pop { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }

  .game-over-overlay {
    position: fixed; inset: 0; z-index: 50;
    background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    animation: fade-in 0.4s ease;
  }
  .game-over-card {
    background: #1a0808; border: 2px solid #c53030;
    border-radius: 24px; padding: 2.5rem; text-align: center;
    max-width: 340px; width: 90%;
    animation: card-pop 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }
  .go-icon { font-size: 3rem; margin-bottom: 0.5rem; }
  .game-over-card h2 { margin: 0 0 0.5rem; font-size: 1.6rem; font-weight: 900; color: #ff6b6b; }
  .game-over-card p { opacity: 0.7; font-size: 0.88rem; margin: 0 0 1.5rem; }

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
