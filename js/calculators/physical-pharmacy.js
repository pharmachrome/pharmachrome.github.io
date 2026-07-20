/*
  physical-pharmacy.js
  --------------------
  Category: physical pharmacy — density, specific gravity/volume, and
  osmolar concentration calculations.
*/

export const CALCULATORS = [
  {
    id: 'density',
    title: 'Density',
    category: 'physical-pharmacy',
    formulaText: 'Density = mass / volume',
    formulaLatex: '\\text{Density} = \\dfrac{\\text{mass}}{\\text{volume}}',
    description: 'Mass per unit volume of a substance, usually expressed in g/mL.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'mass', label: 'Mass', unitType: 'mass', defaultUnit: 'g' },
      { key: 'volume', label: 'Volume', unitType: 'volume', defaultUnit: 'mL' },
      { key: 'density', label: 'Density (g/mL)', unitType: null }
    ],
    targets: ['density', 'mass', 'volume'],
    solve(v, target) {
      const volumeMl = v.volume * 1000; // base unit is L
      if (target === 'density') return v.mass / volumeMl;
      if (target === 'mass') return v.density * volumeMl;
      if (target === 'volume') return (v.mass / v.density) / 1000;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: "Density describes how much mass is packed into a given volume — a physical property unique to each substance and its physical state (a solid, its melt, and its vapor all have different densities). It's the conversion factor between weighing a liquid and knowing its volume, which is why it comes up whenever a liquid ingredient is measured by one but dosed by the other.",
      variables: {
        mass: 'Mass of the substance.',
        volume: 'Volume occupied by that mass.',
        density: 'Mass per unit volume (g/mL).'
      },
      example: {
        problem: 'If 10 mL of sulfuric acid weighs 18 g, what is its density?',
        steps: [
          { label: 'Step 1 — Apply the formula', math: '\\text{Density} = \\dfrac{\\text{mass}}{\\text{volume}}' },
          { label: 'Step 2 — Substitute the known values', math: '\\text{Density} = \\dfrac{18\\ \\text{g}}{10\\ \\text{mL}}' },
          { label: 'Step 3 — Calculate', math: '\\text{Density} = 1.8\\ \\text{g/mL}' }
        ],
        conclusion: 'The sulfuric acid has a density of 1.8 g/mL.'
      },
      tips: [
        'Density changes with temperature (most substances expand slightly when warmed), so precise work specifies the temperature the density was measured at.',
        'Specific gravity (a separate calculator) is closely related — it\'s density expressed relative to water rather than in absolute units.'
      ]
    }
  },
  {
    id: 'specific-gravity',
    title: 'Specific Gravity',
    category: 'physical-pharmacy',
    formulaText: 'Specific gravity = weight of substance / weight of an equal volume of water',
    formulaLatex: '\\text{Specific Gravity} = \\dfrac{\\text{weight of substance}}{\\text{weight of equal volume of water}}',
    description: "A substance's weight relative to the weight of the same volume of water — a dimensionless number that doubles as a substance's density in g/mL, since water weighs almost exactly 1 g/mL.",
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'substanceWeight', label: 'Weight of substance', unitType: 'mass', defaultUnit: 'g' },
      { key: 'waterWeight', label: 'Weight of equal volume of water', unitType: 'mass', defaultUnit: 'g' },
      { key: 'sg', label: 'Specific gravity', unitType: null }
    ],
    targets: ['sg', 'substanceWeight', 'waterWeight'],
    solve(v, target) {
      if (target === 'sg') return v.substanceWeight / v.waterWeight;
      if (target === 'substanceWeight') return v.sg * v.waterWeight;
      if (target === 'waterWeight') return v.substanceWeight / v.sg;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'Specific gravity compares a substance to a standard — water, for liquids and solids (hydrogen is used for gases). Because water\'s density is almost exactly 1 g/mL, specific gravity is numerically nearly identical to density in g/mL, but is itself a pure ratio with no units, which makes it convenient for reagent labels and pharmacopeial tables.',
      variables: {
        substanceWeight: 'Weight of the substance being measured.',
        waterWeight: 'Weight of an equal volume of water (i.e. the same container, filled with water instead).',
        sg: 'Specific gravity — a dimensionless ratio.'
      },
      example: {
        problem: 'If 54.96 mL of an oil weighs 52.78 g, what is its specific gravity? (54.96 mL of water weighs 54.96 g.)',
        steps: [
          { label: 'Step 1 — Apply the formula', math: '\\text{Specific Gravity} = \\dfrac{\\text{weight of substance}}{\\text{weight of equal volume of water}}' },
          { label: 'Step 2 — Substitute the known values', math: '\\text{Specific Gravity} = \\dfrac{52.78}{54.96}' },
          { label: 'Step 3 — Calculate', math: '\\text{Specific Gravity} \\approx 0.9603' }
        ],
        conclusion: 'The oil has a specific gravity of about 0.9603 — slightly less dense than water, so it would float.'
      },
      tips: [
        'A specific gravity below 1 means the substance is less dense than water (floats); above 1 means denser (sinks).',
        'This is the value used in the "molarity of a concentrated liquid reagent" style calculation — specific gravity is how a volume of a liquid reagent gets converted into a weighable mass.'
      ]
    }
  },
  {
    id: 'specific-volume',
    title: 'Specific Volume',
    category: 'physical-pharmacy',
    formulaText: 'Specific volume = volume of substance / volume of an equal weight of water',
    formulaLatex: '\\text{Specific Volume} = \\dfrac{\\text{volume of substance}}{\\text{volume of equal weight of water}}',
    description: "The inverse relationship to specific gravity — how much space a given weight of a substance takes up, relative to the same weight of water.",
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'substanceVolume', label: 'Volume of substance', unitType: 'volume', defaultUnit: 'mL' },
      { key: 'waterVolume', label: 'Volume of equal weight of water', unitType: 'volume', defaultUnit: 'mL' },
      { key: 'sv', label: 'Specific volume', unitType: null }
    ],
    targets: ['sv', 'substanceVolume', 'waterVolume'],
    solve(v, target) {
      if (target === 'sv') return v.substanceVolume / v.waterVolume;
      if (target === 'substanceVolume') return v.sv * v.waterVolume;
      if (target === 'waterVolume') return v.substanceVolume / v.sv;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'Where specific gravity asks "how much does a given volume weigh, compared to water," specific volume asks the reverse: "how much space does a given weight take up, compared to water." The two are reciprocals of one another for the same substance.',
      variables: {
        substanceVolume: 'Volume occupied by the substance.',
        waterVolume: 'Volume that the same weight of water would occupy.',
        sv: 'Specific volume — a dimensionless ratio.'
      },
      example: {
        problem: 'A syrup weighing 107.16 g occupies 91.0 mL. What is its specific volume? (107.16 g of water occupies 107.16 mL.)',
        steps: [
          { label: 'Step 1 — Apply the formula', math: '\\text{Specific Volume} = \\dfrac{\\text{volume of substance}}{\\text{volume of equal weight of water}}' },
          { label: 'Step 2 — Substitute the known values', math: '\\text{Specific Volume} = \\dfrac{91.0}{107.16}' },
          { label: 'Step 3 — Calculate', math: '\\text{Specific Volume} \\approx 0.849' }
        ],
        conclusion: 'The syrup has a specific volume of about 0.849 — the same weight of syrup takes up less space than water, consistent with it being denser than water.'
      },
      tips: [
        'Specific volume less than 1 means the substance is denser than water (a given weight takes up less room); greater than 1 means less dense.',
        'Specific volume is the mathematical reciprocal of specific gravity for the same substance (1 ÷ specific gravity).'
      ]
    }
  },
  {
    id: 'ideal-osmolar-concentration',
    title: 'Ideal Osmolar Concentration',
    category: 'physical-pharmacy',
    formulaText: 'Osmolar concentration (mOsmol/L) = (weight (g/L) / MW) × i × 1000',
    formulaLatex: '\\text{mOsmol/L} = \\dfrac{\\text{weight (g/L)}}{MW} \\times i \\times 1000',
    description: 'Estimates the theoretical osmolarity of a solution, assuming complete dissociation — used to judge whether a solution will be isotonic with body fluid (normal plasma osmolarity is about 275–295 mOsmol/L).',
    molecule: true,
    hasValency: false,
    fields: [
      { key: 'weightGL', label: 'Weight of substance (g/L)', unitType: null },
      { key: 'iFactor', label: 'i factor (dissociation)', unitType: null },
      { key: 'osmolarConcentration', label: 'Osmolar concentration (mOsmol/L)', unitType: null }
    ],
    targets: ['osmolarConcentration', 'weightGL', 'iFactor'],
    solve(v, target) {
      if (target === 'osmolarConcentration') return (v.weightGL / v.mw) * v.iFactor * 1000;
      if (target === 'weightGL') return (v.osmolarConcentration * v.mw) / (v.iFactor * 1000);
      if (target === 'iFactor') return (v.osmolarConcentration * v.mw) / (v.weightGL * 1000);
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'Osmolarity depends on the number of dissolved particles, not the number of molecules — a substance that splits into 2 ions in solution contributes twice the osmotic effect of one that stays intact. This calculator converts a concentration in g/L into the resulting particle concentration (mOsmol/L), which is what actually drives water movement across cell membranes and determines whether a solution is isotonic, hypotonic, or hypertonic.',
      variables: {
        weightGL: 'Concentration of the substance in the solution, in grams per litre.',
        iFactor: 'Number of particles the substance dissociates into in solution.',
        osmolarConcentration: 'Theoretical osmolar concentration, in milliosmoles per litre.',
        mw: 'Molecular weight of the substance, in g/mol.'
      },
      example: {
        problem: 'What is the osmolarity of a solution containing 9 g/L of NaCl (MW 58.5, i = 2)?',
        steps: [
          { label: 'Step 1 — Convert weight to mol/L', math: '\\dfrac{9}{58.5} \\approx 0.154\\ \\text{mol/L}' },
          { label: 'Step 2 — Multiply by the dissociation factor', math: '0.154 \\times 2 = 0.308' },
          { label: 'Step 3 — Convert to milliosmoles', math: '0.308 \\times 1000 = 308\\ \\text{mOsmol/L}' }
        ],
        conclusion: 'The solution has an osmolarity of about 308 mOsmol/L — close to normal plasma osmolarity, so approximately isotonic.'
      },
      tips: [
        'This gives the theoretical (ideal) osmolarity, assuming complete dissociation — real solutions are sometimes slightly less due to ion interactions, which is why measured osmolarity can differ slightly from calculated.',
        'Normal plasma osmolarity is roughly 275–295 mOsmol/L — values calculated here can be compared against that range to judge tonicity.'
      ]
    }
  },
  {
    id: 'plasma-osmolality',
    title: 'Plasma Osmolality',
    category: 'physical-pharmacy',
    formulaText: 'Osmolality = 2(Na + K) + BUN/2.8 + Glucose/18',
    formulaLatex: '\\text{Osmolality} = 2(Na^+ + K^+) + \\dfrac{BUN}{2.8} + \\dfrac{\\text{Glucose}}{18}',
    description: "Estimates a patient's plasma osmolality from routine lab values — used to assess hydration status, and to screen for an osmolar gap when the calculated and lab-measured values diverge.",
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'na', label: 'Sodium, Na+ (mEq/L)', unitType: null },
      { key: 'k', label: 'Potassium, K+ (mEq/L)', unitType: null },
      { key: 'bun', label: 'BUN (mg/dL)', unitType: 'concentration', defaultUnit: 'mgdL' },
      { key: 'glucose', label: 'Glucose (mg/dL)', unitType: 'concentration', defaultUnit: 'mgdL' },
      { key: 'osmolality', label: 'Osmolality (mOsm/kg)', unitType: null }
    ],
    targets: ['osmolality', 'na', 'k', 'bun', 'glucose'],
    solve(v, target) {
      if (target === 'osmolality') return 2 * (v.na + v.k) + v.bun / 2.8 + v.glucose / 18;
      if (target === 'na') return (v.osmolality - v.bun / 2.8 - v.glucose / 18) / 2 - v.k;
      if (target === 'k') return (v.osmolality - v.bun / 2.8 - v.glucose / 18) / 2 - v.na;
      if (target === 'bun') return (v.osmolality - 2 * (v.na + v.k) - v.glucose / 18) * 2.8;
      if (target === 'glucose') return (v.osmolality - 2 * (v.na + v.k) - v.bun / 2.8) * 18;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: "Sodium and potassium are doubled because each is normally paired with a counter-ion (like chloride or bicarbonate) that isn't measured directly but still contributes osmotic particles. BUN and glucose are divided by their respective molecular-weight-derived constants (2.8 and 18) to convert their lab units (mg/dL) into the same mOsm/kg scale as the electrolyte terms. The result approximates what a lab osmometer would measure directly.",
      variables: {
        na: 'Serum sodium concentration.',
        k: 'Serum potassium concentration.',
        bun: 'Blood urea nitrogen.',
        glucose: 'Blood glucose concentration.',
        osmolality: 'Estimated plasma osmolality.'
      },
      example: {
        problem: 'Estimate plasma osmolality given Na 140 mEq/L, K 4 mEq/L, BUN 14 mg/dL, and Glucose 90 mg/dL.',
        steps: [
          { label: 'Step 1 — Electrolyte contribution', math: '2(140 + 4) = 288' },
          { label: 'Step 2 — BUN contribution', math: '\\dfrac{14}{2.8} = 5' },
          { label: 'Step 3 — Glucose contribution', math: '\\dfrac{90}{18} = 5' },
          { label: 'Step 4 — Add them together', math: '288 + 5 + 5 = 298' }
        ],
        conclusion: 'Estimated plasma osmolality is about 298 mOsm/kg — within the normal range.'
      },
      tips: [
        'Normal plasma osmolality is roughly 275–295 mOsm/kg; a measured value substantially higher than the calculated one (an "osmolar gap") can indicate unmeasured osmotically active substances, such as toxic alcohols.',
        'This formula uses conventional US lab units (mg/dL for BUN and glucose, mEq/L for electrolytes) — using different lab units without converting first will give an incorrect result.'
      ]
    }
  }
];
