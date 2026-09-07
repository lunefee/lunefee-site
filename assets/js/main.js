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
      lookbook_note: 'Visual stories are coming soon.',
      collection_body: 'Browse every item on the official online store.',
      social_body: 'Daily fragments and new arrivals live on Instagram.'
    },
    ja: {
      hero_sub: '月の満ち欠けのように、どんな日の自分も自分。',
      concept_body: '満ちる夜も欠ける夜も、月はいつも月のまま。\n着るもの、そばに置くもの、暮らしの小さな選択のひとつひとつに、\nあなたらしさが宿ります。\n私たちがつくるのは、\nその「らしさ」にそっと寄り添う\nモノトーンの世界です。',
      lookbook_note: '世界観を綴るビジュアルは近日公開します。',
      collection_body: 'すべてのアイテムは公式オンラインストアでご覧いただけます。',
      social_body: '日々の断片と入荷のお知らせは Instagram で。'
    },
    ko: {
      hero_sub: '달이 차고 기울듯, 어떤 날의 나도 결국 나.',
      concept_body: '차오르든 기울든 달은 언제나 달입니다.\n무엇을 입고 무엇을 곁에 두는지, 일상의 작은 선택 하나하나에\n당신다움이 깃듭니다.\n우리가 만드는 것은\n그 ‘나다움’에 조용히 곁하는\n모노톤의 세계입니다.',
      lookbook_note: '브랜드의 무드를 담은 비주얼을 곧 공개합니다.',
      collection_body: '모든 아이템은 공식 온라인 스토어에서 만나보실 수 있습니다.',
      social_body: '일상의 조각과 입고 소식은 인스타그램에서.'
    }
  };

  var HTML_LANG = { en: 'en', ja: 'ja', ko: 'ko' };
  var STORE_KEY = 'lunefee.lang';
  var body = document.body;
  var root = document.documentElement;
  var langButtons = Array.prototype.slice.call(document.querySelectorAll('.lang button'));

  function applyLang(lang) {
    if (!I18N[lang]) lang = 'en';
    var dict = I18N[lang];

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

  /* ---------- marquee: duplicate track for a seamless -50% loop -- */
  var mqTrack = document.querySelector('.marquee__track');
  if (mqTrack) mqTrack.innerHTML = mqTrack.innerHTML + mqTrack.innerHTML;

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
    if (yy > 240 && yy > lastY + 4) nav.classList.add('nav--hidden');
    else if (yy < lastY - 4 || yy <= 240) nav.classList.remove('nav--hidden');
    lastY = yy;
  }
  onScrollNav();

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

  /* ---------- one rAF-throttled pump ----------------------- */
  var ticking = false;
  function pump() { onScrollNav(); applyHeroTransforms(); ticking = false; }
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
            '.grid__item,.card,' +
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
