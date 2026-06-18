(function () {
  var html = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  var iconMoon = document.getElementById('theme-icon-moon');
  var iconSun = document.getElementById('theme-icon-sun');

  if (!toggle) return;

  /* Resolve theme: saved preference > system preference > light */
  var saved = localStorage.getItem('elian-theme');
  if (saved) {
    html.dataset.theme = saved;
    updateIcons(saved);
  } else {
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var systemTheme = prefersDark ? 'dark' : 'light';
    html.dataset.theme = systemTheme;
    updateIcons(systemTheme);
  }

  /* Listen to system theme changes when no explicit user override is set */
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (localStorage.getItem('elian-theme')) return; /* user explicitly picked — do not override */
    var next = e.matches ? 'dark' : 'light';
    html.dataset.theme = next;
    updateIcons(next);
  });

  toggle.addEventListener('click', function () {
    var current = html.dataset.theme;
    var next = current === 'dark' ? 'light' : 'dark';
    html.dataset.theme = next;
    localStorage.setItem('elian-theme', next);
    updateIcons(next);
  });

  function updateIcons(theme) {
    if (!iconMoon || !iconSun) return;
    if (theme === 'dark') {
      iconMoon.style.display = 'none';
      iconSun.style.display = '';
    } else {
      iconMoon.style.display = '';
      iconSun.style.display = 'none';
    }
  }
})();