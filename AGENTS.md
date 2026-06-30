# Wenatchee Lake Camp 2026 — Agent Briefing

Trip dates: **July 1–6, 2026** · Lake Wenatchee, WA  
Live site: **https://wenachee.vercel.app**  
Repo: **https://github.com/ipogodin/wenachee**

---

## Stack

| Layer | Technology |
|---|---|
| Framework | SvelteKit 2 + Svelte 5 (runes) |
| Adapter | `@sveltejs/adapter-vercel` |
| Styling | Scoped `<style>` per component, no CSS framework |
| Maps | Leaflet (campground map) |
| Deploy | Vercel — `vercel --prod` from project root |
| Dev | `npm run dev` → localhost:5173 (port may vary) |

---

## Project structure

```
src/
  routes/
    +page.svelte          # Main camp site (Hero, Sites, Schedule, Weather, Float)
    +page.server.js       # Weather API fetch (server-side)
    api/weather/+server.js
    games/
      +page.svelte        # Games hub
      river/+page.svelte  # River Crossing puzzle (primary game)
  lib/
    components/           # Hero, CampingSites, Schedule, Weather, RiverFloat, FloatRules, FireAlert
    config/
      games.js            # All River Crossing config — names, conflicts, scoring, win messages
      sites.js            # Campsite info
      schedule.js / .json # Trip schedule
static/
  river_map.png           # Aerial satellite background for game
  boat.png                # Top-down boat sprite (white bg removed via mix-blend-mode: multiply)
  characters/
    sofia.png             # Portrait photos (transparent bg)
    matt.png
    greg.png
  sounds/
    wen_theme.mp3         # Looping theme (starts on "Let's Go!" click)
    wen_boat.mp3          # Row sfx
    wen_boop.mp3          # Board / unload sfx
    wen_win.mp3           # Victory sfx
    wen_fight.mp3         # Game-over / conflict sfx
  wen_moo.png             # Cow sprite — floats right→left across river
  wen_duck.png            # Duck sprite — floats left→right across river
temp/                     # Drop new assets here; move to static/ when ready (gitignored)
```

---

## River Crossing game — key facts

**Characters:** Sofia (wolf / id A), Matt (goat / id B), Greg (cabbage / id C)  
**Conflict pairs:** A+B and B+C — leaving either pair alone triggers a fight  
**Optimal solution:** 7 moves

**Game states:** `'playing'` → `'fight'` or `'won'`

**Fight mechanic is a deliberate surprise** — the intro screen shows only 2 rules (goal + 1 passenger). Do NOT add any hint about conflicts or fights to the intro.

**Boat animation:** `boatSide` is set immediately when `row()` fires so the CSS `top` transition starts at once. The passenger is deposited at the end of the 820 ms `setTimeout` (matching the transition duration).

**Audio:** All sounds in `/static/sounds/`. Volume is controlled by `masterVolume` + `muted` state; the `$effect` in `river/+page.svelte` keeps all Audio objects in sync. Theme music does NOT restart on game reset — only on page reload.

**Floating animals:** `wen_moo.png` (cow, R→L) and `wen_duck.png` (duck, L→R) are absolutely positioned in `.river-zone` and animated with CSS keyframes. Speed is responsive — duration scales via `@media` breakpoints so apparent speed matches mobile at all screen sizes.

**To replace any asset:** swap the file at its `/static/` path and redeploy.

---

## Configuration

Everything user-facing lives in `src/lib/config/games.js`:
- Character names, photos, roles, colours
- Conflict pairs and flavour text
- Scoring thresholds (optimal / 3-star / 2-star)
- Win messages

---

## Deploy

```bash
vercel --prod      # deploy from local (GitHub auto-deploy may need dashboard setup)
git push           # triggers auto-deploy once GitHub is connected in Vercel dashboard
```

Vercel project: `ipogodins-projects/wenachee` · Project ID: `prj_ILp5UrD83nqq3DDAJyH9nWDtI40U`
