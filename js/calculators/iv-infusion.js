/*
  iv-infusion.js
  --------------
  Category: IV & infusion — gravity-fed drip rates and pump-based critical
  care infusion rates.
*/

export const CALCULATORS = [
  {
    id: 'iv-flow-rate',
    title: 'IV Flow Rate (Drops per Minute)',
    category: 'iv-infusion',
    formulaText: 'Rate (drops/min) = volume × drop factor / time',
    formulaLatex: '\\text{Rate} = \\dfrac{\\text{volume (mL)} \\times \\text{drop factor (drops/mL)}}{\\text{time (min)}}',
    description: 'The drip rate needed for a gravity-fed IV infusion to deliver a given volume over a given time.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'volume', label: 'Infusion volume', unitType: 'volume', defaultUnit: 'mL' },
      { key: 'dropFactor', label: 'Drop factor (drops/mL)', unitType: null },
      { key: 'time', label: 'Time', unitType: 'time', defaultUnit: 'min' },
      { key: 'rate', label: 'Rate (drops/min)', unitType: null }
    ],
    targets: ['rate', 'volume', 'dropFactor', 'time'],
    solve(v, target) {
      const volumeMl = v.volume * 1000; // base unit is L
      if (target === 'rate') return (volumeMl * v.dropFactor) / v.time;
      if (target === 'volume') return ((v.rate * v.time) / v.dropFactor) / 1000;
      if (target === 'dropFactor') return (v.rate * v.time) / volumeMl;
      if (target === 'time') return (volumeMl * v.dropFactor) / v.rate;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'Without an electronic pump, an IV infusion is controlled purely by counting drops, so the rate has to be converted from a volume-over-time order into drops-per-minute using the specific administration set\'s drop factor (how many drops make up 1 mL — this varies by IV tubing set, typically 10, 15, or 20 for standard sets, or 60 for a micro-drip set).',
      variables: {
        volume: 'Total fluid volume to be infused.',
        dropFactor: "The IV administration set's drop factor, printed on the tubing packaging.",
        time: 'Total infusion time.',
        rate: 'The resulting drip rate to count and maintain.'
      },
      example: {
        problem: 'A 500 mL IV bag is to be infused over 5 hours using a set with a drop factor of 20 drops/mL. What is the drip rate?',
        steps: [
          { label: 'Step 1 — Convert time to minutes', math: '5\\ \\text{hr} \\times 60 = 300\\ \\text{min}' },
          { label: 'Step 2 — Apply the formula', math: '\\text{Rate} = \\dfrac{\\text{volume} \\times \\text{drop factor}}{\\text{time}}' },
          { label: 'Step 3 — Substitute the known values', math: '\\text{Rate} = \\dfrac{500 \\times 20}{300}' },
          { label: 'Step 4 — Calculate', math: '\\text{Rate} \\approx 33\\ \\text{drops/min}' }
        ],
        conclusion: 'Set the drip rate to approximately 33 drops per minute.'
      },
      tips: [
        'Drop factor is a property of the specific IV tubing set, not the fluid — always check the packaging rather than assuming a standard value.',
        'Micro-drip sets (60 drops/mL) are typically used for more precise, lower-volume infusions, such as in pediatrics.'
      ]
    }
  },
  {
    id: 'iv-infusion-rate',
    title: 'IV Infusion Rate (Critical Care)',
    category: 'iv-infusion',
    formulaText: 'Rate (mL/hr) = weight × dose × 60 / concentration',
    formulaLatex: '\\text{Rate (mL/hr)} = \\dfrac{\\text{weight (kg)} \\times \\text{dose (mcg/kg/min)} \\times 60}{\\text{concentration (mcg/mL)}}',
    description: 'The infusion pump rate needed to deliver a weight-based, per-minute dose of a critical care drug (like a vasopressor) at a given solution concentration.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'weight', label: 'Weight', unitType: 'mass', defaultUnit: 'kg' },
      { key: 'dose', label: 'Dose (mcg/kg/min)', unitType: null },
      { key: 'concentration', label: 'Concentration (mcg/mL)', unitType: null },
      { key: 'rate', label: 'Rate (mL/hr)', unitType: null }
    ],
    targets: ['rate', 'weight', 'dose', 'concentration'],
    solve(v, target) {
      const weightKg = v.weight / 1000; // base unit is grams
      if (target === 'rate') return (weightKg * v.dose * 60) / v.concentration;
      if (target === 'weight') return ((v.rate * v.concentration) / (v.dose * 60)) * 1000;
      if (target === 'dose') return (v.rate * v.concentration) / (weightKg * 60);
      if (target === 'concentration') return (weightKg * v.dose * 60) / v.rate;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'Critical care drugs (like dopamine, norepinephrine, or other vasopressors) are typically ordered as a per-minute, per-kilogram dose — but an infusion pump needs to be set in mL per hour. This converts one to the other, accounting for the patient\'s weight and how concentrated the prepared bag or syringe is.',
      variables: {
        weight: "The patient's body weight.",
        dose: 'The ordered dose rate, in micrograms per kilogram per minute.',
        concentration: 'How much drug is in each mL of the prepared solution.',
        rate: 'The resulting pump rate.'
      },
      example: {
        problem: 'A 70 kg patient is ordered a dopamine infusion at 5 mcg/kg/min, using a solution concentrated at 200 mcg/mL. What pump rate is needed?',
        steps: [
          { label: 'Step 1 — Multiply weight, dose, and the minutes-to-hours conversion', math: '70 \\times 5 \\times 60 = 21{,}000' },
          { label: 'Step 2 — Divide by the concentration', math: '\\dfrac{21{,}000}{200} = 105' }
        ],
        conclusion: 'Set the infusion pump to 105 mL/hr.'
      },
      tips: [
        'Double-check the concentration of the specific bag or syringe being used — this varies by pharmacy preparation and is easy to mix up between different standard concentrations.',
        'Small errors here are magnified over time on infusions running for hours — many institutions require an independent double-check of this calculation for high-alert drugs.'
      ]
    }
  }
];
