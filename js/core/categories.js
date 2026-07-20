/*
  categories.js
  -------------
  Single source of truth for calculator categories. Add a new category here
  (and create js/calculators/<id>.js exporting CALCULATORS) and it appears
  everywhere automatically: home page, calculators hub, and prev/next nav.
*/
export const CATEGORIES = [
  {
    id: 'fundamental',
    label: 'Fundamental concentration',
    description: 'Normality, Molarity, and other basic concentration calculators.'
  },
  {
    id: 'compounding',
    label: 'Compounding',
    description: 'Weighing accuracy, patient compliance, and isotonicity adjustments.'
  },
  {
    id: 'physical-pharmacy',
    label: 'Physical Pharmacy',
    description: 'Density, specific gravity/volume, and osmolar concentration.'
  },
  {
    id: 'clinical',
    label: 'Clinical',
    description: 'Weight/BSA-based dosing, body measurements, and nutritional screening.'
  },
  {
    id: 'renal-function',
    label: 'Renal Function',
    description: 'Estimating creatinine clearance across different patient populations.'
  },
  {
    id: 'acid-base',
    label: 'Acid-Base',
    description: 'Henderson-Hasselbalch buffer calculations.'
  },
  {
    id: 'iv-infusion',
    label: 'IV & Infusion',
    description: 'Gravity drip rates and critical-care infusion pump rates.'
  },
  {
    id: 'nutrition',
    label: 'Nutrition',
    description: 'Basal energy expenditure (Harris-Benedict equation).'
  },
  {
    id: 'pharmacokinetics',
    label: 'Pharmacokinetics',
    description: 'Volume of distribution, elimination rate, and bioavailability.'
  },
  {
    id: 'alcohol-strength',
    label: 'Alcohol Strength',
    description: 'Proof gallon calculations.'
  },
  {
    id: 'temperature',
    label: 'Temperature',
    description: 'Fahrenheit, Celsius, and Kelvin conversions.'
  },
  {
    id: 'nuclear-pharmacy',
    label: 'Nuclear Pharmacy',
    description: 'Radioactive decay.'
  },
  {
    id: 'business',
    label: 'Business',
    description: 'Basic pharmacy economics.'
  }
];
