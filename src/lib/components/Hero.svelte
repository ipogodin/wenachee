<script>
  import { onMount } from 'svelte';

  let videoEl = $state(null);
  let scrollContainer = $state(null);
  let progress = $state(0); // 0..1
  let videoReady = $state(false);
  let videoDuration = $state(0);

  onMount(() => {
    const video = videoEl;
    if (!video) return;

    const onLoaded = () => {
      videoDuration = video.duration;
      // Play/pause trick: forces the browser to decode frames so seeking works
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          video.pause();
          video.currentTime = 0;
          videoReady = true;
        }).catch(() => {
          // Autoplay blocked (some iOS contexts) — still mark ready for scrubbing
          video.currentTime = 0;
          videoReady = true;
        });
      } else {
        video.currentTime = 0;
        videoReady = true;
      }
    };

    video.addEventListener('loadeddata', onLoaded);
    if (video.readyState >= 2) onLoaded();

    // Force buffering on mount
    video.load();

    // Scroll-scrub: the hero section is 300vh tall so there's room to scroll
    const onScroll = () => {
      const el = scrollContainer;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      progress = p;
      if (videoReady && videoDuration > 0) {
        video.currentTime = p * videoDuration;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      video.removeEventListener('loadeddata', onLoaded);
    };
  });
</script>

<!-- 300vh scroll track — video stays sticky inside -->
<section class="hero-track" bind:this={scrollContainer}>
  <div class="hero-sticky">
    <video
      bind:this={videoEl}
      src="/video/map_clip.mp4"
      poster="/video/map_poster.jpg"
      muted
      playsinline
      preload="auto"
      class="hero-video"
    ></video>

    <!-- Overlay content fades out as you scroll -->
    <div class="hero-overlay" style="opacity: {1 - progress * 2}">
      <div class="hero-content">
        <p class="hero-eyebrow">July 1 – 6, 2026</p>
        <h1 class="hero-title">Wenatchee Lake<br />Camp 2026</h1>
        <p class="hero-sub">Scroll to zoom in</p>
        <div class="scroll-hint">
          <span class="arrow">↓</span>
        </div>
      </div>
    </div>

    <!-- Reveal label when zoomed in -->
    {#if progress > 0.7}
      <div class="arrival-badge" style="opacity: {(progress - 0.7) * 3.3}">
        <span>📍 Lake Wenatchee, WA</span>
      </div>
    {/if}
  </div>
</section>

<style>
  .hero-track {
    height: 300vh;
    position: relative;
  }

  .hero-sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
    background: #000;
  }

  .hero-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      to bottom,
      rgba(0,0,0,0.5) 0%,
      rgba(0,0,0,0.2) 50%,
      rgba(0,0,0,0.6) 100%
    );
    pointer-events: none;
  }

  .hero-content {
    text-align: center;
    color: #fff;
    padding: 1rem;
  }

  .hero-eyebrow {
    font-size: clamp(0.75rem, 2vw, 1rem);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #ffd23f;
    margin: 0 0 0.5rem;
    font-weight: 600;
  }

  .hero-title {
    font-size: clamp(2.2rem, 8vw, 6rem);
    font-weight: 900;
    line-height: 1.05;
    margin: 0 0 1.5rem;
    text-shadow: 0 2px 20px rgba(0,0,0,0.8);
  }

  .hero-sub {
    font-size: clamp(0.9rem, 2.5vw, 1.1rem);
    opacity: 0.8;
    margin: 0 0 2rem;
  }

  .scroll-hint {
    animation: bounce 1.8s infinite;
  }

  .arrow {
    font-size: 1.5rem;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(8px); }
  }

  .arrival-badge {
    position: absolute;
    bottom: 10%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 210, 63, 0.95);
    color: #1a1a1a;
    font-weight: 700;
    font-size: 1rem;
    padding: 0.6rem 1.4rem;
    border-radius: 100px;
    pointer-events: none;
    white-space: nowrap;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }
</style>
