/**
 * Scroll engine for the 3D effects.
 *
 * Any element with [data-scroll] receives a --p custom property between 0 and 1.
 * Modes:
 *   data-scroll="page"    p = scrollY / (data-end × viewport height)
 *   data-scroll="enter"   p = 0 when the element's top sits at data-start × vh,
 *                         p = 1 when it reaches data-end × vh (defaults 1 → 0.3)
 *   data-scroll="sticky"  p runs across a tall container while its sticky child is pinned
 *
 * A sticky container with [data-stack] also drives its [data-stack-card]
 * children, giving each card --enter (0 → 1) and --depth (cards stacked on top).
 */

type Mode = 'page' | 'enter' | 'sticky';

interface Item {
  el: HTMLElement;
  mode: Mode;
  start: number;
  end: number;
  last: number;
  cards: HTMLElement[];
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let items: Item[] = [];
let ticking = false;

function collect() {
  items = [...document.querySelectorAll<HTMLElement>('[data-scroll]')].map((el) => {
    const mode = (el.dataset.scroll as Mode) || 'enter';
    return {
      el,
      mode,
      start: parseFloat(el.dataset.start ?? '1'),
      end: parseFloat(el.dataset.end ?? (mode === 'page' ? '0.6' : '0.3')),
      last: -1,
      cards: el.hasAttribute('data-stack')
        ? [...el.querySelectorAll<HTMLElement>('[data-stack-card]')]
        : [],
    };
  });
}

function progress(item: Item, vh: number): number {
  if (item.mode === 'page') return clamp01(window.scrollY / (item.end * vh));
  const rect = item.el.getBoundingClientRect();
  if (item.mode === 'sticky') {
    const travel = rect.height - vh;
    return travel > 0 ? clamp01(-rect.top / travel) : 0;
  }
  return clamp01((item.start * vh - rect.top) / ((item.start - item.end) * vh));
}

function update() {
  ticking = false;
  const vh = window.innerHeight;
  for (const item of items) {
    const p = reducedMotion.matches ? 1 : progress(item, vh);
    if (Math.abs(p - item.last) < 0.0005) continue;
    item.last = p;
    item.el.style.setProperty('--p', p.toFixed(4));

    if (item.cards.length > 1) {
      const steps = item.cards.length - 1;
      // Land the last card a little early so it rests before the section unpins.
      const pos = Math.min(p * steps * 1.15, steps);
      item.cards.forEach((card, i) => {
        const enter = i === 0 ? 1 : clamp01(pos - (i - 1));
        const depth = Math.min(Math.max(pos - i, 0), steps - i);
        card.style.setProperty('--enter', enter.toFixed(4));
        card.style.setProperty('--depth', depth.toFixed(4));
      });
    }
  }
}

function requestUpdate() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(update);
  }
}

/* One-shot reveals */
function setupReveals() {
  const els = document.querySelectorAll<HTMLElement>('.reveal:not(.is-in)');
  if (!('IntersectionObserver' in window) || reducedMotion.matches) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  els.forEach((el) => io.observe(el));
}

/* Pointer tilt */
function setupTilt() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || reducedMotion.matches) {
    return;
  }
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    const max = parseFloat(el.dataset.tilt || '6');
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`);
      el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`);
      el.style.setProperty('--mx', x.toFixed(3));
      el.style.setProperty('--my', y.toFixed(3));
      el.classList.add('is-tilting');
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
      el.style.setProperty('--mx', '0');
      el.style.setProperty('--my', '0');
      el.classList.remove('is-tilting');
    });
  });
}

collect();
update();
setupReveals();
setupTilt();

window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', requestUpdate);
reducedMotion.addEventListener('change', () => {
  items.forEach((item) => (item.last = -1));
  requestUpdate();
});
