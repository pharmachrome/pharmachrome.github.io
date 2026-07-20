/*
  unit-data.js
  ------------
  Single source of truth for unit conversions. Used by:
    - the standalone Unit Converter section
    - every calculator's smart-fields (js/core/smart-field.js)
  Add a unit once here and it becomes available everywhere automatically.
*/

// Linear unit families: value_in_base = value * factor
export const UNIT_FAMILIES = {
  mass: {
    base: 'g',
    units: {
      fg: 1e-15, pg: 1e-12, ng: 1e-9, ug: 1e-6,
      mg: 0.001, cg: 0.01, dg: 0.1, g: 1,
      dag: 10, hg: 100, kg: 1000,
      gr: 0.0648, s: 1.296, dr: 3.888, oz: 31.1035,
      lb_general: 453.592, lb_apothecary: 373.242
    }
  },
  volume: {
    base: 'L',
    units: {
      uL: 0.000001, mL: 0.001, cL: 0.01, dL: 0.1, L: 1,
      daL: 10, hL: 100, kL: 1000,
      cm3: 0.001, dm3: 1, m3: 1000,
      cin: 0.016387, cft: 28.316,
      gtt: 0.00005, minim: 0.0000616, fdr: 0.003696,
      floz: 0.02957, pt: 0.473, qt: 0.946, gal: 3.785,
      tsp: 0.005, tbsp: 0.015, dssp: 0.01, cfsp: 0.0025,
      wgl: 0.06, tcp: 0.15, gl: 0.25, cp_metric: 0.25
    }
  },
  amount: {
    base: 'mol',
    units: { nmol: 1e-9, umol: 1e-6, mmol: 1e-3, mol: 1 }
  },
  length: {
    base: 'm',
    units: {
      nm: 1e-9, um: 0.000001, mm: 0.001, cm: 0.01, dm: 0.1, m: 1,
      dam: 10, hm: 100, km: 1000,
      inch: 0.0254, mile: 1609.34
    }
  },
  time: {
    base: 'min',
    units: { sec: 0.0166667, min: 1, hr: 60, day: 1440 }
  },
  concentration: {
    base: 'mgdL',
    units: { ngmL: 0.0001, mcgmL: 0.1, mgdL: 1, mgmL: 100, gdL: 1000, gL: 100 }
  },
  radioactivity: {
    base: 'Bq',
    units: {
      Bq: 1, kBq: 1000, MBq: 1e6, GBq: 1e9,
      nCi: 37, uCi: 3.7e4, mCi: 3.7e7, Ci: 3.7e10
    }
  }
};

// Non-linear family handled separately (affine, not multiplicative)
export const TEMPERATURE_UNITS = ['C', 'F', 'K'];

export function temperatureToBase(value, unit) {
  // base = Celsius
  if (unit === 'C') return value;
  if (unit === 'F') return (value - 32) * (5 / 9);
  if (unit === 'K') return value - 273.15;
  throw new Error('Unknown temperature unit: ' + unit);
}

export function temperatureFromBase(valueC, unit) {
  if (unit === 'C') return valueC;
  if (unit === 'F') return valueC * (9 / 5) + 32;
  if (unit === 'K') return valueC + 273.15;
  throw new Error('Unknown temperature unit: ' + unit);
}

/** Convert a value in `fromUnit` to the base unit of its family. */
export function toBaseUnit(value, unitType, unit) {
  if (unitType === 'temperature') return temperatureToBase(value, unit);
  const fam = UNIT_FAMILIES[unitType];
  if (!fam) throw new Error('Unknown unit type: ' + unitType);
  if (!(unit in fam.units)) throw new Error('Unknown unit: ' + unit);
  return value * fam.units[unit];
}

/** Convert a value in the base unit of a family back to `unit`. */
export function fromBaseUnit(valueInBase, unitType, unit) {
  if (unitType === 'temperature') return temperatureFromBase(valueInBase, unit);
  const fam = UNIT_FAMILIES[unitType];
  if (!fam) throw new Error('Unknown unit type: ' + unitType);
  if (!(unit in fam.units)) throw new Error('Unknown unit: ' + unit);
  return valueInBase / fam.units[unit];
}

/** List of unit names available for a given unit type, for populating dropdowns. */
export function unitsFor(unitType) {
  if (unitType === 'temperature') return TEMPERATURE_UNITS;
  const fam = UNIT_FAMILIES[unitType];
  return fam ? Object.keys(fam.units) : [];
}
