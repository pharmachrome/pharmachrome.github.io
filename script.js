// ================== NAVIGATION ==================

function showSection(sectionId){

document.querySelectorAll(".section").forEach(section=>{
section.style.display = "none";
section.classList.remove("active");
});

const target = document.getElementById(sectionId);

target.style.display = "block";

setTimeout(()=>{
target.classList.add("active");
},10);

window.scrollTo(0,0);

}

window.onload = function(){

showSection("home");

window.scrollTo(0,0);

};


// ================== SEARCH ==================

function searchCalculator(){

let input = document.getElementById("searchBar").value.toLowerCase();
let cards = document.querySelectorAll(".card");

cards.forEach(card => {
let name = card.getAttribute("data-name") || "";
card.style.display = name.includes(input) ? "block" : "none";
});

}


// ================== SHOW MORE ==================

function showMore(){

document.querySelectorAll(".hidden").forEach(card=>{
card.style.display = "block";
card.classList.remove("hidden");
});

document.querySelector(".more").style.display = "none";

}


// ================== UNIT CONVERTER ==================

function convertUnits(){

let value = parseFloat(document.getElementById("unitValue").value);
let from = document.getElementById("fromUnit").value;
let to = document.getElementById("toUnit").value;


// ================== UNIT DATABASE ==================

const units = {

length: {
km:1000,
hm:100,
dam:10,
m:1,
dm:0.1,
cm:0.01,
mm:0.001,
um:0.000001,
nm:0.000000001,
inch:0.0254,
mile:1609.34
},

volume: {
kL:1000,
hL:100,
daL:10,
L:1,
dL:0.1,
cL:0.01,
mL:0.001,
uL:0.000001,
cm3:0.001,
dm3:1,
m3:1000,
cin:0.016387,
cft:28.316,

// Household
tsp:0.005,
tbsp:0.015,
dssp:0.01,
cfsp:0.0025,
pt:0.473,
qt:0.946,
gal:3.785,
wgl:0.060,
tcp:0.150,
gl:0.250,
cp_metric:0.250,
gtt:0.00005,

// Apothecarie's fluid
minim:0.0000616,
fdr:0.003697,
floz:0.02957,
},

mass: {
kg:1000,
hg:100,
dag:10,
g:1,
dg:0.1,
cg:0.01,
mg:0.001,
ug:0.000001,
ng:0.000000001,
pg:0.000000000001,
fg:0.000000000000001,

// Apothecarie's weight
gr:0.0647989,
s:1.2959782,
dr:3.888,
oz:31.1034768,
lb_general:453.592,
lb_apothecary:373.242
},

radioactivity: {
Ci:3.7e10,
mCi:3.7e7,
uCi:3.7e4,
nCi:3.7e1,
Bq:1,
kBq:1000,
MBq:1000000,
GBq:1000000000
}

};


// ================== FIND CATEGORY ==================

let category = null;

for(let key in units){
if(units[key][from] !== undefined && units[key][to] !== undefined){
category = key;
break;
}
}


// ================== TEMPERATURE (SPECIAL CASE) ==================

if(["C","F","K"].includes(from) && ["C","F","K"].includes(to)){

let result;

if(from === "C"){
if(to === "F") result = (value * 9/5) + 32;
else if(to === "K") result = value + 273.15;
else result = value;
}

else if(from === "F"){
if(to === "C") result = (value - 32) * 5/9;
else if(to === "K") result = (value - 32) * 5/9 + 273.15;
else result = value;
}

else if(from === "K"){
if(to === "C") result = value - 273.15;
else if(to === "F") result = (value - 273.15) * 9/5 + 32;
else result = value;
}

document.getElementById("conversionResult").innerText =
"Result: " + result + " " + to;

return;
}


// ================== INVALID CASE ==================

if(!category){
document.getElementById("conversionResult").innerText =
"Invalid conversion (different unit types)";
return;
}


// ================== CALCULATION ==================

let result = value * units[category][from] / units[category][to];

document.getElementById("conversionResult").innerText =
"Result: " + result + " " + to;

}


// ================== MOLECULAR WEIGHT CALCULATION ==================

function calculateMolecularWeight(){

let formula = document.getElementById("formula").value.trim().toLowerCase();

// ================== ATOMIC WEIGHTS ==================

const atomicWeights = {

h:1.008, he:4.0026, li:6.94, be:9.0122, b:10.81,
c:12.011, n:14.007, o:15.999, f:18.998, ne:20.180,
na:22.990, mg:24.305, al:26.982, si:28.085, p:30.974,
s:32.06, cl:35.45, ar:39.948, k:39.098, ca:40.078,
fe:55.845, cu:63.546, zn:65.38, ag:107.87, i:126.90,
H:1.008, He:4.0026, Li:6.94, Be:9.0122, B:10.81,
C:12.011, N:14.007, O:15.999, F:18.998, Ne:20.180,
Na:22.990, Mg:24.305, Al:26.982, Si:28.085, P:30.974,
S:32.06, Cl:35.45, Ar:39.948, K:39.098, Ca:40.078,
Fe:55.845, Cu:63.546, Zn:65.38, Ag:107.87, I:126.90

};

let total = 0;
let i = 0;

// ================== PARSER ==================

while(i < formula.length){

let element = formula[i];

// Check 2-letter element
if(i + 1 < formula.length){

let twoLetter = formula[i] + formula[i+1];

if(atomicWeights[twoLetter]){
element = twoLetter;
i++;
}

}

// Get number after element

let num = "";
let j = i + 1;

while(j < formula.length && !isNaN(formula[j])){
num += formula[j];
j++;
}

let count = parseInt(num) || 1;

// ================== CALCULATION ==================

if(atomicWeights[element]){
total += atomicWeights[element] * count;
}
else{
document.getElementById("mwResult").innerHTML =
"Unknown element: " + element;
return;
}

i = j;

}


// ================== RESULT ==================

let exact = total.toFixed(3);
let approx = Math.round(total);

document.getElementById("mwResult").innerHTML =

`
<div class="mw-result-main">
${exact} g/mol
</div>

<div class="mw-result-approx">
≈ ${approx} g/mol
</div>
`;

}




