/*
  section-nav.js
  --------------
  The "← Prev / Next →" bar that sits right below the header on the
  Calculators, Unit converter, and Molecular weight pages. Home is included
  in the sequence but never calls this, so it shows no nav buttons — the
  cycle is: Home -> Calculators -> Units -> Molecular weight -> Home.
*/
const MAIN_SECTIONS = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'calculators', label: 'Calculators', href: '/calculators' },
  { id: 'units', label: 'Units', href: '/units' },
  { id: 'mw', label: 'Molecular weight', href: '/mw' }
];

export function renderSectionNav(container, currentId) {
  const idx = MAIN_SECTIONS.findIndex(s => s.id === currentId);
  if (idx === -1) return;
  const prev = MAIN_SECTIONS[(idx - 1 + MAIN_SECTIONS.length) % MAIN_SECTIONS.length];
  const next = MAIN_SECTIONS[(idx + 1) % MAIN_SECTIONS.length];

  const nav = document.createElement('div');
  nav.className = 'section-nav';
  nav.innerHTML = `
    <a class="nav-btn" href="${prev.href}">← ${prev.label}</a>
    <a class="nav-btn" href="${next.href}">${next.label} →</a>
  `;
  container.prepend(nav);
}
