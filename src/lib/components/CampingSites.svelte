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
          <div class="capacity-line">
            {#if site.capacity}
              <span>👥 {site.capacity} people</span>
            {:else}
              <span class="tbd">👥 Spots TBD</span>
            {/if}
          </div>
          <ul class="amenities">
            {#each site.amenities as a}
              <li>{a}</li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>

    <!-- Directions -->
    <div class="directions-row">
      <div class="directions-label">
        <span>📍</span>
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
          class="dir-btn google"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          Google Maps
        </a>
        <a
          href="https://maps.apple.com/?daddr=47.811871,-120.724083&dirflg=d"
          target="_blank"
          rel="noopener noreferrer"
          class="dir-btn apple"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          Apple Maps
        </a>
      </div>
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

  .capacity-line {
    font-size: 0.85rem;
    opacity: 0.9;
    margin-bottom: 0.8rem;
  }

  .tbd {
    opacity: 0.5;
    font-style: italic;
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

  /* Directions */
  .directions-row {
    margin-top: 2rem;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    padding: 1.2rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .directions-label {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 0.85rem;
  }

  .directions-label span:first-child {
    font-size: 1.4rem;
    flex-shrink: 0;
  }

  .directions-label div {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .directions-label strong {
    font-size: 0.9rem;
  }

  .directions-label span:not(:first-child) {
    opacity: 0.55;
    font-size: 0.78rem;
  }

  .directions-btns {
    display: flex;
    gap: 0.6rem;
    flex-shrink: 0;
  }

  .dir-btn {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.55rem 1.1rem;
    border-radius: 100px;
    font-size: 0.82rem;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .dir-btn.google {
    background: #4285f4;
    color: #fff;
  }

  .dir-btn.google:hover {
    background: #3367d6;
    transform: translateY(-1px);
  }

  .dir-btn.apple {
    background: rgba(255,255,255,0.12);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.2);
  }

  .dir-btn.apple:hover {
    background: rgba(255,255,255,0.2);
    transform: translateY(-1px);
  }

  @media (max-width: 600px) {
    .directions-row {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
