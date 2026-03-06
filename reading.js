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
        <p>This number reflects the core vibration guiding your life journey.</p>
    </div>
    `;
}

// Truth lock
if (currentType === "truth" && !isPaidUser) {

    output.innerHTML = `
        <h2>🔒 Truth Locked</h2>
        <p>This revelation isn't for casual stargazers.</p>
        <p>Upgrade to reveal what the universe is hiding.</p>
    `;

    paywall.style.display = "block";
    return;
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

}