import { strings } from '../strings.js';

/** @param {{ activeCount: number, completedCount: number }} counts */
export function emptyActiveHtml(counts) {
  if (counts.activeCount > 0) return '';
  return `<div class="ql-empty" id="ql-empty-active">
    <img src="/assets/ui/nail.png" class="ql-nail pixel-art" alt="" aria-hidden="true" />
    <p class="ql-empty-text">${strings.emptyActive}</p>
  </div>`;
}

/** @param {{ activeCount: number, completedCount: number }} counts */
export function emptyCompletedHtml(counts) {
  if (counts.completedCount > 0 || counts.activeCount === 0) return '';
  return `<p class="ql-empty" id="ql-empty-completed">${strings.emptyCompleted}</p>`;
}
