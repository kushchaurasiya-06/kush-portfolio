/* =========================================================
   KUSH CHAURASIYA — portfolio interactions
   ========================================================= */
(() => {
  'use strict';

  /* ======================================================
     ✏️  EDIT ME — your links + your work
     ====================================================== */
  const CONFIG = {
    email: 'kushchorasiya@gmail.com',
    // YouTube / Vimeo / direct .mp4 link for the "SHOWREEL" tab
    showreel: '',
    socials: [
      { label: 'INSTAGRAM', url: 'https://www.instagram.com/kushchaurasiya06/' },
      { label: 'YOUTUBE', url: 'https://www.youtube.com/@KushChaurasiya06' },
      { label: 'LINKEDIN', url: 'https://www.linkedin.com/' },
      { label: 'BEHANCE', url: 'https://www.behance.net/' },
    ],
  };

  // Each frame in the 3D reel = one real project.
  // YouTube links play inside the site (thumbnail is pulled from YouTube automatically).
  // Instagram links open in a new tab, so give those a cover image in `img`.
  const WORKS = [
    { title: 'CACS Arena', full: 'CACS Arena — Event Aftermovie', tag: 'EVENT AFTERMOVIE', a: '#ff4b1f', b: '#1d0b05', c: '#7a4cff', url: 'https://youtu.be/FVM4VE5vf3Y' },
    { title: 'Chandigarh LUXE', full: 'Chandigarh LUXE — Promotional Reel', tag: 'BRAND FILM', a: '#f6c143', b: '#3b1a07', c: '#ff4b1f', url: 'https://youtu.be/Q8_euRJxdys' },
    { title: 'Metallurgy Dept. Day', full: 'Metallurgy Department Day — Publicity Reel', tag: 'REELS & SHORTS', a: '#ff3d8b', b: '#2a0730', c: '#ffb020', url: 'https://youtu.be/jOEUgA0qOlc' },
    { title: 'MICC Garba', full: 'MICC Garba — Reel', tag: 'REELS & SHORTS', a: '#ff7a1f', b: '#2a0730', c: '#ff3d8b', url: 'https://youtu.be/sFCCpczWEvA' },
    { title: 'MNIT Cinematic Vlog 01', full: 'MNIT Cinematic Vlog 01', tag: 'TRAVEL FILM', a: '#2fd3b0', b: '#06292b', c: '#f6c143', url: 'https://youtu.be/S_Tm6XRDk14' },
    { title: 'MNIT Cinematic Vlog 02', full: 'MNIT Cinematic Vlog 02', tag: 'TRAVEL FILM', a: '#2fd3b0', b: '#06292b', c: '#3d6bff', url: 'https://youtu.be/QMoUO9U92_M' },
    { title: 'Udaipur Cinematic Vlog', full: 'Udaipur Cinematic Vlog', tag: 'TRAVEL FILM', a: '#f6c143', b: '#06292b', c: '#2fd3b0', url: 'https://youtu.be/qzsmnqn8SO4' },
    { title: 'Editing Arena', full: 'Editing Arena — YouTube Long-form', tag: 'YOUTUBE LONG-FORM', a: '#3d6bff', b: '#07123a', c: '#ff4b1f', url: 'https://youtu.be/6Xa-yrW2HPc' },
    { title: 'Addiction', full: 'Addiction — Short Film', tag: 'SHORT FILM', a: '#e8e2d2', b: '#151515', c: '#ff4b1f', url: 'https://www.instagram.com/p/DfB7riDSU9P/', img: 'assets/shots/b2-green.jpg', pos: '55% 35%' },
  ];

  const TYPE_WORDS = ['first name', 'creator', 'director', 'brand', 'stranger', 'you'];

  /* ======================================================
     helpers
     ====================================================== */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const pad2 = (n) => String(n).padStart(2, '0');
  const toTC = (sec, fps = 24) => {
    sec = Math.max(0, sec);
    const f = Math.floor((sec % 1) * fps);
    const s = Math.floor(sec) % 60;
    const m = Math.floor(sec / 60) % 60;
    const h = Math.floor(sec / 3600);
    return `${pad2(h)}:${pad2(m)}:${pad2(s)}:${pad2(f)}`;
  };
  const rng = (seed) => () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  /* ======================================================
     DOM prep (runs with or without GSAP)
     ====================================================== */
  function prepDOM() {
    $('#year').textContent = new Date().getFullYear();

    // email + socials
    const mail = $('#mailLink');
    mail.href = `mailto:${CONFIG.email}`;
    $('#mailText').dataset.text = CONFIG.email;
    $('#mailText').textContent = CONFIG.email;
    $('#socials').innerHTML = CONFIG.socials
      .map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener"><span class="roll" data-text="${esc(s.label)}">${esc(s.label)}</span></a></li>`)
      .join('') + `<li><a href="mailto:${esc(CONFIG.email)}"><span class="roll" data-text="MAIL">MAIL</span></a></li>`;

    // split display words into chars
    $$('.split').forEach((el) => {
      const txt = el.textContent;
      el.setAttribute('aria-label', txt);
      el.innerHTML = [...txt].map((c) => `<span class="ch"><span class="char">${c === ' ' ? '&nbsp;' : esc(c)}</span></span>`).join('');
    });

    // roll (hover text swap)
    $$('.roll').forEach((el) => {
      const t = el.dataset.text || el.textContent;
      el.innerHTML = `<span class="roll__in"><span>${esc(t)}</span><span aria-hidden="true">${esc(t)}</span></span>`;
    });

    // about paragraph → words
    // (keeps highlighted words like <b class="hl"> intact)
    const splitWords = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'w';
            w.textContent = part;
            frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) splitWords(child);
      });
    };
    $$('.scrub-words').forEach((el) => { el.normalize(); splitWords(el); });

    buildTorn();
    buildQuoteMarks();
    buildReelCards();
  }

  /* torn paper edges, generated so every edge is unique */
  function buildTorn() {
    const fills = { paper: '#f2efe7', deep: '#070d26' };
    $$('.torn').forEach((el, k) => {
      const r = rng(97 + k * 31);
      const W = 1440;
      const pts = [];
      let x = 0;
      while (x < W) {
        let y = 14 + r() * 12;
        if (r() < 0.18) y += r() * 14;
        if (r() < 0.1) y -= r() * 8;
        pts.push([x, y]);
        x += 5 + r() * 16;
      }
      pts.push([W, 14 + r() * 12]);
      const main = `M0,-2 L${W},-2 ` + pts.slice().reverse().map(([px, py]) => `L${px.toFixed(1)},${py.toFixed(1)}`).join(' ') + ' Z';
      const fiber = `M0,-2 L${W},-2 ` + pts.slice().reverse().map(([px, py]) => `L${px.toFixed(1)},${(py + 2 + r() * 5).toFixed(1)}`).join(' ') + ' Z';
      const fill = fills[el.dataset.torn] || fills.paper;
      el.innerHTML = `<svg viewBox="0 0 ${W} 40" preserveAspectRatio="none" style="filter:drop-shadow(0 3px 4px rgba(0,0,0,.18))"><path d="${fiber}" fill="#fbfaf6"/><path d="${main}" fill="${fill}"/></svg>`;
    });
  }

  function buildQuoteMarks() {
    const host = $('.quote__marks');
    const r = rng(12);
    let html = '';
    for (let i = 0; i < 22; i++) {
      let x, y;
      do { x = 3 + r() * 94; y = 4 + r() * 92; } while (x > 16 && x < 84 && y > 18 && y < 82);
      html += `<i style="left:${x}%;top:${y}%;transform:rotate(${(r() * 180).toFixed(0)}deg) scaleX(${(0.6 + r()).toFixed(2)})"></i>`;
    }
    host.innerHTML = html;
  }

  const ytId = (url) => (url || '').match(/(?:youtu\.be\/|[?&]v=|shorts\/|embed\/)([\w-]{11})/)?.[1] || null;
  const isInsta = (url) => /instagram\.com/i.test(url || '');

  function buildReelCards() {
    const ring = $('#reelRing');
    ring.innerHTML = WORKS.map((w, i) => {
      let img = '';
      const id = ytId(w.url);
      const thumb = w.img || (id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : '');
      if (thumb) img = `<img class="${w.mode === 'cutout' ? 'cutout' : 'cover'}" src="${esc(thumb)}" alt="" loading="lazy" ${id && !w.img ? `data-yt="${id}"` : ''} style="object-position:${esc(w.pos || '50% 50%')}" />`;
      const insta = isInsta(w.url);
      const r = rng(200 + i);
      return `
      <article class="card" data-i="${i}" data-cursor-label="${insta ? 'OPEN ↗' : 'PLAY ▶'}" tabindex="0" role="button" aria-label="${insta ? 'Open' : 'Play'} ${esc(w.full || w.title)}">
        <div class="card__face">
          <div class="card__art" style="--a:${w.a};--b:${w.b};--c:${w.c};--x:${(15 + r() * 40).toFixed(0)}%;--y:${(20 + r() * 40).toFixed(0)}%">${img}${thumb ? '' : `<span class="card__glyph">${pad2(i + 1)}</span>`}</div>
          <span class="card__perf card__perf--t"></span><span class="card__perf card__perf--b"></span>
          <span class="card__num">PROJECT ${pad2(i + 1)}</span>
          <span class="card__play">${insta ? '↗' : '▶'}</span>
          <h3 class="card__title">${esc(w.title)}</h3>
          <div class="card__meta"><span>${esc(w.tag)}</span><span>${insta ? 'INSTAGRAM ↗' : 'YOUTUBE ▶'}</span></div>
        </div>
        <div class="card__back">KUSH</div>
      </article>`;
    }).join('');
    $$('img[data-yt]', ring).forEach((im) => {
      const fallback = () => { if (!im.dataset.fb) { im.dataset.fb = 1; im.src = `https://i.ytimg.com/vi/${im.dataset.yt}/hqdefault.jpg`; } };
      im.addEventListener('error', fallback);
      im.addEventListener('load', () => { if (im.naturalWidth <= 120) fallback(); });
    });
  }

  /* ======================================================
     MODAL
     ====================================================== */
  let lenis = null;
  function embedFor(url) {
    if (!url) return null;
    let m = url.match(/(?:youtu\.be\/|[?&]v=|shorts\/|embed\/)([\w-]{11})/);
    if (m) {
      // YouTube needs to know which site embeds it, or it shows "Error 153"
      const origin = /^https?:$/.test(location.protocol) ? `&origin=${encodeURIComponent(location.origin)}` : '';
      return `<iframe src="https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0&modestbranding=1&playsinline=1${origin}" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    }
    m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) return `<iframe src="https://player.vimeo.com/video/${m[1]}?autoplay=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) return `<video src="${esc(url)}" controls autoplay playsinline></video>`;
    return null;
  }
  // Pages opened straight from disk (file://) send no website address, so YouTube refuses to play
  // inside them. In that case just open the video on YouTube instead of showing an error.
  const canEmbed = /^https?:$/.test(location.protocol);
  function openModal(title, url) {
    const modal = $('#modal');
    const id = ytId(url);
    if (id && !canEmbed) { window.open(`https://www.youtube.com/watch?v=${id}`, '_blank', 'noopener'); return; }
    const yt = $('#modalYt');
    yt.hidden = !id;
    if (id) yt.href = `https://www.youtube.com/watch?v=${id}`;
    const embed = embedFor(url);
    $('#modalPlayer').innerHTML = embed || `
      <div class="offline">
        <b>Media Offline</b>
        <span>Médias hors ligne · Medien offline · メディアオフライン</span>
        <small>THIS CUT IS STILL RENDERING — CHECK BACK SOON</small>
      </div>`;
    $('#modalTitle').textContent = `▶ ${title}`;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    lenis && lenis.stop();
    $('#modalClose').focus({ preventScroll: true });
  }
  function closeModal() {
    const modal = $('#modal');
    if (!modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    setTimeout(() => { if (!modal.classList.contains('is-open')) $('#modalPlayer').innerHTML = ''; }, 450);
    lenis && lenis.start();
  }
  function bindModal() {
    $('#modalClose').addEventListener('click', closeModal);
    $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeModal(); });
    addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeModal(); closeMenu(); } });
    $('#reelTab').addEventListener('click', () => openModal('SHOWREEL', CONFIG.showreel));
    $('#menuReel').addEventListener('click', () => { closeMenu(); setTimeout(() => openModal('SHOWREEL', CONFIG.showreel), 500); });
    $('#reelRing').addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (!card) return;
      const w = WORKS[+card.dataset.i];
      if (isInsta(w.url)) { window.open(w.url, '_blank', 'noopener'); return; }
      openModal((w.full || w.title).toUpperCase(), w.url);
    });
    $('#reelRing').addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('card')) { e.preventDefault(); e.target.click(); }
    });
  }

  /* ======================================================
     MENU
     ====================================================== */
  let menuOpen = false;
  let menuMarble = null;
  function menuCircle(r) {
    const b = $('#burger').getBoundingClientRect();
    return `circle(${r}px at ${b.left + b.width / 2}px ${b.top + b.height / 2}px)`;
  }
  function openMenu() {
    if (menuOpen) return;
    menuOpen = true;
    const menu = $('#menu');
    $('#burger').classList.add('is-open');
    $('#burger').setAttribute('aria-expanded', 'true');
    $('#header').classList.add('is-menu');
    menu.setAttribute('aria-hidden', 'false');
    lenis && lenis.stop();
    menuMarble && menuMarble.setActive(true);
    if (!hasGSAP) { menu.style.visibility = 'visible'; menu.style.clipPath = 'none'; return; }
    gsap.killTweensOf(menu);
    gsap.set(menu, { visibility: 'visible', clipPath: menuCircle(0) });
    gsap.to(menu, { clipPath: menuCircle(Math.hypot(innerWidth, innerHeight)), duration: 1.1, ease: 'expo.inOut' });
    gsap.fromTo('.menu__list a', { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.06, ease: 'expo.out', delay: 0.35 });
    gsap.fromTo('.menu__foot', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.7 });
  }
  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    const menu = $('#menu');
    $('#burger').classList.remove('is-open');
    $('#burger').setAttribute('aria-expanded', 'false');
    $('#header').classList.remove('is-menu');
    menu.setAttribute('aria-hidden', 'true');
    lenis && lenis.start();
    if (!hasGSAP) { menu.style.visibility = 'hidden'; return; }
    gsap.killTweensOf(menu);
    gsap.to(menu, {
      clipPath: menuCircle(0), duration: 0.8, ease: 'expo.inOut',
      onComplete: () => { gsap.set(menu, { visibility: 'hidden' }); menuMarble && menuMarble.setActive(false); },
    });
  }

  function scrollToTarget(sel) {
    const el = sel === '#top' ? 0 : $(sel);
    if (lenis) lenis.scrollTo(el, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else if (el === 0) scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }

  function bindNav() {
    $('#burger').addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
    $$('[data-scroll-to]').forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = a.dataset.scrollTo;
      if (menuOpen) { closeMenu(); setTimeout(() => scrollToTarget(target), 450); }
      else scrollToTarget(target);
    }));
    $('#tickerClose').addEventListener('click', () => {
      $('#ticker').classList.add('is-closed');
      document.documentElement.style.setProperty('--ticker-h', '0px');
      setTimeout(() => hasGSAP && ScrollTrigger.refresh(), 650);
    });
  }

  /* header timecode clock (real time, 24fps) */
  function startClock() {
    const el = $('#clockTc');
    const tick = () => {
      const d = new Date();
      el.textContent = `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}:${pad2(Math.floor(d.getMilliseconds() / 1000 * 24))}`;
    };
    tick();
    setInterval(tick, 1000 / 24);
  }

  /* typewriter in the {{ }} */
  function startTypewriter() {
    const el = $('#typeWord');
    let wi = 0;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      await sleep(1600);
      for (;;) {
        const cur = el.textContent;
        for (let i = cur.length; i >= 0; i--) { el.textContent = cur.slice(0, i); await sleep(45); }
        wi = (wi + 1) % TYPE_WORDS.length;
        const next = TYPE_WORDS[wi];
        await sleep(260);
        for (let i = 1; i <= next.length; i++) { el.textContent = next.slice(0, i); await sleep(85 + Math.random() * 60); }
        await sleep(next === 'you' ? 3200 : 1900);
      }
    })();
  }

  /* ======================================================
     MARBLE SHADER — the navy marble from Kush's backdrop
     ====================================================== */
  const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse;
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){ v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y * 1.6;
  float t = uTime * 0.035;
  p += uMouse * 0.1;
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 3.6 * q + vec2(1.7, 9.2) + t * 1.4), fbm(p + 3.6 * q + vec2(8.3, 2.8) - t * 0.8));
  r += uMouse * 0.22;
  float f = fbm(p + 3.2 * r);
  vec3 deep = vec3(0.012, 0.024, 0.085);
  vec3 navy = vec3(0.05, 0.09, 0.26);
  vec3 blue = vec3(0.13, 0.21, 0.5);
  vec3 col = mix(deep, navy, smoothstep(0.22, 0.78, f));
  col = mix(col, blue, smoothstep(0.5, 0.95, length(q) * f) * 0.5);
  float band = abs(fract(f * 6.0 + r.x * 1.6) - 0.5) * 2.0;
  float vein = 1.0 - smoothstep(0.0, 0.07, band);
  col += vec3(0.16, 0.26, 0.58) * vein * 0.42 * smoothstep(0.25, 0.7, f);
  col += vec3(0.05, 0.08, 0.2) * pow(f, 3.0);
  col *= 0.72 + 0.38 * smoothstep(1.25, 0.15, length(uv - 0.5) * 1.6);
  col += (hash(gl_FragCoord.xy + fract(uTime) * 91.0) - 0.5) * 0.035;
  gl_FragColor = vec4(col, 1.0);
}`;
  const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

  const mouseN = { x: 0, y: 0 };
  addEventListener('pointermove', (e) => {
    mouseN.x = (e.clientX / innerWidth - 0.5) * 2;
    mouseN.y = (e.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });

  function createMarble(canvas, manual) {
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) return null;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const m = { x: 0, y: 0 };
    const seed = Math.random() * 100;
    let active = false;

    const resize = () => {
      const s = Math.min(devicePixelRatio || 1, 1.5) * (innerWidth < 760 ? 0.6 : 0.55);
      const w = Math.max(2, Math.round(canvas.clientWidth * s));
      const h = Math.max(2, Math.round(canvas.clientHeight * s));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    };
    const draw = () => {
      resize();
      m.x = lerp(m.x, mouseN.x, 0.04);
      m.y = lerp(m.y, -mouseN.y, 0.04);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, performance.now() / 1000 + seed);
      gl.uniform2f(uMouse, m.x, m.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = () => { if (active) { draw(); requestAnimationFrame(loop); } };
    const setActive = (on) => {
      if (on === active) return;
      active = on;
      if (on) requestAnimationFrame(loop);
    };
    draw();
    if (!manual) {
      new IntersectionObserver(([en]) => setActive(en.isIntersecting && !reduce), { rootMargin: '100px' }).observe(canvas);
    }
    return { setActive };
  }

  function initMarbles() {
    $$('canvas[data-marble]').forEach((c) => {
      const manual = !!c.closest('.menu');
      const inst = createMarble(c, manual);
      if (manual) menuMarble = inst;
    });
  }

  /* ======================================================
     If GSAP failed to load, show a static (still pretty) site
     ====================================================== */
  prepDOM();
  bindModal();
  bindNav();
  startClock();

  if (!hasGSAP) {
    document.body.classList.remove('is-loading');
    $('#loader').remove();
    $$('.about__para .w').forEach((w) => (w.style.opacity = 1));
    $$('.faq__item').forEach((w) => w.classList.add('is-active'));
    initMarbles();
    startTypewriter();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ force3D: true });

  /* ======================================================
     LENIS smooth scroll
     ====================================================== */
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  /* ======================================================
     LOADER — static, timecode, slate clap, CRT switch-off
     ====================================================== */
  function runLoader() {
    return new Promise((resolve) => {
      const loader = $('#loader');
      const canvas = $('#static');
      const ctx = canvas.getContext('2d');
      const W = 220;
      const H = Math.max(80, Math.round(W * ((innerHeight || 9) / (innerWidth || 16)))) || 124;
      canvas.width = W; canvas.height = H;
      const img = ctx.createImageData(W, H);
      const buf = new Uint32Array(img.data.buffer);
      let running = true;
      const noise = () => {
        if (!running) return;
        for (let i = 0; i < buf.length; i++) {
          const v = (Math.random() * 255) | 0;
          buf[i] = (255 << 24) | (v << 16) | (v << 8) | v;
        }
        ctx.putImageData(img, 0, 0);
        requestAnimationFrame(noise);
      };
      noise();

      const imgs = $$('img').filter((i) => i.loading !== 'lazy');
      let fontsReady = false;
      (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { fontsReady = true; });
      const t0 = performance.now();
      const MIN = reduce ? 300 : 2300;
      const tcEl = $('#loaderTc'), pctEl = $('#loaderPct'), barEl = $('#loaderBar');
      let done = false;

      // timer-driven (not frame-driven) so it can never stall on a throttled frame rate
      const step = () => {
        const el = performance.now() - t0;
        const loaded = imgs.filter((i) => i.complete).length / Math.max(1, imgs.length);
        const real = loaded * 0.8 + (fontsReady ? 0.2 : 0);
        // eased progress that can never run ahead of what has actually loaded
        const timeP = 1 - Math.pow(1 - Math.min(1, el / MIN), 2);
        const shown = Math.min(real, timeP);
        pctEl.textContent = `${Math.round(shown * 100)}%`;
        barEl.style.width = `${shown * 100}%`;
        tcEl.textContent = toTC(el / 1000);
        // hard stop after 7s in case a font or image hangs
        if (shown >= 0.999 || el > 7000) finish();
      };
      const timer = setInterval(step, 1000 / 24);

      const finish = () => {
        if (done) return;
        done = true;
        clearInterval(timer);
        pctEl.textContent = '100%';
        barEl.style.width = '100%';
        if (reduce) {
          gsap.to(loader, { autoAlpha: 0, duration: 0.4, onComplete: () => { running = false; loader.remove(); } });
          resolve();
          return;
        }
        const tl = gsap.timeline({ onComplete: () => { running = false; loader.remove(); } });
        tl.to('.loader__ui', { autoAlpha: 0, y: -14, duration: 0.35, ease: 'power2.in' })
          .set('#slate', { autoAlpha: 1 })
          .from('#slate', { scale: 0.82, y: 40, rotation: -5, duration: 0.7, ease: 'expo.out' })
          .fromTo('.slate__top', { rotation: -26 }, { rotation: 0, duration: 0.2, ease: 'power4.in' }, '+=0.2')
          .to('#slate', { x: 6, duration: 0.05, yoyo: true, repeat: 3, ease: 'none' })
          .to(loader, { scaleY: 0.004, filter: 'brightness(5)', duration: 0.42, ease: 'power4.in' }, '+=0.25')
          .add(resolve)
          .to(loader, { scaleX: 0, duration: 0.32, ease: 'power4.in' })
          .to(loader, { autoAlpha: 0, duration: 0.1 });
      };
    });
  }

  /* ======================================================
     CURSOR — viewfinder that "focus-locks" on targets
     ====================================================== */
  function initCursor() {
    if (isTouch) return;
    document.documentElement.classList.add('has-cursor');
    const root = $('#cursor');
    const frame = $('#cursorFrame');
    const dot = $('#cursorDot');
    const label = $('#cursorLabel');
    const m = { x: innerWidth / 2, y: innerHeight / 2 };
    const f = { x: m.x - 17, y: m.y - 17, w: 34, h: 34 };
    const d = { x: m.x, y: m.y };
    let target = null;
    let mode = null;
    let moved = false;
    root.classList.add('is-hidden');

    const setTarget = (el) => {
      if (el === target) return;
      target = el;
      if (!el) mode = null;
      else if (el.matches('.card, [data-tilt], .scrubber__track')) mode = 'label';
      else mode = 'lock';
      let txt = '';
      if (el) {
        txt = el.dataset.cursorLabel || '';
        if (!txt && el.matches('[data-tilt]')) txt = 'HI, I’M KUSH :)';
        if (!txt && el.matches('a')) txt = el.getAttribute('href')?.startsWith('http') ? 'OPEN ↗' : '';
      }
      label.textContent = txt;
      root.classList.toggle('has-label', !!txt);
      root.classList.toggle('is-locked', mode === 'lock');
    };
    const pick = (node) => (node && node.closest ? node.closest('.card, [data-tilt], .scrubber__track, a, button, [data-cursor-label]') : null);

    addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      m.x = e.clientX; m.y = e.clientY;
      if (!moved) { moved = true; f.x = m.x - 17; f.y = m.y - 17; d.x = m.x; d.y = m.y; }
      root.classList.remove('is-hidden');
    }, { passive: true });
    document.addEventListener('mouseover', (e) => setTarget(pick(e.target)));
    document.documentElement.addEventListener('mouseleave', () => root.classList.add('is-hidden'));
    addEventListener('pointerdown', () => root.classList.add('is-press'));
    addEventListener('pointerup', () => root.classList.remove('is-press'));
    addEventListener('click', (e) => {
      const fl = document.createElement('span');
      fl.className = 'cursor__flash';
      fl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      root.appendChild(fl);
      setTimeout(() => fl.remove(), 600);
    });
    // re-check what's under the cursor while the page scrolls under it
    let lastCheck = 0;
    const recheck = () => {
      const now = performance.now();
      if (now - lastCheck < 90 || !moved) return;
      lastCheck = now;
      setTarget(pick(document.elementFromPoint(m.x, m.y)));
    };
    lenis ? lenis.on('scroll', recheck) : addEventListener('scroll', recheck, { passive: true });

    gsap.ticker.add(() => {
      let gx, gy, gw, gh;
      if (mode === 'lock' && target && target.isConnected) {
        const r = target.getBoundingClientRect();
        if (r.width > 0 && r.width < innerWidth * 0.7 && r.height < 280) {
          const p = 8;
          gw = r.width + p * 2; gh = r.height + p * 2;
          gx = r.left - p + (m.x - (r.left + r.width / 2)) * 0.1;
          gy = r.top - p + (m.y - (r.top + r.height / 2)) * 0.1;
        }
      } else if (mode === 'label') {
        gw = gh = 66; gx = m.x - 33; gy = m.y - 33;
      }
      if (gx === undefined) { gw = gh = 34; gx = m.x - 17; gy = m.y - 17; }
      f.x = lerp(f.x, gx, 0.22); f.y = lerp(f.y, gy, 0.22);
      f.w = lerp(f.w, gw, 0.2); f.h = lerp(f.h, gh, 0.2);
      d.x = lerp(d.x, m.x, 0.55); d.y = lerp(d.y, m.y, 0.55);
      frame.style.transform = `translate3d(${f.x.toFixed(1)}px, ${f.y.toFixed(1)}px, 0)`;
      frame.style.width = `${f.w.toFixed(1)}px`;
      frame.style.height = `${f.h.toFixed(1)}px`;
      dot.style.transform = `translate3d(${d.x.toFixed(1)}px, ${d.y.toFixed(1)}px, 0)`;
      const lw = label.offsetWidth || 60;
      let lx = f.x + f.w + 6, ly = f.y + f.h + 6;
      if (lx + lw > innerWidth - 8) lx = f.x - lw - 6;
      if (ly + 24 > innerHeight - 8) ly = f.y - 28;
      label.style.transform = `translate3d(${lx.toFixed(1)}px, ${ly.toFixed(1)}px, 0)`;
    });
  }

  /* magnetic pull on small buttons */
  function initMagnetic() {
    if (isTouch) return;
    $$('.burger, .bracket-btn, .ticker__close, .modal__close').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, .4)' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, .4)' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ======================================================
     HERO
     ====================================================== */
  const drawPaths = $$('.h-scribble .draw');
  function prepHero() {
    drawPaths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len} ${len}`;
      p.style.strokeDashoffset = len;
    });
    gsap.set('.hero .char', { yPercent: 110 });
    gsap.set('#heroImg', { yPercent: 18, autoAlpha: 0 });
    gsap.set('.h-scribble .spark', { scale: 0, transformOrigin: '50% 50%' });
    gsap.set('.h-note', { autoAlpha: 0 });
    gsap.set('.h-tag > *', { autoAlpha: 0, y: 14 });
    gsap.set(['.h-sub', '.h-scroll'], { autoAlpha: 0, y: 12 });
    gsap.set('#header', { yPercent: -60, autoAlpha: 0 });
    gsap.set(['#ticker', '.reel-tab'], { autoAlpha: 0 });
  }

  function playHeroIntro() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to('#heroImg', { yPercent: 0, autoAlpha: 1, duration: 1.6 }, 0)
      .to('.h-hello .char', { yPercent: 0, duration: 1.2, stagger: 0.05 }, 0.1)
      .to('.h-meet .char', { yPercent: 0, duration: 1.2, stagger: 0.05 }, 0.25)
      .to('.h-kush .char', { yPercent: 0, duration: 1.3, stagger: 0.06 }, 0.4)
      .to('.h-tag > *', { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.05 }, 0.6)
      .to(drawPaths, { strokeDashoffset: 0, duration: 1.4, stagger: 0.07, ease: 'power2.inOut' }, 0.6)
      .to('.h-scribble .spark', { scale: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(3)' }, 1.1)
      .to('.h-note', { autoAlpha: 1, duration: 0.6 }, 1.5)
      .to(['.h-sub', '.h-scroll'], { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.9)
      .to('#header', { yPercent: 0, autoAlpha: 1, duration: 1 }, 0.5)
      .to(['#ticker', '.reel-tab'], { autoAlpha: 1, duration: 0.8 }, 0.8);

    // sparkles keep twinkling
    gsap.to('.h-scribble .spark', { rotation: 90, duration: 6, repeat: -1, ease: 'none', delay: 2 });
    startTypewriter();
  }

  function initHeroMotion() {
    // mouse parallax depth
    if (!isTouch && !reduce) {
      const layers = $$('#heroStage .layer').map((el) => ({
        el, depth: parseFloat(el.dataset.depth || 0.3),
        x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3' }),
        y: gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3' }),
      }));
      const person = $('#heroPerson');
      gsap.set(person, { transformPerspective: 1100, transformOrigin: '50% 100%' });
      const rY = gsap.quickTo(person, 'rotationY', { duration: 1.2, ease: 'power3' });
      const rX = gsap.quickTo(person, 'rotationX', { duration: 1.2, ease: 'power3' });
      addEventListener('pointermove', (e) => {
        if (scrollY > innerHeight) return;
        const nx = e.clientX / innerWidth - 0.5;
        const ny = e.clientY / innerHeight - 0.5;
        layers.forEach((l) => { l.x(-nx * l.depth * 70); l.y(-ny * l.depth * 40); });
        rY(nx * 14); rX(-ny * 6);
      }, { passive: true });
    }

    // scroll: the hero tears apart as you leave
    gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } })
      .to('.h-hello', { xPercent: -38, opacity: 0, ease: 'none' }, 0)
      .to('.h-meet', { xPercent: -48, opacity: 0, ease: 'none' }, 0)
      .to('.h-right', { xPercent: 34, opacity: 0, ease: 'none' }, 0)
      .to('.h-tag', { yPercent: -260, opacity: 0, ease: 'none' }, 0)
      .to('#heroPerson', { yPercent: 10, scale: 0.9, ease: 'none' }, 0)
      .to('.h-scroll', { opacity: 0, ease: 'none' }, 0);
  }

  /* ======================================================
     QUOTE — handwriting reveal
     ====================================================== */
  function initQuote() {
    $$('.quote .q-line').forEach((line) => {
      gsap.fromTo(line, { clipPath: 'inset(-20% 100% -20% 0)' }, {
        clipPath: 'inset(-20% 0% -20% 0)', ease: 'none',
        scrollTrigger: { trigger: line, start: 'top 82%', end: 'top 48%', scrub: 0.6 },
      });
    });
    gsap.from('.quote__marks i', {
      scale: 0, opacity: 0, stagger: { each: 0.04, from: 'random' }, duration: 0.6, ease: 'back.out(3)',
      scrollTrigger: { trigger: '.quote', start: 'top 60%' },
    });
    gsap.to('.quote__text', { rotation: 1, yPercent: -6, ease: 'none', scrollTrigger: { trigger: '.quote', start: 'top bottom', end: 'bottom top', scrub: true } });

    // photo: wipes in like a print being revealed, then drifts with a slow push-in
    gsap.fromTo('.qp__frame', { clipPath: 'inset(0% 0% 100% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut',
      scrollTrigger: { trigger: '.quote__photo', start: 'top 78%' },
    });
    gsap.fromTo('.qp__frame img', { scale: 1.16 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.quote__photo', start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.fromTo('.quote__photo', { y: 70 }, {
      y: -50, ease: 'none',
      scrollTrigger: { trigger: '.quote', start: 'top bottom', end: 'bottom top', scrub: true },
    });
    const arrow = $('.qp__arrow path');
    const len = arrow.getTotalLength();
    gsap.fromTo(arrow, { strokeDasharray: len, strokeDashoffset: len }, {
      strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut',
      scrollTrigger: { trigger: '.qp__cap', start: 'top 88%' },
    });
  }

  /* ======================================================
     ABOUT
     ====================================================== */
  function initAbout() {
    gsap.from('.about__title .line > span', {
      yPercent: 110, duration: 1.2, stagger: 0.1, ease: 'expo.out',
      scrollTrigger: { trigger: '.about__title', start: 'top 82%' },
    });
    gsap.to('.about__para .w', {
      opacity: 1, stagger: 0.05, ease: 'none',
      scrollTrigger: { trigger: '.about__para', start: 'top 82%', end: 'bottom 50%', scrub: true },
    });
    gsap.from('.role, .roles .about__label', {
      y: 36, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out',
      scrollTrigger: { trigger: '.roles', start: 'top 86%' },
    });
    gsap.from('.stat, .achievements .about__label', {
      y: 40, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out',
      scrollTrigger: { trigger: '.achievements', start: 'top 90%' },
    });
    // count the numbers up when they come into view
    $$('[data-count]').forEach((el) => {
      const end = +el.dataset.count, suffix = el.dataset.suffix || '';
      const o = { v: 0 };
      el.textContent = `0${suffix}`;
      gsap.to(o, {
        v: end, duration: 2, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%' },
        onUpdate: () => { el.textContent = `${Math.round(o.v)}${suffix}`; },
      });
    });
    gsap.fromTo('.tilt', { rotation: -7, y: 90 }, {
      rotation: 3, y: -50, ease: 'none',
      scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true },
    });
    gsap.from('.tilt__card', {
      clipPath: 'inset(100% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut',
      scrollTrigger: { trigger: '.about__media', start: 'top 80%' },
      onComplete: () => gsap.set('.tilt__card', { clearProps: 'clipPath' }),
    });
    gsap.from('.about__caption', { opacity: 0, x: -30, duration: 1, delay: 0.6, scrollTrigger: { trigger: '.about__media', start: 'top 75%' } });

    // 3D tilt + glare on hover
    if (!isTouch) {
      const card = $('.tilt__card');
      gsap.set(card, { transformPerspective: 1000 });
      const rx = gsap.quickTo(card, 'rotationX', { duration: 0.8, ease: 'power3' });
      const ry = gsap.quickTo(card, 'rotationY', { duration: 0.8, ease: 'power3' });
      const host = $('[data-tilt]');
      host.addEventListener('pointermove', (e) => {
        const r = host.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        rx(-ny * 16); ry(nx * 18);
        card.style.setProperty('--gx', `${(nx + 0.5) * 100}%`);
        card.style.setProperty('--gy', `${(ny + 0.5) * 100}%`);
        card.style.setProperty('--glare', '1');
      });
      host.addEventListener('pointerleave', () => { rx(0); ry(0); card.style.setProperty('--glare', '0'); });
    }
  }

  /* ======================================================
     SERVICES — pinned list with depth-of-field blur
     ====================================================== */
  function initServices() {
    const list = $('#servicesList');
    const items = [...list.children];
    const right = $('.services__right');
    let startY = 0, endY = 0, H = 0;
    const measure = () => {
      H = right.clientHeight;
      const first = items[0], last = items[items.length - 1];
      startY = H / 2 - (first.offsetTop + first.offsetHeight / 2);
      endY = H / 2 - (last.offsetTop + last.offsetHeight / 2);
    };
    const apply = (p) => {
      const y = lerp(startY, endY, p);
      list.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      items.forEach((it) => {
        const c = y + it.offsetTop + it.offsetHeight / 2;
        const dist = Math.min(Math.abs(c - H / 2) / (H * 0.42), 1);
        it.style.filter = `blur(${(Math.pow(dist, 1.3) * 12).toFixed(2)}px)`;
        it.style.opacity = (1 - dist * 0.82).toFixed(3);
        it.style.color = dist < 0.11 ? 'var(--rec)' : '';
      });
    };
    measure(); apply(0);
    ScrollTrigger.create({
      trigger: '#services', start: 'top top', end: '+=190%', pin: '.services__pin', scrub: true,
      onUpdate: (s) => apply(s.progress),
      onRefresh: (s) => { measure(); apply(s.progress); },
    });
    gsap.from('.services__left > *', {
      y: 50, opacity: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out',
      scrollTrigger: { trigger: '#services', start: 'top 65%' },
    });
  }

  /* ======================================================
     WORK — 3D cylinder of film frames, spun by scroll
     ====================================================== */
  function initWork() {
    const ring = $('#reelRing');
    const cards = $$('.card', ring);
    const N = cards.length;
    const step = 360 / N;
    const faces = cards.map((c) => c.querySelector('.card__face'));
    const countEl = $('#workCount'), nowEl = $('#workNow');
    let R = 500, cw = 380;
    let target = 0, cur = 0, front = -1, visible = false;
    const tilt = { x: 0, y: 0 };

    const layout = () => {
      cw = innerWidth < 760 ? Math.min(innerWidth * 0.62, 260) : Math.min(innerWidth * 0.245, 390);
      ring.style.setProperty('--cw', `${cw}px`);
      R = (cw / 2) / Math.tan(Math.PI / N) * 1.22;
      cards.forEach((c, i) => { c.style.transform = `rotateY(${i * step}deg) translateZ(${R.toFixed(1)}px)`; });
    };
    layout();
    addEventListener('resize', layout);

    ScrollTrigger.create({
      trigger: '#work', start: 'top top', end: () => `+=${(N - 1) * 45}%`, pin: '.work__pin', invalidateOnRefresh: true,
      onUpdate: (s) => { target = s.progress * (N - 1) * step; },
    });
    ScrollTrigger.create({ trigger: '#work', start: 'top bottom', end: 'bottom top', onToggle: (s) => { visible = s.isActive; } });

    gsap.ticker.add(() => {
      if (!visible) return;
      cur = lerp(cur, target, 0.075);
      tilt.x = lerp(tilt.x, isTouch ? 0 : mouseN.y * -7, 0.05);
      tilt.y = lerp(tilt.y, isTouch ? 0 : mouseN.x * 10, 0.05);
      ring.style.transform = `translateZ(${(-R).toFixed(1)}px) rotateX(${(tilt.x - 4).toFixed(2)}deg) rotateY(${(-cur + tilt.y).toFixed(2)}deg)`;
      cards.forEach((c, i) => {
        const rel = ((i * step - cur) % 360 + 540) % 360 - 180;
        const facing = Math.cos((rel * Math.PI) / 180);
        faces[i].style.filter = `brightness(${(0.3 + 0.7 * Math.max(0, facing)).toFixed(3)})`;
      });
      const fr = ((Math.round(cur / step) % N) + N) % N;
      if (fr !== front) {
        front = fr;
        countEl.textContent = `${pad2(fr + 1)} / ${pad2(N)}`;
        nowEl.textContent = WORKS[fr].tag;
        gsap.fromTo(nowEl, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out' });
      }
    });

    gsap.from('.work__title, .work__head .eyebrow', {
      y: 60, opacity: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out',
      scrollTrigger: { trigger: '#work', start: 'top 65%' },
    });
    gsap.from('.reel', {
      scale: 0.7, opacity: 0, duration: 1.6, ease: 'expo.out',
      scrollTrigger: { trigger: '#work', start: 'top 55%' },
    });
  }

  /* ======================================================
     FAQ
     ====================================================== */
  function initFaq() {
    $$('.faq__item').forEach((it) => {
      ScrollTrigger.create({ trigger: it, start: 'top 64%', end: 'bottom 36%', toggleClass: 'is-active' });
    });
    gsap.from('.faq__title', { y: 80, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.faq', start: 'top 70%' } });
  }

  /* ======================================================
     CONTACT
     ====================================================== */
  function initContact() {
    $$('.contact__hand .q-line').forEach((line, i) => {
      gsap.fromTo(line, { clipPath: 'inset(-30% 100% -30% 0)' }, {
        clipPath: 'inset(-30% 0% -30% 0)', ease: 'none',
        scrollTrigger: { trigger: '.contact__hand', start: `top ${80 - i * 12}%`, end: `top ${50 - i * 12}%`, scrub: 0.6 },
      });
    });
    gsap.from('.contact__cta > *, .contact__nav', {
      y: 50, opacity: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out',
      scrollTrigger: { trigger: '.contact__row', start: 'top 85%' },
    });
    gsap.from('.contact__kush', {
      yPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out',
      scrollTrigger: { trigger: '.contact__row', start: 'top 80%' },
    });
  }

  /* ======================================================
     HEADER theme switching (light / dark sections)
     ====================================================== */
  function initThemes() {
    const header = $('#header');
    $$('[data-theme]').forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec, start: () => `top ${header.offsetTop + header.offsetHeight / 2}px`,
        end: () => `bottom ${header.offsetTop + header.offsetHeight / 2}px`,
        onToggle: (s) => { if (s.isActive) header.classList.toggle('is-dark', sec.dataset.theme === 'dark'); },
      });
    });
  }

  /* ======================================================
     SCRUBBER HUD — the page is the timeline
     ====================================================== */
  function initScrubber() {
    const hud = $('#scrubber');
    const fill = $('#scrubFill'), head = $('#scrubHead'), tc = $('#scrubTc');
    const track = $('#scrubTrack');
    const DURATION = 180;
    const max = () => Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const update = () => {
      const y = lenis ? lenis.scroll : scrollY;
      const p = clamp(y / max(), 0, 1);
      fill.style.width = `${p * 100}%`;
      head.style.left = `${p * 100}%`;
      tc.textContent = `${toTC(p * DURATION)} / ${toTC(DURATION)}`;
      hud.classList.toggle('is-on', y > innerHeight * 0.6 && !menuOpen);
    };
    lenis ? lenis.on('scroll', update) : addEventListener('scroll', update, { passive: true });
    update();

    let dragging = false;
    const seek = (e, immediate) => {
      const r = track.getBoundingClientRect();
      const p = clamp((e.clientX - r.left) / r.width, 0, 1);
      if (lenis) lenis.scrollTo(p * max(), immediate ? { immediate: true } : { duration: 1.2 });
      else scrollTo(0, p * max());
    };
    track.addEventListener('pointerdown', (e) => { dragging = true; track.setPointerCapture(e.pointerId); seek(e, false); });
    track.addEventListener('pointermove', (e) => { if (dragging) seek(e, true); });
    track.addEventListener('pointerup', () => { dragging = false; });
    track.addEventListener('pointercancel', () => { dragging = false; });
  }

  /* ======================================================
     BOOT
     ====================================================== */
  prepHero();
  initMarbles();
  initCursor();
  initMagnetic();
  initHeroMotion();
  initQuote();
  initAbout();
  initServices();
  initWork();
  initFaq();
  initContact();
  initThemes();
  initScrubber();

  runLoader().then(() => {
    document.body.classList.remove('is-loading');
    window.scrollTo(0, 0);
    lenis && lenis.start();
    ScrollTrigger.refresh();
    playHeroIntro();
  });

  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());
})();
