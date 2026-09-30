/* =========================================================
   Lunefee — brand site scripts
   - the site chrome is English-only; the toggle swaps just the
     descriptive sentences (JA / EN / KO), default EN
   - Lenis smooth scroll (progressive: falls back to native)
   - sticky + auto-hide nav
   - staggered scroll reveals
   - hero parallax
   - hero stardust canvas (accent-tinted, reduced-motion aware)
   - marquee seamless loop
   - intro veil cleanup
   ========================================================= */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- i18n (only the switchable body sentences) --------- */
  var I18N = {
    en: {
      hero_sub: 'Like the phases of the moon, every version of you is still you.',
      concept_body: 'Full or waning, the moon is always the moon.\nYour true self lives in the small choices of everyday life —\nwhat you wear, what you keep close.\nWhat we make is\na monochrome world that stays\nquietly close to that self.',
      collection_body: 'Browse every item on the official online store.',
      social_body: 'Daily fragments and new arrivals, shared on social.',
      lune_personality: 'Quiet and reserved. Gentle at heart — can\u2019t leave anyone in trouble alone.',
      lune_favorite: 'Sweet cakes',
      fee_personality: 'Bright and a little airheaded. Hungry for fun and curious about everything.',
      fee_favorite: 'Hamburgers'
    },
    ja: {
      hero_sub: '月の満ち欠けのように、どんな日の自分も自分。',
      concept_body: '満ちる夜も欠ける夜も、月はいつも月のまま。\n着るもの、そばに置くもの、暮らしの小さな選択のひとつひとつに、\nあなたらしさが宿ります。\n私たちがつくるのは、\nその「らしさ」にそっと寄り添う\nモノトーンの世界です。',
      collection_body: 'すべてのアイテムは公式オンラインストアでご覧いただけます。',
      social_body: '日々の断片と入荷のお知らせは SNS で。',
      lune_personality: '控えめでおとなしい性格。やさしくて、困っている人を放っておけない。',
      lune_favorite: '甘いケーキ',
      fee_personality: '明るくて天然。楽しいことに貪欲で、何事にも好奇心旺盛。',
      fee_favorite: 'ハンバーガー'
    },
    ko: {
      hero_sub: '달이 차고 기울듯, 어떤 날의 나도 결국 나.',
      concept_body: '차오르든 기울든 달은 언제나 달입니다.\n무엇을 입고 무엇을 곁에 두는지, 일상의 작은 선택 하나하나에\n당신다움이 깃듭니다.\n우리가 만드는 것은\n그 ‘나다움’에 조용히 곁하는\n모노톤의 세계입니다.',
      collection_body: '모든 아이템은 공식 온라인 스토어에서 만나보실 수 있습니다.',
      social_body: '일상의 조각과 입고 소식은 SNS에서.',
      lune_personality: '조용하고 얌전한 성격. 다정해서 곤란한 사람을 그냥 지나치지 못한다.',
      lune_favorite: '달콤한 케이크',
      fee_personality: '밝고 엉뚱한 천연. 즐거운 일에 욕심이 많고 무엇이든 호기심 가득.',
      fee_favorite: '햄버거'
    }
  };

  var currentLang = 'ja';

  /* ---------- today's moon ------------------------------------ */
  var MOON_NAMES = {
    ja: ['新月', '三日月', '上弦の月', '十三夜月', '満月', '寝待月', '下弦の月', '有明月'],
    en: ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'],
    ko: ['삭', '초승달', '상현달', '차오르는 달', '보름달', '기우는 달', '하현달', '그믐달']
  };
  var MOON_AGE = { ja: '月齢 ', en: 'Moon age ', ko: '월령 ' };
  var SYNODIC = 29.530588853;
  var NEW_MOON_REF = Date.UTC(2000, 0, 6, 18, 14);   // a known new moon

  function moonAge(date) {
    var days = (date.getTime() - NEW_MOON_REF) / 86400000;
    return ((days % SYNODIC) + SYNODIC) % SYNODIC;
  }
  // lit-part outline for a disc of radius r; northern-hemisphere view
  // (waxing lit on the right, waning on the left)
  function moonPath(age, r) {
    var p = age / SYNODIC;
    var rx = Math.abs(Math.cos(2 * Math.PI * p)) * r;
    var waxing = p < 0.5;
    var crescent = p < 0.25 || p > 0.75;
    var limbSweep = waxing ? 1 : 0;
    var termSweep = waxing ? (crescent ? 0 : 1) : (crescent ? 1 : 0);
    return 'M0,' + (-r) +
      ' A' + r + ',' + r + ' 0 0 ' + limbSweep + ' 0,' + r +
      ' A' + rx.toFixed(2) + ',' + r + ' 0 0 ' + termSweep + ' 0,' + (-r) + 'Z';
  }
  function renderMoon(lang) {
    var box = document.getElementById('moon');
    if (!box) return;
    var age = moonAge(new Date());
    var idx = Math.floor(((age / SYNODIC) * 8 + 0.5)) % 8;
    var path = document.getElementById('moonLitPath');
    if (path) path.setAttribute('d', age < 0.4 || age > SYNODIC - 0.4 ? '' : moonPath(age, 46));
    var name = document.getElementById('moonName');
    if (name) name.textContent = (MOON_NAMES[lang] || MOON_NAMES.en)[idx] + '  ·  ' +
      (MOON_AGE[lang] || MOON_AGE.en) + age.toFixed(1);
    box.hidden = false;
  }

  var HTML_LANG = { en: 'en', ja: 'ja', ko: 'ko' };
  var STORE_KEY = 'lunefee.lang';
  var body = document.body;
  var root = document.documentElement;
  var langButtons = Array.prototype.slice.call(document.querySelectorAll('.lang button'));

  function applyLang(lang) {
    if (!I18N[lang]) lang = 'en';
    var dict = I18N[lang];
    currentLang = lang;
    renderMoon(lang);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.textContent = dict[key];
    });

    body.classList.remove('lang-en', 'lang-ja', 'lang-ko');
    body.classList.add('lang-' + lang);
    root.classList.remove('lang-en', 'lang-ja', 'lang-ko');
    root.classList.add('lang-' + lang);
    root.setAttribute('lang', HTML_LANG[lang]);

    langButtons.forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-lang') === lang);
    });

    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
  }

  function initialLang() {
    // Japanese is the brand default; EN / KO only on explicit opt-in (remembered)
    var saved;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}
    if (saved && I18N[saved]) return saved;
    return 'ja';
  }

  langButtons.forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); });
  });
  applyLang(initialLang());

  /* ---------- year ---------------------------------------------- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- day / night theme ------------------------------ */
  var THEME_KEY = 'lunefee.theme';
  var themeBtn = document.getElementById('themeToggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  function syncTheme() {
    var dark = root.getAttribute('data-theme') === 'dark';
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      themeBtn.setAttribute('aria-label', dark ? 'Switch to day mode' : 'Switch to night mode');
    }
    if (themeMeta) themeMeta.setAttribute('content', dark ? '#0c0d11' : '#fafafa');
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      syncTheme();
    });
  }
  syncTheme();

  /* ---------- 3D characters: load model-viewer only when the section comes near ---------- */
  var models = document.querySelectorAll('model-viewer[data-src]');
  if (models.length) {
    var loadModels = function () {
      if (!window.customElements || customElements.get('model-viewer')) return;
      var sc = document.createElement('script');
      sc.type = 'module';
      sc.src = 'https://cdn.jsdelivr.net/npm/@google/model-viewer@4.3.1/dist/model-viewer.min.js';
      document.head.appendChild(sc);
      // set src only once the element is upgraded — an attribute set before that can be missed
      customElements.whenDefined('model-viewer').then(function () {
        models.forEach(function (m) {
          if (reduce) m.removeAttribute('auto-rotate');
          m.setAttribute('src', m.getAttribute('data-src'));
        });
      });
    };
    if ('IntersectionObserver' in window) {
      var mio = new IntersectionObserver(function (es) {
        if (es.some(function (e) { return e.isIntersecting; })) { loadModels(); mio.disconnect(); }
      }, { rootMargin: '700px 0px' });
      models.forEach(function (m) { mio.observe(m); });
    } else {
      loadModels();
    }
  }

  /* ---------- marquee: duplicate track for a seamless -50% loop -- */
  var mqTrack = document.querySelector('.marquee__track');
  if (mqTrack && !reduce) mqTrack.innerHTML = mqTrack.innerHTML + mqTrack.innerHTML;

  /* ---------- intro veil -------------------------------------- */
  var intro = document.getElementById('intro');
  if (intro) {
    if (reduce) {
      intro.remove();
    } else {
      var dismiss = function () {
        intro.classList.add('intro--gone');
        setTimeout(function () { if (intro && intro.parentNode) intro.remove(); }, 1100);
      };
      window.addEventListener('load', function () { setTimeout(dismiss, 1600); });
      setTimeout(dismiss, 4500); // safety net if 'load' never fires
    }
  }

  /* ---------- Lenis smooth scroll (progressive enhancement) ---- */
  var lenis = null;
  if (!reduce && typeof window.Lenis === 'function') {
    lenis = new window.Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true, touchMultiplier: 1.6 });
    var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length > 1) {
          var el = document.querySelector(id);
          if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -80, duration: 1.2 }); }
        }
      });
    });
  }

  /* ---------- nav: shrink + auto-hide ------------------------- */
  var nav = document.getElementById('nav');
  var lastY = window.scrollY;
  function onScrollNav() {
    var yy = window.scrollY;
    nav.classList.toggle('is-scrolled', yy > 40);
    if (body.classList.contains('menu-open')) { lastY = yy; return; }
    if (yy > 240 && yy > lastY + 4) nav.classList.add('nav--hidden');
    else if (yy < lastY - 4 || yy <= 240) nav.classList.remove('nav--hidden');
    lastY = yy;
  }
  onScrollNav();

  /* ---------- mobile menu ------------------------------------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  var menuOpen = false, menuT;
  function setMenu(open) {
    if (!burger || !menu || open === menuOpen) return;
    menuOpen = open;
    clearTimeout(menuT);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    body.classList.toggle('menu-open', open);
    if (open) {
      menu.hidden = false;
      nav.classList.remove('nav--hidden');
      if (lenis) lenis.stop();
      requestAnimationFrame(function () {
        menu.classList.add('is-open');
        var first = menu.querySelector('a');
        if (first) first.focus({ preventScroll: true });
      });
    } else {
      menu.classList.remove('is-open');
      if (lenis) lenis.start();
      menuT = setTimeout(function () { menu.hidden = true; }, 500);
    }
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(!menuOpen); });
    // capture phase: close (and restart Lenis) before the anchor's smooth-scroll handler runs
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    }, true);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuOpen) { setMenu(false); burger.focus(); }
    });
    window.matchMedia('(min-width:881px)').addEventListener('change', function (m) {
      if (m.matches) setMenu(false);
    });
  }

  /* ---------- hero parallax (scroll + pointer) -------------- */
  var hero = document.getElementById('hero');
  var heroLogo = document.querySelector('.hero__logo');
  var heroDust = document.querySelector('.hero__stardust');
  var pointerX = 0, pointerY = 0;   // -1 .. 1, eased toward target
  var targetX = 0, targetY = 0;

  function applyHeroTransforms() {
    if (reduce || !hero) return;
    var yy = window.scrollY;
    var onScreen = yy <= window.innerHeight;
    var sLogo = onScreen ? yy * 0.12 : window.innerHeight * 0.12;
    var sDust = onScreen ? yy * 0.05 : window.innerHeight * 0.05;
    if (heroLogo) heroLogo.style.transform =
      'translate3d(' + (pointerX * 10).toFixed(1) + 'px,' + (sLogo + pointerY * 7).toFixed(1) + 'px,0)';
    if (heroDust) heroDust.style.transform =
      'translate3d(' + (pointerX * -7).toFixed(1) + 'px,' + (sDust + pointerY * -5).toFixed(1) + 'px,0)';
    hero.style.setProperty('--px', (pointerX * 18).toFixed(1));
    hero.style.setProperty('--py', (pointerY * 12).toFixed(1));
  }

  /* ---------- lookbook: wipe reveal + in-frame drift + lightbox ---- */
  var lb = document.querySelector('.lb');
  var lbDrift = lb && !reduce ? Array.prototype.slice.call(lb.querySelectorAll('.lb__px')) : [];

  function applyLookbookDrift() {
    if (!lbDrift.length) return;
    var vh = window.innerHeight;
    lbDrift.forEach(function (img) {
      var r = img.parentNode.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      var p = (r.top + r.height / 2 - vh / 2) / vh;       // ~ -1 .. 1 across the viewport
      p = Math.max(-1, Math.min(1, p));
      img.style.setProperty('--shift', (p * 6).toFixed(2) + '%');
    });
  }

  if (lb) {
    if (!reduce && 'IntersectionObserver' in window) {
      lb.classList.add('lb--motion');
      var lbIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-in'); lbIo.unobserve(en.target); }
        });
      }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
      lb.querySelectorAll('.lb__item').forEach(function (it) { lbIo.observe(it); });
      applyLookbookDrift();
    }

    var box = document.getElementById('lightbox');
    if (box && typeof box.showModal === 'function') {
      var boxImg = box.querySelector('.lightbox__img');
      var boxCap = box.querySelector('.lightbox__cap');
      var opener = null;
      lb.addEventListener('click', function (e) {
        var btn = e.target.closest('.lb__frame');
        if (!btn) return;
        var img = btn.querySelector('img');
        var cap = btn.parentNode.querySelector('figcaption');
        opener = btn;
        boxImg.src = img.currentSrc || img.src;
        boxImg.alt = img.alt;
        boxCap.textContent = cap ? cap.textContent.replace(/^(\d+)/, '$1 — ') : '';
        box.showModal();
        document.documentElement.style.overflow = 'hidden';
        if (lenis) lenis.stop();
      });
      box.addEventListener('click', function (e) {
        // close on the dark backdrop or the glass ×; taps on the image / caption keep it open
        if (e.target === box || e.target.closest('.lightbox__close')) box.close();
      });
      box.addEventListener('close', function () {
        document.documentElement.style.overflow = '';
        if (lenis) lenis.start();
        if (opener) opener.focus({ preventScroll: true });
      });
    } else {
      lb.querySelectorAll('.lb__frame').forEach(function (b) { b.style.cursor = 'default'; });
    }
  }

  /* ---------- one rAF-throttled pump ----------------------- */
  var ticking = false;
  function pump() { onScrollNav(); applyHeroTransforms(); applyLookbookDrift(); ticking = false; }
  function requestPump() { if (!ticking) { requestAnimationFrame(pump); ticking = true; } }
  window.addEventListener('scroll', requestPump, { passive: true });
  if (lenis) lenis.on('scroll', requestPump);

  /* pointer parallax: fine pointers only, eased follow */
  if (!reduce && hero && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', function (e) {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
    (function follow() {
      pointerX += (targetX - pointerX) * 0.06;
      pointerY += (targetY - pointerY) * 0.06;
      applyHeroTransforms();
      requestAnimationFrame(follow);
    })();
  }

  /* ---------- staggered reveals ----------------------------- */
  var SEL = '.section__label,.section__title,.lead,.body,.note,.btn,' +
            '.card,.chara,' +
            '.footer__wordmark,.footer__links,.footer__copy';

  var groups = [];
  document.querySelectorAll('[data-animate-group]').forEach(function (g) {
    if (g.id !== 'hero') groups.push(g);   // hero shows at rest; only below-the-fold reveals
  });

  if (!reduce && 'IntersectionObserver' in window) {
    groups.forEach(function (g) {
      var items = Array.prototype.slice.call(g.querySelectorAll(SEL));
      items.forEach(function (el, i) {
        el.classList.add('anim');
        el.style.transitionDelay = (i * 70) + 'ms';
      });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('anim-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    groups.forEach(function (g) { io.observe(g); });
  }

  /* ---------- hero stardust canvas -------------------------- */
  var canvas = document.getElementById('stardust');
  if (canvas && !reduce) {
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var stars = [];
    var W = 0, H = 0;
    var INK = '255,255,255';   /* white sparkles over the cloud hero */
    var BLUE = '155,196,214';

    function resize() {
      var host = canvas.parentElement;
      W = host.clientWidth; H = host.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }
    function build() {
      var count = Math.round((W * H) / 14000);
      count = Math.max(28, Math.min(count, 92));
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 1.5 + 0.35,
          base: Math.random() * 0.32 + 0.16,
          amp: Math.random() * 0.4 + 0.2,
          speed: Math.random() * 0.0016 + 0.0004,
          phase: Math.random() * Math.PI * 2,
          drift: (Math.random() - 0.5) * 0.06,
          blue: Math.random() < 0.22
        });
      }
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var a = s.base + s.amp * (0.5 + 0.5 * Math.sin(s.phase + t * s.speed));
        s.x += s.drift;
        if (s.x < -4) s.x = W + 4;
        if (s.x > W + 4) s.x = -4;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + (s.blue ? BLUE : INK) + ',' + a.toFixed(3) + ')';
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(resize, 150); });
    resize();
    requestAnimationFrame(draw);
  }
})();
