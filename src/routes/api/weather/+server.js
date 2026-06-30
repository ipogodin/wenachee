import { json } from '@sveltejs/kit';

const LAT = 47.8173;
const LON = -120.8668;
const UA  = 'wenachee-camp-site (https://wenachee.vercel.app)';
const HEADERS = { 'User-Agent': UA, 'Accept': 'application/geo+json' };

export async function GET() {
  try {
    // Step 1: resolve the forecast grid for this lat/lon
    const ptsRes = await fetch(`https://api.weather.gov/points/${LAT},${LON}`, { headers: HEADERS });
    if (!ptsRes.ok) throw new Error(`NWS points ${ptsRes.status}`);
    const pts = await ptsRes.json();

    // Step 2: fetch the daily forecast
    const fcRes = await fetch(pts.properties.forecast, { headers: HEADERS });
    if (!fcRes.ok) throw new Error(`NWS forecast ${fcRes.status}`);
    const fc = await fcRes.json();

    return json(fc.properties.periods, {
      headers: { 'cache-control': 'public, s-maxage=3600' },
    });
  } catch (e) {
    return json({ error: String(e) }, { status: 502 });
  }
}
