<section class="fire-section">
  <div class="section-inner">
    <div class="alert-header">
      <span class="fire-badge">🔥 Stage 1 Fire Restrictions</span>
      <span class="effective">In effect · Okanogan-Wenatchee National Forest · since Jun 19, 2026</span>
    </div>

    <div class="columns">
      <div class="col allowed">
        <h3>✅ Allowed</h3>
        <ul>
          <li>Campfires in <strong>established fire rings</strong> at designated campgrounds (sites 194–197 qualify)</li>
          <li>Campfires in most Wilderness areas</li>
          <li>Propane &amp; liquid-fuel stoves/lanterns with an on/off switch</li>
          <li>Charcoal grills <strong>within</strong> the designated campground</li>
        </ul>
      </div>
      <div class="col not-allowed">
        <h3>❌ Not Allowed</h3>
        <ul>
          <li>Open fires outside designated campgrounds</li>
          <li>Charcoal fires outside designated campgrounds</li>
          <li>Wood stoves outside designated campgrounds</li>
          <li>Fireworks — <strong>always prohibited in Chelan County</strong></li>
          <li>Exploding targets &amp; incendiary ammo</li>
          <li>Smoking except in cleared areas</li>
        </ul>
      </div>
    </div>

    <div class="footer-row">
      <span class="compliant-note">
        🏕 Our sites (194–197) are in a <strong>designated campground with established fire rings</strong> — campfires are fine. Keep them under 36" and always attended.
      </span>
      <a
        href="https://www.lwfr.org/burn-restrictions"
        target="_blank"
        rel="noopener noreferrer"
        class="more-link"
      >Full restrictions ↗</a>
    </div>
  </div>
</section>

<style>
  .fire-section {
    background: #1a0d00;
    border-top: 3px solid #ff6b35;
    padding: 2.5rem 1.5rem;
    color: #fff;
  }

  .section-inner {
    max-width: 900px;
    margin: 0 auto;
  }

  .alert-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }

  .fire-badge {
    background: #ff6b35;
    color: #fff;
    font-weight: 800;
    font-size: 0.85rem;
    padding: 0.3rem 0.9rem;
    border-radius: 100px;
    white-space: nowrap;
    letter-spacing: 0.04em;
  }

  .effective {
    font-size: 0.8rem;
    opacity: 0.55;
  }

  .columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 600px) {
    .columns { grid-template-columns: 1fr; }
  }

  .col h3 {
    font-size: 0.85rem;
    font-weight: 800;
    margin: 0 0 0.7rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .col ul {
    margin: 0;
    padding-left: 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .col ul li {
    font-size: 0.83rem;
    line-height: 1.45;
    opacity: 0.85;
  }

  .allowed h3 { color: #06d6a0; }
  .not-allowed h3 { color: #ff6b35; }

  .footer-row {
    background: rgba(255,107,53,0.08);
    border: 1px solid rgba(255,107,53,0.2);
    border-radius: 10px;
    padding: 0.85rem 1.1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .compliant-note {
    font-size: 0.82rem;
    line-height: 1.5;
    opacity: 0.9;
  }

  .more-link {
    color: #ffd23f;
    font-size: 0.8rem;
    font-weight: 700;
    text-decoration: none;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .more-link:hover { text-decoration: underline; }
</style>
