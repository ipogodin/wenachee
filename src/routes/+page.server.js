/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
  try {
    const res = await fetch('/api/weather');
    if (!res.ok) return { forecast: null };
    const data = await res.json();

    const forecast = data.daily?.time?.map((date, i) => ({
      date,
      max: data.daily.temperature_2m_max[i],
      min: data.daily.temperature_2m_min[i],
      precip: data.daily.precipitation_sum[i],
      weathercode: data.daily.weathercode[i],
    })) ?? null;

    return { forecast };
  } catch {
    return { forecast: null };
  }
}
