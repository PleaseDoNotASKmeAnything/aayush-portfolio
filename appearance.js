// Apply the saved theme before the first paint to avoid a light flash.
(() => {
  const root = document.documentElement;
  let theme = 'light';
  try {
    const savedTheme = localStorage.getItem('portfolio-editorial-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') theme = savedTheme;
  } catch { /* The toggle also works when browser storage is unavailable. */ }
  function applyTheme(value) {
    root.dataset.theme = value;
    document.querySelector('meta[name="theme-color"]').content = value === 'dark' ? '#191919' : '#fcf9fc';
    const button = document.getElementById('theme-toggle');
    if (button) {
      const label = value === 'dark' ? 'Enable light mode' : 'Enable dark mode';
      button.setAttribute('aria-label', label);
      button.title = label;
    }
  }
  applyTheme(theme);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const started = performance.now();
  // Every page load gets an intro, including reloads and direct section links.
  const showIntro = !reducedMotion;
  if (showIntro) root.classList.add('is-loading');
  let finished = false;
  let progressFrame;
  const introDuration = 2400;
  function updateProgress(now) {
    if (finished) return;
    const progress = Math.min(99, Math.floor((now - started) / introDuration * 100));
    const counter = document.getElementById('intro-count');
    const bar = document.getElementById('intro-progress');
    if (counter) counter.textContent = String(progress).padStart(3, '0');
    if (bar) bar.style.transform = `scaleX(${progress / 100})`;
    progressFrame = requestAnimationFrame(updateProgress);
  }
  function revealPage() {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(progressFrame);
    const counter = document.getElementById('intro-count');
    const bar = document.getElementById('intro-progress');
    if (counter) counter.textContent = '100';
    if (bar) bar.style.transform = 'scaleX(1)';
    root.classList.remove('is-loading');
    if (showIntro) root.classList.add('intro-complete');
    document.querySelectorAll('body > header, body > main, body > footer').forEach(element => { element.inert = false; });
    const loader = document.getElementById('page-loader');
    if (loader) {
      if (loader.contains(document.activeElement)) document.getElementById('main-content')?.focus({ preventScroll: true });
      loader.inert = true;
      loader.setAttribute('aria-hidden', 'true');
      setTimeout(() => loader.remove(), showIntro ? 850 : 0);
    }
  }
  // Reveal independently of network resources, with a hard fallback.
  setTimeout(revealPage, 3500);
  window.addEventListener('pageshow', event => { if (event.persisted) revealPage(); });
  document.addEventListener('DOMContentLoaded', () => {
    if (!showIntro) revealPage();
    if (finished) document.getElementById('page-loader')?.remove();
    else {
      document.querySelectorAll('body > header, body > main, body > footer').forEach(element => { element.inert = true; });
      document.getElementById('intro-skip')?.addEventListener('click', revealPage);
      progressFrame = requestAnimationFrame(updateProgress);
      setTimeout(revealPage, Math.max(0, introDuration - (performance.now() - started)));
    }
    applyTheme(theme);
    document.getElementById('theme-toggle').hidden = false;
    document.getElementById('theme-toggle').addEventListener('click', () => {
      theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(theme);
      try { localStorage.setItem('portfolio-editorial-theme', theme); } catch { /* Optional persistence. */ }
    });
  }, { once: true });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !finished) revealPage();
  });
})();
