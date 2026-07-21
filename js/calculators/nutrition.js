/*
  nutrition.js
  ------------
  Category: nutrition — basal energy expenditure (Harris-Benedict equation).
*/

export const CALCULATORS = [
  {
    id: 'bee-male',
    title: 'BEE (Male)',
    category: 'nutrition',
    formulaText: 'BEE = 66.47 + 13.75W + 5H − 6.76A',
    formulaLatex: 'BEE = 66.47 + 13.75W + 5H - 6.76A',
    description: "A male patient's Basal Energy Expenditure — the calories needed at complete rest — using the Harris-Benedict equation.",
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'weight', label: 'Weight', unitType: 'mass', defaultUnit: 'kg' },
      { key: 'height', label: 'Height', unitType: 'length', defaultUnit: 'cm' },
      { key: 'age', label: 'Age (years)', unitType: null },
      { key: 'bee', label: 'BEE (kcal/day)', unitType: null }
    ],
    targets: ['bee', 'weight', 'height', 'age'],
    solve(v, target) {
      const heightCm = v.height * 100; // base unit is m
      const weightKg = v.weight / 1000; // base unit is grams
      if (target === 'bee') return 66.47 + 13.75 * weightKg + 5 * heightCm - 6.76 * v.age;
      if (target === 'weight') return ((v.bee - 66.47 - 5 * heightCm + 6.76 * v.age) / 13.75) * 1000;
      if (target === 'height') return ((v.bee - 66.47 - 13.75 * weightKg + 6.76 * v.age) / 5) / 100;
      if (target === 'age') return (66.47 + 13.75 * weightKg + 5 * heightCm - v.bee) / 6.76;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: "Basal Energy Expenditure is the number of calories the body burns at complete rest just to maintain vital functions — breathing, circulation, and cell activity — before accounting for any physical activity. The Harris-Benedict equation, from 1919 (and still widely used), estimates it from weight, height, and age, since larger, younger, and taller bodies generally have a higher baseline metabolic rate.",
      variables: {
        weight: "The patient's weight.",
        height: "The patient's height.",
        age: "The patient's age.",
        bee: 'Estimated basal energy expenditure.'
      },
      example: {
        problem: 'Calculate the BEE for a 40-year-old male weighing 70 kg with a height of 170 cm.',
        steps: [
          { label: 'Step 1 — Apply the formula', math: 'BEE = 66.47 + 13.75W + 5H - 6.76A' },
          { label: 'Step 2 — Substitute the known values', math: 'BEE = 66.47 + (13.75 \\times 70) + (5 \\times 170) - (6.76 \\times 40)' },
          { label: 'Step 3 — Calculate', math: 'BEE = 66.47 + 962.5 + 850 - 270.4 \\approx 1609' }
        ],
        conclusion: 'Estimated basal energy expenditure is about 1609 kcal/day.'
      },
      tips: [
        'BEE is the resting baseline only — total daily energy needs are higher once activity level and any illness/stress factors are added on top.',
        'Newer equations (like Mifflin-St Jeor) are considered somewhat more accurate for modern populations, but Harris-Benedict remains widely taught and used.'
      ]
    }
  },
  {
    id: 'bee-female',
    title: 'BEE (Female)',
    category: 'nutrition',
    formulaText: 'BEE = 655.1 + 9.56W + 1.86H − 4.68A',
    formulaLatex: 'BEE = 655.1 + 9.56W + 1.86H - 4.68A',
    description: "A female patient's Basal Energy Expenditure, using the Harris-Benedict equation.",
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'weight', label: 'Weight', unitType: 'mass', defaultUnit: 'kg' },
      { key: 'height', label: 'Height', unitType: 'length', defaultUnit: 'cm' },
      { key: 'age', label: 'Age (years)', unitType: null },
      { key: 'bee', label: 'BEE (kcal/day)', unitType: null }
    ],
    targets: ['bee', 'weight', 'height', 'age'],
    solve(v, target) {
      const heightCm = v.height * 100;
      const weightKg = v.weight / 1000; // base unit is grams
      if (target === 'bee') return 655.1 + 9.56 * weightKg + 1.86 * heightCm - 4.68 * v.age;
      if (target === 'weight') return ((v.bee - 655.1 - 1.86 * heightCm + 4.68 * v.age) / 9.56) * 1000;
      if (target === 'height') return ((v.bee - 655.1 - 9.56 * weightKg + 4.68 * v.age) / 1.86) / 100;
      if (target === 'age') return (655.1 + 9.56 * weightKg + 1.86 * heightCm - v.bee) / 4.68;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'Same purpose as the male equation, with separately-derived coefficients reflecting average differences in body composition and metabolic rate between men and women in the original Harris-Benedict study population.',
      variables: {
        weight: "The patient's weight.",
        height: "The patient's height.",
        age: "The patient's age.",
        bee: 'Estimated basal energy expenditure.'
      },
      example: {
        problem: 'Calculate the BEE for a 35-year-old female weighing 60 kg with a height of 160 cm.',
        steps: [
          { label: 'Step 1 — Apply the formula', math: 'BEE = 655.1 + 9.56W + 1.86H - 4.68A' },
          { label: 'Step 2 — Substitute the known values', math: 'BEE = 655.1 + (9.56 \\times 60) + (1.86 \\times 160) - (4.68 \\times 35)' },
          { label: 'Step 3 — Calculate', math: 'BEE = 655.1 + 573.6 + 297.6 - 163.8 \\approx 1363' }
        ],
        conclusion: 'Estimated basal energy expenditure is about 1363 kcal/day.'
      },
      tips: [
        'To estimate total daily calorie needs, this BEE is typically multiplied by an activity factor (e.g. ~1.2 for sedentary, higher for more active patients) and further adjusted for illness or injury in clinical nutrition support.',
        'Like the male equation, this predates modern population data — treat it as a reasonable estimate, not an exact figure.'
      ]
    }
  }
];
