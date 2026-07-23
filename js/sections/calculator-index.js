import { renderCalculator } from '../core/calc-engine.js';
import { renderSectionNav } from '../core/section-nav.js';
import { CATEGORIES } from '../core/categories.js';
import { getPinned, togglePin } from '../core/pins.js';
import { setPageMeta } from '../core/page-meta.js';

async function loadCategory(categoryId) {
  const module = await import(`../calculators/${categoryId}.js`);
  return module.CALCULATORS;
}

async function loadAllCalculators() {
  // Load every category's module in parallel rather than one-at-a-time —
  // with 13 categories, sequentially awaiting each one turns into several
  // seconds of pure waiting even though nothing here actually depends on
  // another category finishing first.
  return Promise.all(
    CATEGORIES.map(async (cat) => ({
      category: cat,
      calculators: await loadCategory(cat.id)
    }))
  );
}

const PIN_SVG = `<svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M16 9V3H8v6l-2 2v2h5v7h2v-7h5v-2l-2-2z"/></svg>`;

function calcItemHTML(calc, pinnedIds) {
  const isPinned = pinnedIds.includes(calc.id);
  return `
    <div class="calc-item" data-id="${calc.id}" data-category="${calc.category}">
      <a class="calc-item-title" href="/calc/${calc.category}/${calc.id}">${calc.title}</a>
      <button type="button" class="pin-icon${isPinned ? ' pinned' : ''}" data-id="${calc.id}" aria-pressed="${isPinned}" aria-label="${isPinned ? 'Unpin' : 'Pin'} ${calc.title}">${PIN_SVG}</button>
    </div>
  `;
}

/** A heading + toggle button for one collapsible group (category or pinned). */
function groupHeadingHTML(label, expanded) {
  return `<h3 class="calc-group-heading-row"><button type="button" class="calc-group-heading" aria-expanded="${expanded}"><span>${label}</span><span class="calc-group-chevron" aria-hidden="true">▾</span></button></h3>`;
}

/** /calculators — search, pinned, and every category listed with its calculators directly underneath. */
export async function renderCalculatorsPage(container) {
  setPageMeta('Calculators', 'Browse 57+ pharmaceutical calculators by category — concentration, dosing, renal function, pharmacokinetics, and more.');
  container.innerHTML = '<p>Loading calculators…</p>';
  const groups = await loadAllCalculators();
  const allCalcs = groups.flatMap(g => g.calculators);
  const pinnedIds = getPinned();

  container.innerHTML = `
    <div class="hero"><h1>Calculators</h1><p>Fifty-plus pharmaceutical calculations, organized by category. Search by name or pin the ones you use most.</p></div>
    <div class="field" style="max-width:480px;margin:0 auto 24px;">
      <input id="calc-search" type="text" autocomplete="off" placeholder="Search calculators…">
    </div>
    <div id="pinned-group" class="calc-group" style="display:none;">
      ${groupHeadingHTML('📌 Pinned', 'true')}
      <div class="calc-items" id="pinned-items"></div>
    </div>
    <div id="category-groups"></div>
  `;
  renderSectionNav(container, 'calculators');

  const catGroupsEl = container.querySelector('#category-groups');
  for (const g of groups) {
    const groupEl = document.createElement('div');
    groupEl.className = 'calc-group is-collapsed';
    groupEl.dataset.category = g.category.id;
    groupEl.innerHTML = `${groupHeadingHTML(g.category.label, 'false')}<div class="calc-items">${g.calculators.map(c => calcItemHTML(c, pinnedIds)).join('')}</div>`;
    catGroupsEl.appendChild(groupEl);
  }

  function refreshPinnedSection() {
    const pinned = getPinned();
    const pinnedGroup = container.querySelector('#pinned-group');
    const pinnedItemsEl = container.querySelector('#pinned-items');
    const pinnedCalcs = pinned.map(id => allCalcs.find(c => c.id === id)).filter(Boolean);
    if (pinnedCalcs.length === 0) {
      pinnedGroup.style.display = 'none';
      pinnedItemsEl.innerHTML = '';
    } else {
      pinnedGroup.style.display = 'block';
      pinnedItemsEl.innerHTML = pinnedCalcs.map(c => calcItemHTML(c, pinned)).join('');
    }
    applySearch();
  }

  function setExpanded(group, expanded) {
    group.classList.toggle('is-collapsed', !expanded);
    const btn = group.querySelector('.calc-group-heading');
    if (btn) btn.setAttribute('aria-expanded', String(expanded));
  }

  function applySearch() {
    const query = (container.querySelector('#calc-search').value || '').trim().toLowerCase();
    container.querySelectorAll('.calc-item').forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? '' : 'none';
    });
    container.querySelectorAll('.calc-group').forEach(group => {
      const items = group.querySelectorAll('.calc-item');
      if (items.length === 0) return; // empty pinned group etc. — leave as already set
      const anyVisible = Array.from(items).some(i => i.style.display !== 'none');
      group.style.display = anyVisible ? '' : 'none';
      // While searching, force-expand any group so matches are visible even
      // if the user had collapsed it; restore their manual choice once the
      // search box is cleared.
      if (query) {
        setExpanded(group, true);
      } else if (group.dataset.userCollapsed === 'true') {
        setExpanded(group, false);
      }
    });
  }

  // One delegated listener handles pin clicks and collapse/expand toggles,
  // for both the category lists and the pinned section, even after
  // refreshPinnedSection rewrites its HTML. Since `container` (#app) is the
  // same DOM node across every page navigation, we remove any listener left
  // over from a previous visit to this page before attaching a new one —
  // otherwise they stack up and each click fires multiple times.
  if (container._calcPageClickHandler) {
    container.removeEventListener('click', container._calcPageClickHandler);
  }
  const handleClick = (e) => {
    const pinIcon = e.target.closest('.pin-icon');
    if (pinIcon) {
      e.preventDefault();
      togglePin(pinIcon.dataset.id);
      refreshPinnedSection();
      return;
    }
    const heading = e.target.closest('.calc-group-heading');
    if (heading) {
      const group = heading.closest('.calc-group');
      const wasCollapsed = group.classList.contains('is-collapsed');
      setExpanded(group, wasCollapsed); // if it was collapsed, expand it, and vice versa
      group.dataset.userCollapsed = wasCollapsed ? 'false' : 'true';
    }
  };
  container.addEventListener('click', handleClick);
  container._calcPageClickHandler = handleClick;

  container.querySelector('#calc-search').addEventListener('input', applySearch);
  refreshPinnedSection();
}

/** /calc/<categoryId>/<calcId> — a single calculator. */
export async function renderSingleCalculator(container, categoryId, calcId) {
  container.innerHTML = '<p>Loading calculator…</p>';
  let calculators;
  try {
    calculators = await loadCategory(categoryId);
  } catch (e) {
    container.innerHTML = `<p>Unknown category: ${categoryId}</p>`;
    return;
  }
  const calc = calculators.find(c => c.id === calcId);
  if (!calc) {
    container.innerHTML = `<p>Unknown calculator: ${calcId}</p>`;
    return;
  }
  setPageMeta(calc.title, calc.description || `${calc.title} calculator — part of Pharmachrome's pharmaceutical calculation tools.`);
  renderCalculator(container, calc);
}