// ================== CALCULATOR SYSTEM ==================

let currentCalc = "";


const calculators = {

ratio: {
title: "Ratio & Proportion",
formula: "$$ \\frac{a}{b} = \\frac{c}{d} $$",
category: "fundamental",
fields: ["a","b","c","d"]
},

smallest_quantity_weighable: {
title: "Smallest Quantity Weighable",
formula: "$$ SQW = \\frac{100\\% \\times Sensitivity\\ requirement\\ (mg)}{\\ Acceptable\\ Error\\%} $$",
category: "compounding",
fields: ["sensitivity","error percent","SQW"]
},


percentage_error: {
title: "Percentage Error",
formula: "$$ \\%\\ Error = \\frac{Error}{Quantity\\ Desired} \\times 100 $$",
category: "fundamental",
fields: ["error","quantity","percentage error"]
},

density: {
title: "Density",
formula: "$$ Density = \\frac{Mass}{Volume} $$",
category: "physical pharmacy",
fields: ["mass","volume","density"]
},

specific_gravity: {
title: "Specific Gravity",
formula: "$$ Specific\\ Gravity = \\frac{Weight\\ of\\ Substance\\ (gm)}{Weight\\ of\\ Equal\\ Volume\\ of\\ Water\\ (gm)} $$",
category: "physical pharmacy",
fields: ["substance weight","water weight","SG"]
},

specific_volume: {
title: "Specific Volume",
formula: "$$ Specific\\ Volume = \\frac{Volume\\ of\\ substance\\ (ml)}{Volume\\ of\\ equal\\ Weight\\ of\\ water\\ (ml)} $$",
category: "physical pharmacy",
fields: ["substance volume","water volume","SV"]
},


percentage_wv: {
title: "% w/v",
formula: "$$ \\%\\ w/v = \\frac{Weight\\ of\\ solute\\ (g)}{Volume\\ of\\ solution\\ (mL)} \\times 100 $$",
category: "fundamental",
fields: ["solute","solution","percent"]
},

percentage_ww: {
title: "% w/w",
formula: "$$ \\%\\ w/w = \\frac{Weight\\ of\\ Solute\\ (g)}{Weight\\ of\\ Solution\\ (g)} \\times 100 $$",
category: "fundamental",
fields: ["solute","solution","percent"]
},

percentage_vv: {
title: "% v/v",
formula: "$$ \\%\\ v/v = \\frac{Volume\\ of\\ Solute\\ (ml)}{Volume\\ of\\ Solution\\ (ml)} \\times 100 $$",
category: "fundamental",
fields: ["solute","solution","percent"]
},

compliance: {
title: "Compliance Rate",
formula: "$$ \\%\\ Compliance\\ rate = \\frac{Number\\ of\\ days\\ supply\\ of\\ medication}{Number\\ of\\ days\\ since\\ last\\ Rx\\ refill} \\times 100 $$",
category: "compounding",
fields: ["days supply","last refill","% compliance"]
},

dilution: {
title: "Dilution",
formula: "$$ Q_1 \\times C_1 = Q_2 \\times C_2 $$",
category: "fundamental",
fields: ["q1","c1","q2","c2"]
},

number_of_doses: {
title: "Number of Doses",
formula: "$$ Number\\ of\\ Doses = \\frac{Total\\ Quantity}{Size\\ of\\ dose} $$",
category: "fundamental",
fields: ["total quantity","size of dose","number of doses"]
},

dose_weight: {
title: "Dose by Weight",
formula: "$$ Patient's\\ dose\\ (mg) = \\frac{Patient’s\\ weight\\ (kg) \\times Drug\\ dose\\ (mg)}{1\\ (kg)} $$",
category: "clinical",
fields: ["weight","drug dose","patient's dose"]
},

dose_bsa: {
title: "Dose by BSA",
formula: "$$ Patient's\\ dose = \\frac{Patient's\\ BSA\\ (m^2)}{1.73} \\times Adult\\ Dose $$",
category: "clinical",
fields: ["BSA","adult dose","patient's dose"]
},

bsa: {
title: "BSA (Mosteller)",
formula: "$$ BSA = \\sqrt{\\frac{Height_{cm} \\times Weight_{kg}}{3600}} $$",
category: "clinical",
fields: ["height","weight","BSA"]
},

ibw_male: {
title: "IBW (Male)",
formula: "$$ IBW_{male} = 50\\ (kg) + 2.3\\ kg\\times (Height_{inch} - 60) $$",
category: "clinical",
fields: ["height(inch)","IBW"]
},

ibw_female: {
title: "IBW (Female)",
formula: "$$ IBW_{female} = 45.5\\ (kg) + 2.3\\ kg\\times (Height_{inch} - 60) $$",
category: "clinical",
fields: ["height(inch)","IBW"]
},

jelliffe_male: {
title: "Creatinine Clearance (Jelliffe Male)",
formula: "$$ CrCl = \\frac{98 - 0.8 \\times (Age - 20)}{Serum\\ Creatinine\\ (mg/dl)} $$",
category: "renal function",
fields: ["age","scr","crcl"]
},

jelliffe_female: {
title: "Creatinine Clearance (Jelliffe Female)",
formula: "$$ CrCl_{female} = 0.9 \\times CrCl\\ determined\\ by\\ equation\\ for\\ males $$",
category: "renal function",
fields: ["crcl_male","crcl"]
},

cockcroft_male: {
title: "Cockcroft-Gault (Male)",
formula: "$$ CrCl = \\frac{(140 - Age) \\times Weight_{kg}}{72 \\times Serum\\ Creatinine\\ (mg/dL)} $$",
category: "renal function",
fields: ["age","weight","scr","crcl"]
},

cockcroft_female: {
title: "Cockcroft-Gault (Female)",
formula: "$$ CrCl_{female} = 0.85 \\times CrCl\\ determined\\ by\\ equation\\ for\\ males $$",
category: "renal function",
fields: ["crcl_male","crcl"]
},

schwartz: {
title: "Schwartz Equation",
formula: "$$ CrCl = \\frac{k \\times Height\\ (cm)}{Serum\\ Creatinine\\ (mg/dl)} $$",
category: "renal function",
fields: ["k","height","scr","crcl"]
},

adjusted_crcl: {
title: "Adjusted CrCl",
formula: "$$ Adjusted\\ CrCl = \\frac{BSA}{1.73} \\times CrCl $$",
category: "renal function",
fields: ["BSA","crcl","adjusted crcl"]
},

iron_requirement: {
title: "Iron Requirement",
formula: "$$ Iron\\ (mg) = Weight\\ (lb) \\times 0.3 \\times [100 - (Hb\\ (g/dl) \\times 100/14.8)] $$",
category: "clinical",
fields: ["weight(lb)","Hb","iron"]
},

simple_isotonic_solution: {
title: "Simple Isotonic Solution",
formula: "$$ Grams\\ of\\ solute = \\frac{0.52 \\times Molecular\\ weight}{1.86 \\times dissociation\\ (i)} $$",
category: "compounding",
fields: ["Grams of solute", "molecular weight", "dissociation"]
},

nacl_equivalent: {
title: "NaCl Equivalent (E-value)",
formula: "$$ NaCl\\ equivalent\\ (E) = \\frac{58.5}{1.8}\\times \\frac{i\\ factor\\ of\\ the\\ substance}{Molecular\\ weight\\ of\\ the\\ substance} $$",
category: "compounding",
fields: ["i factor of substance","molecular weight of substance","E"]
},

volume_to_render_solution_isotonic: {
title: "Volume to Render Solution Isotonic",
formula: "$$ Water\\ required = \\frac{Amount\\ of\\ substance\\ (gm) \\times E\\ value\\ of\\ substance}{0.009} $$",
category: "compounding",
fields: ["water required", "amount of substance", "E value of substance"]
},

ph_acid: {
title: "Henderson-Hasselbalch (Acid)",
formula: "$$ pH = pKa + \\log \\frac{Salt}{Acid} $$",
category: "acid-base",
fields: ["pka","salt","acid","ph"]
},

ph_base: {
title: "Henderson-Hasselbalch (Base)",
formula: "$$ pH = pKw - pKb + \\log \\frac{Base}{Salt} $$",
category: "acid-base",
fields: ["pkb","pkw","base","salt","ph"]
},

equivalent_weight: {
title: "Equivalent Weight",
formula: "$$ Equivalent\\ weight = \\frac{Atomic\\ weight}{Valence} $$",
category: "fundamental",
fields: ["mw","valence","eq"]
},

meq_from_mg: {
title: "mg to mEq",
formula: "$$ mEq = \\frac{mg\\times Valence}{Atomic\\ weight}​ $$",
category: "acid-base",
fields: ["mg","valence","atomic weight","meq"]
},

mEq_per_mL_to_mg_per_mL: {
title: "mEq/mL to mg/mL",
formula: "$$ \\frac{mg}{mL} = \\frac{mEq/mL \\times Atomic\\ Weight}{Valence} $$",
category: "acid-base",
fields: ["mEq/mL", "atomic weight", "valence", "mg/ml"]
},

ideal_osmolar_concentration: {
title: "Ideal Osmolar Concentration",
formula: "$$ \\frac{mOsmol}{L} = \\frac{Weight\\ of\\ substance\\ (g/L)}{Molecular\\ weight}\\times number\\ of\\ species\\times 1000 $$",
category: "physical pharmacy",
fields: ["weight","molecular weight","species","osmolar concentration"]
},

plasma_osmolality: {
title: "Plasma Osmolality",
formula: "$$ Plasma\\ Osmolality = 2(Na^+ + K^+) + \\frac{BUN}{2.8} + \\frac{Glucose}{18} $$",
category: "physical pharmacy",
fields: ["na","k","bun(blood urea nitrogen)","glucose","plasma osmolality"]
},

iv_flow_rate: {
title: "IV Flow Rate (Drops per Minute)",
formula: "$$ Rate\\ of\\ flow = \\frac{Infusion\\ volume\\ (mL) \\times Drip\\ set\\ (drops/mL)}{Time\\ (min)} $$",
category: "iv & infusion",
fields: ["volume","drip set","time","rate of flow"]
},

iv_infusion_rate_for_critical_care: {
title: "IV Infusion Rate",
formula: "$$ Infusion\\ rate\\ (mL/hr) =  \\frac{Patient’s\\ weight\\ (kg)\\times Dose\\times 60}{Drug\\ concentration} $$",
category: "iv & infusion",
fields: ["weight","dose","concentration","infusion rate"]
},

basal_energy_expenditure_for_males:{
title: "Basal Energy Expenditure (BEE) for Males",
formula: `$$
\\begin{aligned}
BEE\\ (male) &= 66.47 + 13.75 \\times Weight\\ (kg) \\\\
&+ 5.0 \\times Height\\ (cm) - 6.76 \\times Age\\ (yr)
\\end{aligned}
$$`,
category: "nutrition",
fields: ["BEE(male)", "weight", "height", "age"]
},

basal_energy_expenditure_for_females:{
title: "Basal Energy Expenditure (BEE) for Females",
formula: `$$
\\begin{aligned}
BEE\\ (female) &= 655.1 + 9.56 \\times Weight\\ (kg) \\\\
&+ 1.86 \\times Height\\ (cm) - 4.68 \\times Age\\ (yr)
\\end{aligned}
$$`,
category: "nutrition",
fields: ["BEE(female)", "weight", "height", "age"]
},

bmi: {
title: "BMI",
formula: "$$ BMI = \\frac{Weight\\ (kg)}{Height\\ (m^2)} $$",
category: "clinical",
fields: ["weight","height","bmi"]
},

radioactive_decay: {
title: "Radioactive Decay",
formula: "$$ N = N0e^{-\\lambda t} $$",
category: "nuclear pharmacy",
fields: ["N","N0","λ", "t"]
},

vd: {
title: "Volume of Distribution",
formula: "$$ Vd = \\frac{Amount\\ of\\ drug\\ in\\ body\\ (D)}{Plasma\\ concentration\\ (CP)} $$",
category: "pharmacokinetics",
fields: ["Amount of drug in body(D)","Plasma concentration(CP)","VD"]
},

kel: {
title: "Elimination Rate Constant(First order reaction)",
formula: "$$ K_{el} = \\frac{0.693}{t_{1/2}} $$",
category: "pharmacokinetics",
fields: ["t1/2","kel"]
},

benefit_to_cost_ratio: {
title: "Benefit-to-Cost Ratio",
formula: "$$ Benefit\\ to\\ cost\\ ratio = \\frac{Benefits\\ ($)}{Costs\\ ($)} $$",
category: "fundamental",
fields: ["Benefit-to-cost ratio", "Benefits ($)", "Costs ($)"]
},

cost_to_effectiveness_ratio: {
title: "Cost-to-Effectiveness Ratio (C/E)",
formula: "$$ Cost\\ to\\ Effectiveness\\ Ratio\\ (C/E) = \\frac{Costs\\ ($)}{Therapeutic\\ effect} $$",
category: "fundamental",
fields: ["Cost-to-Effectiveness Ratio (C/E)", "Costs ($)", "Therapeutic effect"]
},

prescription_price: {
title: "Prescription Price",
formula: `$$
\\begin{aligned}
Prescription\\ price &= Cost\\ of\\ ingredients  \\\\
&+ Cost\\ of\\ ingredients \\times Markup
\\end{aligned}
$$`,
category: "fundamental",
fields: ["Prescription price", "Cost of ingredients", "% Markup"]
},

proof_gallons: {
title: "Proof gallons",
formula: "$$ Proof\\ gallons = \\frac{Gallons\\times percentage\\ strength\\ of\\ solution}{50\\ %} $$",
category: "alcohol strength",
fields: ["Proof gallons", "Gallons", "Percentage strength of solution"]
},

proof_gallons_proof_streangth: {
title: "Proof gallons (when Proof streangth is available)",
formula: "$$ Proof\\ gallons = \\frac{Gallons\\times Proof\\ strength\\ of\\ solution}{100\\ (proof)} $$",
category: "alcohol strength",
fields: ["Proof gallons", "Gallons", "Proof strength of solution"]
},

fahrenheit_to_centigrade: {
title: "Fahrenheit to Centigrade",
formula: "$$ C = \\frac{5}{9}\\times (F - 32) $$",
category: "temperature",
fields: ["C", "F"]
},

bioavailability: {
title: "Bioavailability",
formula: "$$ F = \\frac{Amount\\ absorbed}{Dose} $$",
category: "pharmacokinetics",
fields: ["Amount absorbed","Dose","F"]
},

normality: {
title: "Normality",
formula: "$$ N = \\frac{Gram\\ equivalent\\ of\\ solute}{Volume\\ of\\ solution(L)} $$",
category: "fundamental",
fields: ["Normality", "Gram equivalent", "Volume of solution(L)"]
},

molarity: {
title: "Molarity",
formula: "$$ M = \\frac{Moles\\ of\\ solute}{Volume\\ of\\ solution(L)} $$",
category: "fundamental",
fields: ["Molarity", "Moles of solute", "Volume of solution(L)"]
},

molality: {
title: "Molality",
formula: "$$ m = \\frac{Moles\\ of\\ solute}{Kg\\ of\\ solvent} $$",
category: "fundamental",
fields: ["Molality", "Moles of solute", "Kg of solvent"]
},

formality: {
title: "Formality",
formula: "$$ F = \\frac{Formula\\ weight}{Volume\\ of\\ solution(L)} $$",
category: "fundamental",
fields: ["Formality", "Formula weight", "Volume of solution(L)"]
}

};


