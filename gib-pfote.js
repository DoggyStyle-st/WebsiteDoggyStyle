(() => {
  const burger = document.getElementById('burger');
  const sideMenu = document.getElementById('sideMenu');
  const overlay = document.getElementById('sideOverlay');
  const pawLink = document.querySelector('.gib-pfote__link');
  const feedback = document.getElementById('pfoten-feedback');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let scrollFrame = 0;
  let feedbackTimer = 0;

  function setMenuOpen(open) {
    burger.classList.toggle('open', open);
    sideMenu.classList.toggle('open', open);
    overlay.classList.toggle('open', open);
  }

  function syncHeader() {
    document.body.classList.toggle('scrolled-down', window.scrollY > 40);
  }

  function cancelPawScroll() {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
  }

  function finishPawScroll() {
    scrollFrame = 0;
    if (window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    document.body.classList.remove('scrolled-down');
    setMenuOpen(true);

    if (feedback) {
      clearTimeout(feedbackTimer);
      feedback.textContent = 'Fein!';
      feedback.classList.add('visible');
      feedbackTimer = setTimeout(() => {
        feedback.classList.remove('visible');
        feedback.textContent = '';
      }, 2400);
    }
  }

  function scrollFromPaw(event) {
    event.preventDefault();
    cancelPawScroll();

    if (reducedMotion.matches || window.scrollY <= 1) {
      finishPawScroll();
      return;
    }

    const deadline = performance.now() + 1800;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update the header even when the browser omits the last scroll event.
    function waitForTop(now) {
      if (window.scrollY <= 1 || now >= deadline) {
        finishPawScroll();
      } else {
        scrollFrame = requestAnimationFrame(waitForTop);
      }
    }

    scrollFrame = requestAnimationFrame(waitForTop);
  }

  burger.addEventListener('click', () => setMenuOpen(!sideMenu.classList.contains('open')));
  overlay.addEventListener('click', () => setMenuOpen(false));
  sideMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
  });
  pawLink.addEventListener('click', scrollFromPaw);
  window.addEventListener('scroll', syncHeader, { passive: true });
  window.addEventListener('pageshow', syncHeader);
  window.addEventListener('wheel', cancelPawScroll, { passive: true });
  window.addEventListener('touchstart', cancelPawScroll, { passive: true });
  syncHeader();
})();
