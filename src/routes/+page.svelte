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

<!-- Directions — first thing after hero -->
<div class="directions-block">
  <div class="directions-address">
    <span class="dir-pin">📍</span>
    <div>
      <strong>Lake Wenatchee State Park — North Campground</strong>
      <span>21588 WA-207, Leavenworth, WA 98826</span>
    </div>
  </div>
  <div class="directions-btns">
    <a
      href="https://www.google.com/maps/dir/?api=1&destination=47.811871,-120.724083"
      target="_blank"
      rel="noopener noreferrer"
      class="dir-card google"
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
      <span class="dir-card-label">
        <span class="dir-card-title">Google Maps</span>
        <span class="dir-card-sub">Tap to navigate →</span>
      </span>
    </a>
    <a
      href="https://maps.apple.com/?daddr=47.811871,-120.724083&dirflg=d"
      target="_blank"
      rel="noopener noreferrer"
      class="dir-card apple"
    >
      <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
      <span class="dir-card-label">
        <span class="dir-card-title">Apple Maps</span>
        <span class="dir-card-sub">Tap to navigate →</span>
      </span>
    </a>
  </div>
</div>

<CampingSites />
<Schedule forecast={data.forecast} />

<!-- Games section -->
<section class="games-section">
  <div class="games-inner">
    <p class="games-eyebrow">🎮 While we're still preparing…</p>
    <h2 class="games-heading">Here are some games to keep you busy</h2>
    <p class="games-sub">Challenge the crew, earn points, and show up on July 1st already winning.</p>
    <a href="/games" class="games-btn">
      <span>Play Camp Games</span>
      <span class="games-btn-arrow">→</span>
    </a>
    <div class="games-chips">
      <span class="chip">🛶 River Crossing</span>
      <span class="chip">🎯 Camp Quiz</span>
      <span class="chip chip-soon">🔒 More coming</span>
    </div>
  </div>
</section>

<FireAlert />
<Weather forecast={data.forecast} />
<RiverFloat />
<FloatRules />

<footer class="site-footer">
  <p>⛺ Wenatchee Lake Camp 2026 · See you there!</p>
</footer>

<style>
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

  /* ── Directions ── */
  .directions-block {
    background: #0d1b2a;
    padding: 1.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
  }

  .directions-address {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.85rem;
    color: rgba(255,255,255,0.75);
  }

  .dir-pin { font-size: 1.2rem; flex-shrink: 0; }

  .directions-address div {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  .directions-address strong { color: #fff; font-size: 0.9rem; }
  .directions-address span  { opacity: 0.6; font-size: 0.78rem; }

  .directions-btns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .dir-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-radius: 16px;
    text-decoration: none;
    color: #fff;
    font-weight: 700;
    transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
    border: 2px solid transparent;
  }

  .dir-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 28px rgba(0,0,0,0.4);
    filter: brightness(1.1);
  }

  .dir-card:active { transform: translateY(0); }

  .dir-card.google {
    background: linear-gradient(135deg, #4285f4, #2b6de8);
    border-color: rgba(255,255,255,0.15);
  }

  .dir-card.apple {
    background: linear-gradient(135deg, #3a3a3c, #1c1c1e);
    border-color: rgba(255,255,255,0.15);
  }

  .dir-card-label {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  .dir-card-title { font-size: 1rem; font-weight: 800; }
  .dir-card-sub   { font-size: 0.72rem; opacity: 0.75; font-weight: 600; letter-spacing: 0.02em; }

  @media (max-width: 500px) {
    .directions-btns { grid-template-columns: 1fr; }
  }

  /* ── Games section ── */
  .games-section {
    background: linear-gradient(180deg, #0a1628 0%, #0d2137 100%);
    padding: 5rem 1.5rem;
    color: #fff;
    text-align: center;
    border-top: 1px solid rgba(6,214,160,0.15);
    border-bottom: 1px solid rgba(6,214,160,0.1);
  }

  .games-inner {
    max-width: 560px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .games-eyebrow {
    font-size: 0.85rem;
    font-weight: 700;
    color: #06d6a0;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin: 0;
    opacity: 0.9;
  }

  .games-heading {
    font-size: clamp(1.6rem, 4vw, 2.4rem);
    font-weight: 900;
    margin: 0;
    line-height: 1.15;
  }

  .games-sub {
    font-size: 0.95rem;
    opacity: 0.6;
    margin: 0;
    max-width: 420px;
  }

  .games-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    margin-top: 0.5rem;
    background: #06d6a0;
    color: #0d1b2a;
    font-weight: 900;
    font-size: 1rem;
    padding: 0.8rem 2rem;
    border-radius: 100px;
    text-decoration: none;
    transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 20px rgba(6,214,160,0.35);
  }
  .games-btn:hover {
    background: #04c090;
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(6,214,160,0.5);
  }
  .games-btn-arrow { font-size: 1.1rem; transition: transform 0.15s; }
  .games-btn:hover .games-btn-arrow { transform: translateX(4px); }

  .games-chips {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 0.25rem;
  }

  .chip {
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.3rem 0.85rem;
    border-radius: 100px;
    background: rgba(6,214,160,0.12);
    border: 1px solid rgba(6,214,160,0.3);
    color: #06d6a0;
  }
  .chip.chip-soon {
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.45);
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
