const $ = s => document.querySelector(s);
const rand = n => Math.floor(Math.random() * n);

/* ---------- Cenário (céu, lua, colinas, flores, corações) ---------- */
const bg = $('#bg'), g = bg.getContext('2d'), S = 4; // S = tamanho de cada "pixel"
let W, H, GY, f = 0, stars = [], flowers = [], hearts = [];

const sky = ['#14093a','#1b1040','#2a1556','#3d1a6b','#58217a','#7a2b82','#a13b88','#d0568e'];
const HEART = ['.##.##.','#######','#######','.#####.','..###..','...#...'];
const hcol = ['#ff5c93','#ff8fb5','#ffd1e1','#ff3d77'];

function size() {
  W = Math.ceil(innerWidth / S);
  H = Math.ceil(innerHeight / S);
  bg.width = W;
  bg.height = H;
  GY = Math.floor(H * .8); // altura do chão
  stars = Array.from({ length: Math.floor(W * H / 110) }, () => ({
    x: rand(W), y: rand(GY - 10), p: rand(60)
  }));
  flowers = Array.from({ length: Math.floor(W / 4) }, () => ({
    x: rand(W),
    y: GY + 3 + rand(Math.max(1, H - GY - 5)),
    c: ['#ff7eb3','#ffd86b','#fff1f6','#b69cff'][rand(4)]
  }));
}

function heart(x, y, c) {
  HEART.forEach((r, j) => {
    for (let i = 0; i < 7; i++) {
      if (r[i] === '#') {
        g.fillStyle = c;
        g.fillRect(Math.round(x) + i, Math.round(y) + j, 1, 1);
      }
    }
  });
}

function draw() {
  // céu em faixas
  sky.forEach((c, i) => {
    g.fillStyle = c;
    g.fillRect(0, Math.floor(i * GY / 8), W, Math.ceil(GY / 8) + 1);
  });
  // estrelas piscando
  stars.forEach(s => {
    g.fillStyle = (f + s.p) % 60 < 48 ? '#fff' : '#8a7cc0';
    g.fillRect(s.x, s.y, 1, 1);
  });
  // lua
  const mx = Math.floor(W * .8), my = Math.floor(GY * .2);
  for (let dy = -7; dy <= 7; dy++) {
    for (let dx = -7; dx <= 7; dx++) {
      if (dx * dx + dy * dy <= 49) {
        g.fillStyle = (dx + 3) ** 2 + (dy + 2) ** 2 < 9 ? '#e8dcb0' : '#fff6cf';
        g.fillRect(mx + dx, my + dy, 1, 1);
      }
    }
  }
  // colinas ao fundo
  g.fillStyle = '#3a1f63';
  for (let x = 0; x < W; x++) {
    const y = Math.floor(GY - 6 - Math.sin(x / 11) * 3 - Math.sin(x / 5) * 1.5);
    g.fillRect(x, y, 1, GY - y);
  }
  // chão e grama
  g.fillStyle = '#2c4f3a';
  g.fillRect(0, GY, W, H - GY);
  g.fillStyle = '#4a8c52';
  g.fillRect(0, GY, W, 2);
  // flores
  flowers.forEach(fl => {
    g.fillStyle = '#3d7a48';
    g.fillRect(fl.x, fl.y + 1, 1, 2);
    g.fillStyle = fl.c;
    g.fillRect(fl.x - 1, fl.y, 3, 1);
    g.fillRect(fl.x, fl.y - 1, 1, 3);
  });
  // corações subindo
  hearts = hearts.filter(h => h.y > -8);
  hearts.forEach(h => {
    h.y -= h.vy;
    h.x += h.vx;
    heart(h.x, h.y, h.c);
  });
}

function burst(cx, cy, n = 9) {
  for (let i = 0; i < n; i++) {
    hearts.push({
      x: cx / S + rand(8) - 4,
      y: cy / S,
      vy: .5 + Math.random() * 1.2,
      vx: (Math.random() - .5) * .8,
      c: hcol[rand(4)]
    });
  }
}

