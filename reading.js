console.log("🔮 reading.js loaded");

const params = new URLSearchParams(window.location.search);

if(params.get("success") === "monthly"){
localStorage.setItem("tier","monthly");
}

if(params.get("success") === "yearly"){
localStorage.setItem("tier","yearly");
}

let userTier = localStorage.getItem("tier") || "free";
let premiumChoices = JSON.parse(localStorage.getItem("premiumChoices")) || [];

const constellations = {

Aries:"♈ The Ram constellation symbolizes courage and bold beginnings.",

Taurus:"♉ The Bull constellation represents stability, patience, and strength.",

Gemini:"♊ The Twins constellation reflects curiosity and dual energy.",

Cancer:"♋ The Crab constellation is tied to emotional depth and intuition.",

Leo:"♌ The Lion constellation radiates confidence, leadership, and fire.",

Virgo:"♍ The Maiden constellation represents wisdom and thoughtful guidance.",

Libra:"♎ The Scales constellation symbolizes harmony and balance.",

Scorpio:"♏ The Scorpion constellation carries mystery, passion, and transformation.",

Sagittarius:"♐ The Archer constellation seeks adventure and higher truth.",

Capricorn:"♑ The Sea Goat constellation represents ambition and discipline.",

Aquarius:"♒ The Water Bearer constellation channels innovation and vision.",

Pisces:"♓ The Fish constellation represents intuition, dreams, and spiritual flow."

};
/* -------------------------
TIER SYSTEM
------------------------- */

const limits = {

free:{
dailyReads:1,
readingLength:2,
soulmate:false,
lucky:false,
tarot:false
},

monthly:{
dailyReads:2,
readingLength:4,
soulmate:false,
lucky:true,
tarot:false
},

yearly:{
dailyReads:3,
readingLength:10,
soulmate:true,
lucky:true,
tarot:true
}

};

const tierSettings = limits[userTier];
function canUseDailyReading(){

const today = new Date().toDateString();

let usage = JSON.parse(localStorage.getItem("dailyUsage")) || {
date: today,
count: 0
};

if(usage.date !== today){

usage = {
date: today,
count: 0
};

}

if(usage.count >= tierSettings.dailyReads){

return false;

}

usage.count++;

localStorage.setItem("dailyUsage", JSON.stringify(usage));

return true;

}

/* -------------------------
NUMEROLOGY
------------------------- */

function calculateLifePath(dateString){

const numbers = dateString.replaceAll("-","").split("").map(Number);

let sum = numbers.reduce((a,b)=>a+b,0);

while(sum > 9 && sum !== 11 && sum !== 22 && sum !== 33){
sum = sum.toString().split("").map(Number).reduce((a,b)=>a+b,0);
}

return sum;

}


/* -------------------------
LUCKY NUMBER (PAID)
------------------------- */

function luckyNumber(){

if(!tierSettings.lucky) return "";

const number = Math.floor(Math.random()*99)+1;

return `
<div class="lucky-number">
<h3>🍀 Your Lucky Number</h3>
<p>${number}</p>
</div>
`;

}const tarotCards = [

{ name:"The Fool", meaning:"A new journey begins. Trust the universe." },

{ name:"The Magician", meaning:"You already have the power you need." },

{ name:"The High Priestess", meaning:"Your intuition is guiding you." },

{ name:"The Lovers", meaning:"A powerful emotional connection is forming." },

{ name:"The Star", meaning:"Hope and spiritual guidance are surrounding you." },

{ name:"The Sun", meaning:"Success and joy are entering your life." }

];
function drawTarot(){

const result = document.getElementById("tarotResult");

if(!tierSettings.tarot){

result.innerHTML = `
<h3>🔒 Tarot Reading Locked</h3>
<p>Unlock with Yearly or Premium Pick.</p>
`;

document.getElementById("paywall").style.display = "block";

return;

}

const card = tarotCards[Math.floor(Math.random() * tarotCards.length)];

result.innerHTML = `
<h3>${card.name}</h3>
<p>${card.meaning}</p>
`;

}

/* -------------------------
COSMIC ENERGY
------------------------- */

function generateCosmicEnergy(){

const love = Math.floor(Math.random()*41)+60;
const money = Math.floor(Math.random()*41)+50;
const energy = Math.floor(Math.random()*41)+55;

return `
<div class="cosmic-meter">

<h3>✨ Cosmic Alignment</h3>

<p>❤️ Love Energy: <strong>${love}%</strong></p>
<p>💰 Money Energy: <strong>${money}%</strong></p>
<p>⚡ Life Force: <strong>${energy}%</strong></p>

</div>
`;

}


/* -------------------------
MAIN READING
------------------------- */
const output = document.getElementById("output");

