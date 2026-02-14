console.log("🔥 reading.js loaded");

let isPaidUser = localStorage.getItem("paidUser") === "true";

function renderReading(sign, type) {
  const output = document.getElementById("output");
  const paywall = document.getElementById("paywall");

  if (!output) return;

  if (type !== "daily" && !isPaidUser) {
    output.innerHTML = `
      <p>
        This message isn’t blocked — it’s withheld.
        <br><br>
        When you unlock it, you won’t unsee what it shows.
      </p>
    `;
    if (paywall) paywall.style.display = "block";
    return;
  }

  if (paywall) paywall.style.display = "none";

  output.innerHTML = `
    <h2>${sign} — ${type.toUpperCase()}</h2>
    <p>
      This isn’t random. This is the part of the reading
      most people aren’t ready to hear.
    </p>
  `;
}output.classList.remove("show");
void output.offsetWidth; // forces reflow
output.classList.add("show");


function unlockMonthly() {
  window.location.href = "PASTE_MONTHLY_STRIPE_LINK";
}

function unlockYearly() {
  window.location.href = "PASTE_YEARLY_STRIPE_LINK";
}
