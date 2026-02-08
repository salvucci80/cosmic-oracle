console.log("🔥 reading.js loaded");

let isPaidUser = localStorage.getItem("paidUser") === "true";

function renderReading(sign, type) {
  const output = document.getElementById("output");

  if (type !== "daily" && !isPaidUser) {
    output.innerHTML = `
      <p>This truth wants to be revealed… but it’s sealed.</p>
    `;
    const paywall = document.getElementById("paywall");
if (paywall) paywall.style.display = "block";

  }

  document.getElementById("paywall").style.display = "none";

  output.innerHTML = `
    <h2>${sign} — ${type.toUpperCase()}</h2>
    <p>This is a full ${type} reading. Dark. Direct. Intimate.</p>
  `;
}

function unlockMonthly() {
  window.location.href = "PASTE_MONTHLY_STRIPE_LINK";
}

function unlockYearly() {
  window.location.href = "PASTE_YEARLY_STRIPE_LINK";
}
