// ===== GLOBAL STATE =====
let currentSign = null;
let currentReadingType = "daily"; // daily, truth, shadow, desire, power
let isPaidUser = false;
const darkReadingTypes = {
  truth: {
    freeTeaser: [
      "There’s something you’ve been circling around but refusing to name.",
      "You already know the truth — the resistance is the clue.",
      "This pattern didn’t start today. It started the last time you ignored yourself."
    ],
    paid: true
  },
  shadow: {
    freeTeaser: [
      "A part of you wants something you’ve been taught to suppress.",
      "Desire and fear are tangled here — and that’s not accidental.",
      "This isn’t your weakness. It’s your shadow asking to be seen."
    ],
    paid: true
  },
  desire: {
    freeTeaser: [
      "Someone is responding to your energy more than you realize.",
      "Your attraction field is active — but unfocused.",
      "What you want is closer than you think, and that’s why it’s dangerous."
    ],
    paid: true
  },
  power: {
    freeTeaser: [
      "There’s a power imbalance here — and you feel it.",
      "Someone benefits from your hesitation.",
      "This dynamic only continues if you allow it."
    ],
    paid: true
  }
};
// ===== READING TYPES =====
const readingTypes = {
  daily: { free: true, vibe: "mystical daily energy" },
  truth: { free: false, vibe: "dark revelation" },
  shadow: { free: false, vibe: "suppressed desire & fear" },
  desire: { free: false, vibe: "sensual magnetic pull" },
  power: { free: false, vibe: "power dynamics & control" }
};

// ===== IMAGE MAP =====
const signImages = {
  Aries: "images/aries_light.jpg",
  Taurus: "images/taurus_light.jpg",
  Gemini: "images/gemini_light.jpg",
  Cancer: "images/cancer_light.jpg",
  Leo: "images/leo_light.jpg",
  Virgo: "images/virgo_light.jpg",
  Libra: "images/libra_light.jpg",
  Scorpio: "images/scorpio_light.jpg",
  Sagittarius: "images/sagittarius_light.jpg",
  Capricorn: "images/capricorn_light.jpg",
  Aquarius: "images/aquarius_light.jpg",
  Pisces: "images/pisces_light.jpg"
};

function renderReading(sign, type) {
  currentSign = sign;
  currentReadingType = type;

  const output = document.getElementById("output");
  const img = document.getElementById("signImage");
  const config = readingTypes[type];

  if (!img || !output) {
    console.warn("renderReading: missing #signImage or #output elements");
    return;
  }

  // image logic
  img.src = config.free ? signImages[sign] : `images/${sign}_shadow.jpg`;

  // FREE + LOCKED FLOW
  if (!config.free && !isPaidUser) {
  const teasers = darkReadingTypes[type]?.freeTeaser || [];
  const teaser =
    teasers.length
      ? teasers[Math.floor(Math.random() * teasers.length)]
      : getFreeTeaser(sign, type);

  output.innerHTML = `
    <p>${teaser}</p>
    <div class="sealed">🔒 This message continues, but it’s sealed.</div>
  `;
  showPaywall();
  return;
}

  


  // PAID or FREE FULL
  output.innerHTML = getFullReading(sign, type);
  hidePaywall();
}

function getFullReading(sign, type) {
  return `
    <h3>${sign} — ${type.toUpperCase()} MESSAGE</h3>
    <p>
      This isn’t random. This energy has been building.
      The tension you feel exists for a reason — and now you’re meant to see it clearly.
    </p>
    <p>
      The moment you stop resisting this truth is the moment things shift.
    </p>
  `;
}

function showPaywall() {
  const p = document.getElementById("paywall");
  if (p) p.style.display = "block";
}

function hidePaywall() {
  const p = document.getElementById("paywall");
  if (p) p.style.display = "none";
}

function unlockReading() {
  isPaidUser = true;
  renderReading(currentSign, currentReadingType);
}

