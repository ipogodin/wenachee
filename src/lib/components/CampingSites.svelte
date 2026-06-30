<script>
  import { SITES, TOTAL_CAPACITY } from '$lib/config/sites.js';
  let activePin = $state(null);
</script>

<section class="sites-section" id="sites">
  <div class="section-inner">
    <div class="section-header">
      <span class="tag">⛺ Where We Sleep</span>
      <h2>Sites 194–197 · {TOTAL_CAPACITY} Adventurers</h2>
      <p class="lead">North Campground, Loop 2 · Tap a pin to see site details.</p>
    </div>

    <!-- Official park map with site pins overlaid -->
    <div class="map-wrap">
      <div class="map-canvas">
        <img
          src="/campground_map.jpg"
          alt="Lake Wenatchee State Park North Campground map"
          class="map-img"
          draggable="false"
        />
        {#each SITES as site}
          <button
            class="map-pin"
            class:active={activePin === site.id}
            style="left: {site.mapX}%; top: {site.mapY}%; --pin-color: {site.color}"
            onclick={() => activePin = activePin === site.id ? null : site.id}
            aria-label="Site {site.id}"
          >
            <span class="pin-dot"></span>
            <span class="pin-label">{site.id}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- Site cards -->
    <div class="site-grid">
      {#each SITES as site}
        <div
          class="site-card"
          class:highlighted={activePin === site.id}
          style="--card-color: {site.color}"
          role="button"
          tabindex="0"
          onclick={() => activePin = activePin === site.id ? null : site.id}
          onkeydown={(e) => e.key === 'Enter' && (activePin = activePin === site.id ? null : site.id)}
        >
          <div class="card-top">
            <span class="site-num" style="background: {site.color}">{site.id}</span>
            <h3>Site {site.id}</h3>
          </div>

          <ul class="amenities">
            {#each site.amenities as a}
              <li>{a}</li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>

  </div>
</section>

<style>
  .sites-section {
    background: linear-gradient(180deg, #0d1b2a 0%, #1a3a2a 100%);
    padding: 5rem 1.5rem;
    color: #fff;
  }

  .section-inner {
    max-width: 900px;
    margin: 0 auto;
  }

  .section-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .tag {
    background: #ffd23f;
    color: #1a1a1a;
    font-weight: 700;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    padding: 0.3rem 0.9rem;
    border-radius: 100px;
    text-transform: uppercase;
  }

  .section-header h2 {
    font-size: clamp(1.8rem, 5vw, 3rem);
    font-weight: 900;
    margin: 1rem 0 0.5rem;
  }

  .lead {
    opacity: 0.7;
    font-size: 1rem;
  }

  /* Map */
  .map-wrap {
    margin-bottom: 2.5rem;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 40px rgba(0,0,0,0.5);
  }

  .map-canvas {
    position: relative;
    width: 100%;
    /* maintain 2125:1250 aspect ratio */
    padding-top: 58.8%;
  }

  .map-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    user-select: none;
  }

  .map-pin {
    position: absolute;
    transform: translate(-50%, -50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .pin-dot {
    width: 18px;
    height: 18px;
    border-radius: 50% 50% 50% 0;
    background: var(--pin-color);
    transform: rotate(-45deg);
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    transition: transform 0.2s;
    display: block;
  }

  .map-pin.active .pin-dot,
  .map-pin:hover .pin-dot {
    transform: rotate(-45deg) scale(1.4);
  }

  .pin-label {
    font-size: 0.65rem;
    font-weight: 900;
    color: #fff;
    text-shadow: 0 1px 3px rgba(0,0,0,0.9);
    white-space: nowrap;
    background: rgba(0,0,0,0.4);
    padding: 1px 4px;
    border-radius: 4px;
  }

  /* Cards */
  .site-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .site-card {
    background: rgba(255,255,255,0.05);
    border: 2px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    padding: 1.2rem;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }

  .site-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--card-color);
  }

  .site-card.highlighted {
    border-color: var(--card-color);
    background: rgba(255,255,255,0.1);
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  }

  .card-top {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.6rem;
  }

  .site-num {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 0.85rem;
    color: #fff;
    flex-shrink: 0;
  }

  .site-card h3 {
    font-size: 0.95rem;
    font-weight: 700;
    margin: 0;
    line-height: 1.2;
  }


  .amenities {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
  }

  .amenities li {
    background: rgba(255,255,255,0.1);
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
    border-radius: 100px;
  }

</style>
