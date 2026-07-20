/*
  acid-base-data.js
  -----------------
  Ka/Kb are empirically measured equilibrium constants — unlike molecular
  weight, they cannot be derived by summing atomic properties, so (unlike
  molecule-data.js) this genuinely needs a lookup table. Scope is kept small
  and standard: common pharma-relevant weak acids/bases only. Add a new
  compound by adding one line here — same pattern as adding a calculator.

  Ka / Kb values at 25°C. pKa = -log10(Ka).
*/

export const WEAK_ACIDS = {
  'acetic acid': { formula: 'CH3COOH', Ka: 1.8e-5 },
  'citric acid (1st)': { formula: 'C6H8O7', Ka: 7.4e-4 },
  'carbonic acid (1st)': { formula: 'H2CO3', Ka: 4.3e-7 },
  'phosphoric acid (1st)': { formula: 'H3PO4', Ka: 7.5e-3 },
  'benzoic acid': { formula: 'C6H5COOH', Ka: 6.3e-5 },
  'lactic acid': { formula: 'C3H6O3', Ka: 1.4e-4 },
  'ascorbic acid (1st)': { formula: 'C6H8O6', Ka: 8.0e-5 }
};

export const WEAK_BASES = {
  'ammonia': { formula: 'NH3', Kb: 1.8e-5 },
  'pyridine': { formula: 'C5H5N', Kb: 1.7e-9 },
  'methylamine': { formula: 'CH3NH2', Kb: 4.4e-4 },
  'ethanolamine': { formula: 'C2H7NO', Kb: 3.2e-5 }
};

export function kaToPka(Ka) { return -Math.log10(Ka); }
export function kbToPkb(Kb) { return -Math.log10(Kb); }
