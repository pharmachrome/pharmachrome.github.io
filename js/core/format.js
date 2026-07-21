/*
  format.js
  ---------
  Shared number-formatting helpers so every section displays numbers the
  same way: a precise value paired with a friendly rounded one, e.g.
  "19.9985 ~ 20". Used by calc-engine.js and molecular-weight.js.

  Rounding rule: only round to the nearest whole number when the actual
  value is within 0.2 of it (i.e. the decimal part is .0-.2 or .8-1.0) —
  an ABSOLUTE distance, not a percentage. This matters because a relative
  (%) threshold rounds larger numbers too aggressively: KCl's real
  molecular weight (74.548) is only ~0.6% away from 75, so a percentage
  rule rounds it to 75 — a real, meaningful difference for a formula like
  mg-to-mEq. An absolute 0.2 threshold catches genuine floating-point/
  atomic-mass noise (39.997 -> 40) without distorting real values like
  74.548 or 180.156.
*/

const ROUND_DISTANCE = 0.2;

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
 * Only rounds when the value is within 0.2 of a whole number — never turns
 * something like 0.5 into 1, and never turns 74.548 (KCl) into 75.
 */
export function roundIfClose(n, maxDistance = ROUND_DISTANCE) {
  if (!Number.isFinite(n)) return n;
  const nearest = Math.round(n);
  const diff = Math.abs(n - nearest);
  return diff <= maxDistance ? nearest : n;
}

/**
 * Returns "actual ~ rounded" (e.g. "19.9985 ~ 20") only when the value is
 * within 0.2 of that whole number. Otherwise rounding would change the
 * number's meaning (e.g. 74.548 -> 75, or 0.5 -> 1), so just the actual
 * value is shown, unpaired.
 */
export function formatPair(n) {
  if (!Number.isFinite(n)) return String(n);
  if (n === 0) return '0';
  const actual = trimNumber(n);
  const nearest = Math.round(n);
  const diff = Math.abs(n - nearest);
  if (diff === 0) return actual;
  if (diff <= ROUND_DISTANCE) return `${actual} ~ ${nearest}`;
  return actual;
}
