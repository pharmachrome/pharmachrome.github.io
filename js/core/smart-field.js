/*
  smart-field.js
  --------------
  One reusable "value + unit dropdown" field. A calculator declares a field's
  unitType (mass, volume, temperature, ...) and gets inline unit conversion
  for free — the user can type "500" and pick "mg" instead of the field's
  default unit, with no need to leave the calculator. Internally everything
  is normalized to the base unit of its family before any formula runs.

  This is the single place point (g) "inline unit conversion" is implemented;
  every calculator reuses it rather than re-implementing conversion.
*/
import { toBaseUnit, fromBaseUnit, unitsFor } from './unit-data.js';

export function createSmartField({ key, label, unitType, defaultUnit, placeholder }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.dataset.key = key;

  const labelEl = document.createElement('label');
  labelEl.textContent = label;
  labelEl.htmlFor = `field-${key}`;

  const controlRow = document.createElement('div');
  controlRow.className = 'field-control';

  const input = document.createElement('input');
  input.type = 'number';
  input.step = 'any';
  input.autocomplete = 'off';
  input.id = `field-${key}`;
  input.placeholder = placeholder || '';
  controlRow.appendChild(input);

  let unitSelect = null;
  if (unitType) {
    unitSelect = document.createElement('select');
    unitSelect.className = 'unit-select';
    for (const u of unitsFor(unitType)) {
      const opt = document.createElement('option');
      opt.value = u;
      opt.textContent = u;
      if (u === defaultUnit) opt.selected = true;
      unitSelect.appendChild(opt);
    }
    controlRow.appendChild(unitSelect);
  }

  wrapper.appendChild(labelEl);
  wrapper.appendChild(controlRow);

  return {
    key,
    wrapper,
    input,
    unitSelect,

    /** Raw numeric value in whatever unit is currently selected, or null if empty/invalid. */
    getRawValue() {
      if (input.value === '' || input.value === null) return null;
      const n = parseFloat(input.value);
      return Number.isFinite(n) ? n : null;
    },

    /** Value converted to the base unit of its family (e.g. always grams, always litres). */
    getBaseValue() {
      const raw = this.getRawValue();
      if (raw === null) return null;
      if (!unitType) return raw;
      return toBaseUnit(raw, unitType, unitSelect.value);
    },

    /** Set the field's displayed value from a base-unit value (e.g. write grams, shown in whatever unit is selected). */
    setBaseValue(baseValue) {
      if (baseValue === null || baseValue === undefined || !Number.isFinite(baseValue)) {
        input.value = '';
        return;
      }
      const shown = unitType ? fromBaseUnit(baseValue, unitType, unitSelect.value) : baseValue;
      input.value = roundForDisplay(shown);
    },

    isEmpty() {
      return input.value === '' || input.value === null;
    },

    setReadOnly(readOnly) {
      input.readOnly = readOnly;
      wrapper.classList.toggle('is-result', readOnly);
    },

    clear() {
      input.value = '';
      wrapper.classList.remove('is-result');
    }
  };
}

function roundForDisplay(n) {
  if (Math.abs(n) >= 1000 || (Math.abs(n) < 0.001 && n !== 0)) return n.toPrecision(6);
  return Math.round(n * 1e6) / 1e6;
}
