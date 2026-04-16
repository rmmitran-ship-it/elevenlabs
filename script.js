// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-question').addEventListener('click', () => {
    const wasActive = item.classList.contains('active');

    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

    // Open clicked item (unless it was already active — toggle behavior)
    if (!wasActive) {
      item.classList.add('active');
    }
  });
});

// ===== AGENT TABS =====
document.querySelectorAll('.agent-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    if (tab.classList.contains('active')) return;

    const tabId = tab.dataset.tab;

    // Swap active tab
    document.querySelectorAll('.agent-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Swap active chat panel
    document.querySelectorAll('.chat-panel').forEach(p => {
      p.classList.toggle('active', p.dataset.panel === tabId);
    });
  });
});

// ===== STATS COUNTER ANIMATION =====
const countUpElements = document.querySelectorAll('.count-up');

function animateCount(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Cubic ease-out
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

if (countUpElements.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  countUpElements.forEach(el => observer.observe(el));
}

// ===== PLATFORM DYNAMIC CAROUSEL =====
(() => {
  const cards = document.querySelectorAll('.platform-card');
  const slides = document.querySelectorAll('.platform-slide');
  if (!cards.length || !slides.length) return;

  let idx = 0;
  let timer = null;
  const INTERVAL = 6000;

  function activate(i, userInitiated = false) {
    idx = i;
    cards.forEach((c, j) => {
      c.classList.toggle('active', j === i);
      // restart progress animation
      const bar = c.querySelector('.card-progress span');
      if (bar) {
        bar.style.animation = 'none';
        void bar.offsetWidth;
        bar.style.animation = '';
      }
    });
    slides.forEach((s, j) => s.classList.toggle('active', j === i));
    if (userInitiated) restart();
  }

  function next() { activate((idx + 1) % cards.length); }

  function start() { timer = setInterval(next, INTERVAL); }
  function stop() { if (timer) clearInterval(timer); timer = null; }
  function restart() { stop(); start(); }

  cards.forEach((c, i) => {
    c.addEventListener('click', () => activate(i, true));
  });

  // Only auto-rotate when visible
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { activate(idx); start(); }
      else stop();
    });
  }, { threshold: 0.3 });
  io.observe(document.querySelector('.platform-visual'));
})();

// ===== SECURITY SECTION DYNAMIC =====
(() => {
  const items = document.querySelectorAll('.sec-item');
  const slides = document.querySelectorAll('.sec-slide');
  if (!items.length || !slides.length) return;

  function activate(i) {
    items.forEach((el, j) => el.classList.toggle('active', j === i));
    slides.forEach((el, j) => el.classList.toggle('active', j === i));
  }

  items.forEach((el, i) => {
    el.addEventListener('click', () => activate(i));
    el.addEventListener('mouseenter', () => activate(i));
  });
})();

// ===== HERO VIDEO AUDIO TOGGLE =====
(() => {
  const video = document.querySelector('.sphere-video');
  const toggle = document.querySelector('.sphere-audio-toggle');
  if (!video || !toggle) return;

  toggle.addEventListener('click', () => {
    const muted = !video.muted;
    video.muted = muted;
    toggle.setAttribute('aria-pressed', String(!muted));
    toggle.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
    toggle.textContent = muted ? 'Tap for sound' : 'Mute';
    if (video.paused) video.play().catch(() => {});
  });
})();
