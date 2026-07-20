/*
  pharmacokinetics.js
  -------------------
  Category: pharmacokinetics — basic parameters describing how a drug
  distributes, is eliminated, and how much of a dose becomes available.
*/

export const CALCULATORS = [
  {
    id: 'volume-of-distribution',
    title: 'Volume of Distribution',
    category: 'pharmacokinetics',
    formulaText: 'Vd = amount of drug / plasma concentration',
    formulaLatex: 'V_d = \\dfrac{\\text{amount of drug}}{\\text{plasma concentration}}',
    description: "The apparent volume a drug would need to occupy to account for the amount in the body at the observed plasma concentration — a measure of how extensively a drug distributes into tissue versus staying in the bloodstream.",
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'amount', label: 'Amount of drug (mg)', unitType: null },
      { key: 'concentration', label: 'Plasma concentration (mg/L)', unitType: null },
      { key: 'vd', label: 'Vd (L)', unitType: null }
    ],
    targets: ['vd', 'amount', 'concentration'],
    solve(v, target) {
      if (target === 'vd') return v.amount / v.concentration;
      if (target === 'amount') return v.vd * v.concentration;
      if (target === 'concentration') return v.amount / v.vd;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: "Volume of distribution isn't a real, physical volume — it's a calculated value that describes how a drug's plasma concentration relates to the total amount in the body. A drug that stays mostly in the bloodstream has a Vd close to actual blood/plasma volume (a few litres); a drug that distributes heavily into fat or tissue can have a Vd far larger than the body itself, since plasma concentration ends up low relative to the total dose.",
      variables: {
        amount: 'Total amount of drug present in the body.',
        concentration: 'The measured plasma (blood) concentration of the drug.',
        vd: 'The calculated volume of distribution.'
      },
      example: {
        problem: 'A patient has 500 mg of a drug in their body, with a measured plasma concentration of 10 mg/L. Find Vd.',
        steps: [
          { label: 'Step 1 — Apply the formula', math: 'V_d = \\dfrac{\\text{amount}}{\\text{concentration}}' },
          { label: 'Step 2 — Substitute the known values', math: 'V_d = \\dfrac{500}{10}' },
          { label: 'Step 3 — Calculate', math: 'V_d = 50\\ \\text{L}' }
        ],
        conclusion: 'The volume of distribution is 50 L — larger than typical plasma volume (~3 L), indicating this drug distributes into tissues beyond the bloodstream.'
      },
      tips: [
        'A very large Vd (well beyond total body water, ~42 L for an average adult) typically means the drug binds extensively to tissue rather than staying in circulation.',
        'Vd is used to calculate loading doses: a target plasma concentration multiplied by Vd gives the amount of drug needed to reach it immediately.'
      ]
    }
  },
  {
    id: 'elimination-rate-constant',
    title: 'Elimination Rate Constant (First-Order)',
    category: 'pharmacokinetics',
    formulaText: 'Kel = 0.693 / half-life',
    formulaLatex: 'K_{el} = \\dfrac{0.693}{t_{1/2}}',
    description: "How quickly a drug is cleared from the body under first-order kinetics, derived directly from its half-life.",
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'halfLife', label: 'Half-life (hr)', unitType: null },
      { key: 'kel', label: 'Kel (hr⁻¹)', unitType: null }
    ],
    targets: ['kel', 'halfLife'],
    solve(v, target) {
      if (target === 'kel') return 0.693 / v.halfLife;
      if (target === 'halfLife') return 0.693 / v.kel;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'For a drug eliminated by first-order kinetics (the most common case — a constant fraction, not a constant amount, is cleared per unit time), the elimination rate constant and half-life are two ways of describing the same underlying process. 0.693 is the natural logarithm of 2 — it appears because a half-life is, by definition, the time for the concentration to fall by exactly half.',
      variables: {
        halfLife: 'The time required for the drug concentration to drop by half.',
        kel: 'The elimination rate constant — the fractional rate at which the drug is cleared per unit time.'
      },
      example: {
        problem: "A drug's half-life is 6 hours. Calculate its elimination rate constant.",
        steps: [
          { label: 'Step 1 — Apply the formula', math: 'K_{el} = \\dfrac{0.693}{t_{1/2}}' },
          { label: 'Step 2 — Substitute the known value', math: 'K_{el} = \\dfrac{0.693}{6}' },
          { label: 'Step 3 — Calculate', math: 'K_{el} \\approx 0.1155\\ \\text{hr}^{-1}' }
        ],
        conclusion: 'The elimination rate constant is approximately 0.1155 per hour.'
      },
      tips: [
        'A higher Kel means faster clearance and a shorter half-life — the two move in opposite directions.',
        'This relationship only holds for first-order elimination; a few drugs (e.g. at high, saturating doses) follow zero-order kinetics instead, where a constant amount (not fraction) is cleared per unit time.'
      ]
    }
  },
  {
    id: 'bioavailability',
    title: 'Bioavailability',
    category: 'pharmacokinetics',
    formulaText: 'F = amount absorbed / dose',
    formulaLatex: 'F = \\dfrac{\\text{amount absorbed}}{\\text{dose}}',
    description: 'The fraction of an administered dose that reaches systemic circulation unchanged — a measure of how efficiently a drug is absorbed.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'absorbed', label: 'Amount absorbed (mg)', unitType: null },
      { key: 'dose', label: 'Dose administered (mg)', unitType: null },
      { key: 'f', label: 'Bioavailability, F', unitType: null }
    ],
    targets: ['f', 'absorbed', 'dose'],
    solve(v, target) {
      if (target === 'f') return v.absorbed / v.dose;
      if (target === 'absorbed') return v.f * v.dose;
      if (target === 'dose') return v.absorbed / v.f;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'Not all of an administered dose necessarily reaches systemic circulation intact — oral drugs, in particular, may be incompletely absorbed from the gut and partially broken down by the liver before reaching the bloodstream (first-pass metabolism). Bioavailability quantifies exactly what fraction "counts" therapeutically. An intravenous dose is, by definition, 100% bioavailable (F = 1), since it bypasses absorption entirely.',
      variables: {
        absorbed: 'The amount of drug that actually reaches systemic circulation.',
        dose: 'The total dose administered.',
        f: 'Bioavailability, as a fraction (multiply by 100 for a percentage).'
      },
      example: {
        problem: 'A patient is given 200 mg of an oral drug. After absorption, 120 mg reaches systemic circulation. Calculate the bioavailability.',
        steps: [
          { label: 'Step 1 — Apply the formula', math: 'F = \\dfrac{\\text{amount absorbed}}{\\text{dose}}' },
          { label: 'Step 2 — Substitute the known values', math: 'F = \\dfrac{120}{200}' },
          { label: 'Step 3 — Calculate', math: 'F = 0.6' }
        ],
        conclusion: 'Bioavailability is 0.6, or 60%.'
      },
      tips: [
        'Bioavailability is why oral and IV doses of the same drug are often different — a lower oral bioavailability requires a larger oral dose to deliver the same effective amount.',
        'This calculator uses a direct absorbed-amount comparison; in practice, bioavailability is usually measured by comparing the area under the plasma concentration curve (AUC) for the oral versus IV route.'
      ]
    }
  }
];
