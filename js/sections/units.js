import { UNIT_FAMILIES, TEMPERATURE_UNITS, toBaseUnit, fromBaseUnit, unitsFor } from '../core/unit-data.js';
import { renderSectionNav } from '../core/section-nav.js';
import { setPageMeta } from '../core/page-meta.js';

const TYPE_LABELS = {
  mass: 'Mass', volume: 'Volume', amount: 'Amount (moles)', length: 'Length',
  time: 'Time', concentration: 'Lab Concentration', radioactivity: 'Radioactivity',
  temperature: 'Temperature'
};
const ALL_TYPES = [...Object.keys(UNIT_FAMILIES), 'temperature'];

export function render(container) {
  setPageMeta('Unit Converter', "Convert between mass, volume, temperature, time, lab concentration, and radioactivity units.");
  container.innerHTML = `
    <div class="hero"><h1>Unit converter</h1><p>Convert between mass, volume, temperature, and other common units. The same conversion tables are used inside every calculator's unit dropdowns.</p></div>
    <section class="calc-card">
      <div class="field">
        <label>Quantity type</label>
        <select id="unit-type"></select>
      </div>
      <div class="unit-convert-row">
        <input id="unit-value" type="number" step="any" autocomplete="off" placeholder="Value">
        <select id="unit-from"></select>
        <span class="unit-convert-arrow">→</span>
        <select id="unit-to"></select>
      </div>
      <div class="result-box" id="unit-result">Enter a value above.</div>
    </section>
  `;
  renderSectionNav(container, 'units');

  const typeSelect = container.querySelector('#unit-type');
  const fromSelect = container.querySelector('#unit-from');
  const toSelect = container.querySelector('#unit-to');
  const valueInput = container.querySelector('#unit-value');
  const resultBox = container.querySelector('#unit-result');

  for (const t of ALL_TYPES) {
    const opt = document.createElement('option');
    opt.value = t;
    opt.textContent = TYPE_LABELS[t] || t;
    typeSelect.appendChild(opt);
  }

  function populateUnitSelects() {
    const type = typeSelect.value;
    const units = type === 'temperature' ? TEMPERATURE_UNITS : unitsFor(type);
    for (const sel of [fromSelect, toSelect]) {
      sel.innerHTML = '';
      for (const u of units) {
        const opt = document.createElement('option');
        opt.value = u;
        opt.textContent = u;
        sel.appendChild(opt);
      }
    }
    if (units.length > 1) toSelect.selectedIndex = 1;
  }

  function convert() {
    const type = typeSelect.value;
    const raw = parseFloat(valueInput.value);
    if (!Number.isFinite(raw)) { resultBox.textContent = 'Enter a value above.'; return; }
    const base = toBaseUnit(raw, type, fromSelect.value);
    const out = fromBaseUnit(base, type, toSelect.value);
    resultBox.innerHTML = `<strong>${raw} ${fromSelect.value} = ${Math.round(out * 1e6) / 1e6} ${toSelect.value}</strong>`;
  }

  typeSelect.addEventListener('change', () => { populateUnitSelects(); convert(); });
  fromSelect.addEventListener('change', convert);
  toSelect.addEventListener('change', convert);
  valueInput.addEventListener('input', convert);

  populateUnitSelects();
}
