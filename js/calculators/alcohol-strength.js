/*
  alcohol-strength.js
  -------------------
  Category: alcohol strength — proof gallon calculations.
*/

export const CALCULATORS = [
  {
    id: 'proof-gallons',
    title: 'Proof Gallons',
    category: 'alcohol-strength',
    formulaText: 'PG = gallons × % strength / 50',
    formulaLatex: 'PG = \\dfrac{\\text{gallons} \\times \\%\\ \\text{strength}}{50}',
    description: 'Standardizes a volume of alcohol at a given percentage strength into proof gallons — the reference unit alcohol content, taxation, and formulation are often expressed in.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'gallons', label: 'Gallons', unitType: null },
      { key: 'percentStrength', label: '% Strength', unitType: null },
      { key: 'pg', label: 'Proof gallons', unitType: null }
    ],
    targets: ['pg', 'gallons', 'percentStrength'],
    solve(v, target) {
      if (target === 'pg') return (v.gallons * v.percentStrength) / 50;
      if (target === 'gallons') return (v.pg * 50) / v.percentStrength;
      if (target === 'percentStrength') return (v.pg * 50) / v.gallons;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'A "proof gallon" is a standardized unit: one gallon of liquid at 50% alcohol by volume (100 proof) equals exactly one proof gallon. Since 50% is the reference strength, dividing by 50 converts any volume-and-strength combination into this common unit, which is what alcohol taxation and formulation calculations are typically based on.',
      variables: {
        gallons: 'The actual volume, in gallons.',
        percentStrength: 'The alcohol concentration, as a percentage by volume.',
        pg: 'The equivalent number of proof gallons.'
      },
      example: {
        problem: 'A container holds 10 gallons of alcohol at 40% strength. How many proof gallons does it represent?',
        steps: [
          { label: 'Step 1 — Apply the formula', math: 'PG = \\dfrac{\\text{gallons} \\times \\%\\ \\text{strength}}{50}' },
          { label: 'Step 2 — Substitute the known values', math: 'PG = \\dfrac{10 \\times 40}{50}' },
          { label: 'Step 3 — Calculate', math: 'PG = 8' }
        ],
        conclusion: 'The container represents 8 proof gallons.'
      },
      tips: [
        'Proof is simply double the percentage strength (40% = 80 proof) — if you have proof directly instead of percentage, use the companion "Proof Gallons (Proof Strength)" calculator instead.',
        'This unit is most often encountered in regulatory/taxation contexts rather than everyday compounding.'
      ]
    }
  },
  {
    id: 'proof-gallons-proof-strength',
    title: 'Proof Gallons (Proof Strength)',
    category: 'alcohol-strength',
    formulaText: 'PG = gallons × proof / 100',
    formulaLatex: 'PG = \\dfrac{\\text{gallons} \\times \\text{proof}}{100}',
    description: 'Calculates proof gallons directly from a proof value rather than a percentage strength.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'gallons', label: 'Gallons', unitType: null },
      { key: 'proof', label: 'Proof', unitType: null },
      { key: 'pg', label: 'Proof gallons', unitType: null }
    ],
    targets: ['pg', 'gallons', 'proof'],
    solve(v, target) {
      if (target === 'pg') return (v.gallons * v.proof) / 100;
      if (target === 'gallons') return (v.pg * 100) / v.proof;
      if (target === 'proof') return (v.pg * 100) / v.gallons;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'Proof is a historical way of expressing alcohol strength, defined as double the percentage alcohol by volume (so 100 proof = 50% ABV). Since proof gallons are defined relative to 100 proof, dividing by 100 here plays the same role that dividing by 50 does in the percentage-strength version.',
      variables: {
        gallons: 'The actual volume, in gallons.',
        proof: 'The alcohol proof (double the percentage strength).',
        pg: 'The equivalent number of proof gallons.'
      },
      example: {
        problem: 'A container holds 10 gallons of alcohol at 80 proof. How many proof gallons does it represent?',
        steps: [
          { label: 'Step 1 — Apply the formula', math: 'PG = \\dfrac{\\text{gallons} \\times \\text{proof}}{100}' },
          { label: 'Step 2 — Substitute the known values', math: 'PG = \\dfrac{10 \\times 80}{100}' },
          { label: 'Step 3 — Calculate', math: 'PG = 8' }
        ],
        conclusion: 'The container represents 8 proof gallons — the same answer as the percentage-strength version, since 80 proof = 40% strength.'
      },
      tips: [
        'Use whichever calculator matches the units on your label or reference — proof and percentage strength are simply double/half of each other.',
        'Proof gallons stay the same whether you calculate from percentage or proof, as long as you use the matching formula.'
      ]
    }
  }
];
