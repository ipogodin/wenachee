/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  try {
    const res = await fetch('/api/weather');
    if (!res.ok) return { forecast: null };
    const periods = await res.json();

    if (!Array.isArray(periods)) return { forecast: null };

    // NWS returns alternating daytime/nighttime periods.
    // Pair them up into one entry per day, filtered to trip dates only.
    const TRIP_START = '2026-07-01';
    const TRIP_END   = '2026-07-05';

    const days = [];
    for (let i = 0; i < periods.length; i++) {
      const p = periods[i];
      if (!p.isDaytime) continue;

      const dateStr = p.startTime.slice(0, 10);
      if (dateStr < TRIP_START || dateStr > TRIP_END) continue;

      const night = periods[i + 1] ?? null;
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
