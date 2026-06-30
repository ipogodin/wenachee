<script>
  let {
    masterVolume = $bindable(0.7),
    muted        = $bindable(false),
    onreset,
  } = $props();

  function toggleMute() { muted = !muted; }

  let icon = $derived(
    muted || masterVolume === 0 ? '🔇' : masterVolume < 0.45 ? '🔉' : '🔊'
  );
</script>

<div class="info-bar">
  <div class="sound-ctrl">
    <button class="sound-icon-btn" onclick={toggleMute} title={muted ? 'Unmute' : 'Mute'}>
      {icon}
    </button>
    <input
      type="range" class="vol-slider"
      min="0" max="1" step="0.05"
      bind:value={masterVolume}
      oninput={() => { if (muted && masterVolume > 0) muted = false; }}
      title="Master volume"
    />
  </div>
  <button class="reset-btn" onclick={onreset}>↺ Reset</button>
</div>

<style>
  .info-bar {
    position: fixed; bottom: 0; left: 0; right: 0; height: 52px;
    background: rgba(5,15,28,0.88); backdrop-filter: blur(12px);
    border-top: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; gap: 1rem; padding: 0 1.2rem; z-index: 20;
  }
  .sound-ctrl { display: flex; align-items: center; gap: 0.5rem; flex: 1; }
  .sound-icon-btn {
    background: none; border: none; color: #fff;
    font-size: 1.1rem; cursor: pointer; padding: 0; line-height: 1;
    opacity: 0.8; transition: opacity 0.15s;
  }
  .sound-icon-btn:hover { opacity: 1; }
  .vol-slider {
    -webkit-appearance: none; appearance: none;
    width: 90px; height: 3px;
    background: rgba(255,255,255,0.2); border-radius: 2px;
    cursor: pointer; outline: none;
  }
  .vol-slider::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    width: 13px; height: 13px; border-radius: 50%;
    background: #06d6a0; cursor: pointer;
    box-shadow: 0 0 4px rgba(6,214,160,0.6);
  }
  .vol-slider::-moz-range-thumb {
    width: 13px; height: 13px; border-radius: 50%; border: none;
    background: #06d6a0; cursor: pointer;
  }
  .reset-btn {
    background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
    color: #fff; padding: 0.3rem 0.8rem; border-radius: 100px;
    font-size: 0.74rem; font-weight: 700; cursor: pointer; white-space: nowrap;
    transition: background 0.15s;
  }
  .reset-btn:hover { background: rgba(255,255,255,0.15); }
</style>
