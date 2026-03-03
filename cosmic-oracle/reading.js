console.log("🔥 reading.js loaded");
function canAccessDaily() {
    const lastAccess = localStorage.getItem("lastFreeReading");
    const today = new Date().toDateString();

    if (lastAccess === today) {
        return false;
    }
// 🔓 Check for Stripe success redirect
const params = new URLSearchParams(window.location.search);

if (params.get("success") === "true") {
    localStorage.setItem("paidUser", "true");
}
    localStorage.setItem("lastFreeReading", today);
    return true;
}
let isPaidUser = localStorage.getItem("paidUser") === "true";
let currentType = "daily";

function selectType(type) {
    currentType = type;

    document.getElementById("dailyTab").classList.remove("active");
    document.getElementById("truthTab").classList.remove("active");

    document.getElementById(type + "Tab").classList.add("active");

    renderReading();
}

async function renderReading() {
    const sign = document.getElementById("signSelect").value;
    const output = document.getElementById("output");
    const paywall = document.getElementById("paywall");

    // 🔒 LOCKED CONTENT CHECK
    if (currentType !== "daily" && !isPaidUser) {
        output.innerHTML = `
            <h2>🔒 Truth Locked</h2>
            <p>This revelation isn't for casual stargazers.</p>
            <p>Unlock to see what the universe is withholding.</p>
        `;
        
        paywall.style.display = "block"; // show upsell
        return; // ⛔ STOP here
    }
// FREE DAILY LIMIT
if (!isPaidUser && currentType === "daily") {
    if (!canAccessDaily()) {
        output.innerHTML = `
            <h2>✨ Daily Reading Used</h2>
            <p>You’ve already consulted the cosmos today.</p>
            <p>Upgrade for unlimited access.</p>
        `;
        paywall.style.display = "block";
        return;
    }
}
    paywall.style.display = "none";
    output.innerHTML = "<p>Consulting the cosmos...</p>";

    try {
        const response = await fetch("/api/reading", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sign, type: currentType })
        });

        const data = await response.json();

        output.innerHTML = `
            <h2>${sign} — ${currentType.toUpperCase()}</h2>
            <p>${data.text}</p>
        `;
    } catch (err) {
        output.innerHTML = "<p>The cosmos are unstable. Try again.</p>";
    }
}

document.addEventListener("DOMContentLoaded", renderReading);
// 💳 STRIPE REDIRECTS
function unlockMonthly() {
    window.location.href = "https://buy.stripe.com/dRm7sNfnebJNa0j9p8fAc02";
}

function unlockYearly() {
    window.location.href = "https://buy.stripe.com/aFaeVf5ME6pta0j44OfAc01";
}