(function () {
  var html = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  var iconMoon = document.getElementById('theme-icon-moon');
  var iconSun = document.getElementById('theme-icon-sun');

  if (!toggle) return;

  /* Restore saved theme */
  var saved = localStorage.getItem('elian-theme');
  if (saved) {
    html.dataset.theme = saved;
    updateIcons(saved);
  } else {
    updateIcons('light');
  }

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
