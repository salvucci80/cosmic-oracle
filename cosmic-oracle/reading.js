console.log("🔥 reading.js loaded");

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

    if (currentType !== "daily" && !isPaidUser) {
        output.innerHTML = `<p>This truth wants to be revealed… but it’s sealed.</p>`;
        paywall.style.display = "block";
        return;
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

