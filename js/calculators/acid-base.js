/*
  acid-base.js
  ------------
  Category: acid-base — Henderson-Hasselbalch buffer calculations.
*/

export const CALCULATORS = [
  {
    id: 'henderson-hasselbalch-acid',
    title: 'Henderson-Hasselbalch (Acid)',
    category: 'acid-base',
    formulaText: 'pH = pKa + log([A⁻] / [HA])',
    formulaLatex: 'pH = pKa + \\log \\dfrac{[A^-]}{[HA]}',
    description: 'Calculates the pH of a buffer made from a weak acid (HA) and its conjugate base (A⁻).',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'pKa', label: 'pKa', unitType: null },
      { key: 'aConc', label: 'Conjugate base, [A⁻] (M)', unitType: null },
      { key: 'haConc', label: 'Weak acid, [HA] (M)', unitType: null },
      { key: 'pH', label: 'pH', unitType: null }
    ],
    targets: ['pH', 'pKa', 'aConc', 'haConc'],
    solve(v, target) {
      if (target === 'pH') return v.pKa + Math.log10(v.aConc / v.haConc);
      if (target === 'pKa') return v.pH - Math.log10(v.aConc / v.haConc);
      if (target === 'aConc') return v.haConc * Math.pow(10, v.pH - v.pKa);
      if (target === 'haConc') return v.aConc / Math.pow(10, v.pH - v.pKa);
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: "A buffer resists pH change because it contains both a weak acid (which can donate a proton if the solution becomes too basic) and its conjugate base (which can accept a proton if it becomes too acidic). The Henderson-Hasselbalch equation shows that pH is entirely determined by pKa and the ratio of these two forms — not their absolute concentrations — which is why a buffer keeps working over a range of dilutions as long as that ratio is preserved.",
      variables: {
        pKa: "The acid's dissociation constant, expressed as a negative log — a fixed property of the specific acid.",
        aConc: 'Concentration of the conjugate base (the ionized form).',
        haConc: 'Concentration of the weak acid (the unionized, protonated form).',
        pH: 'The resulting pH of the buffer.'
      },
      example: {
        problem: 'Calculate the pH of a buffer with pKa = 4.75, [A⁻] = 0.2 M, and [HA] = 0.1 M.',
        steps: [
          { label: 'Step 1 — Find the ratio of base to acid', math: '\\dfrac{[A^-]}{[HA]} = \\dfrac{0.2}{0.1} = 2' },
          { label: 'Step 2 — Take the log of that ratio', math: '\\log(2) \\approx 0.301' },
          { label: 'Step 3 — Apply the formula', math: 'pH = 4.75 + 0.301' },
          { label: 'Step 4 — Calculate', math: 'pH \\approx 5.05' }
        ],
        conclusion: 'The buffer has a pH of approximately 5.05.'
      },
      tips: [
        'When the acid and conjugate base concentrations are equal, the ratio is 1, log(1) = 0, and pH simply equals pKa — a useful sanity check.',
        'A buffer works best (has the most capacity to resist pH change in either direction) when pH is close to pKa, typically within about ±1 unit.',
        "This equation applies to any weak-acid/conjugate-base pair, even ones that don't literally release free H+ — like NH4+/NH3, where NH4+ acts as the acid."
      ]
    }
  },
  {
    id: 'henderson-hasselbalch-base',
    title: 'Henderson-Hasselbalch (Base)',
    category: 'acid-base',
    formulaText: 'pH = pKw − pKb + log([B] / [BH⁺])',
    formulaLatex: 'pH = pKw - pKb + \\log \\dfrac{[B]}{[BH^+]}',
    description: 'Calculates the pH of a buffer made from a weak base (B) and its conjugate acid (BH⁺).',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'pKb', label: 'pKb', unitType: null },
      { key: 'pKw', label: 'pKw (usually 14)', unitType: null },
      { key: 'bConc', label: 'Weak base, [B] (M)', unitType: null },
      { key: 'bhConc', label: 'Conjugate acid, [BH⁺] (M)', unitType: null },
      { key: 'pH', label: 'pH', unitType: null }
    ],
    targets: ['pH', 'pKb', 'bConc', 'bhConc'],
    solve(v, target) {
      if (target === 'pH') return v.pKw - v.pKb + Math.log10(v.bConc / v.bhConc);
      if (target === 'pKb') return v.pKw - v.pH + Math.log10(v.bConc / v.bhConc);
      if (target === 'bConc') return v.bhConc * Math.pow(10, v.pH - v.pKw + v.pKb);
      if (target === 'bhConc') return v.bConc / Math.pow(10, v.pH - v.pKw + v.pKb);
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: "A weak base doesn't release OH⁻ directly — instead it accepts a proton to form its conjugate acid (BH⁺). Because pKb describes the base's own equilibrium, it has to be converted through water's ion product (pKw, typically 14) to arrive at pH, which is why this equation looks a bit different from the acid version even though the underlying logic — a ratio of two forms, log-transformed — is identical.",
      variables: {
        pKb: "The base's dissociation constant, expressed as a negative log.",
        pKw: "Water's ionization constant, expressed as a negative log — 14 at 25°C.",
        bConc: 'Concentration of the unionized weak base.',
        bhConc: 'Concentration of the conjugate acid (the protonated form).',
        pH: 'The resulting pH of the buffer.'
      },
      example: {
        problem: 'Calculate the pH of a buffer containing 0.1 M NH₃ (a weak base) and 0.1 M NH₄⁺ (its conjugate acid), given pKb = 4.75.',
        steps: [
          { label: 'Step 1 — Find the ratio of base to conjugate acid', math: '\\dfrac{[B]}{[BH^+]} = \\dfrac{0.1}{0.1} = 1' },
          { label: 'Step 2 — Take the log of that ratio', math: '\\log(1) = 0' },
          { label: 'Step 3 — Apply the formula', math: 'pH = 14 - 4.75 + 0' },
          { label: 'Step 4 — Calculate', math: 'pH = 9.25' }
        ],
        conclusion: 'The buffer has a pH of 9.25 — equal to pKw − pKb, exactly as expected when base and conjugate acid concentrations are equal.'
      },
      tips: [
        'When base and conjugate acid concentrations are equal, pH simplifies to pKw − pKb — the base-buffer equivalent of "pH = pKa."',
        'pKw is 14 only at 25°C — it changes slightly with temperature, though 14 is a safe default for most classroom and lab calculations.'
      ]
    }
  }
];
