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
