<script>
  let { cardVisible = false } = $props();

  const PARTICLES = ['🎊','⛺','🛶','✨','🏕','🎉','🌊','🥳'];
</script>

<div class={{ 'win-salute': true, 'card-visible': cardVisible }}>
  <div class="salute-text">🎉 Yay! You've done it! 🎉</div>
  {#each PARTICLES as emoji, i}
    <span class="salute-particle" style="--i:{i}">{emoji}</span>
  {/each}
</div>

<style>
  @keyframes salute-pop {
    from { opacity: 0; transform: scale(0.4) rotate(-5deg); }
    to   { opacity: 1; transform: scale(1) rotate(0deg); }
  }
  @keyframes salute-fade-out { to { opacity: 0; transform: scale(0.9); } }
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
  .win-salute.card-visible .salute-text { animation: salute-fade-out 0.3s ease forwards; }

  .salute-particle {
    position: absolute;
    font-size: clamp(1.2rem, 3vw, 1.8rem);
    animation: particle-fly 1.1s cubic-bezier(0.2,0,0.8,1) calc(var(--i) * 0.08s) both;
    --angle: calc(var(--i) * 45deg);
    --dist: clamp(80px, 20vw, 180px);
  }
</style>
