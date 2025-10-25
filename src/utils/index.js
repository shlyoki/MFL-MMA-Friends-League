// src/utils/index.js

export function cn(...classes) {
  return classes.flat().filter(Boolean).join(' ');
}

export const noop = () => {};

export function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

/**
 * Create a URL string with ?page=<number>, preserving existing query params.
 * Works with relative paths like "/events?sort=asc".
 */
export function createPageUrl(path, page) {
  const url = new URL(path, 'http://dummy.local');
  url.searchParams.set('page', String(page));
  return `${url.pathname}${url.search}${url.hash}`;
}

export function formatDate(value) {
  const d = new Date(value);
  return Number.isNaN(+d) ? '' : d.toLocaleDateString();
}

export function formatNumber(n) {
  const x = Number(n);
  return Number.isFinite(x) ? x.toLocaleString() : '';
}

export default {
  cn,
  noop,
  clamp,
  createPageUrl,
  formatDate,
  formatNumber,
};
