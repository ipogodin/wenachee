import { json } from '@sveltejs/kit';

// Lake Wenatchee, WA coordinates
const LAT = 47.8173;
const LON = -120.8668;

export async function GET() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=America%2FLos_Angeles&start_date=2026-07-01&end_date=2026-07-06`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`weather API ${res.status}`);
    const data = await res.json();
    return json(data, { headers: { 'cache-control': 'public, s-maxage=3600' } });
  } catch (e) {
    return json({ error: String(e) }, { status: 502 });
  }
}
