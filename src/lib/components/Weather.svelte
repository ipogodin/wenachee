<script>
  let { forecast = null, error = null } = $props();

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  /** @param {string} dateStr */
  function dayLabel(dateStr) {
    const d = new Date(dateStr + 'T12:00:00');
    return DAYS[d.getDay()];
  }

  /** Map NWS shortForecast text → emoji + short label */
  function condition(shortForecast) {
    const s = shortForecast?.toLowerCase() ?? '';
    if (s.includes('thunder'))                             return { emoji: '⛈',  label: shortForecast };
    if (s.includes('snow') || s.includes('blizzard'))     return { emoji: '🌨',  label: shortForecast };
    if (s.includes('fog'))                                 return { emoji: '🌫',  label: shortForecast };
    if (s.includes('heavy rain') || s.includes('heavy shower')) return { emoji: '🌧', label: shortForecast };
    if (s.includes('rain') || s.includes('shower') || s.includes('drizzle')) return { emoji: '🌦', label: shortForecast };
    if (s.includes('mostly sunny') || s.includes('mostly clear'))  return { emoji: '🌤',  label: shortForecast };
    if (s.includes('partly sunny') || s.includes('partly cloudy')) return { emoji: '⛅',  label: shortForecast };
    if (s.includes('mostly cloudy') || s.includes('considerable')) return { emoji: '🌥',  label: shortForecast };
    if (s.includes('cloudy') || s.includes('overcast'))            return { emoji: '☁️', label: shortForecast };
    if (s.includes('sunny') || s.includes('clear'))                return { emoji: '☀️', label: shortForecast };
    return { emoji: '🌡', label: shortForecast };
  }
</script>

<section class="weather-section" id="weather">
  <div class="section-inner">
    <div class="section-header">
      <span class="tag">🌤 Weather Outlook</span>
      <h2>July Forecast</h2>
      <p class="lead">Lake Wenatchee, WA · Live from weather.gov</p>
    </div>

    {#if error}
      <div class="error-box">
        <p>Could not load forecast — check back closer to the trip!</p>
      </div>
    {:else if !forecast}
      <div class="loading-row">
        {#each [0,1,2,3,4,5] as _}
          <div class="skeleton-card"></div>
        {/each}
      </div>
    {:else}
      <div class="forecast-row">
        {#each forecast as day}
          {@const w = condition(day.shortForecast)}
          <div class="forecast-card">
            <p class="fc-day">{dayLabel(day.date)}</p>
            <p class="fc-date">{day.date.slice(5).replace('-','/')}</p>
            <span class="fc-emoji">{w.emoji}</span>
            <p class="fc-desc">{w.label}</p>
            <div class="fc-temps">
              <span class="temp-hi">↑{Math.round(day.max)}°</span>
              {#if day.min !== null}<span class="temp-lo">↓{Math.round(day.min)}°</span>{/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}

    <p class="disclaimer">Forecast updates hourly. Pack layers — mountain mornings are chilly!</p>
  </div>
</section>

<style>
  .weather-section {
    background: linear-gradient(180deg, #0a2342 0%, #0d1b2a 100%);
    padding: 5rem 1.5rem;
    color: #fff;
  }

  .section-inner {
    max-width: 900px;
    margin: 0 auto;
  }

  .section-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .tag {
    background: #118ab2;
    color: #fff;
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
    opacity: 0.6;
    font-size: 1rem;
  }

  .forecast-row {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 600px) {
    .forecast-row {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .forecast-card {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 14px;
    padding: 1rem 0.6rem;
    text-align: center;
    transition: transform 0.2s;
  }

  .forecast-card:hover {
    transform: translateY(-3px);
    background: rgba(255,255,255,0.11);
  }

  .fc-day {
    font-weight: 800;
    font-size: 0.85rem;
    margin: 0;
    color: #ffd23f;
  }

  .fc-date {
    font-size: 0.7rem;
    opacity: 0.5;
    margin: 0.1rem 0 0.5rem;
  }

  .fc-emoji {
    font-size: 1.8rem;
    display: block;
    margin-bottom: 0.3rem;
  }

  .fc-desc {
    font-size: 0.68rem;
    opacity: 0.7;
    margin: 0 0 0.5rem;
    line-height: 1.2;
  }

  .fc-temps {
    display: flex;
    gap: 0.3rem;
    justify-content: center;
    font-weight: 700;
    font-size: 0.8rem;
  }

  .temp-hi { color: #ff6b35; }
  .temp-lo { color: #74b9ff; }

  .fc-rain {
    font-size: 0.68rem;
    margin: 0.3rem 0 0;
    opacity: 0.7;
  }

  .loading-row {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.75rem;
  }

  @media (max-width: 600px) {
    .loading-row { grid-template-columns: repeat(3, 1fr); }
  }

  .skeleton-card {
    height: 150px;
    background: rgba(255,255,255,0.05);
    border-radius: 14px;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  .error-box {
    text-align: center;
    padding: 2rem;
    opacity: 0.6;
  }

  .disclaimer {
    text-align: center;
    font-size: 0.78rem;
    opacity: 0.45;
    margin: 0;
  }
</style>
