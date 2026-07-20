/*
  app.js
  ------
  The only script loaded up front. Uses real URL paths (e.g. /calc/fundamental/
  normality) rather than hash routes (#/calc/...), so each calculator is a
  genuinely distinct, indexable URL. This needs one thing on the hosting side:
  a 404.html that's a copy of index.html, so GitHub Pages serves the app shell
  for any deep link or refresh, and this router takes it from there based on
  the real path.

  Every internal link in the site is a normal root-relative <a href="/...">;
  this file intercepts clicks on those so navigation doesn't trigger a full
  page reload, and calls history.pushState instead.
*/
const app = document.getElementById('app');
const navLinks = document.querySelectorAll('.nav-links a');

function setActiveNav(path) {
  for (const a of navLinks) {
    const href = a.getAttribute('href');
    a.classList.toggle('is-active', href === path || (path === '/' && href === '/'));
  }
}

async function route() {
  const path = window.location.pathname;
  setActiveNav(path);
  app.classList.remove('is-wide');
  if (app._calcCleanup) {
    app._calcCleanup();
    app._calcCleanup = null;
  }
  const parts = path.split('/').filter(Boolean);

  try {
    if (parts.length === 0) {
      const { render } = await import('./sections/home.js');
      render(app);
    } else if (parts[0] === 'units') {
      const { render } = await import('./sections/units.js');
      render(app);
    } else if (parts[0] === 'mw') {
      const { render } = await import('./sections/molecular-weight.js');
      render(app);
    } else if (parts[0] === 'calculators') {
      const { renderCalculatorsPage } = await import('./sections/calculator-index.js');
      renderCalculatorsPage(app);
    } else if (parts[0] === 'calc' && parts[1] && parts[2]) {
      const { renderSingleCalculator } = await import('./sections/calculator-index.js');
      renderSingleCalculator(app, parts[1], parts[2]);
    } else {
      app.innerHTML = '<p>Page not found.</p>';
    }
  } catch (e) {
    console.error(e);
    app.innerHTML = '<p>Something went wrong loading this section.</p>';
  }
  window.scrollTo(0, 0);
}

// Intercept clicks on internal links so navigation uses pushState instead of
// a full page reload — this is what makes it feel like a single-page app
// while still giving every page its own real, shareable URL.
document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const link = e.target.closest('a');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || !href.startsWith('/') || link.target === '_blank') return;

  e.preventDefault();
  if (href !== window.location.pathname) {
    history.pushState(null, '', href);
    route();
  }
});

window.addEventListener('popstate', route);
window.addEventListener('DOMContentLoaded', route);
