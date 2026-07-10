/**
 * hero.js - Simple entrance animation
 * Fades in hero text on page load and language switch.
 */
(function () {
  var heroText = document.getElementById('hero-text');
  if (!heroText) return;

  function reveal() {
    heroText.classList.remove('revealed');
    void heroText.offsetWidth; /* force reflow to restart transition */
    heroText.classList.add('revealed');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      requestAnimationFrame(reveal);
    });
  } else {
    requestAnimationFrame(reveal);
  }

  window.revealHero = reveal;
})();
