/*
  calc-engine.js
  --------------
  Renders any calculator from its declarative definition (see
  js/calculators/*.js). This is the one place that knows how to:
    - build the molecule-name -> molecular weight autofill (point f)
    - build smart-fields with inline unit conversion (point g)
    - auto-detect which single field the user left empty and solve for it
    - render the formula with KaTeX, falling back to plain text if KaTeX
      hasn't loaded (e.g. offline)
    - lay the calculator card and its description card side by side, when
      the calculator has a description (see js/core/description-panel.js).
      The description card is height-matched to the calculator card and
      only scrolls internally if its content is taller. Calculators without
      descriptionContent yet just render as a single card, as before.

  Adding a new calculator never touches this file — see the comment at the
  top of js/calculators/fundamental.js for the pattern.
*/
import { parseFormula } from './molecule-data.js';
import { createSmartField } from './smart-field.js';
import { COMMON_VALENCY } from './valency-data.js';
import { formatPair, roundIfClose } from './format.js';
import { renderDescriptionPanel } from './description-panel.js';

export function renderCalculator(container, calc) {
  // Clean up any leftover listener/observer from a previously-rendered
  // calculator page before building this one — container (#app) persists
  // across navigations, so without this, resize listeners would stack up
  // the same way the Calculators page's click listener used to.
  if (container._calcCleanup) {
    container._calcCleanup();
    container._calcCleanup = null;
  }

  container.innerHTML = '';
  container.classList.toggle('is-wide', !!calc.descriptionContent);

  const hasDescription = !!calc.descriptionContent;

  const h2 = document.createElement('h2');
  h2.className = 'calc-page-title';
  h2.textContent = calc.title;
  container.appendChild(h2);

  // leftCol is where the calculator itself gets built. Without a
  // description, leftCol is just a single self-contained card (old
  // behaviour). With a description, leftCol and rightCol are two separate
  // cards sitting side by side inside .calc-layout.
  let leftCol;
  let rightCol = null;

  if (hasDescription) {
    const layout = document.createElement('div');
    layout.className = 'calc-layout';
    leftCol = document.createElement('div');
    leftCol.className = 'calc-left';
    rightCol = document.createElement('div');
    rightCol.className = 'calc-right';
    layout.appendChild(leftCol);
    layout.appendChild(rightCol);
    container.appendChild(layout);
    renderDescriptionPanel(rightCol, calc);
  } else {
    leftCol = document.createElement('section');
    leftCol.className = 'calc-card';
    container.appendChild(leftCol);
  }

  const formula = document.createElement('div');
  formula.className = 'calc-formula';
  leftCol.appendChild(formula);
  renderFormula(formula, calc);

  if (calc.description) {
    const desc = document.createElement('p');
    desc.className = 'calc-desc';
    desc.textContent = calc.description;
    leftCol.appendChild(desc);
  }

  // ---- Molecular weight (+ optional molecule-name autofill, + valency) ----
  let moleculeInput = null;
  let mwField = null;
  let valencyInput = null;
  let moleculeStatus = null;

  if (calc.molecule) {
    const group = document.createElement('div');
    group.className = 'field-group field-group-optional';
    const groupLabel = document.createElement('div');
    groupLabel.className = 'field-group-label';
    groupLabel.textContent = 'Molecular weight (required for this formula)';
    group.appendChild(groupLabel);

    mwField = createSmartField({ key: 'mw', label: 'Molecular weight (g/mol)', unitType: null });
    group.appendChild(mwField.wrapper);

    const moleculeWrap = document.createElement('div');
    moleculeWrap.className = 'field';
    const moleculeLabel = document.createElement('label');
    moleculeLabel.textContent = 'Or type a molecule / formula to fill it in automatically (optional)';
    moleculeInput = document.createElement('input');
    moleculeInput.type = 'text';
    moleculeInput.autocomplete = 'off';
    moleculeInput.placeholder = 'e.g. NaOH, H2SO4, CuSO4.5H2O';
    moleculeStatus = document.createElement('div');
    moleculeStatus.className = 'field-hint';
    moleculeWrap.appendChild(moleculeLabel);
    moleculeWrap.appendChild(moleculeInput);
    moleculeWrap.appendChild(moleculeStatus);
    group.appendChild(moleculeWrap);

    if (calc.hasValency) {
      const valWrap = document.createElement('div');
      valWrap.className = 'field';
      const valLabel = document.createElement('label');
      valLabel.textContent = 'Valency / n-factor';
      valencyInput = document.createElement('input');
      valencyInput.type = 'number';
      valencyInput.step = 'any';
      valencyInput.autocomplete = 'off';
      valencyInput.placeholder = 'e.g. 1 for NaOH, 2 for H2SO4';
      valWrap.appendChild(valLabel);
      valWrap.appendChild(valencyInput);
      const valHint = document.createElement('div');
      valHint.className = 'field-hint';
      valHint.textContent = 'Depends on the reaction — auto-filled as a common default, check before use.';
      valWrap.appendChild(valHint);
      group.appendChild(valWrap);
    }

    leftCol.appendChild(group);

    moleculeInput.addEventListener('input', () => {
      const name = moleculeInput.value.trim();
      if (!name) { moleculeStatus.textContent = ''; return; }
      const { weight, error } = parseFormula(name);
      if (error) {
        moleculeStatus.textContent = error;
        moleculeStatus.classList.add('is-error');
      } else {
        const cleanWeight = roundIfClose(weight);
        mwField.setBaseValue(cleanWeight);
        moleculeStatus.textContent = `${name} = ${formatPair(weight)} g/mol`;
        moleculeStatus.classList.remove('is-error');
        if (valencyInput && !valencyInput.value && COMMON_VALENCY[name.toLowerCase()] !== undefined) {
          valencyInput.value = COMMON_VALENCY[name.toLowerCase()];
        }
      }
    });
  }

  // ---- Primary fields: fill any two of three, leave one blank ----
  const primaryGroup = document.createElement('div');
  primaryGroup.className = 'field-group';
  if (calc.fields.length > 2) {
    const hint = document.createElement('div');
    hint.className = 'field-group-label';
    hint.textContent = 'Fill in all but one — that one will be calculated';
    primaryGroup.appendChild(hint);
  }
  const smartFields = {};
  for (const f of calc.fields) {
    const sf = createSmartField(f);
    smartFields[f.key] = sf;
    primaryGroup.appendChild(sf.wrapper);
  }
  leftCol.appendChild(primaryGroup);

  const resultBox = document.createElement('div');
  resultBox.className = 'result-box';
  resultBox.textContent = 'Fill in the fields above and press Calculate.';

  // ---- Buttons: Calculate / Clear / Close ----
  const buttonRow = document.createElement('div');
  buttonRow.className = 'calc-buttons';

  const calcBtn = document.createElement('button');
  calcBtn.className = 'btn-primary';
  calcBtn.textContent = 'Calculate';

  const clearBtn = document.createElement('button');
  clearBtn.className = 'btn-secondary';
  clearBtn.type = 'button';
  clearBtn.textContent = 'Clear';

  const closeBtn = document.createElement('a');
  closeBtn.className = 'btn-secondary btn-close';
  closeBtn.href = `/calculators`;
  closeBtn.textContent = 'Close';

  buttonRow.appendChild(clearBtn);
  buttonRow.appendChild(calcBtn);
  buttonRow.appendChild(closeBtn);
  leftCol.appendChild(buttonRow);
  leftCol.appendChild(resultBox);

  clearBtn.addEventListener('click', () => {
    for (const key in smartFields) smartFields[key].clear();
    if (moleculeInput) { moleculeInput.value = ''; moleculeStatus.textContent = ''; mwField.clear(); }
    if (valencyInput) valencyInput.value = '';
    resultBox.classList.remove('is-error');
    resultBox.textContent = 'Fill in the fields above and press Calculate.';
    syncDescriptionHeight();
  });

  calcBtn.addEventListener('click', () => {
    const values = {};
    const emptyKeys = [];
    for (const key in smartFields) {
      const v = smartFields[key].getBaseValue();
      if (v === null) emptyKeys.push(key);
      else values[key] = v;
    }

    if (emptyKeys.length === 0) {
      showError(resultBox, 'All fields are filled — clear one to calculate it (or use "Clear" to start over).');
      return;
    }
    if (emptyKeys.length > 1) {
      const labels = emptyKeys.map(k => calc.fields.find(f => f.key === k).label).join(', ');
      showError(resultBox, `Please fill in all but one field. Still empty: ${labels}.`);
      return;
    }
    const target = emptyKeys[0];

    if (calc.molecule) {
      const mw = mwField.getBaseValue();
      if (mw === null) { showError(resultBox, 'This formula needs molecular weight — enter it directly above, or type a molecule name to auto-fill it.'); return; }
      if (mw <= 0) { showError(resultBox, 'Molecular weight must be greater than zero.'); return; }
      values.mw = mw;
    }
    if (calc.hasValency) {
      const val = parseFloat(valencyInput.value);
      if (!Number.isFinite(val) || val <= 0) { showError(resultBox, 'Enter a valency / n-factor.'); return; }
      values.valency = val;
    }

    // Physical quantities (mass, volume, concentration, MW, valency) can't be
    // negative — catch that before it produces a confusing result.
    for (const key in values) {
      if (values[key] < 0) {
        const f = calc.fields.find(f => f.key === key);
        showError(resultBox, `${f ? f.label : key} can't be negative — check your inputs.`);
        return;
      }
    }

    let resultValue;
    try {
      resultValue = calc.solve(values, target);
    } catch (e) {
      showError(resultBox, e.message);
      return;
    }

    if (!Number.isFinite(resultValue)) {
      showError(resultBox, "Couldn't calculate that — one of the values above (like a volume of 0) makes this division impossible. Check your inputs.");
      return;
    }
    if (resultValue < 0) {
      const targetFieldForCheck = calc.fields.find(f => f.key === target);
      showError(resultBox, `That would give a negative ${(targetFieldForCheck ? targetFieldForCheck.label : target).toLowerCase()}, which isn't physically possible — check your inputs.`);
      return;
    }

    values[target] = resultValue;
    smartFields[target].setBaseValue(resultValue);

    const targetField = calc.fields.find(f => f.key === target);
    let html = `<strong>${targetField.label}: ${formatPair(resultValue)}</strong>`;

    // Bonus: whenever a molecule is known and a "weight" field exists, surface
    // the required grams regardless of which field was actually solved for.
    if (calc.molecule && moleculeInput.value.trim() && values.weight !== undefined && values.weight !== null) {
      html += `<div class="result-sub">≈ ${formatPair(values.weight)} g of ${moleculeInput.value.trim()}</div>`;
    }
    resultBox.classList.remove('is-error');
    resultBox.innerHTML = html;
    syncDescriptionHeight();
  });

  // ---- Match the description card's height to the calculator card's,
  // scrolling internally only if the description content is taller. ----
  function syncDescriptionHeight() {
    if (!rightCol) return;
    if (window.innerWidth <= 760) {
      rightCol.style.maxHeight = 'none';
      rightCol.style.overflowY = 'visible';
      return;
    }
    const leftHeight = leftCol.getBoundingClientRect().height;
    rightCol.style.maxHeight = leftHeight + 'px';
    rightCol.style.overflowY = 'auto';
  }

  if (rightCol) {
    let ro = null;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => syncDescriptionHeight());
      ro.observe(leftCol);
    } else {
      window.addEventListener('resize', syncDescriptionHeight);
    }
    container._calcCleanup = () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', syncDescriptionHeight);
    };
    // Run once after this element is actually in the document (next frame),
    // since heights are 0 until it's attached and laid out.
    requestAnimationFrame(syncDescriptionHeight);
  }
}

function showError(resultBox, message) {
  resultBox.classList.add('is-error');
  resultBox.innerHTML = `<span class="is-error">${message}</span>`;
}

function renderFormula(el, calc) {
  if (window.katex && calc.formulaLatex) {
    try {
      window.katex.render(calc.formulaLatex, el, { throwOnError: false });
      return;
    } catch (e) {
      // fall through to plain text
    }
  }
  el.textContent = calc.formulaText || '';
}
