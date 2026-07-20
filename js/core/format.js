/*
  format.js
  ---------
  Shared number-formatting helpers so every section displays numbers the
  same way: a precise value paired with a friendly rounded one, e.g.
  "19.9985 ~ 20". Used by calc-engine.js and molecular-weight.js.
*/

/** Trim a number to a sensible number of significant digits for display. */
export function trimNumber(n) {
  if (!Number.isFinite(n)) return String(n);
  if (Math.abs(n) >= 1000 || (Math.abs(n) < 0.001 && n !== 0)) return n.toPrecision(6);
  const rounded = Math.round(n * 10000) / 10000;
  return String(rounded);
}

/**
 * Like formatPair's rounding rule, but returns the actual NUMBER to use in
 * further calculations rather than a display string. Used when auto-filling
 * molecular weight from a molecule name: NaOH's true computed weight is
 * 39.997, and calculating with that instead of the clean 40 introduces tiny
 * downstream errors (e.g. a normality of 0.100008 instead of exactly 0.1).
 * Only rounds when it's cosmetic (~1%) — a genuine value like 127.5 stays
 * 127.5, and this never turns something like 0.5 into 1.
 */
export function roundIfClose(n, thresholdRatio = 0.01) {
  if (!Number.isFinite(n) || n === 0) return n;
  const rounded = Math.round(n);
  if (rounded === 0) return n;
  const relativeDiff = Math.abs(n - rounded) / Math.abs(n);
  return relativeDiff < thresholdRatio ? rounded : n;
}

/**
 * Returns "actual ~ rounded" (e.g. "19.9985 ~ 20") only when rounding to the
 * nearest whole number is cosmetic — i.e. within ~1% of the actual value.
 * Otherwise rounding would change the number's meaning (e.g. 0.5 -> 1 is a
 * 100% change), so just the actual value is shown, unpaired.
 */
export function formatPair(n) {
  if (!Number.isFinite(n)) return String(n);
  if (n === 0) return '0';
  const actual = trimNumber(n);
  const rounded = Math.round(n);
  if (actual === String(rounded)) return actual;
  const relativeDiff = Math.abs(n - rounded) / Math.abs(n);
  if (relativeDiff < 0.01) return `${actual} ~ ${rounded}`;
  return actual;
}
