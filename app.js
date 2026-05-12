// Quest Log v2 — Application Logic

// ── State ─────────────────────────────────────────────────────────
const STORAGE_KEY = 'quest-log:quests';
let quests = [];

function loadQuests() {
  try {
    quests = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { quests = []; }
}

function saveQuests() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quests));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ── Render ────────────────────────────────────────────────────────
let newlyAddedId   = null;
let lastCompletedId = null;

function renderQuests() {
  const activeList     = document.getElementById('active-quest-list');
  const completedList  = document.getElementById('completed-quest-list');
  const activeEmpty    = document.getElementById('active-empty');
  const completedSection = document.getElementById('completed-section');

  const active    = quests.filter(q => !q.completed);
  const completed = quests.filter(q =>  q.completed);

  // Active list
  activeList.innerHTML = '';
  if (active.length === 0) {
    activeEmpty.classList.remove('hidden');
  } else {
    activeEmpty.classList.add('hidden');
    active.forEach(q => activeList.appendChild(buildQuestItem(q)));
  }

  // Completed list
  completedList.innerHTML = '';
  if (completed.length === 0) {
    completedSection.classList.add('hidden');
  } else {
    completedSection.classList.remove('hidden');
    completed.forEach(q => completedList.appendChild(buildQuestItem(q)));
  }

  newlyAddedId    = null;
  lastCompletedId = null;
}

function buildQuestItem(quest) {
  const li = document.createElement('li');
  li.setAttribute('data-quest-id', quest.id);
  li.className = 'quest-item card-border' + (quest.completed ? ' completed' : '');

  // Animate entrance
  if (quest.id === newlyAddedId) li.classList.add('quest-enter');

  // Toggle button
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.setAttribute('data-action', 'toggle-complete');
  toggle.className = 'quest-toggle';
  toggle.setAttribute('aria-label', quest.completed ? 'Mark as active' : 'Mark as complete');
  if (quest.id === lastCompletedId) toggle.classList.add('seal-appear');
  toggle.textContent = quest.completed ? '✓' : '';

  // Title
  const title = document.createElement('span');
  title.className = 'quest-title';
  title.textContent = quest.title; // textContent — XSS safe

  // Abandon button
  const abandon = document.createElement('button');
  abandon.type = 'button';
  abandon.setAttribute('data-action', 'abandon');
  abandon.className = 'quest-abandon';
  abandon.setAttribute('aria-label', 'Abandon quest');
  abandon.textContent = '\u2715'; // ✕

  li.appendChild(toggle);
  li.appendChild(title);
  li.appendChild(abandon);

  return li;
}

// ── Actions ───────────────────────────────────────────────────────
function addQuest(text) {
  const title = text.trim().slice(0, 200);
  if (!title) return;

  const quest = {
    id: generateId(),
    title,
    completed: false,
    createdAt: Date.now(),
    completedAt: null,
  };
  quests.unshift(quest);
  newlyAddedId = quest.id;
  saveQuests();
  renderQuests();
}

function toggleComplete(id) {
  const quest = quests.find(q => q.id === id);
  if (!quest) return;

  quest.completed = !quest.completed;
  quest.completedAt = quest.completed ? Date.now() : null;

  if (quest.completed) {
    lastCompletedId = id;
  } else {
    // Move back to top of active
    quests = quests.filter(q => q.id !== id);
    quests.unshift(quest);
    newlyAddedId = id;
  }

  saveQuests();
  renderQuests();
}

function deleteQuest(id) {
  const appEl = document.getElementById('app');
  const row = appEl ? appEl.querySelector(`[data-quest-id="${id}"]`) : null;

  if (row) {
    row.classList.add('quest-exit');
    row.addEventListener('animationend', () => {
      quests = quests.filter(q => q.id !== id);
      saveQuests();
      renderQuests();
    }, { once: true });
  } else {
    quests = quests.filter(q => q.id !== id);
    saveQuests();
    renderQuests();
  }
}

// ── Events ────────────────────────────────────────────────────────
function bindEvents() {
  // Form submit
  const form  = document.getElementById('quest-form');
  const input = document.getElementById('quest-input');

  form.addEventListener('submit', e => {
    e.preventDefault();
    addQuest(input.value);
    input.value = '';
    input.focus();
  });

  // Delegated clicks for toggle + abandon
  const appEl = document.getElementById('app');
  appEl.addEventListener('click', e => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const row = btn.closest('[data-quest-id]');
    if (!row) return;

    const id = row.getAttribute('data-quest-id');
    const action = btn.getAttribute('data-action');

    if (action === 'toggle-complete') toggleComplete(id);
    if (action === 'abandon')         deleteQuest(id);
  });
}

// ── Torch animation ───────────────────────────────────────────────
function initTorches() {
  const SHEET_SRC = 'assets/sprites/torch-spritesheet.png';
  const FRAME_W   = 8;   // source px per frame
  const FRAME_H   = 16;
  const FRAMES    = 4;
  const SCALE     = 3;
  const FPS       = 6;

  const sheet = new Image();
  sheet.src = SHEET_SRC;

  const canvases = document.querySelectorAll('.torch');
  const states = Array.from(canvases).map(c => ({
    canvas: c,
    ctx: c.getContext('2d'),
    frame: 0,
    delay: parseInt(c.dataset.delay || '0', 10),
    lastTick: 0,
  }));

  sheet.onload = () => {
    const interval = 1000 / FPS;

    function tick(ts) {
      states.forEach(s => {
        const effectiveTs = ts - s.delay;
        if (effectiveTs < 0) return;
        if (effectiveTs - s.lastTick >= interval) {
          s.frame = (s.frame + 1) % FRAMES;
          s.lastTick = effectiveTs;
          s.ctx.clearRect(0, 0, FRAME_W * SCALE, FRAME_H * SCALE);
          s.ctx.imageSmoothingEnabled = false;
          s.ctx.drawImage(
            sheet,
            s.frame * FRAME_W, 0, FRAME_W, FRAME_H,
            0, 0, FRAME_W * SCALE, FRAME_H * SCALE
          );
        }
      });
      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  };
}

// ── Init ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadQuests();
  bindEvents();
  renderQuests();
  initTorches();
});
