// Images are generated as inline SVG so the page is self-contained.
// To use real photos, replace `src` in the ITEMS list with your own image URLs.
const svg = s => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
const W = 800, H = 600;
const wrap = (defs, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><defs>${defs}</defs>${body}</svg>`;
const grad = (id, a, b) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;

function mountains([sky1, sky2, m1, m2, sun]) {
  return svg(wrap(grad('g', sky1, sky2),
    `<rect width="${W}" height="${H}" fill="url(#g)"/><circle cx="560" cy="190" r="70" fill="${sun}" opacity=".9"/>
     <polygon points="0,420 170,200 320,380 470,230 640,400 800,260 800,600 0,600" fill="${m1}"/>
     <polygon points="0,500 150,350 300,480 460,330 620,490 800,380 800,600 0,600" fill="${m2}"/>`));
}
function city([sky1, sky2, b1, b2, win]) {
  let out = `<rect width="${W}" height="${H}" fill="url(#g)"/>`;
  const xs = [20, 120, 210, 310, 400, 510, 600, 700];
  const hs = [260, 380, 300, 430, 340, 400, 280, 360];
  xs.forEach((x, i) => {
    const w = 80, h = hs[i], y = H - h, c = i % 2 ? b1 : b2;
    out += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
    for (let r = 0; r < Math.floor(h / 40); r++) for (let k = 0; k < 3; k++)
      if ((r * 3 + k + i) % 3) out += `<rect x="${x + 12 + k * 22}" y="${y + 14 + r * 40}" width="12" height="18" fill="${win}" opacity=".85"/>`;
  });
  return svg(wrap(grad('g', sky1, sky2), out));
}
function abstract([c1, c2, c3, c4, c5]) {
  return svg(wrap(grad('g', c1, c2),
    `<rect width="${W}" height="${H}" fill="url(#g)"/>
     <circle cx="220" cy="240" r="170" fill="${c3}" opacity=".85"/>
     <circle cx="520" cy="360" r="210" fill="${c4}" opacity=".75"/>
     <circle cx="650" cy="150" r="110" fill="${c5}" opacity=".9"/>
     <rect x="90" y="400" width="300" height="24" rx="12" fill="${c5}" opacity=".7"/>`));
}

const ITEMS = [
  {t:'Alpine Dawn',    c:'Nature',   src:mountains(['#ffd6a5','#ffadad','#5b6c8f','#2f3e5c','#fff3b0'])},
  {t:'Misty Ridge',    c:'Nature',   src:mountains(['#cfe8ef','#9fc5d5','#5a8a8f','#2d5159','#ffffff'])},
  {t:'Desert Sunset',  c:'Nature',   src:mountains(['#ff9a62','#7b2d5b','#7a2f3b','#3b1530','#ffe08a'])},
  {t:'Pine Valley',    c:'Nature',   src:mountains(['#b8e1c1','#6fb38a','#2f7d57','#1b4d3a','#fffbd0'])},
  {t:'Neon Skyline',   c:'City',     src:city(['#2b1055','#7597de','#1c1b3a','#2c2a55','#ffe66d'])},
  {t:'Golden Hour',    c:'City',     src:city(['#ffcf9e','#f08a5d','#52324a','#3a2236','#fff1c1'])},
  {t:'Midnight Blocks',c:'City',     src:city(['#0b1026','#1d2b64','#0f172a','#1e293b','#fde68a'])},
  {t:'Harbor Haze',    c:'City',     src:city(['#dfe9f3','#a6c1ee','#51698a','#3b4f6b','#ffffff'])},
  {t:'Orbit',          c:'Abstract', src:abstract(['#0f2027','#2c5364','#ff6b6b','#4ecdc4','#ffe66d'])},
  {t:'Bloom',          c:'Abstract', src:abstract(['#fbc2eb','#a6c1ee','#8e44ad','#ff7eb3','#fff4a3'])},
  {t:'Tidal',          c:'Abstract', src:abstract(['#00c6ff','#0072ff','#e0f7fa','#1de9b6','#ffffff'])},
  {t:'Ember',          c:'Abstract', src:abstract(['#232526','#414345','#ff512f','#f09819','#ffd29d'])}
];

const grid = document.getElementById('grid');
const filtersEl = document.getElementById('filters');
const lb = document.getElementById('lb'), lbImg = document.getElementById('lbImg'), lbCap = document.getElementById('lbCap');
let current = 'All';
let visible = [];   // items matching the active filter
let idx = 0;        // position inside `visible`
let lastFocus = null;

['All', ...new Set(ITEMS.map(i => i.c))].forEach(cat => {
  const b = document.createElement('button');
  b.textContent = cat;
  b.type = 'button';
  if (cat === current) b.classList.add('active');
  b.addEventListener('click', () => {
    current = cat;
    filtersEl.querySelectorAll('button').forEach(x => x.classList.toggle('active', x === b));
    render();
  });
  filtersEl.appendChild(b);
});

function render() {
  visible = ITEMS.filter(i => current === 'All' || i.c === current);
  grid.innerHTML = '';
  if (!visible.length) { grid.innerHTML = '<p class="empty">No images in this category.</p>'; return; }
  visible.forEach((item, n) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'card';
    card.style.animationDelay = (n * 40) + 'ms';
    card.setAttribute('aria-label', 'Open ' + item.t);
    card.innerHTML = `<img src="${item.src}" alt="${item.t}" loading="lazy"><div class="cap"><b>${item.t}</b><span>${item.c}</span></div>`;
    card.addEventListener('click', () => open(n));
    grid.appendChild(card);
  });
}

function show(n, animate) {
  idx = (n + visible.length) % visible.length;
  const item = visible[idx];
  const apply = () => {
    lbImg.src = item.src;
    lbImg.alt = item.t;
    lbCap.innerHTML = `${item.t}<small>${item.c} &middot; ${idx + 1} / ${visible.length}</small>`;
    lbImg.classList.remove('swap');
  };
  if (animate) { lbImg.classList.add('swap'); setTimeout(apply, 180); } else apply();
}
function open(n) { lastFocus = document.activeElement; show(n, false); lb.classList.add('open'); document.body.style.overflow = 'hidden'; document.getElementById('close').focus(); }
function close() { lb.classList.remove('open'); document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }

document.getElementById('next').addEventListener('click', e => { e.stopPropagation(); show(idx + 1, true); });
document.getElementById('prev').addEventListener('click', e => { e.stopPropagation(); show(idx - 1, true); });
document.getElementById('close').addEventListener('click', close);
lb.addEventListener('click', e => { if (e.target === lb || e.target.tagName === 'FIGURE') close(); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowRight') show(idx + 1, true);
  if (e.key === 'ArrowLeft') show(idx - 1, true);
});
// swipe support for touch screens
let sx = null;
lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, {passive:true});
lb.addEventListener('touchend', e => {
  if (sx === null) return;
  const dx = e.changedTouches[0].clientX - sx;
  if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1), true);
  sx = null;
}, {passive:true});

render();
