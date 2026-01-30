/* -----------------------------------------
  Accessibility: show focus outlines only
  for keyboard users (Tab navigation)
------------------------------------------ */

const handleFirstTab = (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing');
    window.removeEventListener('keydown', handleFirstTab);
    window.addEventListener('mousedown', handleMouseDownOnce, { passive: true });
  }
};

const handleMouseDownOnce = () => {
  document.body.classList.remove('user-is-tabbing');
  window.removeEventListener('mousedown', handleMouseDownOnce);
  window.addEventListener('keydown', handleFirstTab);
};

window.addEventListener('keydown', handleFirstTab);

/* -----------------------------------------
  Back-to-top button (safe + CSS-class based)
  Works with CSS: .back-to-top.show { ... }
------------------------------------------ */

const backToTopButton = document.querySelector('.back-to-top');
const SHOW_AT_Y = 700;

const updateBackToTop = () => {
  if (!backToTopButton) return;

  if (window.scrollY > SHOW_AT_Y) {
    backToTopButton.classList.add('show');
  } else {
    backToTopButton.classList.remove('show');
  }
};

// Run once on load (in case user refreshes mid-scroll)
updateBackToTop();

// Use passive scroll listener for performance
window.addEventListener('scroll', updateBackToTop, { passive: true });

/* -----------------------------------------
  Smooth in-page navigation (extra-safe)
  GitHub Pages friendly, no dependencies
------------------------------------------ */

const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    // Smooth scroll (native)
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Update URL hash without jumping
    history.pushState(null, '', href);
  });
});