function loadCalculators(){

const containers = {
"fundamental": document.getElementById("fundamentalContainer"),
"clinical": document.getElementById("clinicalContainer"),
"physical pharmacy": document.getElementById("physicalContainer"),
"compounding": document.getElementById("compoundingContainer"),
"renal function": document.getElementById("renalContainer"),
"pharmacokinetics": document.getElementById("pkContainer"),
"iv & infusion": document.getElementById("ivContainer"),
"acid-base": document.getElementById("acidbaseContainer"),
"nutrition": document.getElementById("nutritionContainer"),
"nuclear pharmacy": document.getElementById("nuclearContainer"),
"alcohol strength": document.getElementById("alcoholContainer"),
"temperature": document.getElementById("temperatureContainer")
};

Object.keys(calculators).forEach(key => {

let calc = calculators[key];
let container = containers[calc.category];

if(container){

container.innerHTML += `
<div class="card" data-name="${key}">
<h3>${calc.title}</h3>
<button class="open-btn" data-type="${key}">
Open Tool
</button>
</div>
`;

}

});

document.querySelectorAll(".open-btn").forEach(btn=>{
btn.addEventListener("click", function(){
openCalculator(this.dataset.type);
});
});

}


function toggleCategory(header){

const content = header.nextElementSibling;

content.classList.toggle("active");

header.classList.toggle("active");

}

