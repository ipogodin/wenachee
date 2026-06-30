<script>
  let { character, selectable = false, arrived = false, onclick } = $props();
</script>

<button
  class={{ 'char-btn': true, selectable }}
  style="--col: {character.color}"
  {onclick}
  title={selectable ? (arrived ? `Re-board ${character.name}` : `Board ${character.name}`) : character.name}
>
  <div class={{ 'portrait-ring': true, arrived }}>
    {#if character.image}
      <img src={character.image} alt={character.name} class="portrait" />
    {:else}
      <div class="portrait-fallback">{character.placeholder}</div>
    {/if}
  </div>
  <span class="char-name">{character.name}</span>
</button>

<style>
  @keyframes golden-glow {
    0%,100% { border-color: #ffd23f; box-shadow: 0 0 0 0 rgba(255,210,63,0.7), 0 2px 12px rgba(0,0,0,0.5); }
    55%      { border-color: #ffd23f; box-shadow: 0 0 0 7px rgba(255,210,63,0),  0 2px 12px rgba(0,0,0,0.5); }
  }

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
  .char-btn.selectable .portrait-ring { animation: golden-glow 1.3s ease-in-out infinite; }
  .char-btn.selectable:hover .portrait-ring {
    animation: none;
    border-color: var(--col);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--col) 45%, transparent), 0 2px 12px rgba(0,0,0,0.5);
  }
  .portrait-ring.arrived { border-color: #06d6a0; box-shadow: 0 0 14px rgba(6,214,160,0.45); }

  .portrait { width: 100%; height: 100%; object-fit: cover; object-position: top center; }
  .portrait-fallback {
    width: 100%; height: 100%; background: var(--col, #888);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.6rem; font-weight: 900; color: #0d1b2a;
  }
  .char-name { font-size: 0.7rem; font-weight: 700; text-shadow: 0 1px 6px rgba(0,0,0,0.9); }
</style>
