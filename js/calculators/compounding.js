/*
  compounding.js
  --------------
  Category: compounding — weighing accuracy, patient compliance, and
  isotonicity adjustments. Same pattern as fundamental.js: add a calculator
  by adding one object below; nothing else needs to change.
*/

export const CALCULATORS = [
  {
    id: 'smallest-quantity-weighable',
    title: 'Smallest Quantity Weighable',
    category: 'compounding',
    formulaText: 'SQW = (100 × sensitivity) / acceptable error %',
    formulaLatex: 'SQW = \\dfrac{100 \\times \\text{sensitivity}}{\\text{acceptable error \\%}}',
    description: 'The smallest amount that can be weighed on a given balance while staying within an acceptable margin of error.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'sensitivity', label: 'Sensitivity requirement', unitType: 'mass', defaultUnit: 'mg' },
      { key: 'errorPercent', label: 'Acceptable error (%)', unitType: null },
      { key: 'sqw', label: 'Smallest quantity weighable', unitType: 'mass', defaultUnit: 'mg' }
    ],
    targets: ['sqw', 'sensitivity', 'errorPercent'],
    solve(v, target) {
      if (target === 'sqw') return (100 * v.sensitivity) / v.errorPercent;
      if (target === 'sensitivity') return (v.sqw * v.errorPercent) / 100;
      if (target === 'errorPercent') return (100 * v.sensitivity) / v.sqw;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: "Every balance has a sensitivity requirement — the smallest additional weight needed to move the pointer or reading by one division. Below that, the balance simply can't detect the difference. Since the same absolute error matters far more for a small weighing than a large one, pharmacopeial standards define an acceptable percentage error (commonly 5%), and together these two numbers define the smallest quantity that balance can weigh reliably. Anything smaller has to be weighed indirectly, usually via the aliquot method (weighing a larger, diluted portion instead).",
      variables: {
        sensitivity: "The balance's sensitivity requirement — the smallest weight change it can detect.",
        errorPercent: 'The maximum acceptable percentage error for the weighing (often 5%, per pharmacopeial standard — check your local requirement).',
        sqw: 'The smallest quantity that can be weighed on this balance within that acceptable error.'
      },
      example: {
        problem: 'A balance has a sensitivity requirement of 6 mg. What is the smallest quantity it can weigh with no more than 5% error?',
        steps: [
          { label: 'Step 1 — Apply the formula', math: 'SQW = \\dfrac{100 \\times \\text{sensitivity}}{\\text{acceptable error \\%}}' },
          { label: 'Step 2 — Substitute the known values', math: 'SQW = \\dfrac{100 \\times 6}{5}' },
          { label: 'Step 3 — Calculate', math: 'SQW = 120\\ \\text{mg}' }
        ],
        conclusion: 'This balance can weigh quantities as small as 120 mg within 5% error. Anything smaller needs an aliquot or a more sensitive balance.'
      },
      tips: [
        "If the amount you need is below the SQW, don't weigh it directly — weigh a larger multiple of it mixed with an inert diluent, then take a fractional (aliquot) portion of that mixture.",
        'Sensitivity requirement is a fixed property of a specific balance — check its documentation or have it tested, rather than assuming a value.'
      ]
    }
  },
  {
    id: 'compliance-rate',
    title: 'Compliance Rate',
    category: 'compounding',
    formulaText: '% Compliance = (days supply / days since last refill) × 100',
    formulaLatex: '\\%\\ \\text{Compliance} = \\dfrac{\\text{days supply}}{\\text{days since last refill}} \\times 100',
    description: "A measure of how closely a patient's actual refill pattern matches how the medication was supposed to last.",
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'daysSupply', label: 'Days supply dispensed', unitType: 'time', defaultUnit: 'day' },
      { key: 'refillInterval', label: 'Days since last refill', unitType: 'time', defaultUnit: 'day' },
      { key: 'compliance', label: '% Compliance', unitType: null }
    ],
    targets: ['compliance', 'daysSupply', 'refillInterval'],
    solve(v, target) {
      if (target === 'compliance') return (v.daysSupply / v.refillInterval) * 100;
      if (target === 'daysSupply') return (v.compliance * v.refillInterval) / 100;
      if (target === 'refillInterval') return (v.daysSupply * 100) / v.compliance;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: "If a patient is dispensed a 30-day supply but doesn't return for a refill until day 45, they were without medication coverage for part of that time (or were taking it less often than prescribed). Compliance rate captures this as a simple percentage — 100% means the patient refilled exactly when the supply should have run out.",
      variables: {
        daysSupply: 'The number of days the dispensed quantity was intended to last.',
        refillInterval: 'The actual number of days that passed before the next refill.',
        compliance: "The patient's refill compliance, as a percentage."
      },
      example: {
        problem: 'A patient received a 30-day supply of medication but returned for a refill after 45 days. What is the compliance rate?',
        steps: [
          { label: 'Step 1 — Apply the formula', math: '\\%\\ \\text{Compliance} = \\dfrac{\\text{days supply}}{\\text{days since last refill}} \\times 100' },
          { label: 'Step 2 — Substitute the known values', math: '\\%\\ \\text{Compliance} = \\dfrac{30}{45} \\times 100' },
          { label: 'Step 3 — Calculate', math: '\\%\\ \\text{Compliance} \\approx 66.7\\%' }
        ],
        conclusion: 'A 66.7% compliance rate suggests the patient had gaps in medication coverage, or was taking doses less frequently than prescribed.'
      },
      tips: [
        'A compliance rate over 100% (refilling before the supply should have run out) can indicate early refills, lost medication, or a dosing change — worth a conversation with the patient.',
        'This is a simple ratio and doesn\'t distinguish between "ran out and went without" versus "spread the doses out" — both produce the same number.'
      ]
    }
  },
  {
    id: 'simple-isotonic-solution',
    title: 'Simple Isotonic Solution (Freezing-Point Method)',
    category: 'compounding',
    formulaText: 'Grams of solute = (0.52 × MW) / (1.86 × i)',
    formulaLatex: '\\text{Grams of solute} = \\dfrac{0.52 \\times MW}{1.86 \\times i}',
    description: "How much of a given substance, used alone, would make a solution isotonic with body fluid (whose freezing point is depressed by 0.52°C relative to water).",
    molecule: true,
    hasValency: false,
    fields: [
      { key: 'iFactor', label: 'i factor (dissociation)', unitType: null },
      { key: 'grams', label: 'Grams of solute required', unitType: 'mass', defaultUnit: 'g' }
    ],
    targets: ['grams', 'iFactor'],
    solve(v, target) {
      if (target === 'grams') return (0.52 * v.mw) / (1.86 * v.iFactor);
      if (target === 'iFactor') return (0.52 * v.mw) / (1.86 * v.grams);
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'Body fluids (like blood or tears) freeze at about -0.52°C. Any solution that also freezes at -0.52°C exerts the same osmotic pressure and is therefore isotonic with the body — won\'t cause cells to swell or shrink. 1.86 is the freezing-point depression of a 1-molal ideal (non-dissociating) solution; dividing by the dissociation factor (i) accounts for substances that split into multiple particles in solution.',
      variables: {
        iFactor: 'The number of particles the substance dissociates into in solution (1 for a non-electrolyte like glucose, roughly 2 for a 1:1 electrolyte like NaCl).',
        grams: 'Grams of the substance, used alone, needed to make an isotonic solution (specifics depend on the volume being prepared).',
        mw: 'Molecular weight of the substance, in g/mol.'
      },
      example: {
        problem: 'How many grams of glucose (MW 180, i = 1, a non-electrolyte) would be needed, used alone, to prepare an isotonic solution?',
        steps: [
          { label: 'Step 1 — Apply the formula', math: '\\text{Grams} = \\dfrac{0.52 \\times MW}{1.86 \\times i}' },
          { label: 'Step 2 — Substitute the known values', math: '\\text{Grams} = \\dfrac{0.52 \\times 180}{1.86 \\times 1}' },
          { label: 'Step 3 — Calculate', math: '\\text{Grams} \\approx 50.3\\ \\text{g}' }
        ],
        conclusion: 'About 50.3 g of glucose, used alone per litre, would make an isotonic solution.'
      },
      tips: [
        'The i factor depends on how completely and into how many particles the substance dissociates — a weak electrolyte will have an i factor between 1 and its theoretical maximum.',
        'This method gives the concentration for the drug alone; in practice a formulation often already contains some tonicity contribution from the active drug, and the NaCl Equivalent method is used to figure out how much additional NaCl (or other adjusting agent) is needed to reach isotonicity.'
      ]
    }
  },
  {
    id: 'nacl-equivalent',
    title: 'NaCl Equivalent (E-value)',
    category: 'compounding',
    formulaText: 'E = (58.5 / 1.8) × (i / MW)',
    formulaLatex: 'E = \\dfrac{58.5}{1.8} \\times \\dfrac{i}{MW}',
    description: 'The E-value states how many grams of NaCl produce the same osmotic effect as 1 g of a given drug — the standard tool for tonicity-adjusting a compounded formulation.',
    molecule: true,
    hasValency: false,
    fields: [
      { key: 'iFactor', label: 'i factor (dissociation)', unitType: null },
      { key: 'eValue', label: 'E-value (NaCl equivalent)', unitType: null }
    ],
    targets: ['eValue', 'iFactor'],
    solve(v, target) {
      if (target === 'eValue') return (58.5 / 1.8) * (v.iFactor / v.mw);
      if (target === 'iFactor') return (v.eValue * v.mw) / (58.5 / 1.8);
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: "The E-value compares a drug's osmotic contribution directly against NaCl, the reference substance most tonicity work is built around. An E-value of 0.36 means 1 g of the drug has the same osmotic effect as 0.36 g of NaCl — which lets a pharmacist figure out how much additional NaCl (or another adjusting agent) is needed to bring a formulation up to isotonic strength.",
      variables: {
        iFactor: 'The number of particles the substance dissociates into in solution.',
        eValue: 'Grams of NaCl that produce the same osmotic effect as 1 g of this substance.',
        mw: 'Molecular weight of the substance, in g/mol.'
      },
      example: {
        problem: 'Calculate the E-value for a drug with a molecular weight of 180 and an i factor of 2.',
        steps: [
          { label: 'Step 1 — Apply the formula', math: 'E = \\dfrac{58.5}{1.8} \\times \\dfrac{i}{MW}' },
          { label: 'Step 2 — Substitute the known values', math: 'E = \\dfrac{58.5}{1.8} \\times \\dfrac{2}{180}' },
          { label: 'Step 3 — Calculate', math: 'E \\approx 0.36' }
        ],
        conclusion: '1 g of this drug has the same osmotic effect as about 0.36 g of NaCl.'
      },
      tips: [
        'Once you have the E-value, the Volume to Render Solution Isotonic calculator uses it directly to find how much water (or how much additional NaCl) a formulation needs.',
        'E-values for many common drugs are already published in reference tables — this calculator is most useful when a drug isn\'t listed and you have its MW and dissociation factor.'
      ]
    }
  },
  {
    id: 'volume-to-render-isotonic',
    title: 'Volume to Render Solution Isotonic',
    category: 'compounding',
    formulaText: 'Water required = (amount × E-value) / 0.009',
    formulaLatex: '\\text{Water required} = \\dfrac{\\text{amount} \\times E}{0.009}',
    description: 'Given a drug\'s E-value, finds how much water is needed to dissolve it into an isotonic solution (using the fact that a 0.9% NaCl solution — 0.009 g/mL — is isotonic).',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'amount', label: 'Amount of drug', unitType: 'mass', defaultUnit: 'g' },
      { key: 'eValue', label: 'E-value (NaCl equivalent)', unitType: null },
      { key: 'water', label: 'Water required', unitType: 'volume', defaultUnit: 'mL' }
    ],
    targets: ['water', 'amount', 'eValue'],
    solve(v, target) {
      const waterMl = v.water * 1000; // base unit is L
      const amountG = v.amount;       // base unit is g
      if (target === 'water') return ((amountG * v.eValue) / 0.009) / 1000;
      if (target === 'amount') return (waterMl * 0.009) / v.eValue;
      if (target === 'eValue') return (waterMl * 0.009) / amountG;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'A 0.9% w/v NaCl solution (0.009 g of NaCl per mL of water) is isotonic with body fluid — that\'s the reference point this calculator works from. Once a drug\'s E-value states how much NaCl-equivalent osmotic effect it contributes, this formula finds exactly how much water that amount of drug needs to be dissolved in to land at that same 0.9% isotonic reference point.',
      variables: {
        amount: 'The weighed amount of the drug being dissolved.',
        eValue: "The drug's E-value (grams of NaCl-equivalent per gram of drug) — from the NaCl Equivalent calculator or a reference table.",
        water: 'The volume of water needed to make this amount of drug isotonic.'
      },
      example: {
        problem: 'How much water is needed to make 1 g of a drug with an E-value of 0.18 into an isotonic solution?',
        steps: [
          { label: 'Step 1 — Apply the formula', math: '\\text{Water} = \\dfrac{\\text{amount} \\times E}{0.009}' },
          { label: 'Step 2 — Substitute the known values', math: '\\text{Water} = \\dfrac{1 \\times 0.18}{0.009}' },
          { label: 'Step 3 — Calculate', math: '\\text{Water} = 20\\ \\text{mL}' }
        ],
        conclusion: 'Dissolving 1 g of this drug in 20 mL of water gives an isotonic solution.'
      },
      tips: [
        'If the prescribed volume is larger than this calculated "isotonic volume," the difference is made isotonic by adding NaCl (or another tonicity agent) — this calculator gives the starting reference point, not the final compounding instructions.',
        'This method assumes the E-value already accounts for the drug\'s own dissociation — double check the E-value\'s source before combining it here.'
      ]
    }
  }
];
