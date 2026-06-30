<script>
  import Hero from '$lib/components/Hero.svelte';
  import CampingSites from '$lib/components/CampingSites.svelte';
  import Schedule from '$lib/components/Schedule.svelte';
  import Weather from '$lib/components/Weather.svelte';
  import RiverFloat from '$lib/components/RiverFloat.svelte';
  import FloatRules from '$lib/components/FloatRules.svelte';
  import FireAlert from '$lib/components/FireAlert.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>Wenatchee Lake Camp 2026</title>
  <meta name="description" content="Camping trip at Lake Wenatchee, WA — July 1–6, 2026. Sites, schedule, weather & float rules." />
  <meta name="theme-color" content="#0d1b2a" />
</svelte:head>

<!-- Nav -->
<nav class="top-nav">
  <a href="#sites">Sites</a>
  <a href="#schedule">Schedule</a>
  <a href="#weather">Weather</a>
  <a href="#float">Float</a>
  <a href="/games" class="games-link">🎮 Games</a>
</nav>

<Hero />

<a href="/games" class="games-cta">
  <span class="games-cta-icon">🎮</span>
  <span class="games-cta-text">
    <strong>Camp Games are live!</strong>
    <span>River Crossing puzzle + more coming — play now</span>
  </span>
  <span class="games-cta-badge">Live</span>
  <span class="games-cta-arrow">→</span>
</a>

<CampingSites />
<Schedule forecast={data.forecast} />
<FireAlert />
<Weather forecast={data.forecast} />
<RiverFloat />
<FloatRules />

<footer class="site-footer">
  <p>⛺ Wenatchee Lake Camp 2026 · See you there!</p>
</footer>

<style>
  :global(*) {
    box-sizing: border-box;
  }

  :global(html) {
    scroll-behavior: smooth;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    background: #0d1b2a;
    color: #fff;
    -webkit-font-smoothing: antialiased;
  }

  .top-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    background: rgba(13, 27, 42, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .top-nav a {
    color: rgba(255,255,255,0.75);
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 0.35rem 0.8rem;
    border-radius: 100px;
    transition: all 0.2s;
  }

  .top-nav a:hover {
    color: #fff;
    background: rgba(255,255,255,0.1);
  }

  .top-nav .games-link {
    color: #06d6a0;
    border: 1px solid rgba(6,214,160,0.35);
  }
  .top-nav .games-link:hover {
    background: rgba(6,214,160,0.15);
    color: #06d6a0;
  }

  /* ── Games CTA banner ── */
  @keyframes cta-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes cta-pulse-border {
    0%, 100% { border-color: rgba(6,214,160,0.55); box-shadow: 0 0 0 0 rgba(6,214,160,0); }
    50%       { border-color: rgba(6,214,160,1);    box-shadow: 0 0 18px 2px rgba(6,214,160,0.25); }
  }
  @keyframes icon-bounce {
    0%, 100% { transform: translateY(0) rotate(0deg);  }
    30%      { transform: translateY(-6px) rotate(-8deg); }
    60%      { transform: translateY(-3px) rotate(4deg);  }
  }
  @keyframes arrow-slide {
    0%, 100% { transform: translateX(0);   opacity: 1; }
    45%      { transform: translateX(6px);  opacity: 0.4; }
    46%      { transform: translateX(-6px); opacity: 0.4; }
  }

  .games-cta {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    padding: 1.1rem 1.5rem;
    text-decoration: none;
    color: #fff;
    position: relative;
    overflow: hidden;
    /* vivid layered background */
    background: linear-gradient(135deg, rgba(6,214,160,0.18) 0%, rgba(13,27,42,0.95) 50%, rgba(6,100,200,0.12) 100%);
    border-top: 2px solid rgba(6,214,160,0.55);
    border-bottom: 1px solid rgba(6,214,160,0.2);
    /* pulsing border glow */
    animation: cta-pulse-border 2.4s ease-in-out infinite;
    transition: background 0.2s;
  }
  /* scan-line shimmer pseudo-element */
  .games-cta::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg,
      transparent 35%,
      rgba(6,214,160,0.08) 50%,
      transparent 65%
    );
    background-size: 200% 100%;
    animation: cta-shimmer 3s linear infinite;
    pointer-events: none;
  }
  .games-cta:hover {
    background: linear-gradient(135deg, rgba(6,214,160,0.28) 0%, rgba(13,27,42,0.95) 50%, rgba(6,100,200,0.18) 100%);
  }

  .games-cta-icon {
    font-size: 2rem;
    flex-shrink: 0;
    animation: icon-bounce 2.8s ease-in-out infinite;
    filter: drop-shadow(0 0 8px rgba(6,214,160,0.6));
  }
  .games-cta-text { flex: 1; display: flex; flex-direction: column; gap: 0.15rem; }
  .games-cta-text strong {
    font-size: 1rem;
    color: #06d6a0;
    text-shadow: 0 0 12px rgba(6,214,160,0.5);
  }
  .games-cta-text span { font-size: 0.8rem; opacity: 0.65; }

  .games-cta-badge {
    font-size: 0.6rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    background: #06d6a0;
    color: #0d1b2a;
    padding: 0.15rem 0.5rem;
    border-radius: 100px;
    flex-shrink: 0;
  }
  .games-cta-arrow {
    font-size: 1.3rem;
    color: #06d6a0;
    animation: arrow-slide 2s ease-in-out infinite;
    flex-shrink: 0;
  }

  .site-footer {
    background: #060e18;
    text-align: center;
    padding: 2.5rem 1rem;
    font-size: 0.85rem;
    opacity: 0.5;
    color: #fff;
  }
</style>
