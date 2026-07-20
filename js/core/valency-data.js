/*
  valency-data.js
  ---------------
  Valency (n-factor) depends on the reaction a compound is used in, so it
  can't be derived automatically — see the Normality calculator's field-hint.
  This is only a convenience default for common compounds; always editable.
  Add more as needed, same one-line-per-entry pattern as everything else.
*/
export const COMMON_VALENCY = {
  'naoh': 1, 'koh': 1, 'nh4oh': 1,
  'hcl': 1, 'hno3': 1, 'ch3cooh': 1,
  'h2so4': 2, 'ca(oh)2': 2, 'mg(oh)2': 2,
  'h3po4': 3, 'al(oh)3': 3
};
