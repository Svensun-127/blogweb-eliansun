(function () {
  /* Hero text fade-in on page load */
  var heroText = document.getElementById('hero-text');
  if (!heroText) return;

  window.addEventListener('DOMContentLoaded', function () {
    /* Small delay so the layout is painted first */
    requestAnimationFrame(function () {
      heroText.classList.add('revealed');
    });
  });
})();