document.querySelectorAll(".accordion-item").forEach(item=>{

let count = item.querySelectorAll(".card").length;

let header = item.querySelector(".accordion-header");

if(header && count>0){

header.innerHTML = header.innerHTML + 
` <span class="calc-count">(${count})</span>`;

}

});


function openCalculator(type){

currentCalc = type;

const modal = document.getElementById("calculatorModal");
modal.classList.add("active");
document.body.style.overflow = "hidden";

window.scrollTo({
top: 0,
behavior: "smooth"
});

let calc = calculators[type];

if(!calc){
document.getElementById("calcInputs").innerHTML = "Coming soon";
return;
}

document.getElementById("calcTitle").innerText = calc.title;

document.getElementById("formulaText").innerHTML = calc.formula;
MathJax.typeset();

// AUTO INPUT GENERATION
let html = "";

calc.fields.forEach(f=>{
html += `<div class="input-group">
<label>${f}</label>
<input id="${f}" placeholder="Enter ${f}">
</div>`;
});

html += `<p style="color:gray;">Leave one field empty</p>`;

document.getElementById("calcInputs").innerHTML = html;

}

window.onclick = function(event) {
let modal = document.getElementById("calculatorModal");
if (event.target == modal) {
modal.classList.remove("active");
document.body.style.overflow = "auto";
}
}


