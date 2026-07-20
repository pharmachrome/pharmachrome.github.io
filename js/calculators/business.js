/*
  business.js
  -----------
  Category: business — basic pharmacy economics. In the old site these were
  tagged under "fundamental," but grouping them with concentration
  calculators didn't make thematic sense, so they get their own category
  here instead.
*/

export const CALCULATORS = [
  {
    id: 'benefit-to-cost-ratio',
    title: 'Benefit-to-Cost Ratio',
    category: 'business',
    formulaText: 'BCR = total benefits / total costs',
    formulaLatex: 'BCR = \\dfrac{\\text{total benefits}}{\\text{total costs}}',
    description: 'Compares the monetary value of benefits to the cost of achieving them — a basic tool for evaluating whether a program or intervention is worth its cost.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'benefits', label: 'Total benefits ($)', unitType: null },
      { key: 'costs', label: 'Total costs ($)', unitType: null },
      { key: 'bcr', label: 'Benefit-to-cost ratio', unitType: null }
    ],
    targets: ['bcr', 'benefits', 'costs'],
    solve(v, target) {
      if (target === 'bcr') return v.benefits / v.costs;
      if (target === 'benefits') return v.bcr * v.costs;
      if (target === 'costs') return v.benefits / v.bcr;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'A BCR above 1 means the benefits outweigh the costs (the higher above 1, the more favorable); a BCR below 1 means the program costs more than the value it returns. It\'s a simple, widely-used first-pass tool for comparing whether a clinical or pharmacy program is worth continuing or investing in — for example, comparing the cost of a medication therapy management program to the value of hospitalizations it prevents.',
      variables: {
        benefits: 'The total monetary value of benefits gained.',
        costs: 'The total monetary cost of achieving those benefits.',
        bcr: 'The resulting benefit-to-cost ratio.'
      },
      example: {
        problem: 'A clinical pharmacy program costs $2000 to run and is estimated to provide $8500 in benefits (e.g. avoided hospitalizations). What is the BCR?',
        steps: [
          { label: 'Step 1 — Apply the formula', math: 'BCR = \\dfrac{\\text{total benefits}}{\\text{total costs}}' },
          { label: 'Step 2 — Substitute the known values', math: 'BCR = \\dfrac{8500}{2000}' },
          { label: 'Step 3 — Calculate', math: 'BCR = 4.25' }
        ],
        conclusion: 'A BCR of 4.25 means the program returns $4.25 in benefit for every $1 spent — a strongly favorable ratio.'
      },
      tips: [
        'BCR doesn\'t account for how the benefits and costs are distributed over time — a full economic evaluation would also consider discounting future value.',
        'Putting a monetary value on clinical benefits (like quality of life or avoided harm) is often the hardest and most debatable part of this calculation, not the arithmetic itself.'
      ]
    }
  },
  {
    id: 'cost-to-effectiveness-ratio',
    title: 'Cost-to-Effectiveness Ratio (C/E)',
    category: 'business',
    formulaText: 'C/E = total costs / effectiveness (units of outcome)',
    formulaLatex: '\\dfrac{C}{E} = \\dfrac{\\text{total costs}}{\\text{effectiveness}}',
    description: 'The cost required to achieve one unit of a clinical outcome — used to compare the economic efficiency of different treatments or interventions.',
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'costs', label: 'Total costs ($)', unitType: null },
      { key: 'effectiveness', label: 'Effectiveness (outcome units)', unitType: null },
      { key: 'ce', label: 'Cost per unit of effectiveness ($)', unitType: null }
    ],
    targets: ['ce', 'costs', 'effectiveness'],
    solve(v, target) {
      if (target === 'ce') return v.costs / v.effectiveness;
      if (target === 'costs') return v.ce * v.effectiveness;
      if (target === 'effectiveness') return v.costs / v.ce;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'Unlike BCR, which needs a dollar value for benefits, cost-effectiveness compares cost against a clinical outcome measured in its own natural units (like number of infections prevented, or life-years gained) — useful when it\'s hard or inappropriate to assign a direct monetary value to a health outcome.',
      variables: {
        costs: 'The total cost of the intervention.',
        effectiveness: 'The clinical outcome achieved, in its own natural units.',
        ce: 'The cost per unit of effectiveness achieved.'
      },
      example: {
        problem: 'A screening program costs $1000 and identifies 50 additional cases of a condition. What is the cost per case identified?',
        steps: [
          { label: 'Step 1 — Apply the formula', math: '\\dfrac{C}{E} = \\dfrac{\\text{total costs}}{\\text{effectiveness}}' },
          { label: 'Step 2 — Substitute the known values', math: '\\dfrac{C}{E} = \\dfrac{1000}{50}' },
          { label: 'Step 3 — Calculate', math: '\\dfrac{C}{E} = 20' }
        ],
        conclusion: 'The program costs $20 per additional case identified.'
      },
      tips: [
        'A C/E ratio only becomes meaningful compared against an alternative — $20 per case identified is only "good" or "bad" relative to what another screening approach would cost per case.',
        'Effectiveness should be a genuine outcome measure (cases found, symptom-free days, etc.), not just an activity count (like number of patients screened) — the distinction matters for a valid comparison.'
      ]
    }
  },
  {
    id: 'prescription-price',
    title: 'Prescription Price',
    category: 'business',
    formulaText: 'Price = cost + (cost × markup %)',
    formulaLatex: '\\text{Price} = \\text{cost} + \\left(\\text{cost} \\times \\dfrac{\\text{markup \\%}}{100}\\right)',
    description: "A prescription's dispensing price, given the drug's acquisition cost and a markup percentage (e.g. a pharmacy's standard margin).",
    molecule: false,
    hasValency: false,
    fields: [
      { key: 'cost', label: 'Acquisition cost ($)', unitType: null },
      { key: 'markupPercent', label: 'Markup (%)', unitType: null },
      { key: 'price', label: 'Price ($)', unitType: null }
    ],
    targets: ['price', 'cost', 'markupPercent'],
    solve(v, target) {
      if (target === 'price') return v.cost + (v.cost * v.markupPercent) / 100;
      if (target === 'cost') return v.price / (1 + v.markupPercent / 100);
      if (target === 'markupPercent') return ((v.price - v.cost) / v.cost) * 100;
      throw new Error('Unknown target: ' + target);
    },
    descriptionContent: {
      meaning: 'This is a straightforward cost-plus-markup pricing model: the acquisition cost (what the pharmacy paid for the drug) plus a percentage margin to cover overhead, professional service, and profit. Actual reimbursement in many settings (insurance-negotiated rates, dispensing fees) is more complex than a pure markup, but this captures the basic underlying arithmetic.',
      variables: {
        cost: "The pharmacy's acquisition cost for the drug.",
        markupPercent: 'The markup percentage applied on top of cost.',
        price: 'The resulting price charged.'
      },
      example: {
        problem: "A drug's acquisition cost is $100. Applying a 20% markup, what is the dispensing price?",
        steps: [
          { label: 'Step 1 — Apply the formula', math: '\\text{Price} = \\text{cost} + \\left(\\text{cost} \\times \\dfrac{\\text{markup}}{100}\\right)' },
          { label: 'Step 2 — Substitute the known values', math: '\\text{Price} = 100 + \\left(100 \\times \\dfrac{20}{100}\\right)' },
          { label: 'Step 3 — Calculate', math: '\\text{Price} = 100 + 20 = 120' }
        ],
        conclusion: 'The dispensing price is $120.'
      },
      tips: [
        'This model doesn\'t include a separate dispensing fee, which many real-world pricing structures add on top of the cost-plus-markup amount.',
        'Insurance-reimbursed prescriptions are often set by a negotiated formula (e.g. AWP minus a discount, plus a fee) rather than a simple markup on acquisition cost — this calculator suits cash-pay or simplified pricing scenarios.'
      ]
    }
  }
];
