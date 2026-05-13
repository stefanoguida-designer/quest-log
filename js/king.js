const KING_QUOTES = [
  '«Thou hast served the crown with honour. We are most grateful.»',
  '«The kingdom owes thee a debt, brave knight.»',
  '«We shall not forget thy service. The crown thanks thee.»',
  '«Thy deeds bring light to these dark times. Well done.»',
  '«Rise, champion. Thy quest is complete and thy king is pleased.»',
  '«The realm breathes easier thanks to thee, noble soul.»',
  '«Thy service shall be remembered long after these walls crumble.»',
  '«We are in thy debt, brave knight. The crown bows to thy dedication.»',
  '«Thou hast done what others could not. The kingdom is grateful.»',
  '«A deed most noble. Thy king thanks thee from the depths of his heart.»',
];

const COUNTDOWN_SECONDS = 5;

let countdownTimer = null;
let returnFocusTo = null;

function popupHtml() {
  return `
<div class="ql-king-overlay hidden" id="ql-king-overlay">
  <div class="ql-king-popup">
    <div class="ql-king-portrait-wrap">
      <img src="/assets/sprites/king.png" class="ql-king-portrait pixel-art" alt="The King" />
    </div>
    <div class="ql-king-box">
      <p class="ql-king-quote" id="ql-king-quote"></p>
      <button class="ql-btn ql-btn--ghost ql-king-dismiss" id="ql-king-dismiss">
        Dismiss (<span id="ql-king-countdown">5</span>)
      </button>
    </div>
  </div>
</div>`;
}

function clearCountdown() {
  if (countdownTimer !== null) {
    window.clearInterval(countdownTimer);
    countdownTimer = null;
  }
}

function randomQuote() {
  const index = Math.floor(Math.random() * KING_QUOTES.length);
  return KING_QUOTES[index];
}

function ensurePopup() {
  let overlay = document.getElementById('ql-king-overlay');
  if (!overlay) {
    document.body.insertAdjacentHTML('beforeend', popupHtml());
    overlay = document.getElementById('ql-king-overlay');
  }

  const quote = document.getElementById('ql-king-quote');
  const countdown = document.getElementById('ql-king-countdown');
  const dismiss = document.getElementById('ql-king-dismiss');

  if (!overlay || !quote || !countdown || !dismiss) return null;

  return {
    overlay,
    quote,
    countdown,
    dismiss,
  };
}

function closeKingPopup() {
  const popup = ensurePopup();
  clearCountdown();
  popup?.overlay.classList.add('hidden');

  if (returnFocusTo && document.contains(returnFocusTo)) {
    returnFocusTo.focus();
  }
  returnFocusTo = null;
}

/**
 * @param {HTMLElement | null} [focusTarget]
 */
export function showKingPopup(focusTarget = null) {
  const popup = ensurePopup();
  if (!popup) return;

  clearCountdown();
  returnFocusTo = focusTarget;

  let remaining = COUNTDOWN_SECONDS;
  popup.quote.textContent = randomQuote();
  popup.countdown.textContent = String(remaining);
  popup.overlay.classList.remove('hidden');
  popup.dismiss.onclick = closeKingPopup;
  popup.dismiss.focus();

  countdownTimer = window.setInterval(() => {
    remaining -= 1;
    popup.countdown.textContent = String(Math.max(remaining, 0));
    if (remaining <= 0) closeKingPopup();
  }, 1000);
}
