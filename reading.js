console.log("🔮 reading.js loaded");

const params = new URLSearchParams(window.location.search);

if(params.get("success") === "monthly"){
localStorage.setItem("tier","monthly");
}

if(params.get("success") === "yearly"){
localStorage.setItem("tier","yearly");
}

let userTier = localStorage.getItem("tier") || "free";

/* -------------------------
TIER SYSTEM
------------------------- */

const limits = {

free:{
dailyReads:1,
readingLength:2,
soulmate:false,
lucky:false
},

monthly:{
dailyReads:2,
readingLength:4,
soulmate:false,
lucky:true
},

yearly:{
dailyReads:3,
readingLength:10,
soulmate:true,
lucky:true
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

async function getReading(){
if(!canUseDailyReading()){

output.innerHTML = `
<h3>🔒 Daily Limit Reached</h3>
<p>You’ve used your readings for today.</p>
`;

return;

}
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

result.innerHTML = `
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

window.location.href = "https://buy.stripe.com/7sYdRbejaaFJa0j44OfAc04";

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