// ================== CALCULATION ENGINE ==================

function calculate(){

let inputs = document.querySelectorAll("#calcInputs input");
let values = {};

let emptyFields = [];

inputs.forEach(input => {
if(input.value.trim() === ""){
emptyFields.push(input.id);
}
});

if(emptyFields.length !== 1){
document.getElementById("calcResult").innerText =
"Leave exactly ONE field empty";
return;
}

inputs.forEach(input=>{
values[input.id] = input.value.trim() === "" ? null : parseFloat(input.value);
});

let result = "";


// RATIO
if(currentCalc === "ratio"){

let {a, b, c, d} = values;

if(a == null) result = (b*c)/d;
else if(b == null) result = (a*d)/c;
else if(c == null) result = (a*d)/b;
else if(d == null) result = (b*c)/a;
else result = "Leave one field empty";

}


// SMALLEST QUANTITY WEIGHABLE
if(currentCalc === "smallest_quantity_weighable"){

let sensitivity = values["sensitivity"];
let error = values["error percent"];
let sqw = values["SQW"];

if(sqw == null) result = (sensitivity*100)/error;
else if(sensitivity == null) result = (sqw*error)/100;
else if(error == null) result = (sensitivity*100)/sqw;
else result = "Leave one field empty";

}


// PERCENTAGE ERROR
if(currentCalc === "percentage_error"){

let error = values["error"];
let quantity = values["quantity"];
let percent = values["percentage error"];

if(percent == null) result = (error/quantity)*100;
else if(error == null) result = (percent*quantity)/100;
else if(quantity == null) result = (error*100)/percent;
else result = "Leave one field empty";

}


// DENSITY
if(currentCalc === "density"){

let {mass, volume, density} = values;

if(density == null) result = mass/volume;
else if(mass == null) result = density*volume;
else if(volume == null) result = mass/density;
else result = "Leave one field empty";

}


// SPECIFIC GRAVITY
if(currentCalc === "specific_gravity"){

let substance = values["substance weight"];
let water = values["water weight"];
let sg = values["SG"];

if(sg == null) result = substance/water;
else if(substance == null) result = sg*water;
else if(water == null) result = substance/sg;
else result = "Leave one field empty";

}


// SPECIFIC VOLUME
if(currentCalc === "specific_volume"){

let substance = values["substance volume"];
let water = values["water volume"];
let sv = values["SV"];

if(sv == null) result = substance/water;
else if(substance == null) result = sv*water;
else if(water == null) result = substance/sv;
else result = "Leave one field empty";

}


// PERCENT W/V
if(currentCalc === "percentage_wv"){

let {solute, solution, percent} = values;

if(percent == null) result = (solute/solution)*100;
else if(solute == null) result = (percent*solution)/100;
else if(solution == null) result = (solute*100)/percent;
else result = "Leave one field empty";

}


// PERCENT W/W
if(currentCalc === "percentage_ww"){

let {solute, solution, percent} = values;

if(percent == null) result = (solute/solution)*100;
else if(solute == null) result = (percent*solution)/100;
else if(solution == null) result = (solute*100)/percent;
else result = "Leave one field empty";

}



// PERCENT V/V
if(currentCalc === "percentage_vv"){

let {solute, solution, percent} = values;

if(percent == null) result = (solute/solution)*100;
else if(solute == null) result = (percent*solution)/100;
else if(solution == null) result = (solute*100)/percent;
else result = "Leave one field empty";

}



// COMPLIANCE
if(currentCalc === "compliance"){

let taken = values["days supply"];
let total = values["last refill"];
let percent = values["% compliance"];

if(percent == null) result = (taken/total)*100;
else if(taken == null) result = (percent*total)/100;
else if(total == null) result = (taken*100)/percent;
else result = "Leave one field empty";

}


// DILUTION
if(currentCalc === "dilution"){

let {q1, c1, q2, c2} = values;

if(q1 == null) result = (q2*c2)/c1;
else if(c1 == null) result = (q2*c2)/q1;
else if(q2 == null) result = (q1*c1)/c2;
else if(c2 == null) result = (q1*c1)/q2;
else result = "Leave one field empty";

}


// NUMBER OF DOSES
if(currentCalc === "number_of_doses"){

let total = values["total quantity"];
let dose = values["size of dose"];
let n = values["number of doses"];

if(n == null) result = total/dose;
else if(total == null) result = n*dose;
else if(dose == null) result = total/n;
else result = "Leave one field empty";

}


// DOSE BY WEIGHT
if(currentCalc === "dose_weight"){

let weight = values["weight"];
let dose = values["drug dose"];
let patient = values["patient's dose"];

if(patient == null) result = weight * dose;
else if(weight == null) result = patient / dose;
else if(dose == null) result = patient / weight;
else result = "Leave one field empty";

}


// DOSE BY BSA
if(currentCalc === "dose_bsa"){

let bsa = values["BSA"];
let adult = values["adult dose"];
let patient = values["patient's dose"];

if(patient == null) result = (bsa/1.73)*adult;
else if(bsa == null) result = (patient*1.73)/adult;
else if(adult == null) result = patient/(bsa/1.73);
else result = "Leave one field empty";

}


// BSA
if(currentCalc === "bsa"){

let height = values["height"];
let weight = values["weight"];
let bsa = values["BSA"];

if(bsa == null) result = Math.sqrt((height*weight)/3600);
else result = "Leave BSA empty";

}


// IBW MALE
if(currentCalc === "ibw_male"){

let height = values["height(inch)"];
let ibw = values["IBW"];

if(ibw == null) result = 50 + 2.3*(height-60);
else result = "Leave IBW empty";

}


// IBW FEMALE
if(currentCalc === "ibw_female"){

let height = values["height(inch)"];
let ibw = values["IBW"];

if(ibw == null) result = 45.5 + 2.3*(height-60);
else result = "Leave IBW empty";

}


// JELLIFFE MALE
if(currentCalc === "jelliffe_male"){

let age = values["age"];
let scr = values["scr"];
let crcl = values["crcl"];

if(crcl == null) result = (98 - 0.8*(age-20))/scr;
else result = "Leave CrCl empty";

}


// JELLIFFE FEMALE
if(currentCalc === "jelliffe_female"){

let male = values["crcl_male"];
let crcl = values["crcl"];

if(crcl == null) result = 0.9 * male;
else result = "Leave CrCl empty";

}


// COCKCROFT MALE
if(currentCalc === "cockcroft_male"){

let age = values["age"];
let weight = values["weight"];
let scr = values["scr"];
let crcl = values["crcl"];

if(crcl == null) result = ((140-age)*weight)/(72*scr);
else result = "Leave CrCl empty";

}


// COCKCROFT FEMALE
if(currentCalc === "cockcroft_female"){

let male = values["crcl_male"];
let crcl = values["crcl"];

if(crcl == null) result = 0.85 * male;
else result = "Leave CrCl empty";

}


// SCHWARTZ
if(currentCalc === "schwartz"){

let k = values["k"];
let height = values["height"];
let scr = values["scr"];
let crcl = values["crcl"];

if(crcl == null) result = (k*height)/scr;
else result = "Leave CrCl empty";

}


// ADJUSTED CRCL
if(currentCalc === "adjusted_crcl"){

let bsa = values["BSA"];
let crcl = values["crcl"];
let adjusted = values["adjusted crcl"];

if(adjusted == null) result = (bsa/1.73)*crcl;
else if(bsa == null) result = (adjusted*1.73)/crcl;
else if(crcl == null) result = adjusted/(bsa/1.73);
else result = "Leave one field empty";

}


// IRON REQUIREMENT
if(currentCalc === "iron_requirement"){

let weight = values["weight(lb)"];
let hb = values["Hb"];
let iron = values["iron"];

if(iron == null) result = weight * 0.3 * (100 - (hb*100/14.8));
else result = "Leave Iron empty";

}


// SIMPLE ISOTONIC SOLUTION
if(currentCalc === "simple_isotonic_solution"){

let grams = values["Grams of solute"];
let mw = values["molecular weight"];
let i = values["dissociation"];

if(grams == null) result = (0.52*mw)/(1.86*i);
else if(mw == null) result = (grams*1.86*i)/0.52;
else if(i == null) result = (0.52*mw)/(1.86*grams);
else result = "Leave one field empty";

}


// NACL EQUIVALENT
if(currentCalc === "nacl_equivalent"){

let i = values["i factor of substance"];
let mw = values["molecular weight of substance"];
let e = values["E"];

if(e == null) result = (58.5/1.8)*(i/mw);
else result = "Leave E empty";

}


// VOLUME TO RENDER ISOTONIC
if(currentCalc === "volume_to_render_solution_isotonic"){

let water = values["water required"];
let amount = values["amount of substance"];
let e = values["E value of substance"];

if(water == null) result = (amount*e)/0.009;
else result = "Leave water empty";

}


// PH ACID
if(currentCalc === "ph_acid"){

let pka = values["pka"];
let salt = values["salt"];
let acid = values["acid"];
let ph = values["ph"];

if(ph == null) result = pka + Math.log10(salt/acid);
else result = "Leave pH empty";

}


// PH BASE
if(currentCalc === "ph_base"){

let pkb = values["pkb"];
let pkw = values["pkw"];
let base = values["base"];
let salt = values["salt"];
let ph = values["ph"];

if(ph == null) result = pkw - pkb + Math.log10(base/salt);
else result = "Leave pH empty";

}


// EQUIVALENT WEIGHT
if(currentCalc === "equivalent_weight"){

let mw = values["mw"];
let valence = values["valence"];
let eq = values["eq"];

if(eq == null) result = mw/valence;
else result = "Leave eq empty";

}


// MG TO MEQ
if(currentCalc === "meq_from_mg"){

let mg = values["mg"];
let valence = values["valence"];
let mw = values["atomic weight"];
let meq = values["meq"];

if(meq == null) result = (mg*valence)/mw;
else result = "Leave mEq empty";

}


// MEQ/ML TO MG/ML
if(currentCalc === "mEq_per_mL_to_mg_per_mL"){

let meq = values["mEq/mL"];
let mw = values["atomic weight"];
let valence = values["valence"];
let mg = values["mg/ml"];

if(mg == null) result = (meq*mw)/valence;
else result = "Leave mg empty";

}


// IDEAL OSMOLAR
if(currentCalc === "ideal_osmolar_concentration"){

let weight = values["weight"];
let mw = values["molecular weight"];
let species = values["species"];
let osm = values["osmolar concentration"];

if(osm == null) result = (weight/mw)*species*1000;
else result = "Leave osm empty";

}


// PLASMA OSMOLALITY
if(currentCalc === "plasma_osmolality"){

let na = values["na"];
let k = values["k"];
let bun = values["bun(blood urea nitrogen)"];
let glucose = values["glucose"];
let osm = values["plasma osmolality"];

if(osm == null) result = 2*(na+k) + (bun/2.8) + (glucose/18);
else result = "Leave osmolality empty";

}


// IV FLOW RATE
if(currentCalc === "iv_flow_rate"){

let volume = values["volume"];
let drip = values["drip set"];
let time = values["time"];
let rate = values["rate of flow"];

if(rate == null) result = (volume*drip)/time;
else if(volume == null) result = (rate*time)/drip;
else if(drip == null) result = (rate*time)/volume;
else if(time == null) result = (volume*drip)/rate;
else result = "Leave one field empty";

}


// IV INFUSION RATE
if(currentCalc === "iv_infusion_rate_for_critical_care"){

let weight = values["weight"];
let dose = values["dose"];
let conc = values["concentration"];
let rate = values["infusion rate"];

if(rate == null) result = (weight*dose*60)/conc;
else if(weight == null) result = (rate*conc)/(dose*60);
else if(dose == null) result = (rate*conc)/(weight*60);
else if(conc == null) result = (weight*dose*60)/rate;
else result = "Leave one field empty";

}


// BEE MALE
if(currentCalc === "basal_energy_expenditure_for_males"){

let bee = values["BEE(male)"];
let weight = values["weight"];
let height = values["height"];
let age = values["age"];

if(bee == null) result = 66.47 + (13.75*weight) + (5*height) - (6.76*age);
else result = "Leave BEE empty";

}


// BEE FEMALE
if(currentCalc === "basal_energy_expenditure_for_females"){

let bee = values["BEE(female)"];
let weight = values["weight"];
let height = values["height"];
let age = values["age"];

if(bee == null) result = 655.1 + (9.56*weight) + (1.86*height) - (4.68*age);
else result = "Leave BEE empty";

}


// BMI
if(currentCalc === "bmi"){

let weight = values["weight"];
let height = values["height"];
let bmi = values["bmi"];

if(bmi == null) result = weight/(height*height);
else if(weight == null) result = bmi*(height*height);
else if(height == null) result = Math.sqrt(weight/bmi);
else result = "Leave one field empty";

}


// RADIOACTIVE DECAY
if(currentCalc === "radioactive_decay"){

let N = values["N"];
let N0 = values["N0"];
let lambda = values["λ"];
let t = values["t"];

if(N == null) result = N0*Math.exp(-lambda*t);
else result = "Leave N empty";

}


// VOLUME OF DISTRIBUTION
if(currentCalc === "vd"){

let d = values["Amount of drug in body(D)"];
let cp = values["Plasma concentration(CP)"];
let vd = values["VD"];

if(vd == null) result = d/cp;
else if(d == null) result = vd*cp;
else if(cp == null) result = d/vd;
else result = "Leave one field empty";

}


// KEL
if(currentCalc === "kel"){

let half = values["t1/2"];
let kel = values["kel"];

if(kel == null) result = 0.693/half;
else if(half == null) result = 0.693/kel;
else result = "Leave one field empty";

}


// BENEFIT COST
if(currentCalc === "benefit_to_cost_ratio"){

let ratio = values["Benefit-to-cost ratio"];
let benefit = values["Benefits ($)"];
let cost = values["Costs ($)"];

if(ratio == null) result = benefit/cost;
else if(benefit == null) result = ratio*cost;
else if(cost == null) result = benefit/ratio;
else result = "Leave one field empty";

}


// COST EFFECTIVENESS
if(currentCalc === "cost_to_effectiveness_ratio"){

let ratio = values["Cost-to-Effectiveness Ratio (C/E)"];
let cost = values["Costs ($)"];
let effect = values["Therapeutic effect"];

if(ratio == null) result = cost/effect;
else if(cost == null) result = ratio*effect;
else if(effect == null) result = cost/ratio;
else result = "Leave one field empty";

}


// PRESCRIPTION PRICE
if(currentCalc === "prescription_price"){

let price = values["Prescription price"];
let cost = values["Cost of ingredients"];
let markup = values["% Markup"];

if(price == null) result = cost + (cost*markup/100);
else if(cost == null) result = price/(1 + markup/100);
else result = "Leave one field empty";

}


// PROOF GALLONS
if(currentCalc === "proof_gallons"){

let proof = values["Proof gallons"];
let gallons = values["Gallons"];
let percent = values["Percentage strength of solution"];

if(proof == null) result = (gallons*percent)/50;
else result = "Leave proof empty";

}


// PROOF GALLONS PROOF
if(currentCalc === "proof_gallons_proof_streangth"){

let proof = values["Proof gallons"];
let gallons = values["Gallons"];
let strength = values["Proof strength of solution"];

if(proof == null) result = (gallons*strength)/100;
else result = "Leave proof empty";

}


// TEMP CONVERSION
if(currentCalc === "fahrenheit_to_centigrade"){

let c = values["C"];
let f = values["F"];

if(c == null) result = (5/9)*(f-32);
else if(f == null) result = (c*9/5)+32;
else result = "Leave one field empty";

}


// BIOAVAILABILITY
if(currentCalc === "bioavailability"){

let absorbed = values["Amount absorbed"];
let dose = values["Dose"];
let f = values["F"];

if(f == null) result = absorbed/dose;
else if(absorbed == null) result = f*dose;
else if(dose == null) result = absorbed/f;
else result = "Leave one field empty";

}


// NORMALITY
if(currentCalc === "normality"){

let normality = values["Normality"];
let gram = values["Gram equivalent of solute"];
let volume = values["Volume of solution(L)"];

if(volume == null) result = gram/normality;
else if(gram == null) result = normality*volume;
else if(normality == null) result = gram/volume;
else result = "Leave one field empty";

}


// MOLARITY
if(currentCalc === "molarity"){

let molarity = values["Molarity"];
let moles = values["Moles of solute"];
let volume = values["Volume of solution(L)"];

if(volume == null) result = moles/molarity;
else if(moles == null) result = molarity*volume;
else if(molarity == null) result = moles/volume;
else result = "Leave one field empty";

}


// MOLALITY
if(currentCalc === "molality"){

let molality = values["Molality"];
let moles = values["Moles of solute"];
let solvent = values["Kg of solvent"];

if(solvent == null) result = moles/molality;
else if(moles == null) result = molality*solvent;
else if(molality == null) result = moles/solvent;
else result = "Leave one field empty";

}


// FORMALITY
if(currentCalc === "formality"){

let formality = values["Formality"];
let weight = values["Formula weight"];
let volume = values["Volume of solution(L)"];

if(volume == null) result = weight/formality;
else if(weight == null) result = formality*volume;
else if(formality == null) result = weight/volume;
else result = "Leave one field empty";

}


if(typeof result === "number"){
result = Math.round(result * 1000) / 1000;
}

if(typeof result === "number" && isNaN(result)){
result = "Please enter valid values (leave only one field empty)";
}

inputs.forEach(input => {
input.style.borderColor = "#ccc"; // reset
});

if(emptyFields.length === 1){
document.getElementById(emptyFields[0]).style.borderColor = "green";
}

document.getElementById("calcResult").innerText = "Result: " + result;

}

