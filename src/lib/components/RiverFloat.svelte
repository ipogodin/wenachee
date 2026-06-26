<script>
  import { onMount, onDestroy } from 'svelte';
  import 'leaflet/dist/leaflet.css';

  let mapEl = $state(null);
  let map = null;
  let L = null;

  // Hardcoded float route — edit these coordinates to update the route for everyone
  const DEFAULT_ROUTE = [
    { type: 'start', lat: 47.811871, lng: -120.724083 },
    { type: 'path',  lat: 47.808008, lng: -120.723782 },
    { type: 'path',  lat: 47.812274, lng: -120.707302 },
    { type: 'path',  lat: 47.816769, lng: -120.697861 },
    { type: 'path',  lat: 47.814118, lng: -120.690479 },
    { type: 'path',  lat: 47.815501, lng: -120.687389 },
    { type: 'path',  lat: 47.809968, lng: -120.677433 },
    { type: 'path',  lat: 47.801551, lng: -120.675030 },
    { type: 'path',  lat: 47.796132, lng: -120.662498 },
    { type: 'end',   lat: 47.796139, lng: -120.664861 },
  ];

  /** @type {{ type: 'start'|'end'|'path', lat: number, lng: number }[]} */
  let points = $state(DEFAULT_ROUTE);
  let mode = $state('done');
  let showCoords = $state(false);

  // Leaflet objects
  let markers = [];
  let polyline = null;
  let startMarker = null;
  let endMarker = null;

  function clearAll() {
    points = [...DEFAULT_ROUTE];
    redraw();
  }

  function undoLast() {
    const pathPoints = points.filter(p => p.type === 'path');
    if (pathPoints.length > 0) {
      const last = pathPoints[pathPoints.length - 1];
      points = points.filter(p => p !== last);
    } else {
      const end = points.find(p => p.type === 'end');
      if (end) points = points.filter(p => p.type !== 'end');
      else points = points.filter(p => p.type !== 'start');
    }
    redraw();
  }

  function redraw() {
    if (!map || !L) return;

    // Clear existing markers
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    if (polyline) { map.removeLayer(polyline); polyline = null; }

    const start = points.find(p => p.type === 'start');
    const end = points.find(p => p.type === 'end');
    const path = points.filter(p => p.type === 'path');

    // Draw polyline through start → path points → end
    const linePoints = [
      ...(start ? [[start.lat, start.lng]] : []),
      ...path.map(p => [p.lat, p.lng]),
      ...(end ? [[end.lat, end.lng]] : []),
    ];

    if (linePoints.length >= 2) {
      polyline = L.polyline(linePoints, {
        color: '#06d6a0',
        weight: 5,
        opacity: 0.9,
        dashArray: null,
      }).addTo(map);
    }

    // Start marker
    if (start) {
      const icon = L.divIcon({
        className: '',
        html: `<div class="float-marker start-marker">🚀 Start</div>`,
        iconAnchor: [36, 20],
      });
      const m = L.marker([start.lat, start.lng], { icon, draggable: true })
        .addTo(map)
        .bindPopup('<b>🚀 Put-in point</b><br>Drag to adjust')
        .on('dragend', e => {
          const idx = points.findIndex(p => p.type === 'start');
          if (idx >= 0) { points[idx] = { type: 'start', lat: e.target.getLatLng().lat, lng: e.target.getLatLng().lng }; redraw(); }
        });
      markers.push(m);
    }

    // End marker
    if (end) {
      const icon = L.divIcon({
        className: '',
        html: `<div class="float-marker end-marker">🏁 Take-out</div>`,
        iconAnchor: [52, 20],
      });
      const m = L.marker([end.lat, end.lng], { icon, draggable: true })
        .addTo(map)
        .bindPopup('<b>🏁 Take-out / cars here</b><br>Drag to adjust')
        .on('dragend', e => {
          const idx = points.findIndex(p => p.type === 'end');
          if (idx >= 0) { points[idx] = { type: 'end', lat: e.target.getLatLng().lat, lng: e.target.getLatLng().lng }; redraw(); }
        });
      markers.push(m);
    }

    // Path waypoints — small dots, draggable
    path.forEach((pt, i) => {
      const icon = L.divIcon({
        className: '',
        html: `<div class="float-marker waypoint-marker">${i + 1}</div>`,
        iconAnchor: [10, 10],
      });
      const m = L.marker([pt.lat, pt.lng], { icon, draggable: true })
        .addTo(map)
        .on('dragend', e => {
          const pathPts = points.filter(p => p.type === 'path');
          const global = points.indexOf(pathPts[i]);
          if (global >= 0) { points[global] = { type: 'path', lat: e.target.getLatLng().lat, lng: e.target.getLatLng().lng }; redraw(); }
        });
      markers.push(m);
    });
  }

  function handleMapClick(e) {
    const { lat, lng } = e.latlng;
    if (mode === 'start') {
      points = points.filter(p => p.type !== 'start');
      points = [{ type: 'start', lat, lng }, ...points];
      mode = 'path';
    } else if (mode === 'end') {
      points = points.filter(p => p.type !== 'end');
      points = [...points.filter(p => p.type !== 'end'), { type: 'end', lat, lng }];
      mode = 'done';
    } else if (mode === 'path') {
      // Insert before end if it exists
      const endIdx = points.findIndex(p => p.type === 'end');
      if (endIdx >= 0) {
        points = [...points.slice(0, endIdx), { type: 'path', lat, lng }, ...points.slice(endIdx)];
      } else {
        points = [...points, { type: 'path', lat, lng }];
      }
    }
    redraw();
  }

  function startPlanning() {
    const hasStart = points.some(p => p.type === 'start');
    mode = hasStart ? 'path' : 'start';
  }

  function setCursorClass() {
    if (!map) return;
    const el = map.getContainer();
    el.classList.toggle('cursor-crosshair', mode !== 'view' && mode !== 'done');
  }

  $effect(() => {
    setCursorClass();
  });

  // Approx distance in km
  function routeDistanceKm() {
    const start = points.find(p => p.type === 'start');
    const end = points.find(p => p.type === 'end');
    const path = points.filter(p => p.type === 'path');
    const all = [
      ...(start ? [start] : []),
      ...path,
      ...(end ? [end] : []),
    ];
    if (all.length < 2) return null;
    let d = 0;
    for (let i = 1; i < all.length; i++) {
      const R = 6371;
      const dLat = (all[i].lat - all[i-1].lat) * Math.PI / 180;
      const dLng = (all[i].lng - all[i-1].lng) * Math.PI / 180;
      const a = Math.sin(dLat/2)**2 + Math.cos(all[i-1].lat * Math.PI/180) * Math.cos(all[i].lat * Math.PI/180) * Math.sin(dLng/2)**2;
      d += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }
    return d.toFixed(1);
  }

  $effect(() => {
    redraw();
  });

  async function initMap() {
    L = (await import('leaflet')).default;

    map = L.map(mapEl, {
      center: [47.818, -120.795],
      zoom: 12,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    map.on('click', handleMapClick);
    redraw();

    // Fit the map to show the full route with some padding
    const latlngs = points.map(p => [p.lat, p.lng]);
    if (latlngs.length > 1) {
      map.fitBounds(latlngs, { padding: [40, 40], animate: false });
    }
  }

  onMount(() => {
    // Initialize Leaflet only after the section is visible — this guarantees
    // the container has its final CSS dimensions before Leaflet measures it.
    const observer = new IntersectionObserver(async (entries) => {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        await initMap();
      }
    }, { threshold: 0.05 });
    observer.observe(mapEl);

    return () => observer.disconnect();
  });

  onDestroy(() => {
    if (map) map.remove();
  });

  let coordsText = $derived(
    JSON.stringify(points.map(p => ({ type: p.type, lat: +p.lat.toFixed(6), lng: +p.lng.toFixed(6) })), null, 2)
  );

  let hasStart = $derived(points.some(p => p.type === 'start'));
  let hasEnd = $derived(points.some(p => p.type === 'end'));
  let dist = $derived(routeDistanceKm());
</script>

<section class="float-section" id="float">
  <div class="section-inner">

    <div class="section-header">
      <span class="tag">🛶 River Float</span>
      <h2>Plan the Float Route</h2>
      <p class="lead">Place your put-in, trace the river, drop the take-out. All markers are draggable.</p>
    </div>

    <!-- Status bar -->
    <div class="status-bar">
      {#if mode === 'view' && !hasStart}
        <span class="status-hint">👆 Hit <strong>Start Planning</strong> then tap the map to place your put-in point</span>
      {:else if mode === 'start'}
        <span class="status-hint pulse">📍 Tap the map to place the <strong>put-in / launch point</strong></span>
      {:else if mode === 'path'}
        <span class="status-hint pulse">🗺 Tap along the river to trace the route · Hit <strong>Place Take-out</strong> when done</span>
      {:else if mode === 'end'}
        <span class="status-hint pulse">🏁 Tap to place the <strong>take-out / cars location</strong></span>
      {:else if mode === 'done' || (hasStart && hasEnd)}
        <span class="status-hint">
          ✅ Route set
          {#if dist}· <strong>{dist} km</strong>{/if}
          · Tap <strong>Add Path Points</strong> to keep tracing · All markers are draggable
        </span>
      {/if}
    </div>

    <!-- Map -->
    <div class="map-wrap" bind:this={mapEl}></div>

    <!-- Controls -->
    <div class="controls-row">
      <div class="controls-left">
        {#if mode === 'view' || mode === 'done'}
          <button class="ctrl-btn primary" onclick={startPlanning}>
            {hasStart ? '+ Add Path Points' : '🚀 Start Planning'}
          </button>
          {#if !hasEnd && hasStart}
            <button class="ctrl-btn" onclick={() => mode = 'end'}>🏁 Place Take-out</button>
          {/if}
          {#if hasStart && !hasEnd}
            <button class="ctrl-btn" onclick={() => mode = 'end'}>🏁 Place Take-out</button>
          {/if}
        {:else if mode === 'path'}
          <button class="ctrl-btn primary" onclick={() => { mode = 'end'; }}>🏁 Place Take-out</button>
          <button class="ctrl-btn" onclick={() => mode = 'done'}>✅ Done Tracing</button>
        {:else if mode === 'start' || mode === 'end'}
          <button class="ctrl-btn" onclick={() => mode = 'view'}>Cancel</button>
        {/if}
        {#if points.length > 0}
          <button class="ctrl-btn danger-soft" onclick={undoLast}>↩ Undo</button>
          <button class="ctrl-btn danger" onclick={clearAll}>🗑 Clear All</button>
        {/if}
      </div>
      <div class="controls-right">
        <button class="ctrl-btn small" onclick={() => showCoords = !showCoords}>
          {showCoords ? 'Hide' : 'Show'} Coords
        </button>
      </div>
    </div>

    {#if showCoords && points.length > 0}
      <div class="coords-box">
        <pre>{coordsText}</pre>
      </div>
    {/if}

  </div>
</section>

<style>
  :global(.leaflet-container) { font-family: inherit; }
  :global(.cursor-crosshair) { cursor: crosshair !important; }
  :global(.float-marker) {
    background: rgba(0,0,0,0.75);
    color: #fff;
    border-radius: 100px;
    padding: 3px 8px;
    font-size: 0.7rem;
    font-weight: 700;
    white-space: nowrap;
    backdrop-filter: blur(4px);
    border: 1.5px solid rgba(255,255,255,0.25);
  }
  :global(.start-marker) { background: #06d6a0; color: #0d1b2a; border-color: #06d6a0; }
  :global(.end-marker) { background: #ff6b35; color: #fff; border-color: #ff6b35; }
  :global(.waypoint-marker) {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(6,214,160,0.85);
    color: #0d1b2a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6rem;
    font-weight: 900;
    padding: 0;
    border: 2px solid #fff;
  }

  .float-section {
    background: #0d2137;
    padding: 5rem 1.5rem;
    color: #fff;
  }

  .section-inner {
    max-width: 900px;
    margin: 0 auto;
  }

  .section-header {
    text-align: center;
    margin-bottom: 1.5rem;
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
    font-size: clamp(1.8rem, 5vw, 3rem);
    font-weight: 900;
    margin: 1rem 0 0.5rem;
  }

  .lead {
    opacity: 0.6;
    font-size: 1rem;
  }

  .status-bar {
    background: rgba(6, 214, 160, 0.08);
    border: 1px solid rgba(6, 214, 160, 0.2);
    border-radius: 10px;
    padding: 0.7rem 1.1rem;
    margin-bottom: 1rem;
    font-size: 0.85rem;
    min-height: 2.5rem;
    display: flex;
    align-items: center;
  }

  .status-hint { opacity: 0.9; }

  .pulse { animation: glow 1.5s ease-in-out infinite alternate; }
  @keyframes glow {
    from { color: #fff; }
    to { color: #06d6a0; }
  }

  .map-wrap {
    width: 100%;
    height: 420px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 40px rgba(0,0,0,0.5);
    margin-bottom: 1rem;
  }

  @media (max-width: 600px) {
    .map-wrap { height: 300px; }
  }

  .controls-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .controls-left {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .ctrl-btn {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    padding: 0.45rem 1rem;
    border-radius: 100px;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }

  .ctrl-btn:hover { background: rgba(255,255,255,0.18); }
  .ctrl-btn.primary { background: #06d6a0; color: #0d1b2a; border-color: #06d6a0; }
  .ctrl-btn.primary:hover { background: #04c090; }
  .ctrl-btn.danger { background: rgba(255,80,80,0.15); border-color: rgba(255,80,80,0.3); color: #ff8080; }
  .ctrl-btn.danger:hover { background: rgba(255,80,80,0.25); }
  .ctrl-btn.danger-soft { background: rgba(255,180,50,0.1); border-color: rgba(255,180,50,0.25); color: #ffd23f; }
  .ctrl-btn.small { font-size: 0.75rem; padding: 0.35rem 0.8rem; }

  .coords-box {
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 1rem;
    margin-top: 0.5rem;
    overflow-x: auto;
  }

  .coords-box pre {
    margin: 0;
    font-size: 0.72rem;
    color: #06d6a0;
    line-height: 1.5;
  }
</style>
