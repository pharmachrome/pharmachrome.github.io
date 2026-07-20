import { setPageMeta } from '../core/page-meta.js';

export function render(container) {
  setPageMeta(null, "A single place for pharmaceutical calculators, unit conversion, and molecular weight — built for pharmacy students and professionals.");
  container.innerHTML = `
    <div class="hero">
      <h1>Pharmaceutical Calculation Tools</h1>
      <p>A single place for pharmaceutical calculators, unit conversion, and molecular weight — built for pharmacy students and professionals.</p>
    </div>

    <div class="home-actions">
      <a class="action-tile" href="/calculators">
        <span class="action-tile-icon">℞</span>
        <span class="action-tile-label">Calculators</span>
        <span class="action-tile-desc">Normality, molarity, dosing, and other pharmaceutical formulas, with molecular weight built in.</span>
      </a>
      <a class="action-tile" href="/units">
        <span class="action-tile-icon">⇄</span>
        <span class="action-tile-label">Unit converter</span>
        <span class="action-tile-desc">Convert between mass, volume, and temperature units.</span>
      </a>
      <a class="action-tile" href="/mw">
        <span class="action-tile-icon">⚗</span>
        <span class="action-tile-label">Molecular weight calculator</span>
        <span class="action-tile-desc">Enter any chemical formula to calculate its molecular weight.</span>
      </a>
    </div>
  `;
}
