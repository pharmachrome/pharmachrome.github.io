/*
  renal-function.js
  -----------------
  Category: renal function — estimating creatinine clearance (a proxy for
  kidney function) using several validated equations, each suited to
  different patient populations. Formulas cross-checked against Cockcroft &
  Gault 1976, Jelliffe 1973, Sanaka et al. 1996, and Schwartz et al. 1976.
*/

export const CALCULATORS = [
  {
    id: 'jelliffe-male',
    title: 'Creatinine Clearance (Jelliffe, Male)',
    category: 'renal-function',
    formulaText: 'CrCl = [98 − 0.8(age − 20)] / SCr',
    formulaLatex: 'CrCl = \\dfrac{98 - 0.8(\\text{age} - 20)}{SCr}',
    description: "Estimates a male patient's creatinine clearance from age and serum creatinine alone — the Jelliffe 'bedside' method, useful when weight isn't available or reliable.",
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'age', label: 'Age (years)', unitType: null },
      { key: 'scr', label: 'Serum creatinine, SCr (mg/dL)', unitType: 'concentration', defaultUnit: 'mgdL' },
      { key: 'crcl', label: 'CrCl (mL/min)', unitType: null }
    ],
    targets: ['crcl', 'age', 'scr'],
    solve(v, target) {
      if (target === 'crcl') return (98 - 0.8 * (v.age - 20)) / v.scr;
      if (target === 'age') return 20 - (v.crcl * v.scr - 98) / 0.8;
      if (target === 'scr') return (98 - 0.8 * (v.age - 20)) / v.crcl;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: "Jelliffe's 1973 bedside equation estimates creatinine clearance without needing the patient's weight, using the fact that creatinine production naturally declines with age (as muscle mass gradually decreases) starting from a reference value at age 20. It's normalized to a standard 1.73 m² body surface area, so it can overestimate or underestimate clearance in patients whose muscle mass is notably different from average for their age.",
      variables: {
        age: "The patient's age.",
        scr: 'Serum creatinine concentration.',
        crcl: 'Estimated creatinine clearance.'
      },
      example: {
        problem: 'Determine the creatinine clearance for an 80-year-old male patient with a serum creatinine of 2 mg/dL.',
        steps: [
          { label: 'Step 1 — Apply the formula', math: 'CrCl = \\dfrac{98 - 0.8(\\text{age} - 20)}{SCr}' },
          { label: 'Step 2 — Substitute the known values', math: 'CrCl = \\dfrac{98 - 0.8(80 - 20)}{2}' },
          { label: 'Step 3 — Calculate', math: 'CrCl = \\dfrac{98 - 48}{2} = 25\\ \\text{mL/min}' }
        ],
        conclusion: 'Estimated creatinine clearance is 25 mL/min.'
      },
      tips: [
        'This equation shouldn\'t be used if the patient\'s muscle mass is significantly different from average (e.g. cachexia, amputation, or a very muscular build) — creatinine production depends heavily on muscle mass.',
        'For female patients, use the separate Jelliffe (Female) calculator, which applies a 10% downward adjustment for typically lower average muscle mass.'
      ]
    }
  },
  {
    id: 'jelliffe-female',
    title: 'Creatinine Clearance (Jelliffe, Female)',
    category: 'renal-function',
    formulaText: 'CrCl = 0.9 × [98 − 0.8(age − 20)] / SCr',
    formulaLatex: 'CrCl = 0.9 \\times \\dfrac{98 - 0.8(\\text{age} - 20)}{SCr}',
    description: "The Jelliffe bedside equation for female patients, applying a 0.9 correction factor to the male formula.",
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'age', label: 'Age (years)', unitType: null },
      { key: 'scr', label: 'Serum creatinine, SCr (mg/dL)', unitType: 'concentration', defaultUnit: 'mgdL' },
      { key: 'crcl', label: 'CrCl (mL/min)', unitType: null }
    ],
    targets: ['crcl', 'age', 'scr'],
    solve(v, target) {
      if (target === 'crcl') return 0.9 * (98 - 0.8 * (v.age - 20)) / v.scr;
      if (target === 'age') return 20 - ((v.crcl * v.scr / 0.9) - 98) / 0.8;
      if (target === 'scr') return 0.9 * (98 - 0.8 * (v.age - 20)) / v.crcl;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'Same bedside logic as the male Jelliffe equation, adjusted downward by a factor of 0.9 (10%) to reflect that women, on average, have proportionally less muscle mass — and therefore produce somewhat less creatinine — at the same age and body size.',
      variables: {
        age: "The patient's age.",
        scr: 'Serum creatinine concentration.',
        crcl: 'Estimated creatinine clearance.'
      },
      example: {
        problem: 'Determine the creatinine clearance for an 80-year-old female patient with a serum creatinine of 2 mg/dL.',
        steps: [
          { label: 'Step 1 — Apply the formula', math: 'CrCl = 0.9 \\times \\dfrac{98 - 0.8(\\text{age} - 20)}{SCr}' },
          { label: 'Step 2 — Substitute the known values', math: 'CrCl = 0.9 \\times \\dfrac{98 - 0.8(80 - 20)}{2}' },
          { label: 'Step 3 — Calculate', math: 'CrCl = 0.9 \\times 25 = 22.5\\ \\text{mL/min}' }
        ],
        conclusion: 'Estimated creatinine clearance is 22.5 mL/min.'
      },
      tips: [
        'As with the male version, this assumes roughly average muscle mass for age and sex — it\'s less reliable outside that assumption.',
        'The 0.9 correction factor is a population average, not a precise adjustment for any individual patient.'
      ]
    }
  },
  {
    id: 'cockcroft-gault-male',
    title: 'Cockcroft-Gault (Male)',
    category: 'renal-function',
    formulaText: 'CrCl = [(140 − age) × weight] / (72 × SCr)',
    formulaLatex: 'CrCl = \\dfrac{(140 - \\text{age}) \\times \\text{weight}}{72 \\times SCr}',
    description: "The most widely used equation for estimating creatinine clearance in adults with stable kidney function — often used to guide medication dose adjustments.",
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'age', label: 'Age (years)', unitType: null },
      { key: 'weight', label: 'Weight', unitType: 'mass', defaultUnit: 'kg' },
      { key: 'scr', label: 'Serum creatinine, SCr (mg/dL)', unitType: 'concentration', defaultUnit: 'mgdL' },
      { key: 'crcl', label: 'CrCl (mL/min)', unitType: null }
    ],
    targets: ['crcl', 'age', 'weight', 'scr'],
    solve(v, target) {
      const weightKg = v.weight / 1000; // base unit is grams
      if (target === 'crcl') return ((140 - v.age) * weightKg) / (72 * v.scr);
      if (target === 'age') return 140 - (v.crcl * 72 * v.scr) / weightKg;
      if (target === 'weight') return ((v.crcl * 72 * v.scr) / (140 - v.age)) * 1000;
      if (target === 'scr') return ((140 - v.age) * weightKg) / (72 * v.crcl);
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: "Developed by Cockcroft and Gault in 1976, this remains the most commonly referenced equation for dose-adjusting medications by kidney function, largely because most modern drug studies and dosing guidelines were validated against it. It estimates clearance from age, weight, and serum creatinine, without requiring a urine collection.",
      variables: {
        age: "The patient's age.",
        weight: "The patient's actual body weight (some guidelines specify ideal or adjusted body weight in obese patients — check the specific context).",
        scr: 'Serum creatinine concentration.',
        crcl: 'Estimated creatinine clearance.'
      },
      example: {
        problem: 'Determine the creatinine clearance for an 80-year-old male patient weighing 70 kg with a serum creatinine of 2 mg/dL.',
        steps: [
          { label: 'Step 1 — Apply the formula', math: 'CrCl = \\dfrac{(140 - \\text{age}) \\times \\text{weight}}{72 \\times SCr}' },
          { label: 'Step 2 — Substitute the known values', math: 'CrCl = \\dfrac{(140 - 80) \\times 70}{72 \\times 2}' },
          { label: 'Step 3 — Calculate', math: 'CrCl = \\dfrac{4200}{144} \\approx 29.2\\ \\text{mL/min}' }
        ],
        conclusion: 'Estimated creatinine clearance is about 29.2 mL/min.'
      },
      tips: [
        'This equation was validated using body weight measurements from the 1970s and can overestimate clearance in today\'s heavier average patients — many institutions cap the weight used, or substitute ideal/adjusted body weight for obese patients.',
        'Standardized (IDMS-traceable) serum creatinine assays read about 12% lower than older assays — since this equation predates that standardization, results may run slightly higher than the original validation population would suggest.'
      ]
    }
  },
  {
    id: 'cockcroft-gault-female',
    title: 'Cockcroft-Gault (Female)',
    category: 'renal-function',
    formulaText: 'CrCl = 0.85 × [(140 − age) × weight] / (72 × SCr)',
    formulaLatex: 'CrCl = 0.85 \\times \\dfrac{(140 - \\text{age}) \\times \\text{weight}}{72 \\times SCr}',
    description: 'The Cockcroft-Gault equation for female patients, applying a 0.85 correction factor to account for lower average muscle mass.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'age', label: 'Age (years)', unitType: null },
      { key: 'weight', label: 'Weight', unitType: 'mass', defaultUnit: 'kg' },
      { key: 'scr', label: 'Serum creatinine, SCr (mg/dL)', unitType: 'concentration', defaultUnit: 'mgdL' },
      { key: 'crcl', label: 'CrCl (mL/min)', unitType: null }
    ],
    targets: ['crcl', 'age', 'weight', 'scr'],
    solve(v, target) {
      const weightKg = v.weight / 1000; // base unit is grams
      if (target === 'crcl') return 0.85 * ((140 - v.age) * weightKg) / (72 * v.scr);
      if (target === 'age') return 140 - (v.crcl * 72 * v.scr) / (0.85 * weightKg);
      if (target === 'weight') return ((v.crcl * 72 * v.scr) / (0.85 * (140 - v.age))) * 1000;
      if (target === 'scr') return 0.85 * ((140 - v.age) * weightKg) / (72 * v.crcl);
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: "Same equation as the male version, multiplied by 0.85 — a correction factor derived from the original 1976 study population, reflecting that women tend to have proportionally less muscle mass at the same weight, and therefore produce less creatinine per kilogram.",
      variables: {
        age: "The patient's age.",
        weight: "The patient's actual body weight.",
        scr: 'Serum creatinine concentration.',
        crcl: 'Estimated creatinine clearance.'
      },
      example: {
        problem: 'Determine the creatinine clearance for a 70-year-old female patient weighing 65 kg with a serum creatinine of 2 mg/dL.',
        steps: [
          { label: 'Step 1 — Apply the formula', math: 'CrCl = 0.85 \\times \\dfrac{(140 - \\text{age}) \\times \\text{weight}}{72 \\times SCr}' },
          { label: 'Step 2 — Substitute the known values', math: 'CrCl = 0.85 \\times \\dfrac{(140 - 70) \\times 65}{72 \\times 2}' },
          { label: 'Step 3 — Calculate', math: 'CrCl \\approx 0.85 \\times 31.6 \\approx 26.9\\ \\text{mL/min}' }
        ],
        conclusion: 'Estimated creatinine clearance is about 26.9 mL/min.'
      },
      tips: [
        'More recent data suggests the "true" optimal correction factor for women is closer to 0.84–0.88 — 0.85 remains standard for consistency with historical dosing guidelines.',
        'Same weight and creatinine-standardization caveats apply as the male version.'
      ]
    }
  },
  {
    id: 'sanaka-male',
    title: 'Sanaka Equation (Male)',
    category: 'renal-function',
    formulaText: 'CrCl = weight × [19 × albumin + 32] / (100 × SCr)',
    formulaLatex: 'CrCl = \\dfrac{\\text{weight} \\times [19 \\times \\text{albumin} + 32]}{100 \\times SCr}',
    description: 'Estimates creatinine clearance in elderly patients with reduced muscle mass, using serum albumin as a marker of muscle/nutritional status instead of relying on age alone.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'weight', label: 'Weight', unitType: 'mass', defaultUnit: 'kg' },
      { key: 'albumin', label: 'Plasma albumin (g/dL)', unitType: 'concentration', defaultUnit: 'gdL' },
      { key: 'scr', label: 'Serum creatinine, SCr (mg/dL)', unitType: 'concentration', defaultUnit: 'mgdL' },
      { key: 'crcl', label: 'CrCl (mL/min)', unitType: null }
    ],
    targets: ['crcl', 'weight', 'albumin', 'scr'],
    solve(v, target) {
      const weightKg = v.weight / 1000; // base unit is grams
      const albuminGdL = v.albumin / 1000; // concentration base is mg/dL; formula needs g/dL
      if (target === 'crcl') return (weightKg * (19 * albuminGdL + 32)) / (100 * v.scr);
      if (target === 'weight') return ((v.crcl * 100 * v.scr) / (19 * albuminGdL + 32)) * 1000;
      if (target === 'albumin') return (((v.crcl * 100 * v.scr) / weightKg - 32) / 19) * 1000;
      if (target === 'scr') return (weightKg * (19 * albuminGdL + 32)) / (100 * v.crcl);
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: "Standard equations like Cockcroft-Gault assume roughly normal muscle mass for a patient's age — an assumption that breaks down in elderly, bedridden, or chronically debilitated patients with muscle atrophy, causing those equations to overestimate true kidney function. Sanaka and colleagues (1996) found that serum albumin, which reflects overall nutritional and muscle status, could substitute for age as a better predictor in this specific population.",
      variables: {
        weight: "The patient's actual body weight.",
        albumin: 'Serum (plasma) albumin concentration — reflects nutritional/muscle status.',
        scr: 'Serum creatinine concentration.',
        crcl: 'Estimated creatinine clearance.'
      },
      example: {
        problem: 'Determine the creatinine clearance for an elderly male patient weighing 65 kg, with a plasma albumin of 2.9 g/dL and serum creatinine of 2 mg/dL.',
        steps: [
          { label: 'Step 1 — Apply the formula', math: 'CrCl = \\dfrac{\\text{weight} \\times [19 \\times \\text{albumin} + 32]}{100 \\times SCr}' },
          { label: 'Step 2 — Substitute the known values', math: 'CrCl = \\dfrac{65 \\times [19 \\times 2.9 + 32]}{100 \\times 2}' },
          { label: 'Step 3 — Calculate', math: 'CrCl \\approx \\dfrac{5661.5}{200} \\approx 28.3\\ \\text{mL/min}' }
        ],
        conclusion: 'Estimated creatinine clearance is about 28.3 mL/min.'
      },
      tips: [
        'This equation is specifically intended for elderly patients with suspected muscle atrophy — for a typical adult with normal muscle mass, Cockcroft-Gault remains the standard choice.',
        'Serum albumin can also drop due to illness, inflammation, or liver disease unrelated to muscle mass — interpret this equation with the full clinical picture in mind.'
      ]
    }
  },
  {
    id: 'sanaka-female',
    title: 'Sanaka Equation (Female)',
    category: 'renal-function',
    formulaText: 'CrCl = weight × [13 × albumin + 29] / (100 × SCr)',
    formulaLatex: 'CrCl = \\dfrac{\\text{weight} \\times [13 \\times \\text{albumin} + 29]}{100 \\times SCr}',
    description: 'The Sanaka equation for female patients with reduced muscle mass, using separately-derived coefficients from the same study.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'weight', label: 'Weight', unitType: 'mass', defaultUnit: 'kg' },
      { key: 'albumin', label: 'Plasma albumin (g/dL)', unitType: 'concentration', defaultUnit: 'gdL' },
      { key: 'scr', label: 'Serum creatinine, SCr (mg/dL)', unitType: 'concentration', defaultUnit: 'mgdL' },
      { key: 'crcl', label: 'CrCl (mL/min)', unitType: null }
    ],
    targets: ['crcl', 'weight', 'albumin', 'scr'],
    solve(v, target) {
      const weightKg = v.weight / 1000; // base unit is grams
      const albuminGdL = v.albumin / 1000; // concentration base is mg/dL; formula needs g/dL
      if (target === 'crcl') return (weightKg * (13 * albuminGdL + 29)) / (100 * v.scr);
      if (target === 'weight') return ((v.crcl * 100 * v.scr) / (13 * albuminGdL + 29)) * 1000;
      if (target === 'albumin') return (((v.crcl * 100 * v.scr) / weightKg - 29) / 13) * 1000;
      if (target === 'scr') return (weightKg * (13 * albuminGdL + 29)) / (100 * v.crcl);
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: "Same rationale as the male Sanaka equation — substituting serum albumin for age to better estimate kidney function in elderly patients with muscle atrophy — with coefficients derived separately from female patient data in the original study.",
      variables: {
        weight: "The patient's actual body weight.",
        albumin: 'Serum (plasma) albumin concentration.',
        scr: 'Serum creatinine concentration.',
        crcl: 'Estimated creatinine clearance.'
      },
      example: {
        problem: 'Determine the creatinine clearance for an elderly female patient weighing 60 kg, with a plasma albumin of 3.0 g/dL and serum creatinine of 1.5 mg/dL.',
        steps: [
          { label: 'Step 1 — Apply the formula', math: 'CrCl = \\dfrac{\\text{weight} \\times [13 \\times \\text{albumin} + 29]}{100 \\times SCr}' },
          { label: 'Step 2 — Substitute the known values', math: 'CrCl = \\dfrac{60 \\times [13 \\times 3.0 + 29]}{100 \\times 1.5}' },
          { label: 'Step 3 — Calculate', math: 'CrCl = \\dfrac{4080}{150} = 27.2\\ \\text{mL/min}' }
        ],
        conclusion: 'Estimated creatinine clearance is 27.2 mL/min.'
      },
      tips: [
        'Best reserved for elderly patients where muscle atrophy is suspected to be distorting age-based estimates — not intended as a general-purpose replacement for Cockcroft-Gault.',
        'As with the male version, other causes of low albumin (illness, inflammation) can affect the result independent of true muscle mass.'
      ]
    }
  },
  {
    id: 'schwartz-equation',
    title: 'Schwartz Equation (Pediatric)',
    category: 'renal-function',
    formulaText: 'CrCl = k × height / SCr',
    formulaLatex: 'CrCl = \\dfrac{k \\times \\text{height}}{SCr}',
    description: 'Estimates kidney function in infants, children, and adolescents from height and serum creatinine — the standard pediatric equivalent to Cockcroft-Gault.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'k', label: 'k (age/sex-specific constant)', unitType: null },
      { key: 'height', label: 'Height', unitType: 'length', defaultUnit: 'cm' },
      { key: 'scr', label: 'Serum creatinine, SCr (mg/dL)', unitType: 'concentration', defaultUnit: 'mgdL' },
      { key: 'crcl', label: 'CrCl (mL/min/1.73m²)', unitType: null }
    ],
    targets: ['crcl', 'k', 'height', 'scr'],
    solve(v, target) {
      const heightCm = v.height * 100; // base unit is m
      if (target === 'crcl') return (v.k * heightCm) / v.scr;
      if (target === 'k') return (v.crcl * v.scr) / heightCm;
      if (target === 'height') return ((v.k !== 0 ? (v.crcl * v.scr) / v.k : 0)) / 100;
      if (target === 'scr') return (v.k * heightCm) / v.crcl;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: "Children's muscle mass (and therefore creatinine production) scales with body length rather than age directly, which is why the pediatric Schwartz equation uses height instead of age or weight. The constant k adjusts for the fact that this relationship changes as children grow and as boys and girls diverge in muscle mass during adolescence.",
      variables: {
        k: 'A constant reflecting the relationship between body size and creatinine production for this age/sex group — see tips for standard values.',
        height: "The patient's height (or length, in infants).",
        scr: 'Serum creatinine concentration.',
        crcl: 'Estimated creatinine clearance, normalized to a standard 1.73 m² body surface area.'
      },
      example: {
        problem: 'A 10-year-old child has a height of 130 cm and a serum creatinine of 0.5 mg/dL. Using k = 0.55, estimate creatinine clearance.',
        steps: [
          { label: 'Step 1 — Apply the formula', math: 'CrCl = \\dfrac{k \\times \\text{height}}{SCr}' },
          { label: 'Step 2 — Substitute the known values', math: 'CrCl = \\dfrac{0.55 \\times 130}{0.5}' },
          { label: 'Step 3 — Calculate', math: 'CrCl = \\dfrac{71.5}{0.5} = 143\\ \\text{mL/min}' }
        ],
        conclusion: 'Estimated creatinine clearance is 143 mL/min/1.73m² — within the normal pediatric range.'
      },
      tips: [
        'Standard k values: 0.33 for preterm infants, 0.45 for full-term infants, 0.55 for children and adolescent girls, 0.70 for adolescent boys — choose based on the patient\'s age and sex.',
        'This equation assumes normal body habitus — it isn\'t reliable for children with significantly unusual muscle mass, malnutrition, or edema.'
      ]
    }
  },
  {
    id: 'adjusted-crcl',
    title: 'Adjusted CrCl',
    category: 'renal-function',
    formulaText: 'Adjusted CrCl = (BSA / 1.73) × CrCl',
    formulaLatex: '\\text{Adjusted CrCl} = \\dfrac{BSA}{1.73} \\times CrCl',
    description: "Converts a creatinine clearance normalized to standard body surface area (1.73 m²) into a value specific to this patient's actual size, or vice versa.",
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'bsa', label: 'BSA (m²)', unitType: null },
      { key: 'crcl', label: 'CrCl (mL/min/1.73m²)', unitType: null },
      { key: 'adjustedCrcl', label: 'Adjusted CrCl (mL/min)', unitType: null }
    ],
    targets: ['adjustedCrcl', 'bsa', 'crcl'],
    solve(v, target) {
      if (target === 'adjustedCrcl') return (v.bsa / 1.73) * v.crcl;
      if (target === 'bsa') return (v.adjustedCrcl / v.crcl) * 1.73;
      if (target === 'crcl') return v.adjustedCrcl / (v.bsa / 1.73);
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'Some creatinine clearance equations (notably Schwartz) report results normalized to a standard 1.73 m² body surface area, which allows fair comparison between patients of different sizes — but for actual drug dosing, what matters is the patient\'s real, non-normalized clearance. This calculator converts between the two using the patient\'s own measured BSA.',
      variables: {
        bsa: "The patient's own body surface area.",
        crcl: 'Creatinine clearance normalized to 1.73 m² (e.g. from the Schwartz equation).',
        adjustedCrcl: "The patient's actual (non-normalized) creatinine clearance."
      },
      example: {
        problem: 'A patient has a normalized CrCl of 90 mL/min/1.73m² and a measured BSA of 2.2 m². What is the adjusted CrCl?',
        steps: [
          { label: 'Step 1 — Apply the formula', math: '\\text{Adjusted CrCl} = \\dfrac{BSA}{1.73} \\times CrCl' },
          { label: 'Step 2 — Substitute the known values', math: '\\text{Adjusted CrCl} = \\dfrac{2.2}{1.73} \\times 90' },
          { label: 'Step 3 — Calculate', math: '\\text{Adjusted CrCl} \\approx 114.4\\ \\text{mL/min}' }
        ],
        conclusion: "After adjusting for this patient's larger-than-average body size, the clearance is about 114.4 mL/min."
      },
      tips: [
        'This step matters most for patients whose body size differs substantially from average — the correction is small for a BSA close to 1.73 m².',
        'Cockcroft-Gault and the Jelliffe/Sanaka equations already use actual patient data directly, so this adjustment step is mainly needed after a BSA-normalized result like Schwartz.'
      ]
    }
  }
];
