/*
  description-panel.js
  ---------------------
  Renders the right-hand description column next to a calculator: what the
  value means, what each variable is, a worked example (steps rendered with
  KaTeX), and practical tips. Content lives in each calculator's
  `descriptionContent` (see js/calculators/fundamental.js for the shape).

  All example content is written fresh for this site — not reproduced from
  any textbook — even when a textbook informed the accuracy of the concept.
*/

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function labelFor(calc, key) {
  const f = calc.fields.find(f => f.key === key);
  if (f) return f.label;
  if (key === 'mw') return 'Molecular weight (MW)';
  if (key === 'valency') return 'Valency (n-factor)';
  return key;
}

export function renderDescriptionPanel(container, calc) {
  const desc = calc.descriptionContent;
  if (!desc) {
    container.innerHTML = '<p class="field-hint">Description coming soon for this calculator.</p>';
    return;
  }

  let html = '';

  if (desc.meaning) {
    html += `<h4 class="desc-heading">What this measures</h4><p class="desc-text">${escapeHtml(desc.meaning)}</p>`;
  }

  if (desc.variables) {
    html += `<h4 class="desc-heading">Variables</h4><ul class="desc-list">`;
    for (const key in desc.variables) {
      html += `<li><b>${escapeHtml(labelFor(calc, key))}</b> — ${escapeHtml(desc.variables[key])}</li>`;
    }
    html += `</ul>`;
  }

  if (desc.example) {
    html += `<h4 class="desc-heading">Worked example</h4>`;
    if (desc.example.problem) html += `<p class="desc-text">${escapeHtml(desc.example.problem)}</p>`;
    html += `<div class="desc-steps">`;
    desc.example.steps.forEach(step => {
      html += `<div class="desc-step">`;
      html += `<p class="desc-step-label">${escapeHtml(step.label)}</p>`;
      if (step.math) html += `<div class="desc-step-math" data-latex="${encodeURIComponent(step.math)}"></div>`;
      if (step.note) html += `<p class="desc-text">${escapeHtml(step.note)}</p>`;
      html += `</div>`;
    });
    html += `</div>`;
    if (desc.example.conclusion) html += `<p class="desc-text"><strong>Conclusion:</strong> ${escapeHtml(desc.example.conclusion)}</p>`;
  }

  if (desc.tips && desc.tips.length) {
    html += `<h4 class="desc-heading">Practical tips</h4><ul class="desc-list">`;
    desc.tips.forEach(t => { html += `<li>${escapeHtml(t)}</li>`; });
    html += `</ul>`;
  }

  container.innerHTML = html;

  if (window.katex) {
    container.querySelectorAll('.desc-step-math').forEach(el => {
      const latex = decodeURIComponent(el.dataset.latex);
      try {
        window.katex.render(latex, el, { throwOnError: false, displayMode: true });
      } catch (e) {
        el.textContent = latex;
      }
    });
  }
}