size();
addEventListener('resize', size);
setInterval(() => {
  f++;
  if (f % 12 === 0) {
    hearts.push({ x: rand(W), y: GY, vy: .35 + Math.random() * .4, vx: 0, c: hcol[rand(4)] });
  }
  draw();
}, 90);

/* ---------- Bonequinha da Iane (16x20 pixels) ---------- */
// Legenda: h = cabelo, H = brilho do cabelo, s = pele, e = olho, p = bochecha,
// m = boca, d = vestido, D = vestido escuro, w = coraçãozinho, k = sapato
const rows = [
  "....hhhhhhhh....",
  "...hhhHHhhhhh...",
  "..hhhhhhhhhhhh..",
  "..hhhhhhhhhhhh..",
  "..hhssssssssshh.".slice(0, 2) + "hhssssssss" + "hh..",
  "..hhsesssseshh..",
  "..hhspsmmspshh..",
  "..hhhsssssshhh..",
  "..hhh.ssss.hhh..",
  "..hh.dddddd.hh..",
  "..hhsddwwddshh..",
  "...hsddddddsh...",
  "....dddddddd....",
  "...dddDDDDddd...",
  "..dddddddddddd..",
  "..dDdDdDdDdDdd..",
  "....ss....ss....",
  "....ss....ss....",
  "....ss....ss....",
  "...kkk....kkk..."
];

// Troque as cores aqui para ficar mais parecida com ela
const pal = {
  h: '#4a2a1e',   // cabelo
  H: '#7a4a30',   // brilho do cabelo
  s: '#f5c6a5',   // pele
  e: '#2b1855',   // olhos
  p: '#ff9bb5',   // bochechas
  m: '#d9476d',   // boca
  d: '#ff5c93',   // vestido
  D: '#d63f78',   // vestido escuro
  w: '#fff1f6',   // coração do vestido
  k: '#3b2a5a'    // sapatos
};

const sp = $('#sprite').getContext('2d');

function paint(blink) {
  sp.clearRect(0, 0, 16, 20);
  rows.forEach((r, y) => [...r].forEach((c, x) => {
    if (c === '.') return;
    sp.fillStyle = pal[(blink && c === 'e') ? 's' : c]; // piscar = olho vira pele
    sp.fillRect(x, y, 1, 1);
  }));
}
paint(false);
setInterval(() => {
  paint(true);
  setTimeout(() => paint(false), 160);
}, 3200);

/* ---------- Interações ---------- */
const doll = $('#doll'), bubble = $('#bubble');

const msgs = [
  "Oi, amor! Que bom que você chegou ♥",
  "Você é a minha parte favorita do dia",
  "Eu te escolheria em qualquer universo",
  "Seu sorriso é o meu save point",
  "Te amo mais que todos os pixels daqui",
  "Toque no chão e eu vou até você!"
];

let mi = 0, px = innerWidth / 2, bt;
doll.style.left = px + 'px';

function falar() {
  bubble.textContent = msgs[mi++ % msgs.length];
  bubble.classList.add('show');
  clearTimeout(bt);
  bt = setTimeout(() => bubble.classList.remove('show'), 3800);
  const r = doll.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + 10);
}

doll.addEventListener('click', e => {
  e.stopPropagation();
  falar();
});
doll.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    falar();
  }
});

// Tocar no chão: a bonequinha anda até lá
document.addEventListener('click', e => {
  if (e.target.closest('button,#carta,#doll')) return;
  const half = doll.offsetWidth / 2;
  const x = Math.min(Math.max(e.clientX, half), innerWidth - half);
  doll.classList.toggle('flip', x < px);
  px = x;
  doll.classList.add('walk');
  doll.style.left = x + 'px';
  setTimeout(() => doll.classList.remove('walk'), 1400);
  burst(e.clientX, e.clientY, 6);
});

// Carta
$('#abrir').onclick = () => {
  $('#carta').classList.add('open');
  burst(innerWidth / 2, innerHeight * .6, 14);
};
$('#fechar').onclick = () => $('#carta').classList.remove('open');