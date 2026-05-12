import { strings } from '../strings.js';

/** @param {{ activeCount: number, completedCount: number }} counts */
export function emptyActiveHtml(counts) {
  if (counts.activeCount > 0) return '';
  return `<p class="ql-empty" id="ql-empty-active">${strings.emptyActive}</p>`;
}

/** @param {{ activeCount: number, completedCount: number }} counts */
export function emptyCompletedHtml(counts) {
  if (counts.completedCount > 0 || counts.activeCount === 0) return '';
  return `<p class="ql-empty" id="ql-empty-completed">${strings.emptyCompleted}</p>`;
}
