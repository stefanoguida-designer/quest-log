/** Peglin-style torch sprites on header canvases (see `/assets/sprites/torch-spritesheet.png`). */
export function initTorches() {
  const SHEET_SRC = '/assets/sprites/torch-spritesheet.png';
  const FRAME_W = 8;
  const FRAME_H = 16;
  const FRAMES = 5;
  const SCALE = 3;
  const FPS = 6;

  const sheet = new Image();
  sheet.src = SHEET_SRC;

  const canvases = document.querySelectorAll('canvas.torch');
  if (canvases.length === 0) return;

  const states = Array.from(canvases).map((c) => ({
    canvas: /** @type {HTMLCanvasElement} */ (c),
    ctx: /** @type {HTMLCanvasElement} */ (c).getContext('2d'),
    frame: 0,
    delay: parseInt(c.dataset.delay || '0', 10),
    lastTick: 0,
  }));

  sheet.onload = () => {
    const interval = 1000 / FPS;
    const w = FRAME_W * SCALE;
    const h = FRAME_H * SCALE;

    function tick(ts) {
      states.forEach((s) => {
        if (!s.ctx) return;
        const effectiveTs = ts - s.delay;
        if (effectiveTs < 0) return;
        if (effectiveTs - s.lastTick >= interval) {
          s.frame = (s.frame + 1) % FRAMES;
          s.lastTick = effectiveTs;
          s.ctx.clearRect(0, 0, w, h);
          s.ctx.imageSmoothingEnabled = false;
          s.ctx.drawImage(sheet, s.frame * FRAME_W, 0, FRAME_W, FRAME_H, 0, 0, w, h);
        }
      });
      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  };
}
