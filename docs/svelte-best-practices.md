# Svelte 5 Best Practices — Project Alignment

Reference: [Official Svelte docs](https://svelte.dev/docs/svelte/best-practices) ·
[Svelte AI tools skill](https://github.com/sveltejs/ai-tools/blob/main/plugins/claude/svelte/skills/svelte-core-bestpractices/SKILL.md)

---

## What was fixed (June 2026)

### 1. Global CSS consolidated into `src/app.css`

**Before:** `:global(body)`, `:global(html)`, `:global(*)` resets were scattered in route `<style>` blocks, which is a Svelte anti-pattern (scoped styles should not set global resets).

**After:** All base resets live in `src/app.css`, imported once in `src/routes/+layout.svelte`. The river game keeps only one `overflow: hidden` override (a necessary page-specific body style for its fixed-layout game canvas).

### 2. Removed duplicate `applyVolume()` function

**Before:** Both an `applyVolume()` function and a `$effect` block did identical work of syncing Audio object volumes.

**After:** Only the `$effect` remains. It is the correct tool for syncing external APIs (Audio objects) from reactive state. `applyVolume` was dead code.

### 3. Component decomposition — river game

**Before:** `src/routes/games/river/+page.svelte` was 822 lines — script, template, and CSS all in one monolithic file.

**After:** 8 focused sub-components extracted to `src/lib/components/game/`:

| Component | Responsibility |
|---|---|
| `IntroOverlay.svelte` | Rules screen before game starts |
| `SoundPanel.svelte` | Bottom bar: mute toggle + volume slider + reset button |
| `CharacterToken.svelte` | Reusable character portrait button (north/south banks) |
| `FightBurst.svelte` | Fight emoji explosion animation |
| `RiverCritters.svelte` | Floating cow & duck decorative animals |
| `WinSalute.svelte` | Victory particle burst + fade-out |
| `WinCard.svelte` | Victory modal with star rating |
| `GameOverCard.svelte` | Game-over modal after a conflict |

The page file dropped from 822 lines to ~260 lines and now contains only game state logic and the main layout skeleton.

### 4. Modern class syntax

**Before:** `class:directive` syntax throughout (e.g., `class:at-south={!boatAtNorth}`).

**After:** Object syntax in new and rewritten components (e.g., `class={{ 'at-south': !boatAtNorth }}`), consistent with the Svelte 5 SKILL recommendation.

---

## Rules to follow going forward

### DO use Svelte 5 runes

```svelte
<!-- ✅ -->
let count = $state(0);
let doubled = $derived(count * 2);

<!-- ❌ legacy Svelte 4 -->
let count = 0;
$: doubled = count * 2;
```

### DO use `$props()` not `export let`

```svelte
<!-- ✅ -->
let { name, onclick } = $props();

<!-- ❌ -->
export let name;
```

### DO use inline event handlers, not `on:` directives

```svelte
<!-- ✅ -->
<button onclick={handler}>

<!-- ❌ -->
<button on:click={handler}>
```

### DO use `$effect` only for external side-effects

`$effect` is for driving external APIs (DOM, Audio, Maps, timers) from reactive state — not for computing derived values.

```svelte
<!-- ✅ right use: syncing an external Audio object -->
$effect(() => { audioEl.volume = masterVolume; });

<!-- ❌ wrong use: should be $derived instead -->
$effect(() => { total = price * quantity; });
```

### DO keep components focused

Extract sub-components when a piece of UI:
- Has its own meaningful CSS (>30 lines)
- Appears in multiple places, OR
- Can receive clean props and operate independently

### DO put global CSS in `src/app.css`

Never use `:global(html)`, `:global(body)`, or `:global(*)` resets inside a `<style>` block in a route or component. These belong in `src/app.css`.

Exception: page-specific body overrides (like `overflow: hidden` for a game page) are acceptable in a route's `<style>` block when scoped with `:global(body)`, as long as it is clearly documented.

### DO use keyed `{#each}` blocks

```svelte
<!-- ✅ -->
{#each items as item (item.id)}

<!-- ❌ key-less — poor diffing performance -->
{#each items as item}
```

### DO use `class={{ }}` object syntax for conditional classes

```svelte
<!-- ✅ -->
<div class={{ 'boat-wrap': true, 'at-south': !boatAtNorth }}>

<!-- acceptable but less preferred -->
<div class="boat-wrap" class:at-south={!boatAtNorth}>
```

### DO use `$bindable()` for two-way prop binding

```svelte
<!-- child -->
let { value = $bindable() } = $props();

<!-- parent -->
<Child bind:value={myState} />
```

### DO use snippets over repeated markup blocks

```svelte
{#snippet characterCard(c)}
  <div class="card">{c.name}</div>
{/snippet}

{@render characterCard(sofia)}
{@render characterCard(matt)}
```
