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

  .site-footer {
    background: #060e18;
    text-align: center;
    padding: 2.5rem 1rem;
    font-size: 0.85rem;
    opacity: 0.5;
    color: #fff;
  }
</style>