let result = document.getElementById("calcResult");
if(result){
result.innerText = "--";
}

function clearCalc(){
document.getElementById("calcInputs").querySelectorAll("input").forEach(input => input.value = "");
}

document.getElementById("calcResult").innerText = "--";

// ================== CLOSE ==================

function closeCalculator(){
const modal = document.getElementById("calculatorModal");
modal.classList.remove("active");
document.body.style.overflow = "auto";
}

document.addEventListener("DOMContentLoaded", function(){
loadCalculators();

document.querySelectorAll("input[type='number']").forEach(input=>{
input.classList.add("calc-input");
});

});

document.addEventListener("keydown", function(e){

let inputs = document.querySelectorAll("#calculatorModal input");
let active = document.activeElement;
let index = Array.from(inputs).indexOf(active);

if(e.key === "Enter" || e.key === "ArrowDown"){
e.preventDefault();
if(index < inputs.length - 1){
inputs[index + 1].focus();
}
}

if(e.key === "ArrowUp"){
e.preventDefault();
if(index > 0){
inputs[index - 1].focus();
}
}

});

document.addEventListener("DOMContentLoaded", function(){

  document.querySelectorAll(".accordion-header").forEach(header => {

    header.addEventListener("click", function(e){

      // Prevent automatic scroll caused by focus
      e.preventDefault();
      this.blur();  // remove focus from header after click

      const item = this.parentElement;
      const content = this.nextElementSibling;

      // Close other accordions smoothly
      document.querySelectorAll(".accordion-item").forEach(i=>{
        if(i !== item){
          i.classList.remove("active");
          i.querySelector(".accordion-content").style.maxHeight = "0";
        }
      });

      // Toggle current accordion
      if(item.classList.contains("active")){
        item.classList.remove("active");
        content.style.maxHeight = "0";
      } else {
        item.classList.add("active");
        content.style.maxHeight = content.scrollHeight + "px";
      }

    });

  });

});

window.addEventListener("scroll", function(){

const header = document.querySelector("header");

if(window.scrollY > 10){
header.classList.add("scrolled");
}
else{
header.classList.remove("scrolled");
}

});
