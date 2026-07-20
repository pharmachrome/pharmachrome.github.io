/*
  temperature.js
  --------------
  Category: temperature — direct Fahrenheit/Centigrade/Kelvin conversions.
  Note: the site's Unit Converter page also handles temperature generically;
  these exist as direct, single-purpose calculators matching the old site.
*/

export const CALCULATORS = [
  {
    id: 'fahrenheit-centigrade',
    title: 'Fahrenheit and Centigrade',
    category: 'temperature',
    formulaText: 'C = (5/9)(F − 32)     F = (9/5)C + 32',
    formulaLatex: 'C = \\dfrac{5}{9}(F - 32) \\qquad F = \\dfrac{9}{5}C + 32',
    description: 'Converts between Fahrenheit and Celsius (Centigrade) temperature scales.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'fahrenheit', label: 'Fahrenheit (°F)', unitType: null },
      { key: 'centigrade', label: 'Centigrade (°C)', unitType: null }
    ],
    targets: ['centigrade', 'fahrenheit'],
    solve(v, target) {
      if (target === 'centigrade') return (5 / 9) * (v.fahrenheit - 32);
      if (target === 'fahrenheit') return (9 / 5) * v.centigrade + 32;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'Fahrenheit and Celsius use different zero points and different-sized degrees, so converting between them requires both an offset (32) and a scaling factor (9/5 or its reciprocal 5/9) — unlike Celsius and Kelvin, which share the same degree size and differ only by an offset.',
      variables: {
        fahrenheit: 'Temperature on the Fahrenheit scale.',
        centigrade: 'Temperature on the Celsius (Centigrade) scale.'
      },
      example: {
        problem: 'Convert 98.6°F (normal body temperature) to Celsius.',
        steps: [
          { label: 'Step 1 — Apply the formula', math: 'C = \\dfrac{5}{9}(F - 32)' },
          { label: 'Step 2 — Substitute the known value', math: 'C = \\dfrac{5}{9}(98.6 - 32)' },
          { label: 'Step 3 — Calculate', math: 'C = 37.0°C' }
        ],
        conclusion: '98.6°F equals exactly 37.0°C.'
      },
      tips: [
        'The two scales cross at −40° — this is the one temperature where Fahrenheit and Celsius read the same number.',
        'For quick, generic unit conversion (not just temperature), the site\'s Unit Converter page handles this and other unit families in one place.'
      ]
    }
  },
  {
    id: 'kelvin-centigrade',
    title: 'Kelvin and Centigrade',
    category: 'temperature',
    formulaText: 'K = C + 273.15',
    formulaLatex: 'K = C + 273.15',
    description: 'Converts between Kelvin (the absolute temperature scale) and Celsius.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'kelvin', label: 'Kelvin (K)', unitType: null },
      { key: 'centigrade', label: 'Centigrade (°C)', unitType: null }
    ],
    targets: ['kelvin', 'centigrade'],
    solve(v, target) {
      if (target === 'kelvin') return v.centigrade + 273.15;
      if (target === 'centigrade') return v.kelvin - 273.15;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'Kelvin and Celsius use the same size of degree — a 1-degree change means the same thing on both scales — so converting between them is a pure offset, no scaling needed. Kelvin\'s zero point (0 K, "absolute zero") is set at the coldest theoretically possible temperature, which happens to sit at −273.15°C.',
      variables: {
        kelvin: 'Temperature on the Kelvin (absolute) scale.',
        centigrade: 'Temperature on the Celsius (Centigrade) scale.'
      },
      example: {
        problem: 'Convert 25°C (room temperature) to Kelvin.',
        steps: [
          { label: 'Step 1 — Apply the formula', math: 'K = C + 273.15' },
          { label: 'Step 2 — Substitute the known value', math: 'K = 25 + 273.15' },
          { label: 'Step 3 — Calculate', math: 'K = 298.15\\ \\text{K}' }
        ],
        conclusion: '25°C equals 298.15 K.'
      },
      tips: [
        'Kelvin is never written with a degree symbol (°) — it\'s just "K," since it\'s an absolute scale, not a relative one.',
        'Because the degree size matches, a temperature difference in °C and in K is always the same number — only the starting point changes.'
      ]
    }
  },
  {
    id: 'kelvin-fahrenheit',
    title: 'Kelvin and Fahrenheit',
    category: 'temperature',
    formulaText: 'K = (5/9)(F − 32) + 273.15',
    formulaLatex: 'K = \\dfrac{5}{9}(F - 32) + 273.15',
    description: 'Converts directly between Kelvin and Fahrenheit, combining both the offset and scaling adjustments in one step.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'kelvin', label: 'Kelvin (K)', unitType: null },
      { key: 'fahrenheit', label: 'Fahrenheit (°F)', unitType: null }
    ],
    targets: ['kelvin', 'fahrenheit'],
    solve(v, target) {
      if (target === 'kelvin') return (5 / 9) * (v.fahrenheit - 32) + 273.15;
      if (target === 'fahrenheit') return (9 / 5) * (v.kelvin - 273.15) + 32;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: "This is simply the Fahrenheit-to-Celsius conversion and the Celsius-to-Kelvin offset combined into a single formula, for convenience when you only care about the Kelvin/Fahrenheit endpoints and don't need the intermediate Celsius value.",
      variables: {
        kelvin: 'Temperature on the Kelvin (absolute) scale.',
        fahrenheit: 'Temperature on the Fahrenheit scale.'
      },
      example: {
        problem: 'Convert 98.6°F (normal body temperature) directly to Kelvin.',
        steps: [
          { label: 'Step 1 — Apply the formula', math: 'K = \\dfrac{5}{9}(F - 32) + 273.15' },
          { label: 'Step 2 — Substitute the known value', math: 'K = \\dfrac{5}{9}(98.6 - 32) + 273.15' },
          { label: 'Step 3 — Calculate', math: 'K = 37.0 + 273.15 = 310.15\\ \\text{K}' }
        ],
        conclusion: '98.6°F equals 310.15 K.'
      },
      tips: [
        'This gives the same result as converting F → C → K in two steps — it just saves a step when Celsius itself isn\'t needed.',
        'All three temperature calculators (and the Unit Converter) are internally consistent — converting the same value through any path gives the same answer.'
      ]
    }
  }
];
