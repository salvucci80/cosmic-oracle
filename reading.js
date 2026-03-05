console.log("🔮 reading.js loaded");

// Detect Stripe success redirect
const params = new URLSearchParams(window.location.search);
if (params.get("success") === "true") {
    localStorage.setItem("paidUser", "true");
}

let isPaidUser = localStorage.getItem("paidUser") === "true";
let currentType = "daily";

// Free reading limiter
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

// Generate reading when button pressed
async function getReading() {

    const sign = document.getElementById("signSelect").value;
    const output = document.getElementById("output");
    const paywall = document.getElementById("paywall");

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

        const response = await fetch("https://cosmic-oracle-l7qc.onrender.com://YOUR-RENDER-URL.onrender.com/api/reading", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sign: sign,
                type: currentType
            })
        });

        const data = await response.json();

        output.innerHTML = `
        <h2>${sign} — ${currentType.toUpperCase()}</h2>
        <p>${data.text}</p>
        `;

    } catch (error) {

        output.innerHTML = "<p>The cosmos are unstable. Try again.</p>";

    }
}