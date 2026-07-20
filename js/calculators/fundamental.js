/*
  fundamental.js
  --------------
  Category: fundamental concentration calculators.

  HOW TO ADD A NEW CALCULATOR (this is the only file you touch):
    1. Add a new object to CALCULATORS below.
    2. fields: the physical-quantity inputs/outputs (each gets a smart-field
       with unit conversion automatically, via unitType).
    3. molecule: true if "molecule name -> molecular weight" autofill applies.
    4. hasValency: true only if the calc needs an n-factor (e.g. Normality).
    5. targets: which fields the user may choose to "solve for".
    6. solve(values, target): values are ALWAYS in base units
       (g for mass, L for volume, mol/L etc. are plain numbers) regardless of
       what unit the user picked in the dropdown — write your math in base
       units and don't worry about unit conversion here.
   That's it — no other file needs to change.
*/

export const CALCULATORS = [
  {
    id: 'normality',
    title: 'Normality',
    category: 'fundamental',
    formulaText: 'N = (weight × valency) / (MW × volume)',
    formulaLatex: 'N = \\dfrac{\\text{weight} \\times \\text{valency}}{MW \\times \\text{volume}}',
    description: 'Concentration expressed in gram-equivalents per litre of solution.',
    molecule: true,
    hasValency: true,
    fields: [
      { key: 'weight', label: 'Weight of solute', unitType: 'mass', defaultUnit: 'g' },
      { key: 'volume', label: 'Volume of solution', unitType: 'volume', defaultUnit: 'L' },
      { key: 'normality', label: 'Normality (N)', unitType: null }
    ],
    targets: ['normality', 'weight', 'volume'],
    solve(v, target) {
      if (target === 'normality') return (v.weight * v.valency) / (v.mw * v.volume);
      if (target === 'weight') return (v.normality * v.mw * v.volume) / v.valency;
      if (target === 'volume') return (v.weight * v.valency) / (v.mw * v.normality);
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'Normality (N) expresses concentration as gram-equivalents of a reactive species per litre of solution, rather than in moles. Because it accounts for how many reactive units — H+, OH-, or electrons — each molecule contributes, it is the concentration unit most directly tied to how much a solution can actually react, which is why it shows up so often in acid-base titrations and redox reactions.',
      variables: {
        weight: 'Mass of the pure solute being dissolved, in grams.',
        volume: 'Total volume of the final solution (not just the water added), in litres.',
        normality: 'Concentration expressed in gram-equivalents per litre (eq/L).',
        mw: 'Molecular weight of the solute, in g/mol — used to convert mass into moles.',
        valency: "Number of reactive units each molecule contributes in the reaction of interest — e.g. replaceable H+ for an acid, OH- for a base, or electrons transferred in a redox reaction."
      },
      example: {
        problem: 'How many grams of potassium hydroxide (KOH) are needed to prepare 250 mL of a 0.2 N solution?',
        steps: [
          { label: 'Step 1 — Find the molecular weight', math: 'MW_{KOH} = 39.10 + 16.00 + 1.008 \\approx 56.11\\ \\text{g/mol}', note: 'KOH releases one hydroxide ion per molecule, so its valency here is 1.' },
          { label: 'Step 2 — Convert volume to litres', math: '250\\ \\text{mL} = 0.250\\ \\text{L}' },
          { label: 'Step 3 — Rearrange the formula to solve for weight', math: '\\text{weight} = \\dfrac{N \\times MW \\times \\text{volume}}{\\text{valency}}' },
          { label: 'Step 4 — Substitute the known values', math: '\\text{weight} = \\dfrac{0.2 \\times 56.11 \\times 0.250}{1}' },
          { label: 'Step 5 — Calculate', math: '\\text{weight} \\approx 2.81\\ \\text{g}' }
        ],
        conclusion: 'About 2.81 g of KOH, dissolved and made up to 250 mL with water, gives a 0.2 N solution.'
      },
      tips: [
        'Valency is not a fixed property of a compound — it depends on the reaction. Sulfuric acid (H2SO4) is valency 2 if both protons react, but valency 1 if only one does.',
        'Always use the volume of the final solution, not just the water added — dissolving a solid changes the total volume slightly.',
        'For a monoprotic acid or a base with a single hydroxide (like HCl or NaOH), Normality and Molarity are numerically identical.'
      ]
    }
  },
  {
    id: 'molarity',
    title: 'Molarity',
    category: 'fundamental',
    formulaText: 'M = weight / (MW × volume)',
    formulaLatex: 'M = \\dfrac{\\text{weight}}{MW \\times \\text{volume}}',
    description: 'Concentration expressed in moles of solute per litre of solution.',
    molecule: true,
    hasValency: false,
    fields: [
      { key: 'weight', label: 'Weight of solute', unitType: 'mass', defaultUnit: 'g' },
      { key: 'volume', label: 'Volume of solution', unitType: 'volume', defaultUnit: 'L' },
      { key: 'molarity', label: 'Molarity (mol/L)', unitType: null }
    ],
    targets: ['molarity', 'weight', 'volume'],
    solve(v, target) {
      if (target === 'molarity') return v.weight / (v.mw * v.volume);
      if (target === 'weight') return v.molarity * v.mw * v.volume;
      if (target === 'volume') return v.weight / (v.mw * v.molarity);
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'Molarity (M) expresses concentration as the number of moles of solute dissolved per litre of solution. It is the most widely used concentration unit in pharmacy and chemistry because it relates directly to the number of molecules present, which is what most reactions and molar-mass-based dosing calculations actually depend on.',
      variables: {
        weight: 'Mass of the pure solute being dissolved, in grams.',
        volume: 'Total volume of the final solution, in litres.',
        molarity: 'Concentration expressed in moles of solute per litre of solution (mol/L).',
        mw: 'Molecular weight of the solute, in g/mol — used to convert mass into moles.'
      },
      example: {
        problem: 'What is the molarity of a solution made by dissolving 4.5 g of glucose (C6H12O6) in enough water to make 500 mL of solution?',
        steps: [
          { label: 'Step 1 — Find the molecular weight', math: 'MW_{C_6H_{12}O_6} \\approx 180.16\\ \\text{g/mol}' },
          { label: 'Step 2 — Convert volume to litres', math: '500\\ \\text{mL} = 0.500\\ \\text{L}' },
          { label: 'Step 3 — Apply the molarity formula', math: 'M = \\dfrac{\\text{weight}}{MW \\times \\text{volume}}' },
          { label: 'Step 4 — Substitute the known values', math: 'M = \\dfrac{4.5}{180.16 \\times 0.500}' },
          { label: 'Step 5 — Calculate', math: 'M \\approx 0.05\\ \\text{mol/L}' }
        ],
        conclusion: 'The solution has a molarity of about 0.05 M (50 mM).'
      },
      tips: [
        'Molarity depends on the volume of the final solution, not the volume of solvent present before the solute dissolves.',
        "Unlike Normality, Molarity doesn't depend on how the substance reacts — it's simply moles per litre, regardless of valency.",
        'To convert Molarity to Normality, multiply by the valency for the reaction in question: N = M × valency.'
      ]
    }
  },
  {
    id: 'molality',
    title: 'Molality',
    category: 'fundamental',
    formulaText: 'm = (weight / MW) / mass of solvent (kg)',
    formulaLatex: 'm = \\dfrac{\\text{weight} / MW}{\\text{solvent mass (kg)}}',
    description: 'Concentration expressed in moles of solute per kilogram of solvent (independent of the solution\'s total volume).',
    molecule: true,
    hasValency: false,
    fields: [
      { key: 'weight', label: 'Weight of solute', unitType: 'mass', defaultUnit: 'g' },
      { key: 'solventMass', label: 'Mass of solvent', unitType: 'mass', defaultUnit: 'kg' },
      { key: 'molality', label: 'Molality (mol/kg)', unitType: null }
    ],
    targets: ['molality', 'weight', 'solventMass'],
    solve(v, target) {
      const solventKg = v.solventMass / 1000; // base unit is grams
      if (target === 'molality') return (v.weight / v.mw) / solventKg;
      if (target === 'weight') return v.molality * v.mw * solventKg;
      if (target === 'solventMass') return ((v.weight / v.mw) / v.molality) * 1000;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: "Molality (m) expresses concentration as moles of solute per kilogram of solvent, rather than per litre of solution. Because it's defined by mass rather than volume, molality doesn't change with temperature the way Molarity can (liquids expand and contract as they warm or cool, but mass doesn't), which is why it's preferred for precise physical-chemistry work like freezing-point depression or boiling-point elevation.",
      variables: {
        weight: 'Mass of the pure solute being dissolved, in grams.',
        solventMass: 'Mass of the solvent only (not the total solution), typically in kilograms.',
        molality: 'Concentration expressed in moles of solute per kilogram of solvent (mol/kg).',
        mw: 'Molecular weight of the solute, in g/mol — used to convert mass into moles.'
      },
      example: {
        problem: 'How many grams of urea (CH4N2O) must be dissolved in 250 g of water to prepare a 2 molal solution?',
        steps: [
          { label: 'Step 1 — Find the molecular weight', math: 'MW_{CH_4N_2O} \\approx 60.06\\ \\text{g/mol}' },
          { label: 'Step 2 — Convert solvent mass to kilograms', math: '250\\ \\text{g} = 0.250\\ \\text{kg}' },
          { label: 'Step 3 — Rearrange the formula to solve for weight', math: '\\text{weight} = m \\times MW \\times \\text{solvent mass (kg)}' },
          { label: 'Step 4 — Substitute the known values', math: '\\text{weight} = 2 \\times 60.06 \\times 0.250' },
          { label: 'Step 5 — Calculate', math: '\\text{weight} \\approx 30.0\\ \\text{g}' }
        ],
        conclusion: 'About 30.0 g of urea dissolved in the 250 g of water gives a 2 molal solution.'
      },
      tips: [
        "Molality uses the mass of solvent, not the mass or volume of the final solution — don't include the solute's own weight when measuring the solvent.",
        'Because it depends only on mass, molality is unaffected by temperature changes, unlike Molarity.',
        'For dilute aqueous solutions, Molality and Molarity are numerically close (since 1 L of water weighs almost exactly 1 kg), but they diverge for concentrated solutions or non-aqueous solvents.'
      ]
    }
  },
  {
    id: 'formality',
    title: 'Formality',
    category: 'fundamental',
    formulaText: 'F = weight / (MW × volume)',
    formulaLatex: 'F = \\dfrac{\\text{weight}}{MW \\times \\text{volume}}',
    description: 'Concentration expressed in formula weights of solute per litre — used for ionic compounds that fully dissociate, where "molecules" as such don\'t exist in solution.',
    molecule: true,
    hasValency: false,
    fields: [
      { key: 'weight', label: 'Weight of solute', unitType: 'mass', defaultUnit: 'g' },
      { key: 'volume', label: 'Volume of solution', unitType: 'volume', defaultUnit: 'L' },
      { key: 'formality', label: 'Formality (F)', unitType: null }
    ],
    targets: ['formality', 'weight', 'volume'],
    solve(v, target) {
      if (target === 'formality') return v.weight / (v.mw * v.volume);
      if (target === 'weight') return v.formality * v.mw * v.volume;
      if (target === 'volume') return v.weight / (v.mw * v.formality);
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: "Formality (F) expresses concentration in formula weights per litre of solution. It's numerically calculated exactly like Molarity, but the distinction matters conceptually: for a compound like NaCl that fully dissociates into ions in water, there's no intact \"NaCl molecule\" in solution to count — so chemists use the term formula weight (based on the empirical formula) rather than molecular weight, and Formality rather than Molarity, to describe how much of that formula unit was dissolved.",
      variables: {
        weight: 'Mass of the pure solute being dissolved, in grams.',
        volume: 'Total volume of the final solution, in litres.',
        formality: 'Concentration expressed in formula weights of solute per litre of solution (F).',
        mw: 'Formula weight of the solute, in g/mol — used to convert mass into formula units.'
      },
      example: {
        problem: 'What is the formality of a solution containing 5.844 g of sodium chloride (NaCl) in enough water to make 100 mL of solution?',
        steps: [
          { label: 'Step 1 — Find the formula weight', math: 'MW_{NaCl} \\approx 58.44\\ \\text{g/mol}' },
          { label: 'Step 2 — Convert volume to litres', math: '100\\ \\text{mL} = 0.100\\ \\text{L}' },
          { label: 'Step 3 — Apply the formality formula', math: 'F = \\dfrac{\\text{weight}}{MW \\times \\text{volume}}' },
          { label: 'Step 4 — Substitute the known values', math: 'F = \\dfrac{5.844}{58.44 \\times 0.100}' },
          { label: 'Step 5 — Calculate', math: 'F = 1.0' }
        ],
        conclusion: 'The solution has a formality of 1.0 F.'
      },
      tips: [
        "In everyday pharmacy calculations, Formality and Molarity are used interchangeably for most purposes — the distinction mainly matters in analytical/physical chemistry contexts where whether the compound stays intact in solution actually changes the chemistry.",
        'The calculation itself is identical to Molarity — only the interpretation of what MW represents differs.'
      ]
    }
  },
  {
    id: 'equivalent-weight',
    title: 'Equivalent Weight',
    category: 'fundamental',
    formulaText: 'Equivalent weight = MW / valence',
    formulaLatex: '\\text{Equivalent weight} = \\dfrac{MW}{\\text{valence}}',
    description: 'The mass of a substance that supplies or reacts with one mole of reactive units (e.g. one mole of H+, OH-, or charge).',
    molecule: true,
    hasValency: false,
    fields: [
      { key: 'valence', label: 'Valence', unitType: null },
      { key: 'equivalentWeight', label: 'Equivalent weight (g/eq)', unitType: null }
    ],
    targets: ['equivalentWeight', 'valence'],
    solve(v, target) {
      if (target === 'equivalentWeight') return v.mw / v.valence;
      if (target === 'valence') return v.mw / v.equivalentWeight;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: "Equivalent weight is the mass of a substance that provides or reacts with one mole of reactive units — one mole of replaceable H+ for an acid, one mole of OH- for a base, or one mole of charge for an ion. It's the bridge between a substance's molecular weight (a fixed property) and Normality (which depends on the reaction), which is why it appears directly inside the Normality formula.",
      variables: {
        valence: 'Number of reactive units (H+, OH-, or charge) supplied per molecule or ion.',
        equivalentWeight: 'Mass, in grams, that supplies one mole of reactive units (g/eq).',
        mw: 'Molecular weight of the substance, in g/mol.'
      },
      example: {
        problem: 'Calculate the equivalent weight of calcium chloride (CaCl2) given a valence of 2.',
        steps: [
          { label: 'Step 1 — Find the molecular weight', math: 'MW_{CaCl_2} \\approx 110.98\\ \\text{g/mol}' },
          { label: 'Step 2 — Apply the equivalent weight formula', math: '\\text{Equivalent weight} = \\dfrac{MW}{\\text{valence}}' },
          { label: 'Step 3 — Substitute the known values', math: '\\text{Equivalent weight} = \\dfrac{110.98}{2}' },
          { label: 'Step 4 — Calculate', math: '\\text{Equivalent weight} \\approx 55.49\\ \\text{g/eq}' }
        ],
        conclusion: 'One equivalent of CaCl2 weighs about 55.49 g.'
      },
      tips: [
        'Valence here means the same thing as the n-factor used in the Normality calculator — check the reaction in question, not just the formula, before assuming a value.',
        'For a monovalent ion or compound (valence 1), equivalent weight and molecular weight are the same number.'
      ]
    }
  },
  {
    id: 'mg-to-meq',
    title: 'mg to mEq',
    category: 'fundamental',
    formulaText: 'mEq = (mg × valence) / MW',
    formulaLatex: '\\text{mEq} = \\dfrac{\\text{mg} \\times \\text{valence}}{MW}',
    description: 'Converts a mass of an electrolyte to milliequivalents, the unit typically used for electrolyte replacement and IV fluid orders.',
    molecule: true,
    hasValency: false,
    fields: [
      { key: 'mg', label: 'Weight', unitType: 'mass', defaultUnit: 'mg' },
      { key: 'valence', label: 'Valence', unitType: null },
      { key: 'meq', label: 'mEq', unitType: null }
    ],
    targets: ['meq', 'mg', 'valence'],
    solve(v, target) {
      const mgValue = v.mg * 1000; // base unit is grams
      if (target === 'meq') return (mgValue * v.valence) / v.mw;
      if (target === 'mg') return ((v.meq * v.mw) / v.valence) / 1000;
      if (target === 'valence') return (v.meq * v.mw) / mgValue;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'Milliequivalents (mEq) express the amount of an electrolyte in terms of its charge-carrying capacity rather than its mass — which is what actually matters physiologically, since the body responds to electrolytes by charge and osmotic activity, not by weight. This is why IV fluid orders and electrolyte replacement doses are almost always written in mEq rather than mg.',
      variables: {
        mg: 'Mass of the electrolyte, typically in milligrams.',
        valence: 'Charge on the ion (e.g. 1 for Na+ or K+, 2 for Ca2+ or Mg2+).',
        meq: 'The equivalent electrolyte amount in milliequivalents.',
        mw: 'Molecular (or atomic) weight of the electrolyte, in g/mol.'
      },
      example: {
        problem: "A patient's order calls for 15 mEq of potassium chloride (KCl). How many milligrams is that?",
        steps: [
          { label: 'Step 1 — Find the molecular weight', math: 'MW_{KCl} \\approx 74.55\\ \\text{g/mol}' },
          { label: 'Step 2 — Rearrange the formula to solve for mg', math: '\\text{mg} = \\dfrac{\\text{mEq} \\times MW}{\\text{valence}}' },
          { label: 'Step 3 — Substitute the known values (valence of K+ is 1)', math: '\\text{mg} = \\dfrac{15 \\times 74.55}{1}' },
          { label: 'Step 4 — Calculate', math: '\\text{mg} \\approx 1118\\ \\text{mg}' }
        ],
        conclusion: '15 mEq of KCl is about 1118 mg (roughly 1.12 g).'
      },
      tips: [
        'For monovalent ions (Na+, K+, Cl-), 1 mEq and 1 mmol are the same amount — the conversion only changes for divalent or trivalent ions.',
        'Double-check the valence against the specific ion, not the whole salt, when a compound contains more than one type of charged species.'
      ]
    }
  },
  {
    id: 'meq-per-ml-to-mg-per-ml',
    title: 'mEq/mL to mg/mL',
    category: 'fundamental',
    formulaText: 'mg/mL = (mEq/mL × MW) / valence',
    formulaLatex: '\\text{mg/mL} = \\dfrac{(\\text{mEq/mL}) \\times MW}{\\text{valence}}',
    description: 'Converts an electrolyte concentration from mEq/mL to mg/mL, or back — useful when a product is labeled in one unit but dosed in the other.',
    molecule: true,
    hasValency: false,
    fields: [
      { key: 'meqPerMl', label: 'mEq/mL', unitType: null },
      { key: 'valence', label: 'Valence', unitType: null },
      { key: 'mgPerMl', label: 'mg/mL', unitType: null }
    ],
    targets: ['mgPerMl', 'meqPerMl', 'valence'],
    solve(v, target) {
      if (target === 'mgPerMl') return (v.meqPerMl * v.mw) / v.valence;
      if (target === 'meqPerMl') return (v.mgPerMl * v.valence) / v.mw;
      if (target === 'valence') return (v.meqPerMl * v.mw) / v.mgPerMl;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'Injectable electrolyte products are often labeled in mEq/mL (the clinically relevant unit), but compounding or verifying a preparation sometimes requires knowing the equivalent mass concentration in mg/mL. This calculator converts between the two directly.',
      variables: {
        meqPerMl: 'Electrolyte concentration expressed in milliequivalents per millilitre.',
        valence: 'Charge on the ion (e.g. 1 for Na+, 2 for Ca2+).',
        mgPerMl: 'Electrolyte concentration expressed in milligrams per millilitre.',
        mw: 'Molecular (or atomic) weight of the electrolyte, in g/mol.'
      },
      example: {
        problem: 'A calcium chloride injection is labeled as 1.36 mEq/mL. What is this in mg/mL? (Ca2+ has a valence of 2.)',
        steps: [
          { label: 'Step 1 — Find the molecular weight', math: 'MW_{CaCl_2} \\approx 110.98\\ \\text{g/mol}' },
          { label: 'Step 2 — Apply the formula', math: '\\text{mg/mL} = \\dfrac{\\text{mEq/mL} \\times MW}{\\text{valence}}' },
          { label: 'Step 3 — Substitute the known values', math: '\\text{mg/mL} = \\dfrac{1.36 \\times 110.98}{2}' },
          { label: 'Step 4 — Calculate', math: '\\text{mg/mL} \\approx 75.5\\ \\text{mg/mL}' }
        ],
        conclusion: 'The 1.36 mEq/mL calcium chloride injection is equivalent to about 75.5 mg/mL.'
      },
      tips: [
        'This is the same relationship as mg-to-mEq, just expressed per millilitre instead of as a total amount.',
        "Always confirm which salt form is on the label (e.g. calcium chloride vs. calcium gluconate) — they have different molecular weights and different valences of calcium delivered per mL."
      ]
    }
  },
  {
    id: 'ratio-proportion',
    title: 'Ratio & Proportion',
    category: 'fundamental',
    formulaText: 'a / b = c / d',
    formulaLatex: '\\dfrac{a}{b} = \\dfrac{c}{d}',
    description: 'Solves a proportion for any one of its four terms — the basis of most pharmaceutical dose and dilution conversions.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'a', label: 'a', unitType: null },
      { key: 'b', label: 'b', unitType: null },
      { key: 'c', label: 'c', unitType: null },
      { key: 'd', label: 'd', unitType: null }
    ],
    targets: ['a', 'b', 'c', 'd'],
    solve(v, target) {
      if (target === 'a') return (v.b * v.c) / v.d;
      if (target === 'b') return (v.a * v.d) / v.c;
      if (target === 'c') return (v.a * v.d) / v.b;
      if (target === 'd') return (v.b * v.c) / v.a;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'A proportion states that two ratios are equal — if you know a known quantity relates to another known quantity in a certain ratio, an unknown amount relates to a fourth quantity the same way. This is the underlying logic behind converting doses, scaling recipes, and most day-to-day pharmacy calculations, even when they\'re not written out as an explicit proportion.',
      variables: {
        a: 'First term of the known ratio (e.g. a quantity you were given).',
        b: 'Second term of the known ratio (e.g. what that quantity corresponds to).',
        c: 'First term of the unknown ratio (e.g. the new quantity in question).',
        d: 'Second term of the unknown ratio (the value being solved for, in the same units as b).'
      },
      example: {
        problem: 'If 3 tablets contain 975 mg of a drug, how many mg are in 8 tablets?',
        steps: [
          { label: 'Step 1 — Set up the proportion', math: '\\dfrac{3\\ \\text{tablets}}{975\\ \\text{mg}} = \\dfrac{8\\ \\text{tablets}}{d}' },
          { label: 'Step 2 — Cross-multiply', math: '3 \\times d = 975 \\times 8' },
          { label: 'Step 3 — Solve for d', math: 'd = \\dfrac{975 \\times 8}{3}' },
          { label: 'Step 4 — Calculate', math: 'd = 2600\\ \\text{mg}' }
        ],
        conclusion: '8 tablets contain 2600 mg of the drug.'
      },
      tips: [
        'Keep the units consistent within each ratio (a and c should be the same kind of quantity, and b and d should be the same kind of quantity) — the calculator only handles the arithmetic, not the units.',
        'Most dosage, dilution, and concentration conversions in pharmacy are proportions in disguise — if a formula feels unfamiliar, try writing it as a ratio first.'
      ]
    }
  },
  {
    id: 'percentage-error',
    title: 'Percentage Error',
    category: 'fundamental',
    formulaText: '% Error = (error / quantity desired) × 100',
    formulaLatex: '\\%\\ \\text{Error} = \\dfrac{\\text{error}}{\\text{quantity desired}} \\times 100',
    description: 'Expresses a measurement or weighing error as a percentage of the intended quantity — used to judge whether an error is within acceptable pharmaceutical tolerance.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'error', label: 'Error (deviation)', unitType: null },
      { key: 'quantityDesired', label: 'Quantity desired', unitType: null },
      { key: 'percentError', label: '% Error', unitType: null }
    ],
    targets: ['percentError', 'error', 'quantityDesired'],
    solve(v, target) {
      if (target === 'percentError') return (v.error / v.quantityDesired) * 100;
      if (target === 'error') return (v.percentError * v.quantityDesired) / 100;
      if (target === 'quantityDesired') return (v.error * 100) / v.percentError;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: "Every weighing or measuring device has a margin of error, and the same absolute error matters much more for a small quantity than a large one. Percentage error puts a measurement's deviation in context by expressing it relative to the intended quantity, which is how pharmacies judge whether a given balance or measuring device is suitable for a particular weighing.",
      variables: {
        error: 'The absolute deviation between the intended and actual quantity (same units as quantity desired).',
        quantityDesired: 'The amount that was actually intended to be weighed or measured.',
        percentError: 'The error expressed as a percentage of the quantity desired.'
      },
      example: {
        problem: 'A prescription calls for 0.5 g of a drug, but the balance used can only be trusted within ±0.02 g. What is the percentage error at this quantity?',
        steps: [
          { label: 'Step 1 — Apply the percentage error formula', math: '\\%\\ \\text{Error} = \\dfrac{\\text{error}}{\\text{quantity desired}} \\times 100' },
          { label: 'Step 2 — Substitute the known values', math: '\\%\\ \\text{Error} = \\dfrac{0.02}{0.5} \\times 100' },
          { label: 'Step 3 — Calculate', math: '\\%\\ \\text{Error} = 4\\%' }
        ],
        conclusion: 'Weighing 0.5 g on this balance carries a 4% potential error.'
      },
      tips: [
        'Most pharmacopeial standards treat a 5% error as the usual upper limit of acceptability for a compounded preparation — check your local standard rather than assuming this figure.',
        'The smaller the quantity being weighed relative to a balance\'s sensitivity, the larger the percentage error — this is why a "minimum weighable quantity" is defined for any given balance.'
      ]
    }
  },
  {
    id: 'percentage-wv',
    title: '% Weight-in-Volume (%w/v)',
    category: 'fundamental',
    formulaText: '%w/v = weight (g) / (volume (mL) / 100)',
    formulaLatex: '\\%\\ w/v = \\dfrac{\\text{weight (g)}}{\\text{volume (mL)}} \\times 100',
    description: 'Grams of solute per 100 mL of solution — the standard way strength is expressed for most liquid pharmaceutical preparations.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'weight', label: 'Weight of solute', unitType: 'mass', defaultUnit: 'g' },
      { key: 'volume', label: 'Volume of solution', unitType: 'volume', defaultUnit: 'mL' },
      { key: 'percent', label: '% w/v', unitType: null }
    ],
    targets: ['percent', 'weight', 'volume'],
    solve(v, target) {
      const volumeL = v.volume; // base unit is L
      if (target === 'percent') return v.weight / (10 * volumeL);
      if (target === 'weight') return v.percent * 10 * volumeL;
      if (target === 'volume') return v.weight / (10 * v.percent);
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: '%w/v (weight-in-volume) states how many grams of solute are dissolved in every 100 mL of the finished solution. It\'s the most common way liquid drug strengths are labeled — for example, a "5% dextrose" IV bag means 5 g of dextrose per 100 mL of solution.',
      variables: {
        weight: 'Mass of the pure solute in the solution, in grams.',
        volume: 'Total volume of the final solution.',
        percent: 'Strength expressed as grams of solute per 100 mL of solution (%w/v).'
      },
      example: {
        problem: 'How many grams of dextrose are needed to prepare 500 mL of a 5% w/v dextrose solution?',
        steps: [
          { label: 'Step 1 — Rearrange the formula to solve for weight', math: '\\text{weight} = \\%w/v \\times \\dfrac{\\text{volume (mL)}}{100}' },
          { label: 'Step 2 — Substitute the known values', math: '\\text{weight} = 5 \\times \\dfrac{500}{100}' },
          { label: 'Step 3 — Calculate', math: '\\text{weight} = 25\\ \\text{g}' }
        ],
        conclusion: '25 g of dextrose, dissolved and made up to 500 mL, gives a 5% w/v solution.'
      },
      tips: [
        '%w/v always refers to the volume of the finished solution, never the volume of solvent used to get there.',
        'Because it mixes a mass unit (g) with a volume unit (mL), %w/v is not a pure ratio the way %w/w or %v/v are — the "100" in the formula is doing real unit-conversion work, not just scaling.'
      ]
    }
  },
  {
    id: 'percentage-ww',
    title: '% Weight-in-Weight (%w/w)',
    category: 'fundamental',
    formulaText: '%w/w = (weight of solute / weight of solution) × 100',
    formulaLatex: '\\%\\ w/w = \\dfrac{\\text{weight of solute}}{\\text{weight of solution}} \\times 100',
    description: 'Grams of solute per 100 g of the total solution or mixture — common for ointments, creams, and other semisolids.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'weightSolute', label: 'Weight of solute', unitType: 'mass', defaultUnit: 'g' },
      { key: 'weightSolution', label: 'Weight of solution', unitType: 'mass', defaultUnit: 'g' },
      { key: 'percent', label: '% w/w', unitType: null }
    ],
    targets: ['percent', 'weightSolute', 'weightSolution'],
    solve(v, target) {
      if (target === 'percent') return (v.weightSolute / v.weightSolution) * 100;
      if (target === 'weightSolute') return (v.percent * v.weightSolution) / 100;
      if (target === 'weightSolution') return (v.weightSolute * 100) / v.percent;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: '%w/w (weight-in-weight) states how many grams of an ingredient are present in every 100 g of the total preparation. It\'s the standard way strength is expressed for semisolids like ointments and creams, where measuring by volume isn\'t practical or accurate.',
      variables: {
        weightSolute: 'Mass of the active ingredient or component being measured, in grams.',
        weightSolution: 'Total mass of the finished preparation (all ingredients combined), in grams.',
        percent: 'Strength expressed as grams of that ingredient per 100 g of total preparation (%w/w).'
      },
      example: {
        problem: 'A cream is prepared by combining 3 g of a drug with enough base to make 60 g of cream. What is the %w/w strength?',
        steps: [
          { label: 'Step 1 — Apply the formula', math: '\\%w/w = \\dfrac{\\text{weight of solute}}{\\text{weight of solution}} \\times 100' },
          { label: 'Step 2 — Substitute the known values', math: '\\%w/w = \\dfrac{3}{60} \\times 100' },
          { label: 'Step 3 — Calculate', math: '\\%w/w = 5\\%' }
        ],
        conclusion: 'The cream is a 5% w/w preparation.'
      },
      tips: [
        'Because both quantities are masses, %w/w is a true, unit-consistent ratio — no conversion factor is needed, unlike %w/v.',
        'The "weight of solution" is the total finished weight, including the active ingredient itself, not just the base or vehicle added to it.'
      ]
    }
  },
  {
    id: 'percentage-vv',
    title: '% Volume-in-Volume (%v/v)',
    category: 'fundamental',
    formulaText: '%v/v = (volume of solute / volume of solution) × 100',
    formulaLatex: '\\%\\ v/v = \\dfrac{\\text{volume of solute}}{\\text{volume of solution}} \\times 100',
    description: 'Millilitres of solute per 100 mL of the total solution — used when both the solute and the solution are liquids.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'volumeSolute', label: 'Volume of solute', unitType: 'volume', defaultUnit: 'mL' },
      { key: 'volumeSolution', label: 'Volume of solution', unitType: 'volume', defaultUnit: 'mL' },
      { key: 'percent', label: '% v/v', unitType: null }
    ],
    targets: ['percent', 'volumeSolute', 'volumeSolution'],
    solve(v, target) {
      if (target === 'percent') return (v.volumeSolute / v.volumeSolution) * 100;
      if (target === 'volumeSolute') return (v.percent * v.volumeSolution) / 100;
      if (target === 'volumeSolution') return (v.volumeSolute * 100) / v.percent;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: '%v/v (volume-in-volume) states how many millilitres of one liquid are present in every 100 mL of the total solution. It\'s used specifically when both the solute and the solvent are liquids — most commonly for alcohol content, since ethanol and water don\'t simply add their volumes together when mixed.',
      variables: {
        volumeSolute: 'Volume of the liquid ingredient being measured.',
        volumeSolution: 'Total volume of the finished solution.',
        percent: 'Strength expressed as mL of that liquid per 100 mL of total solution (%v/v).'
      },
      example: {
        problem: 'A solution contains 40 mL of alcohol in a total of 200 mL of solution. What is its %v/v strength?',
        steps: [
          { label: 'Step 1 — Apply the formula', math: '\\%v/v = \\dfrac{\\text{volume of solute}}{\\text{volume of solution}} \\times 100' },
          { label: 'Step 2 — Substitute the known values', math: '\\%v/v = \\dfrac{40}{200} \\times 100' },
          { label: 'Step 3 — Calculate', math: '\\%v/v = 20\\%' }
        ],
        conclusion: 'The solution is 20% v/v.'
      },
      tips: [
        'For alcohol-water mixtures specifically, volumes aren\'t strictly additive (mixing 50 mL alcohol with 50 mL water gives slightly less than 100 mL total) — %v/v strength is still defined by the volume of the finished solution, not the sum of the starting volumes.',
        'Like %w/w, %v/v is a true same-unit ratio, so no conversion factor is needed in the formula.'
      ]
    }
  },
  {
    id: 'dilution',
    title: 'Dilution (Q1C1 = Q2C2)',
    category: 'fundamental',
    formulaText: 'Q1 × C1 = Q2 × C2',
    formulaLatex: 'Q_1 \\times C_1 = Q_2 \\times C_2',
    description: 'Relates the strength and quantity of a stock preparation to the strength and quantity of the diluted preparation made from it.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'q1', label: 'Q1 — starting quantity', unitType: 'volume', defaultUnit: 'mL' },
      { key: 'c1', label: 'C1 — starting strength (%)', unitType: null },
      { key: 'q2', label: 'Q2 — final quantity', unitType: 'volume', defaultUnit: 'mL' },
      { key: 'c2', label: 'C2 — final strength (%)', unitType: null }
    ],
    targets: ['q1', 'c1', 'q2', 'c2'],
    solve(v, target) {
      if (target === 'q1') return (v.q2 * v.c2) / v.c1;
      if (target === 'c1') return (v.q2 * v.c2) / v.q1;
      if (target === 'q2') return (v.q1 * v.c1) / v.c2;
      if (target === 'c2') return (v.q1 * v.c1) / v.q2;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'When a stock (concentrated) preparation is diluted, the total amount of active ingredient stays the same — only the volume and strength change, trading one for the other. Q1C1 = Q2C2 captures that: whatever quantity was "concentrated" into the small starting volume is the same quantity now spread through the larger final volume.',
      variables: {
        q1: 'Quantity (volume or weight) of the starting, more concentrated preparation.',
        c1: 'Strength of the starting preparation (e.g. as a percentage).',
        q2: 'Quantity (volume or weight) of the final, diluted preparation.',
        c2: 'Strength of the final, diluted preparation, in the same terms as C1.'
      },
      example: {
        problem: 'How many mL of a 15% w/v stock solution are needed to prepare 1000 mL of a 3% w/v solution?',
        steps: [
          { label: 'Step 1 — Rearrange the formula to solve for Q1', math: 'Q_1 = \\dfrac{Q_2 \\times C_2}{C_1}' },
          { label: 'Step 2 — Substitute the known values', math: 'Q_1 = \\dfrac{1000 \\times 3}{15}' },
          { label: 'Step 3 — Calculate', math: 'Q_1 = 200\\ \\text{mL}' }
        ],
        conclusion: 'Measure 200 mL of the 15% stock solution and dilute it up to 1000 mL total to get a 3% solution.'
      },
      tips: [
        'Q1 and Q2 must be in the same units as each other, and C1/C2 must be in the same units/terms as each other — but the two pairs don\'t need to match each other (e.g. quantities in mL, strengths in %).',
        'This same relationship works for solids being diluted with an inert powder, not just liquids — Q can be a weight instead of a volume.'
      ]
    }
  },
  {
    id: 'number-of-doses',
    title: 'Number of Doses',
    category: 'fundamental',
    formulaText: 'Number of doses = total quantity / size of one dose',
    formulaLatex: '\\text{Number of doses} = \\dfrac{\\text{total quantity}}{\\text{size of one dose}}',
    description: 'How many individual doses can be measured out of a total prepared quantity.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'totalQuantity', label: 'Total quantity', unitType: 'mass', defaultUnit: 'g' },
      { key: 'doseSize', label: 'Size of one dose', unitType: 'mass', defaultUnit: 'mg' },
      { key: 'numberOfDoses', label: 'Number of doses', unitType: null }
    ],
    targets: ['numberOfDoses', 'totalQuantity', 'doseSize'],
    solve(v, target) {
      if (target === 'numberOfDoses') return v.totalQuantity / v.doseSize;
      if (target === 'totalQuantity') return v.numberOfDoses * v.doseSize;
      if (target === 'doseSize') return v.totalQuantity / v.numberOfDoses;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'A simple but essential calculation: given a bulk prepared quantity and the size of an individual dose, how many doses can actually be measured out of it. It\'s used both when compounding (how much bulk powder or liquid to prepare) and when dispensing (how many doses remain in a container).',
      variables: {
        totalQuantity: 'The total amount of preparation available.',
        doseSize: 'The amount given in a single dose, in the same kind of unit as the total quantity.',
        numberOfDoses: 'How many individual doses the total quantity yields.'
      },
      example: {
        problem: 'A bulk container holds 30 g of a drug powder. If each dose is 500 mg, how many doses does the container hold?',
        steps: [
          { label: 'Step 1 — Apply the formula', math: '\\text{Number of doses} = \\dfrac{\\text{total quantity}}{\\text{size of one dose}}' },
          { label: 'Step 2 — Substitute the known values (30 g = 30,000 mg)', math: '\\text{Number of doses} = \\dfrac{30{,}000\\ \\text{mg}}{500\\ \\text{mg}}' },
          { label: 'Step 3 — Calculate', math: '\\text{Number of doses} = 60' }
        ],
        conclusion: 'The 30 g container holds 60 doses of 500 mg each.'
      },
      tips: [
        'The total quantity and dose size just need to be the same kind of measurement (both mass, or both volume) — pick whichever unit is convenient using the dropdowns, the calculator converts automatically.',
        'This calculation assumes doses are measured exactly and nothing is lost in preparation — real yields are often slightly lower.'
      ]
    }
  }
];
