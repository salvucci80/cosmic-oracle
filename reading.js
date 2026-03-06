console.log("🔮 reading.js loaded");

const params = new URLSearchParams(window.location.search);

let userTier = localStorage.getItem("tier") || "free";
let currentType = "daily";

// Stripe success detection
if (params.get("success") === "monthly") {
    localStorage.setItem("tier", "monthly");
}

if (params.get("success") === "yearly") {
    localStorage.setItem("tier", "yearly");
}

let isPaidUser = userTier !== "free";

// Numerology calculator
function calculateLifePath(dateString) {
const numerologyMeanings = {

1:"Leaders and pioneers. You thrive when creating your own path.",

2:"Diplomats and peacemakers. Your power lies in harmony and intuition.",

3:"Creators and communicators. Expression and creativity are your gifts.",

4:"Builders of stability. Discipline and structure guide your destiny.",

5:"Adventurers and explorers. Freedom and change fuel your spirit.",

6:"Caretakers and healers. Love and responsibility shape your journey.",

7:"Seekers of truth. Wisdom, intuition, and spirituality guide you.",

8:"Power builders. You are aligned with success, ambition, and influence.",

9:"Humanitarians. Compassion and global awareness define your path.",

11:"Master intuitive. You carry spiritual insight and deep awareness.",

22:"Master builder. You are capable of creating lasting impact.",

33:"Master teacher. Compassion and healing are your greatest strengths."

};
    const numbers = dateString.replaceAll("-", "").split("").map(Number);

    let sum = numbers.reduce((a,b) => a + b,0);

    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
        sum = sum.toString().split("").map(Number).reduce((a,b)=>a+b,0);
    }

    return sum;
}

// Free daily limiter
function canAccessDaily() {

    const lastAccess = localStorage.getItem("lastFreeReading");
    const today = new Date().toDateString();

    if (lastAccess === today) {
        return false;
    }

    localStorage.setItem("lastFreeReading", today);
    return true;
}

// Switch tabs
function selectType(type) {

    currentType = type;

    document.getElementById("dailyTab").classList.remove("active");
    document.getElementById("truthTab").classList.remove("active");

    document.getElementById(type + "Tab").classList.add("active");
}

// Main reading function
async function getReading() {

const sign = document.getElementById("signSelect").value;
const birthdate = document.getElementById("birthdate").value;
const output = document.getElementById("output");
const paywall = document.getElementById("paywall");

let numerologyText = "";

// Numerology block
if (birthdate) {

    const lifePath = calculateLifePath(birthdate);

    numerologyText = `
    <div class="numerology">
        <h3>🔢 Numerology Insight</h3>
       <p>Your Life Path Number is <strong>${lifePath}</strong>.</p>
<p>${numerologyMeanings[lifePath]}</p>
        <p>This number reflects the core vibration guiding your life journey.</p>
    </div>
    `;
}

// Truth lock
if (currentType === "truth" && !isPaidUser) {

output.innerHTML = `
<h2>🔒 Truth Locked</h2>

<div class="blur">
<p>The universe sees more than you're ready to hear.</p>
<p>There is a shift forming around you — a truth that could change your direction.</p>
<p>Someone in your orbit is hiding intentions.</p>
</div>

<p>Unlock to reveal the full cosmic truth.</p>
`;

paywall.style.display = "block";

return;

}
}

// Free daily limit
if (!isPaidUser && currentType === "daily") {

    if (!canAccessDaily()) {

        output.innerHTML = `
            <h2>✨ Daily Reading Used</h2>
            <p>You’ve already consulted the cosmos today.</p>
            <p>Upgrade for unlimited insight.</p>
        `;

        paywall.style.display = "block";
        return;
    }
}

paywall.style.display = "none";
output.innerHTML = "<p>Consulting the cosmos...</p>";

try {

    const response = await fetch(
        "https://cosmic-oracle-l7qc.onrender.com/api/reading",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sign: sign,
                type: currentType
            })
        }
    );

    const data = await response.json();

    output.innerHTML = `
        <h2>${sign} — ${currentType.toUpperCase()}</h2>
        <p>${data.text}</p>
        ${numerologyText}
    `;

} catch (error) {

    output.innerHTML = "<p>The cosmos are unstable. Try again.</p>";

}
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];

for (let i = 0; i < 120; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.3
    });
}

function animateStars(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "white";

    stars.forEach(star => {

        ctx.beginPath();

        ctx.arc(star.x,star.y,star.size,0,Math.PI*2);

        ctx.fill();

        star.y += star.speed;

        if(star.y > canvas.height){
            star.y = 0;
        }

    });

    requestAnimationFrame(animateStars);

}

animateStars();
