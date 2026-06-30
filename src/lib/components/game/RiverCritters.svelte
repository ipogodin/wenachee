<img src="/wen_moo.png"  alt="" class="critter critter-cow"  aria-hidden="true" />
<img src="/wen_duck.png" alt="" class="critter critter-duck" aria-hidden="true" />

<style>
  @keyframes critter-lr {
    0%   { left: -120px; }
    100% { left: calc(100% + 120px); }
  }
  @keyframes critter-rl {
    0%   { left: calc(100% + 120px); }
    100% { left: -120px; }
  }
  @keyframes critter-bob {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-5px); }
  }

  .critter {
    position: absolute;
    height: 52px;
    width: auto;
    pointer-events: none;
    user-select: none;
    filter: drop-shadow(0 3px 6px rgba(0,0,0,0.5));
  }
  .critter-cow {
    top: 18%;
    animation:
      critter-rl  var(--cow-dur, 26s) linear     infinite,
      critter-bob  3s                 ease-in-out infinite;
  }
  .critter-duck {
    top: 62%;
    animation:
      critter-lr  var(--duck-dur, 16s) linear     infinite -6s,
      critter-bob  2s                  ease-in-out infinite -1s;
  }

  /* Scale duration with screen width to keep apparent speed constant */
  @media (min-width: 600px) {
    .critter-cow  { --cow-dur:  42s; }
    .critter-duck { --duck-dur: 26s; }
  }
  @media (min-width: 900px) {
    .critter-cow  { --cow-dur:  62s; }
    .critter-duck { --duck-dur: 38s; }
  }
  @media (min-width: 1200px) {
    .critter-cow  { --cow-dur:  82s; }
    .critter-duck { --duck-dur: 50s; }
  }
  @media (min-width: 1500px) {
    .critter-cow  { --cow-dur: 100s; }
    .critter-duck { --duck-dur: 62s; }
  }
</style>
