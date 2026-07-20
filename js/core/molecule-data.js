/*
  molecule-data.js
  -----------------
  Source of truth for molecular weight calculation.

  IMPORTANT: This deliberately does NOT store a database of molecules/compounds.
  It stores only the ~118 atomic weights (a fixed, complete list) and a formula
  parser that sums them. This means ANY formula the user types (NaOH, H2SO4,
  C6H12O6, Ca3(PO4)2, CuSO4.5H2O, ...) works with zero extra data entry, because
  molecular weight is purely additive over atoms.

  Ka/Kb (acid-base-data.js) cannot use this approach — see that file for why.
*/

export const ATOMIC_WEIGHTS = {
  H: 1.008, He: 4.0026, Li: 6.94, Be: 9.0122, B: 10.81, C: 12.011, N: 14.007,
  O: 15.999, F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305, Al: 26.982,
  Si: 28.085, P: 30.974, S: 32.06, Cl: 35.45, Ar: 39.948, K: 39.098, Ca: 40.078,
  Sc: 44.956, Ti: 47.867, V: 50.942, Cr: 51.996, Mn: 54.938, Fe: 55.845,
  Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.38, Ga: 69.723, Ge: 72.630,
  As: 74.922, Se: 78.971, Br: 79.904, Kr: 83.798, Rb: 85.468, Sr: 87.62,
  Y: 88.906, Zr: 91.224, Nb: 92.906, Mo: 95.95, Tc: 98, Ru: 101.07,
  Rh: 102.91, Pd: 106.42, Ag: 107.87, Cd: 112.41, In: 114.82, Sn: 118.71,
  Sb: 121.76, Te: 127.60, I: 126.90, Xe: 131.29, Cs: 132.91, Ba: 137.33,
  La: 138.91, Ce: 140.12, Pr: 140.91, Nd: 144.24, Pm: 145, Sm: 150.36,
  Eu: 151.96, Gd: 157.25, Tb: 158.93, Dy: 162.50, Ho: 164.93, Er: 167.26,
  Tm: 168.93, Yb: 173.05, Lu: 174.97, Hf: 178.49, Ta: 180.95, W: 183.84,
  Re: 186.21, Os: 190.23, Ir: 192.22, Pt: 195.08, Au: 196.97, Hg: 200.59,
  Tl: 204.38, Pb: 207.2, Bi: 208.98, Po: 209, At: 210, Rn: 222, Fr: 223,
  Ra: 226, Ac: 227, Th: 232.04, Pa: 231.04, U: 238.03, Np: 237, Pu: 244,
  Am: 243, Cm: 247, Bk: 247, Cf: 251, Es: 252, Fm: 257, Md: 258, No: 259,
  Lr: 266, Rf: 267, Db: 268, Sg: 269, Bh: 270, Hs: 269, Mt: 278, Ds: 281,
  Rg: 282, Cn: 285, Nh: 286, Fl: 289, Mc: 290, Lv: 293, Ts: 294, Og: 294
};

/**
 * Parses a single bracketed chemical group (no hydrate dots) and returns
 * its total weight, recursively handling (), [], {} nesting.
 */
function parseChemicalGroup(str) {
  let i = 0;

  function parseNumber() {
    let start = i;
    while (i < str.length && /[0-9]/.test(str[i])) i++;
    return start === i ? 1 : parseInt(str.slice(start, i), 10);
  }

  function parseGroup() {
    let total = 0;
    while (i < str.length && str[i] !== ')' && str[i] !== ']' && str[i] !== '}') {
      const ch = str[i];
      if (ch === '(' || ch === '[' || ch === '{') {
        i++;
        const subtotal = parseGroup();
        if (str[i] === ')' || str[i] === ']' || str[i] === '}') i++;
        else throw new Error('Unmatched bracket');
        total += subtotal * parseNumber();
      } else if (/[A-Z]/.test(ch)) {
        let sym = ch;
        i++;
        if (i < str.length && /[a-z]/.test(str[i])) {
          sym += str[i];
          i++;
        }
        if (!(sym in ATOMIC_WEIGHTS)) throw new Error(`Unknown element: "${sym}"`);
        total += ATOMIC_WEIGHTS[sym] * parseNumber();
      } else {
        throw new Error(`Unexpected character: "${ch}"`);
      }
    }
    return total;
  }

  const weight = parseGroup();
  if (i !== str.length) throw new Error(`Unexpected character: "${str[i]}"`);
  return weight;
}

/**
 * Parses a full formula, including hydrate/adduct notation separated by
 * '.' or '·' with an optional leading coefficient, e.g. "CuSO4.5H2O".
 * Returns { weight, error }. weight is null if error is set.
 */
export function parseFormula(rawFormula) {
  const formula = (rawFormula || '').trim().replace(/\s+/g, '');
  if (!formula) return { weight: null, error: 'Enter a formula' };

  const segments = formula.split(/[·.]/).filter(Boolean);
  let total = 0;
  try {
    for (const seg of segments) {
      const match = seg.match(/^(\d+)(.*)$/);
      const coeff = match ? parseInt(match[1], 10) : 1;
      const rest = match ? match[2] : seg;
      if (!rest) throw new Error('Incomplete formula segment');
      total += coeff * parseChemicalGroup(rest);
    }
  } catch (e) {
    return { weight: null, error: e.message };
  }
  return { weight: total, error: null };
}
