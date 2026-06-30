/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  try {
    const res = await fetch('/api/weather');
    if (!res.ok) return { forecast: null };
    const periods = await res.json();

    if (!Array.isArray(periods)) return { forecast: null };

    // NWS returns alternating daytime/nighttime periods.
    // Pair them up into one entry per day.
    const days = [];
    for (let i = 0; i < periods.length; i++) {
      const p = periods[i];
      if (!p.isDaytime) continue;

      const night = periods[i + 1] ?? null;
      const dateStr = p.startTime.slice(0, 10); // "2026-07-01"

      days.push({
        date:          dateStr,
        max:           p.temperature,
        min:           night?.temperature ?? null,
        shortForecast: p.shortForecast,
        windSpeed:     p.windSpeed,
        windDirection: p.windDirection,
      });
    }

    return { forecast: days.length ? days : null };
  } catch {
    return { forecast: null };
  }
}
