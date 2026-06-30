<script>
  import SCHEDULE from '$lib/config/schedule.json';

  let { forecast = null } = $props();

  let activeDay = $state(0);

  function condition(shortForecast) {
    const s = shortForecast?.toLowerCase() ?? '';
    if (s.includes('thunder'))                                    return ['⛈',  shortForecast];
    if (s.includes('snow') || s.includes('blizzard'))            return ['🌨',  shortForecast];
    if (s.includes('fog'))                                        return ['🌫',  shortForecast];
    if (s.includes('heavy rain') || s.includes('heavy shower'))  return ['🌧',  shortForecast];
    if (s.includes('rain') || s.includes('shower') || s.includes('drizzle')) return ['🌦', shortForecast];
    if (s.includes('mostly sunny') || s.includes('mostly clear')) return ['🌤', shortForecast];
    if (s.includes('partly sunny') || s.includes('partly cloudy')) return ['⛅', shortForecast];
    if (s.includes('mostly cloudy') || s.includes('considerable')) return ['🌥', shortForecast];
    if (s.includes('cloudy') || s.includes('overcast'))          return ['☁️', shortForecast];
    if (s.includes('sunny') || s.includes('clear'))              return ['☀️', shortForecast];
    return ['🌡', shortForecast ?? 'Unknown'];
  }

  // Build date → weather lookup
  let weatherMap = $derived(
    forecast
      ? Object.fromEntries(forecast.map(f => [f.date, f]))
      : {}
  );

  function dayWeather(date) {
    return weatherMap[date] ?? null;
  }
</script>

<section class="schedule-section" id="schedule">
  <div class="section-inner">
    <div class="section-header">
      <span class="tag">📅 The Plan</span>
      <h2>6 Days of Adventure</h2>
      <p class="lead">July 1–6, 2026 · Lake Wenatchee, WA</p>
    </div>

    <!-- Day tabs -->
    <div class="day-tabs" role="tablist">
      {#each SCHEDULE as day, i}
        {@const w = dayWeather(day.date)}
        <button
          class="day-tab"
          class:active={activeDay === i}
          role="tab"
          aria-selected={activeDay === i}
          onclick={() => activeDay = i}
        >
          <span class="tab-label">{day.label}</span>
          {#if w}
            <span class="tab-weather">{condition(w.shortForecast)[0]} {Math.round(w.max)}°</span>
          {/if}
        </button>
      {/each}
    </div>

    <!-- Weather summary for active day -->
    {#if dayWeather(SCHEDULE[activeDay].date)}
      {@const w = dayWeather(SCHEDULE[activeDay].date)}
      {@const [emoji, label] = condition(w.shortForecast)}
      <div class="weather-bar">
        <span class="w-icon">{emoji}</span>
        <span class="w-label">{label}</span>
        <span class="w-temps">↑ {Math.round(w.max)}° / ↓ {w.min !== null ? Math.round(w.min) + '°' : '—'}F</span>
      </div>
    {/if}

    <!-- Activities for active day -->
    <div class="activities-panel">
      {#each SCHEDULE[activeDay].activities as activity, i}
        <div class="activity-row" style="animation-delay: {i * 0.07}s">
          <div class="time-col">
            <span class="time">{activity.time}</span>
          </div>
          <div class="connector">
            <div class="dot"></div>
            {#if i < SCHEDULE[activeDay].activities.length - 1}
              <div class="line"></div>
            {/if}
          </div>
          <div class="activity-body">
            <span class="activity-emoji">{activity.emoji}</span>
            <div>
              <p class="activity-title">{activity.title}</p>
              {#if activity.note}
                <p class="activity-note">{activity.note}</p>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>

    <p class="edit-hint">✏️ Edit activities in <code>src/lib/config/schedule.json</code></p>
  </div>
</section>

<style>
  .schedule-section {
    background: #1a1a2e;
    padding: 5rem 1.5rem;
    color: #fff;
  }

  .section-inner {
    max-width: 700px;
    margin: 0 auto;
  }

  .section-header {
    text-align: center;
    margin-bottom: 2.5rem;
  }

  .tag {
    background: #ff6b35;
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

  /* Day tabs */
  .day-tabs {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .day-tabs::-webkit-scrollbar { display: none; }

  .day-tab {
    background: rgba(255,255,255,0.08);
    border: 2px solid transparent;
    border-radius: 12px;
    color: #fff;
    cursor: pointer;
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    font-weight: 700;
    white-space: nowrap;
    transition: all 0.2s;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
  }

  .tab-label { line-height: 1.2; }

  .tab-weather {
    font-size: 0.7rem;
    font-weight: 600;
    opacity: 0.75;
  }

  .day-tab.active {
    background: #ff6b35;
    border-color: #ff6b35;
  }

  .day-tab.active .tab-weather { opacity: 1; }

  .day-tab:hover:not(.active) {
    border-color: rgba(255,255,255,0.3);
  }

  /* Weather bar */
  .weather-bar {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 0.55rem 1rem;
    margin-bottom: 1.5rem;
    font-size: 0.85rem;
  }

  .w-icon { font-size: 1.1rem; }
  .w-label { font-weight: 600; }
  .w-temps { opacity: 0.7; margin-left: auto; }
  .w-precip { opacity: 0.6; font-size: 0.8rem; }

  /* Timeline */
  .activities-panel {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .activity-row {
    display: grid;
    grid-template-columns: 80px 24px 1fr;
    gap: 0 1rem;
    align-items: flex-start;
    animation: fadeIn 0.3s ease both;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .time-col {
    text-align: right;
    padding-top: 2px;
  }

  .time {
    font-size: 0.75rem;
    font-weight: 700;
    color: #ffd23f;
    white-space: nowrap;
  }

  .connector {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ff6b35;
    flex-shrink: 0;
    margin-top: 4px;
    box-shadow: 0 0 8px #ff6b3580;
  }

  .line {
    flex: 1;
    width: 2px;
    background: rgba(255,107,53,0.3);
    min-height: 30px;
  }

  .activity-body {
    display: flex;
    gap: 0.7rem;
    padding-bottom: 1.5rem;
    align-items: flex-start;
  }

  .activity-emoji {
    font-size: 1.2rem;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .activity-title {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 700;
    line-height: 1.3;
  }

  .activity-note {
    margin: 0.2rem 0 0;
    font-size: 0.78rem;
    opacity: 0.6;
    font-style: italic;
  }

  .edit-hint {
    margin-top: 2rem;
    text-align: center;
    font-size: 0.72rem;
    opacity: 0.3;
  }

  .edit-hint code {
    background: rgba(255,255,255,0.1);
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    font-family: monospace;
  }
</style>
