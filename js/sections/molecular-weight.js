import { parseFormula } from '../core/molecule-data.js';
import { formatPair } from '../core/format.js';
import { renderSectionNav } from '../core/section-nav.js';
import { setPageMeta } from '../core/page-meta.js';

export function render(container) {
  setPageMeta('Molecular Weight Calculator', "Calculate molecular weight from any chemical formula, computed from atomic mass — not looked up from a fixed list.");
  container.innerHTML = `
    <div class="hero"><h1>Molecular weight calculator</h1><p>Enter any chemical formula to calculate its molecular weight, computed directly from atomic mass rather than looked up from a fixed list.</p></div>
    <section class="calc-card">
      <div class="field">
        <label>Formula</label>
        <input id="mw-formula" type="text" autocomplete="off" placeholder="e.g. Ca3(PO4)2, CuSO4.5H2O">
      </div>
      <div class="result-box" id="mw-result">Enter a formula above.</div>
    </section>
  `;
  renderSectionNav(container, 'mw');

  const input = container.querySelector('#mw-formula');
  const resultBox = container.querySelector('#mw-result');

  input.addEventListener('input', () => {
    const formula = input.value.trim();
    if (!formula) { resultBox.textContent = 'Enter a formula above.'; return; }
    const { weight, error } = parseFormula(formula);
    if (error) {
      resultBox.innerHTML = `<span class="is-error">${error}</span>`;
    } else {
      resultBox.innerHTML = `<strong>${formula} = ${formatPair(weight)} g/mol</strong>`;
    }
  });
}
