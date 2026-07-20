/*
  page-meta.js
  ------------
  Sets the browser tab title and the <meta name="description"> tag for
  whichever page is currently showing. Called once at the top of every
  section's render() function. Matters for bookmarking, shared links, and
  search engine snippets — each of the 57+ calculator pages gets its own
  accurate title/description instead of one generic one for the whole site.
*/

const SITE_NAME = 'Pharmachrome';
const DEFAULT_TITLE = 'Pharmachrome — Pharmaceutical Calculations';
const DEFAULT_DESCRIPTION = 'Pharmaceutical calculators, unit conversion, and a molecular weight tool for pharmacy students and professionals.';

/**
 * @param {string|null} title - Page-specific title, or null/undefined for the homepage/default.
 * @param {string} [description] - Page-specific meta description; falls back to a generic one.
 */
export function setPageMeta(title, description) {
  document.title = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;

  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description || DEFAULT_DESCRIPTION);
}
