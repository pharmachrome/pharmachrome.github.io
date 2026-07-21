/*
  clinical.js
  -----------
  Category: clinical — dosing based on patient size, body measurements, and
  basic nutritional status.
*/

export const CALCULATORS = [
  {
    id: 'dose-by-weight',
    title: 'Dose by Weight',
    category: 'clinical',
    formulaText: "Patient's dose = weight × dose per kg",
    formulaLatex: "\\text{Patient's dose} = \\text{weight} \\times \\text{dose per kg}",
    description: "Scales a per-kilogram dose to an individual patient's body weight.",
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'weight', label: "Patient's weight", unitType: 'mass', defaultUnit: 'kg' },
      { key: 'dosePerKg', label: 'Dose (mg per kg)', unitType: null },
      { key: 'patientDose', label: "Patient's dose (mg)", unitType: null }
    ],
    targets: ['patientDose', 'weight', 'dosePerKg'],
    solve(v, target) {
      const weightKg = v.weight / 1000; // base unit is grams
      if (target === 'patientDose') return weightKg * v.dosePerKg;
      if (target === 'weight') return (v.patientDose / v.dosePerKg) * 1000;
      if (target === 'dosePerKg') return v.patientDose / weightKg;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: "Many drug doses, especially in pediatrics and for medications with a narrow safety margin, are expressed per kilogram of body weight rather than as a flat amount — since a larger body generally distributes and eliminates a drug differently than a smaller one. Multiplying the per-kg dose by the patient's actual weight gives the specific amount to administer.",
      variables: {
        weight: 'The patient\'s body weight.',
        dosePerKg: 'The recommended dose per kilogram of body weight.',
        patientDose: 'The total dose for this specific patient.'
      },
      example: {
        problem: 'The usual initial dose of a drug is 0.15 mg per kg of body weight. How many mg should be given to a patient weighing 154 lb?',
        steps: [
          { label: 'Step 1 — Convert weight to kilograms', math: '154\\ \\text{lb} \\div 2.2 \\approx 70.0\\ \\text{kg}' },
          { label: 'Step 2 — Apply the formula', math: "\\text{Patient's dose} = \\text{weight} \\times \\text{dose per kg}" },
          { label: 'Step 3 — Substitute the known values', math: '\\text{Dose} = 70.0 \\times 0.15' },
          { label: 'Step 4 — Calculate', math: '\\text{Dose} \\approx 10.5\\ \\text{mg}' }
        ],
        conclusion: 'The patient should receive approximately 10.5 mg.'
      },
      tips: [
        'Use the weight field\'s unit dropdown to enter pounds directly — no need to convert by hand.',
        'For some drugs, guidelines specify using ideal body weight rather than actual body weight, particularly in obese patients — check the specific drug\'s dosing guidance.'
      ]
    }
  },
  {
    id: 'dose-by-bsa',
    title: 'Dose by BSA',
    category: 'clinical',
    formulaText: "Patient's dose = (patient's BSA / 1.73) × adult dose",
    formulaLatex: "\\text{Patient's dose} = \\dfrac{\\text{Patient's BSA}}{1.73} \\times \\text{Adult dose}",
    description: 'Scales a standard adult dose to a patient of a different body size, using body surface area — the standard approach for chemotherapy and many pediatric doses.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'patientBsa', label: "Patient's BSA (m²)", unitType: null },
      { key: 'adultDose', label: 'Adult dose (mg)', unitType: null },
      { key: 'patientDose', label: "Patient's dose (mg)", unitType: null }
    ],
    targets: ['patientDose', 'patientBsa', 'adultDose'],
    solve(v, target) {
      if (target === 'patientDose') return (v.patientBsa / 1.73) * v.adultDose;
      if (target === 'patientBsa') return (v.patientDose / v.adultDose) * 1.73;
      if (target === 'adultDose') return v.patientDose / (v.patientBsa / 1.73);
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'Body surface area correlates more closely with metabolic rate and organ function than weight alone, which is why BSA-based dosing is the standard for chemotherapy and many pediatric medications. 1.73 m² represents the body surface area of a "reference" adult, so this scales the standard adult dose up or down for a patient whose BSA differs from that reference.',
      variables: {
        patientBsa: "The patient's body surface area, usually from the BSA (Mosteller) calculator.",
        adultDose: 'The standard adult dose for this medication.',
        patientDose: "The dose scaled to this patient's body surface area."
      },
      example: {
        problem: "If the standard adult dose of a drug is 100 mg, what is the approximate dose for a child with a BSA of 0.83 m²?",
        steps: [
          { label: 'Step 1 — Apply the formula', math: "\\text{Patient's dose} = \\dfrac{\\text{BSA}}{1.73} \\times \\text{Adult dose}" },
          { label: 'Step 2 — Substitute the known values', math: '\\text{Dose} = \\dfrac{0.83}{1.73} \\times 100' },
          { label: 'Step 3 — Calculate', math: '\\text{Dose} \\approx 48\\ \\text{mg}' }
        ],
        conclusion: "The child's dose is approximately 48 mg."
      },
      tips: [
        'Use the BSA (Mosteller) calculator first if you only have the patient\'s height and weight.',
        'BSA-based dosing is especially common for chemotherapy, where the therapeutic window is narrow and accurate scaling matters most.'
      ]
    }
  },
  {
    id: 'bsa-mosteller',
    title: 'BSA (Mosteller)',
    category: 'clinical',
    formulaText: 'BSA = √(height × weight / 3600)',
    formulaLatex: 'BSA = \\sqrt{\\dfrac{\\text{height (cm)} \\times \\text{weight (kg)}}{3600}}',
    description: "A patient's body surface area, estimated from height and weight using the Mosteller formula.",
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'height', label: 'Height', unitType: 'length', defaultUnit: 'cm' },
      { key: 'weight', label: 'Weight', unitType: 'mass', defaultUnit: 'kg' },
      { key: 'bsa', label: 'BSA (m²)', unitType: null }
    ],
    targets: ['bsa', 'height', 'weight'],
    solve(v, target) {
      const heightCm = v.height * 100; // base unit is m
      const weightKg = v.weight / 1000; // base unit is grams
      if (target === 'bsa') return Math.sqrt((heightCm * weightKg) / 3600);
      if (target === 'height') return (Math.pow(v.bsa, 2) * 3600 / weightKg) / 100;
      if (target === 'weight') return (Math.pow(v.bsa, 2) * 3600 / heightCm) * 1000;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'Body surface area is used throughout medicine to scale doses and physiological measurements (like creatinine clearance) to an individual patient. The Mosteller formula is the most widely used BSA equation today because it\'s simple to calculate and closely matches more complex historical formulas (like Du Bois) across the normal weight range.',
      variables: {
        height: "The patient's height.",
        weight: "The patient's weight.",
        bsa: 'The estimated body surface area.'
      },
      example: {
        problem: 'Calculate the BSA for a patient measuring 165 cm in height and weighing 65 kg.',
        steps: [
          { label: 'Step 1 — Apply the formula', math: 'BSA = \\sqrt{\\dfrac{\\text{height} \\times \\text{weight}}{3600}}' },
          { label: 'Step 2 — Substitute the known values', math: 'BSA = \\sqrt{\\dfrac{165 \\times 65}{3600}}' },
          { label: 'Step 3 — Calculate', math: 'BSA \\approx 1.73\\ m^2' }
        ],
        conclusion: 'The patient has a BSA of approximately 1.73 m² — coincidentally, the exact "reference adult" value used in BSA-based dosing.'
      },
      tips: [
        'This BSA figure feeds directly into the Dose by BSA and Adjusted CrCl calculators.',
        'The Mosteller formula is considered accurate across the typical adult and pediatric weight range, but like all BSA formulas, becomes less reliable at extremes of body size.'
      ]
    }
  },
  {
    id: 'ibw-male',
    title: 'IBW (Male)',
    category: 'clinical',
    formulaText: 'IBW (male) = 50 kg + 2.3 kg × (height in inches − 60)',
    formulaLatex: 'IBW_{male} = 50 + 2.3 \\times (\\text{height (in)} - 60)',
    description: "A male patient's ideal body weight, estimated from height using the Devine formula — widely used for dosing medications with a narrow therapeutic margin.",
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'height', label: 'Height', unitType: 'length', defaultUnit: 'inch' },
      { key: 'ibw', label: 'IBW (kg)', unitType: null }
    ],
    targets: ['ibw', 'height'],
    solve(v, target) {
      const heightIn = v.height / 0.0254; // base unit is m
      if (target === 'ibw') return 50 + 2.3 * (heightIn - 60);
      if (target === 'height') return ((v.ibw - 50) / 2.3 + 60) * 0.0254;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: "Ideal body weight (IBW) estimates a patient's weight at a healthy build for their height, independent of their actual (possibly over- or under-weight) body mass. The Devine formula is the most widely used IBW equation for drug dosing, since some medications should be dosed to IBW rather than actual weight to avoid over- or under-dosing in patients who are notably heavier or lighter than average.",
      variables: {
        height: "The patient's height (the formula is defined in inches over 5 feet).",
        ibw: 'The estimated ideal body weight.'
      },
      example: {
        problem: 'Calculate the IBW for a male patient who is 5 ft 8 in tall.',
        steps: [
          { label: 'Step 1 — Convert height to inches', math: '5\\ \\text{ft}\\ 8\\ \\text{in} = 68\\ \\text{in}' },
          { label: 'Step 2 — Apply the formula', math: 'IBW = 50 + 2.3 \\times (\\text{height} - 60)' },
          { label: 'Step 3 — Substitute the known values', math: 'IBW = 50 + 2.3 \\times (68 - 60)' },
          { label: 'Step 4 — Calculate', math: 'IBW = 50 + 18.4 = 68.4\\ \\text{kg}' }
        ],
        conclusion: "The patient's ideal body weight is 68.4 kg."
      },
      tips: [
        'The Devine formula is defined for adult heights over 5 feet (60 inches) — it isn\'t meant for pediatric use.',
        'Some drugs (especially in obese patients) are dosed using an "adjusted body weight" that blends IBW and actual weight — IBW alone isn\'t always the right figure to use.'
      ]
    }
  },
  {
    id: 'ibw-female',
    title: 'IBW (Female)',
    category: 'clinical',
    formulaText: 'IBW (female) = 45.5 kg + 2.3 kg × (height in inches − 60)',
    formulaLatex: 'IBW_{female} = 45.5 + 2.3 \\times (\\text{height (in)} - 60)',
    description: "A female patient's ideal body weight, estimated from height using the Devine formula.",
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'height', label: 'Height', unitType: 'length', defaultUnit: 'inch' },
      { key: 'ibw', label: 'IBW (kg)', unitType: null }
    ],
    targets: ['ibw', 'height'],
    solve(v, target) {
      const heightIn = v.height / 0.0254;
      if (target === 'ibw') return 45.5 + 2.3 * (heightIn - 60);
      if (target === 'height') return ((v.ibw - 45.5) / 2.3 + 60) * 0.0254;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: "Same purpose as the male Devine formula — estimating a healthy-build weight from height for drug dosing purposes — with a lower starting constant (45.5 kg vs. 50 kg) reflecting average differences in body composition.",
      variables: {
        height: "The patient's height.",
        ibw: 'The estimated ideal body weight.'
      },
      example: {
        problem: 'Calculate the IBW for a female patient measuring 160 cm in height.',
        steps: [
          { label: 'Step 1 — Convert height to inches', math: '160\\ \\text{cm} \\approx 63\\ \\text{in}' },
          { label: 'Step 2 — Apply the formula', math: 'IBW = 45.5 + 2.3 \\times (\\text{height} - 60)' },
          { label: 'Step 3 — Substitute the known values', math: 'IBW = 45.5 + 2.3 \\times (63 - 60)' },
          { label: 'Step 4 — Calculate', math: 'IBW = 45.5 + 6.9 = 52.4\\ \\text{kg}' }
        ],
        conclusion: "The patient's ideal body weight is 52.4 kg."
      },
      tips: [
        'Enter height directly in cm using the unit dropdown — no need to convert to inches by hand.',
        'Like the male version, this formula applies to adult heights over 5 feet.'
      ]
    }
  },
  {
    id: 'iron-requirement',
    title: 'Iron Requirement',
    category: 'clinical',
    formulaText: 'Iron (mg) = weight (lb) × 0.3 × [100 − (Hb × 100/14.8)]',
    formulaLatex: '\\text{Iron (mg)} = \\text{weight (lb)} \\times 0.3 \\times \\left[100 - \\dfrac{Hb \\times 100}{14.8}\\right]',
    description: 'A simplified estimate of total iron deficit needed to correct anemia, based on body weight and current hemoglobin relative to a normal reference value.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'weight', label: 'Weight', unitType: 'mass', defaultUnit: 'lb_general' },
      { key: 'hb', label: 'Hemoglobin, Hb (g/dL)', unitType: null },
      { key: 'iron', label: 'Iron requirement (mg)', unitType: null }
    ],
    targets: ['iron', 'weight', 'hb'],
    solve(v, target) {
      const weightLb = v.weight / 453.592; // base unit is grams; 453.592 g = 1 lb
      if (target === 'iron') return weightLb * 0.3 * (100 - (v.hb * 100 / 14.8));
      if (target === 'weight') return (v.iron / (0.3 * (100 - (v.hb * 100 / 14.8)))) * 453.592;
      if (target === 'hb') return ((100 - v.iron / (0.3 * weightLb)) * 14.8) / 100;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'This estimates the total iron deficit as a percentage shortfall from a normal hemoglobin reference (14.8 g/dL), scaled by body weight. It\'s a simplified teaching formula for estimating total-dose iron replacement therapy — modern clinical practice more often uses the Ganzoni formula, which works directly from a target and current Hb in the same units rather than a percentage-of-normal approach.',
      variables: {
        weight: "The patient's body weight.",
        hb: "The patient's current hemoglobin level.",
        iron: 'The estimated total iron dose needed to correct the deficit.'
      },
      example: {
        problem: 'Calculate the iron requirement for a patient weighing 150 lb with a hemoglobin of 8 g/dL.',
        steps: [
          { label: 'Step 1 — Find the Hb deficit percentage', math: '\\dfrac{8 \\times 100}{14.8} \\approx 54.1\\%' },
          { label: 'Step 2 — Find the remaining percentage', math: '100 - 54.1 = 45.9\\%' },
          { label: 'Step 3 — Apply the formula', math: '\\text{Iron} = 150 \\times 0.3 \\times 45.9' },
          { label: 'Step 4 — Calculate', math: '\\text{Iron} \\approx 2068\\ \\text{mg}' }
        ],
        conclusion: 'This patient has an estimated total iron requirement of about 2068 mg.'
      },
      tips: [
        'This is a simplified educational formula — real-world IV iron dosing protocols (e.g. the Ganzoni formula, used on many product labels) may give a different figure and should be used for actual clinical dosing decisions.',
        'The total dose is typically split into multiple administrations rather than given all at once — check the specific iron product\'s dosing guidance.'
      ]
    }
  },
  {
    id: 'bmi',
    title: 'BMI',
    category: 'clinical',
    formulaText: 'BMI = weight / height²',
    formulaLatex: 'BMI = \\dfrac{\\text{weight (kg)}}{\\text{height (m)}^2}',
    description: 'Body Mass Index — a simple screening measure relating weight to height, used to classify underweight, normal, overweight, and obese ranges.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'weight', label: 'Weight', unitType: 'mass', defaultUnit: 'kg' },
      { key: 'height', label: 'Height', unitType: 'length', defaultUnit: 'm' },
      { key: 'bmi', label: 'BMI (kg/m²)', unitType: null }
    ],
    targets: ['bmi', 'weight', 'height'],
    solve(v, target) {
      const weightKg = v.weight / 1000; // base unit is grams
      if (target === 'bmi') return weightKg / Math.pow(v.height, 2);
      if (target === 'weight') return (v.bmi * Math.pow(v.height, 2)) * 1000;
      if (target === 'height') return Math.sqrt(weightKg / v.bmi);
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'BMI is a simple, widely-used screening tool relating body weight to height. It doesn\'t distinguish fat from muscle mass, so it can be misleading for very muscular individuals or in populations with different average builds, but it remains a quick, standard first-pass classification.',
      variables: {
        weight: "The patient's weight.",
        height: "The patient's height.",
        bmi: 'Body Mass Index.'
      },
      example: {
        problem: 'Calculate the BMI for a person weighing 70 kg with a height of 1.75 m.',
        steps: [
          { label: 'Step 1 — Square the height', math: '1.75^2 = 3.0625' },
          { label: 'Step 2 — Apply the formula', math: 'BMI = \\dfrac{\\text{weight}}{\\text{height}^2}' },
          { label: 'Step 3 — Substitute the known values', math: 'BMI = \\dfrac{70}{3.0625}' },
          { label: 'Step 4 — Calculate', math: 'BMI \\approx 22.86' }
        ],
        conclusion: 'A BMI of 22.86 falls in the standard "normal weight" range (18.5–24.9).'
      },
      tips: [
        'Standard adult ranges: below 18.5 underweight, 18.5–24.9 normal, 25–29.9 overweight, 30+ obese — these cutoffs are for adults and don\'t apply directly to children.',
        'BMI is a screening tool, not a diagnosis — it doesn\'t account for muscle mass, fat distribution, age, or sex differences in body composition.'
      ]
    }
  }
];
