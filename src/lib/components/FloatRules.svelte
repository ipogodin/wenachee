<script>
  const RULES = [
    {
      emoji: '🍑',
      title: 'The Golden Rule',
      body: 'Your butt must fit in it. If you question whether it fits, it doesn\'t fit.',
    },
    {
      emoji: '⏱️',
      title: '4-Hour Float Plan',
      body: 'The river float is roughly 4 hours. Bring snacks, sunscreen, and something to sit on that floats.',
    },
    {
      emoji: '🌊',
      title: 'Respect the River',
      body: 'Stay together as a group. If someone tips — help first, laugh second.',
    },
    {
      emoji: '👟',
      title: 'Wear Shoes',
      body: 'River rocks are slippery. Water shoes or old sneakers. No flip-flops that fall off.',
    },
    {
      emoji: '🍺',
      title: 'Drinks Policy',
      body: 'Canned beverages only on the water. Glass is a nightmare and a hazard.',
    },
    {
      emoji: '🎒',
      title: 'Dry Bag = Mandatory',
      body: 'Phone, keys, wallet in a dry bag. We will not rescue your electronics.',
    },
    {
      emoji: '🛟',
      title: 'Life Jackets',
      body: 'Kids 12 and under must wear a PFD the entire time. Adults — strongly recommended, especially at higher flows.',
    },
    {
      emoji: '🚫',
      title: 'No Motor Zone',
      body: 'River section is non-motorized only. The lake allows motors — be courteous of swimmers near shore.',
    },
  ];
</script>

<section class="float-section" id="float">
  <div class="section-inner">
    <div class="section-header">
      <span class="tag">🛶 Float Rules</span>
      <h2>Floating Devices: The Law of the River</h2>
      <p class="lead">Unofficial, absolutely enforced.</p>
    </div>

    <div class="rules-grid">
      {#each RULES as rule, i}
        <div class="rule-card" style="animation-delay: {i * 0.05}s">
          <span class="rule-emoji">{rule.emoji}</span>
          <div>
            <h3>{rule.title}</h3>
            <p>{rule.body}</p>
          </div>
        </div>
      {/each}
    </div>

    <div class="disclaimer-box">
      <p>
        <strong>Official WA State stuff:</strong> Motorized vessels must be registered with WA DOL.
        All watercraft should carry a throwable PFD. Lake Wenatchee is within Wenatchee National Forest —
        Leave No Trace applies. <br/>
        Full regs: <strong>wdfw.wa.gov</strong>
      </p>
    </div>
  </div>
</section>

<style>
  .float-section {
    background: linear-gradient(180deg, #06d6a010 0%, #0d1b2a 100%);
    background: #0d2137;
    padding: 5rem 1.5rem;
    color: #fff;
  }

  .section-inner {
    max-width: 800px;
    margin: 0 auto;
  }

  .section-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .tag {
    background: #06d6a0;
    color: #0d1b2a;
    font-weight: 700;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    padding: 0.3rem 0.9rem;
    border-radius: 100px;
    text-transform: uppercase;
  }

  .section-header h2 {
    font-size: clamp(1.6rem, 4.5vw, 2.8rem);
    font-weight: 900;
    margin: 1rem 0 0.5rem;
  }

  .lead {
    opacity: 0.6;
    font-size: 1rem;
    font-style: italic;
  }

  .rules-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .rule-card {
    background: rgba(6, 214, 160, 0.07);
    border: 1px solid rgba(6, 214, 160, 0.2);
    border-radius: 14px;
    padding: 1.2rem;
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    animation: fadeUp 0.4s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .rule-emoji {
    font-size: 1.8rem;
    flex-shrink: 0;
    line-height: 1;
  }

  .rule-card h3 {
    margin: 0 0 0.3rem;
    font-size: 0.95rem;
    font-weight: 800;
    color: #06d6a0;
  }

  .rule-card p {
    margin: 0;
    font-size: 0.85rem;
    opacity: 0.8;
    line-height: 1.5;
  }

  .disclaimer-box {
    background: rgba(255,255,255,0.05);
    border-radius: 12px;
    padding: 1.2rem 1.5rem;
    font-size: 0.82rem;
    opacity: 0.7;
    line-height: 1.6;
    text-align: center;
  }
</style>
