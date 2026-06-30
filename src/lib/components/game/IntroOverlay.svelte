<script>
  let { onstartgame } = $props();
</script>

<div class="intro-overlay">
  <div class="intro-card">
    <div class="intro-boat">🛶</div>
    <h2>River Crossing</h2>
    <ul class="rules-list">
      <li><span class="rule-icon">🏕</span> Get <strong>everyone</strong> to the south bank</li>
      <li><span class="rule-icon">🚣</span> The boat fits <strong>1 passenger</strong> at a time</li>
    </ul>
    <button class="start-btn" onclick={onstartgame}>Let's Go! →</button>
  </div>
</div>

<style>
  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes card-pop { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes icon-bob {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-6px); }
  }

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
