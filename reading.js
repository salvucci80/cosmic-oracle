console.log("🔥 reading.js loaded");
function canAccessDaily() {
    const lastAccess = localStorage.getItem("lastFreeReading");
    const today = new Date().toDateString();
function getLifePathNumber(birthdate) {
    if(!birthdate) return null;

    let digits = birthdate.replaceAll("-", "").split("").map(Number);
    let sum = digits.reduce((a,b)=>a+b,0);

    while (sum > 9) {
        sum = sum.toString().split("").map(Number).reduce((a,b)=>a+b,0);
    }

    return sum;
}
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

async (params) => {
    
}    ;currentType = "type";

    document.getElementById("dailyTab").classList.remove("active");
    document.getElementById("truthTab").classList.remove("active");

    document.getElementById(type + "Tab").classList.add("active");

    renderReading();
async function renderReading() {

    const sign = document.getElementById("signSelect").value;
    const birthdate = document.getElementById("birthdate").value;

    const output = document.getElementById("output");
    const paywall = document.getElementById("paywall");

    try {

        output.innerHTML = "<p>Consulting the cosmos...</p>";

        const response = await fetch("/api/reading", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ sign })
        });

        const data = await response.json();

        const lifePath = getLifePathNumber(birthdate);

        let fullReading = data.text;
        let preview = fullReading.split(".").slice(0,3).join(".") + ".";

        if(!isPaidUser){

            output.innerHTML = `
            <h2>${sign} — DAILY READING</h2>

            <p>${preview}</p>

            <h3>🔢 Numerology</h3>
            <p>Your Life Path Number is ${lifePath}. It influences your destiny.</p>

            <div class="blurred">
            The deeper cosmic truth remains hidden...
            </div>
            `;

            paywall.style.display = "block";

        } else {

            output.innerHTML = `
            <h2>${sign} — FULL COSMIC READING</h2>

            <p>${fullReading}</p>

            <h3>🔢 Numerology</h3>
            <p>Your Life Path Number is ${lifePath}. This number represents the energetic blueprint guiding your life's path.</p>
            `;

            paywall.style.display = "none";
        }

    } catch (err) {

        output.innerHTML = "<p>The cosmos are unstable. Try again.</p>";

    }
}

// 💳 STRIPE REDIRECTS
function unlockMonthly() {
    window.location.href = "https://buy.stripe.com/9B6fZjcb26pt1tN0SCfAc05";
}

function unlockYearly() {
    window.location.href = "https://buy.stripe.com/7sYdRbejaaFJa0j44OfAc04";
}