if(!canUseDailyReading()){

output.innerHTML = `
<h3>🔒 Daily Limit Reached</h3>
<p>You’ve used your readings for today.</p>
`;

return;

const sign = document.getElementById("signSelect").value;
const birthdate = document.getElementById("birthdate").value;

const output = document.getElementById("output");
const paywall = document.getElementById("paywall");

let numerologyText = "";

if(birthdate){

const lifePath = calculateLifePath(birthdate);

numerologyText = `
<div class="numerology">

<h3>🔢 Numerology Insight</h3>

<p>Your Life Path Number is <strong>${lifePath}</strong>.</p>

</div>
`;

}

output.innerHTML = "<p>Consulting the cosmos...</p>";

try{

const response = await fetch(
"https://cosmic-oracle-l7qc.onrender.com/api/reading",
{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({ sign:sign })
}
);

const data = await response.json();

const cosmicEnergy = generateCosmicEnergy();

output.innerHTML = `

<h2>${sign}</h2>

${cosmicEnergy}

<p>${data.text.split(" ").slice(0, tierSettings.readingLength * 20).join(" ")}</p>

${numerologyText}

${luckyNumber()}

`;

}catch(error){

output.innerHTML="<p>The cosmos are unstable. Try again.</p>";

}

}


/* -------------------------
COMPATIBILITY
------------------------- */

function checkCompatibility(){

const your = document.getElementById("yourSign").value;
const their = document.getElementById("theirSign").value;

const result = document.getElementById("compatibilityResult");

const chemistry = Math.floor(Math.random()*41)+60;

const messages=[

"Cosmic sparks are strong between these signs.",
"There is magnetic attraction written in the stars.",
"A deep emotional connection is possible here.",
"This pairing can be both passionate and transformative.",
"The universe suggests powerful chemistry."

];

const message = messages[Math.floor(Math.random()*messages.length)];

result.innerHTML=`

<h3>${your} ❤️ ${their}</h3>

<p style="font-size:28px;">${chemistry}% Cosmic Match</p>

<p>${message}</p>

`;

}


/* -------------------------
SOULMATE (YEARLY ONLY)
------------------------- */
function revealSoulmate(){

const result = document.getElementById("soulmateResult");

if(!tierSettings.soulmate){

result.innerHTML=`

<h3>🔒 Soulmate Prediction Locked</h3>
<p>This insight is available for yearly members.</p>

`;

document.getElementById("paywall").style.display = "block";


return;

}

const signs=[
"Aries","Taurus","Gemini","Cancer","Leo","Virgo",
"Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];

const soulmate = signs[Math.floor(Math.random()*signs.length)];

result.innerHTML=`

<h3>Your Soulmate Sign</h3>

<p style="font-size:28px">${soulmate}</p>

`;

}
function shareReading(){

const resultText = document.body.innerText;

const url = window.location.href;

if(navigator.share){

navigator.share({
title: "My Cosmic Reading",
text: resultText.substring(0,200),
url: url
});

}else{

navigator.clipboard.writeText(url);

alert("Link copied! Share your cosmic reading ✨");

}

}

/* -------------------------
TAB SWITCHING
------------------------- */

document.querySelectorAll(".tab-btn").forEach(button=>{

button.addEventListener("click",()=>{

const tab = button.dataset.tab;

document.querySelectorAll(".tab-content").forEach(section=>{
section.style.display="none";
});

document.getElementById(tab).style.display="block";

document.querySelectorAll(".tab-btn").forEach(btn=>{
btn.classList.remove("active");
});

button.classList.add("active");

});

});
function unlockMonthly(){

window.location.href = "https://buy.stripe.com/9B6fZjcb26pt1tN0SCfAc05";

}

function unlockYearly(){

tierSettings.tarot = true;
tierSettings.soulmate = true;


window.location.href = "https://buy.stripe.com/7sYdRbejaaFJa0j44OfAc04";

}

function unlockPack(){

window.location.href = "https://buy.stripe.com/aFa3cx7UM8xB6O79p8fAc06";

}

function unlockPremiumFeature(feature){

if(premiumChoices.length >= 2){
alert("You already unlocked your 2 premium features.");
return;
}

if(!premiumChoices.includes(feature)){
premiumChoices.push(feature);
localStorage.setItem("premiumChoices", JSON.stringify(premiumChoices));
tierSettings[feature] = true;
}

}
/* -------------------------
STAR BACKGROUND
------------------------- */

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars=[];

for(let i=0;i<180;i++){

stars.push({
x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*2.5,
speed:Math.random()*0.15,
opacity:Math.random(),
twinkle:Math.random()*0.02
});

}

function animateStars(){

ctx.clearRect(0,0,canvas.width,canvas.height);

stars.forEach(star=>{

star.opacity+=star.twinkle;

if(star.opacity>1||star.opacity<0.1){
star.twinkle*=-1;
}

ctx.globalAlpha=star.opacity;

ctx.beginPath();
ctx.arc(star.x,star.y,star.size,0,Math.PI*2);
ctx.fillStyle="white";
ctx.fill();

star.y+=star.speed;

if(star.y>canvas.height){
star.y=0;
}

});


for(let i=0;i<stars.length;i++){

for(let j=i+1;j<stars.length;j++){

const dx = stars[i].x-stars[j].x;
const dy = stars[i].y-stars[j].y;

const distance = Math.sqrt(dx*dx+dy*dy);

if(distance<120){

ctx.beginPath();
ctx.moveTo(stars[i].x,stars[i].y);
ctx.lineTo(stars[j].x,stars[j].y);

ctx.strokeStyle="rgba(255,255,255,0.05)";
ctx.stroke();

}

}

}

requestAnimationFrame(animateStars);

}

animateStars();