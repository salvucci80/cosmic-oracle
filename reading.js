console.log("🔮 reading.js loaded");

const params = new URLSearchParams(window.location.search);

let userTier = localStorage.getItem("tier") || "free";
let currentType = "daily";

// Stripe success detection
if (params.get("success") === "monthly") {
    localStorage.setItem("tier","monthly");
    userTier = "monthly";
}

if (params.get("success") === "yearly") {
    localStorage.setItem("tier","yearly");
    userTier = "yearly";
}

let isPaidUser = userTier !== "free";


// NUMEROLOGY CALCULATOR
function calculateLifePath(dateString){

const personalities = {

1:"Leader energy. Independent, bold, natural pioneer.",
2:"Empath soul. Peacemaker, intuitive, deeply emotional.",
3:"Creative star. Expressive, artistic, magnetic personality.",
4:"Builder energy. Stable, hardworking, practical.",
5:"Freedom seeker. Adventurous, curious, restless spirit.",
6:"Nurturer. Loving, protective, family oriented.",
7:"Mystic mind. Deep thinker, spiritual seeker.",
8:"Power player. Ambitious, success driven.",
9:"Old soul. Compassionate, wise, humanitarian.",
11:"Master intuitive. Highly spiritual awareness.",
22:"Master builder. Destined to build something big.",
33:"Master healer. Compassion and guidance for others."

};

const numbers = dateString.replaceAll("-","").split("").map(Number);

let sum = numbers.reduce((a,b)=>a+b,0);

while(sum > 9 && sum !== 11 && sum !== 22 && sum !== 33){
sum = sum.toString().split("").map(Number).reduce((a,b)=>a+b,0);
}

return {
number:sum,
meaning:personalities[sum]
};

}


// FREE DAILY LIMIT
function canAccessDaily(){

const lastAccess = localStorage.getItem("lastFreeReading");
const today = new Date().toDateString();

if(lastAccess === today){
return false;
}

localStorage.setItem("lastFreeReading",today);
return true;

}


// SWITCH TABS
function selectType(type){

currentType = type;

document.querySelectorAll(".tab-btn").forEach(btn=>{
btn.classList.remove("active");
});

document.getElementById(type+"Tab").classList.add("active");

}


// MAIN READING FUNCTION
async function getReading(){

const sign = document.getElementById("signSelect").value;
const birthdate = document.getElementById("birthdate").value;

const output = document.getElementById("output");
const paywall = document.getElementById("paywall");

let numerologyText = "";


// NUMEROLOGY BLOCK
if(birthdate){

const result = calculateLifePath(birthdate);

numerologyText = `
<div class="numerology">
<h3>🔢 Numerology Insight</h3>
<p>Your Life Path Number is <strong>${result.number}</strong></p>
<p>${result.meaning}</p>
</div>
`;

}


// TRUTH LOCK
if(currentType === "truth" && !isPaidUser){

output.innerHTML = `

<h2>🔒 Premium Reading</h2>

<div class="blur">

<p>The universe senses movement around you.</p>

<p>Someone near you may not be revealing their full intentions.</p>

<p>A shift in your path is forming.</p>

</div>

<p>Unlock premium insight to reveal the full message.</p>

`;

paywall.style.display = "block";

return;

}


// FREE DAILY LIMIT
if(!isPaidUser && currentType === "daily"){

if(!canAccessDaily()){

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

try{

const response = await fetch(
"https://cosmic-oracle-l7qc.onrender.com/api/reading",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
sign:sign,
type:currentType
})
}
);

const data = await response.json();

output.innerHTML = `

<h2>${sign} — ${currentType.toUpperCase()}</h2>

<p>${data.text}</p>

${numerologyText}

`;

}catch(error){

output.innerHTML = "<p>The cosmos are unstable. Try again.</p>";

}

}



// STAR BACKGROUND
const canvas = document.getElementById("stars");

if(canvas){

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];

for(let i=0;i<120;i++){

stars.push({

x:Math.random()*canvas.width,
y:Math.random()*canvas.height,
size:Math.random()*2,
speed:Math.random()*0.3

});

}

function animateStars(){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.fillStyle="white";

stars.forEach(star=>{

ctx.beginPath();

ctx.arc(star.x,star.y,star.size,0,Math.PI*2);

ctx.fill();

star.y+=star.speed;

if(star.y>canvas.height){
star.y=0;
}

});

requestAnimationFrame(animateStars);

}

animateStars();

}