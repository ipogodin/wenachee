<script>
  const EMOJIS = [
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
</script>

<div class="fight-burst">
  {#each EMOJIS as f}
    <span class="fight-emoji" style="--dx:{f.dx}px; --dy:{f.dy}px; --rot:{f.rot}deg; --delay:{f.delay}s">{f.e}</span>
  {/each}
  <div class="fight-word">FIGHT!</div>
</div>

<style>
  @keyframes fight-bg-flash {
    0%    { background: rgba(180,20,10,0);    }
    15%   { background: rgba(180,20,10,0.35); }
    60%   { background: rgba(180,20,10,0.3);  }
    100%  { background: rgba(180,20,10,0.1);  }
  }
  @keyframes emoji-burst {
    0%   { opacity: 0; transform: translate(0,0) scale(0) rotate(0deg); }
    25%  { opacity: 1; transform: translate(var(--dx), var(--dy)) scale(1.4) rotate(var(--rot)); }
    70%  { opacity: 1; transform: translate(var(--dx), var(--dy)) scale(1)   rotate(calc(var(--rot)*2)); }
    100% { opacity: 0; transform: translate(calc(var(--dx)*1.3), calc(var(--dy)*1.3)) scale(0.6) rotate(calc(var(--rot)*3)); }
  }
  @keyframes fight-word-anim {
    0%    { opacity: 0; transform: scale(0.2) rotate(-8deg); }
    15%   { opacity: 1; transform: scale(1.3) rotate(3deg); }
    30%   { transform: scale(0.95) rotate(-2deg); }
    45%   { transform: scale(1.15) rotate(1deg); }
    70%   { opacity: 1; transform: scale(1) rotate(0deg); }
    100%  { opacity: 0; transform: scale(0.8); }
  }

  .fight-burst {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    z-index: 8; pointer-events: none;
    animation: fight-bg-flash 2s ease forwards;
  }
  .fight-emoji {
    position: absolute; top: 50%; left: 50%;
    font-size: 1.8rem; line-height: 1;
    animation: emoji-burst 0.7s cubic-bezier(0.2,0,0.8,1) var(--delay) 3 both;
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
</style>
