(function () {
  var main = document.getElementById('main-area');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var pending = false;

  function updateStars() {
    pending = false;
    if (reducedMotion.matches) return;
    var scroll = window.scrollY + (main ? main.scrollTop : 0);
    var offset = Math.sin(scroll / 450) * -48;
    document.documentElement.style.setProperty('--stars-offset', offset.toFixed(1) + 'px');
  }

  function scheduleUpdate() {
    if (!pending) {
      pending = true;
      window.requestAnimationFrame(updateStars);
    }
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  if (main) main.addEventListener('scroll', scheduleUpdate, { passive: true });
  updateStars();
})();
