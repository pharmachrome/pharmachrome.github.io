/*
  nuclear-pharmacy.js
  -------------------
  Category: nuclear pharmacy — radioactive decay.
*/

export const CALCULATORS = [
  {
    id: 'radioactive-decay',
    title: 'Radioactive Decay',
    category: 'nuclear-pharmacy',
    formulaText: 'N = N₀ × e^(−λt)',
    formulaLatex: 'N = N_0 \\times e^{-\\lambda t}',
    description: 'Calculates the remaining activity of a radioactive material after a given elapsed time — essential for timing the use of short-lived radiopharmaceuticals.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'n0', label: 'Initial activity, N₀', unitType: null },
      { key: 'decayConstant', label: 'Decay constant, λ (per unit time)', unitType: null },
      { key: 'time', label: 'Elapsed time', unitType: null },
      { key: 'n', label: 'Remaining activity, N', unitType: null }
    ],
    targets: ['n', 'n0', 'decayConstant', 'time'],
    solve(v, target) {
      if (target === 'n') return v.n0 * Math.exp(-v.decayConstant * v.time);
      if (target === 'n0') return v.n / Math.exp(-v.decayConstant * v.time);
      if (target === 'decayConstant') return -Math.log(v.n / v.n0) / v.time;
      if (target === 'time') return -Math.log(v.n / v.n0) / v.decayConstant;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'Radioactive decay is a first-order process — a constant fraction of the remaining material decays per unit time, the same underlying mathematics as first-order drug elimination (which is why this formula has the same shape as the pharmacokinetics elimination equations). The decay constant (λ) is a fixed property of the specific radioisotope, directly related to its half-life by λ = 0.693 / half-life.',
      variables: {
        n0: 'The initial activity (or amount) of the radioactive material.',
        decayConstant: "The isotope's decay constant — use the same time units as the elapsed time field.",
        time: 'Elapsed time since the initial measurement.',
        n: 'The remaining activity after that time has passed.'
      },
      example: {
        problem: 'A radiopharmaceutical has an initial activity of 100 mCi and a decay constant of 0.1 per hour. What activity remains after 10 hours?',
        steps: [
          { label: 'Step 1 — Apply the formula', math: 'N = N_0 \\times e^{-\\lambda t}' },
          { label: 'Step 2 — Substitute the known values', math: 'N = 100 \\times e^{-0.1 \\times 10}' },
          { label: 'Step 3 — Calculate', math: 'N = 100 \\times e^{-1} \\approx 36.8\\ \\text{mCi}' }
        ],
        conclusion: 'About 36.8 mCi of activity remains after 10 hours.'
      },
      tips: [
        'If you have a half-life instead of a decay constant, convert it first using the Elimination Rate Constant calculator (same formula: λ = 0.693 / half-life) — decay constant and elimination rate constant are mathematically identical concepts.',
        'Keep the time units consistent — if λ is "per hour," time must be in hours, not minutes or days.'
      ]
    }
  }
];
