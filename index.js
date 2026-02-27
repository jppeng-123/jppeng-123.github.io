/* =========================================================
   JP Peng — index.js (Static, minimal)
   Keeps only:
   (1) Keyboard-only focus outlines
   (2) Back-to-top show/hide
   (3) Footer year auto-update
   ========================================================= */

(() => {
  "use strict";

  // 1) Focus outline only for keyboard users
  function enableKeyboardFocus() {
    document.body.classList.add("user-is-tabbing");
  }
  function disableKeyboardFocus() {
    document.body.classList.remove("user-is-tabbing");
  }

  function onKeyDown(e) {
    const keys = ["Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    if (keys.includes(e.key)) enableKeyboardFocus();
  }

  window.addEventListener("keydown", onKeyDown, { passive: true });
  window.addEventListener("mousedown", disableKeyboardFocus, { passive: true });
  window.addEventListener("touchstart", disableKeyboardFocus, { passive: true });

  // 2) Back to top button
  const backToTopButton = document.querySelector(".back-to-top");
  const SHOW_AFTER_PX = 360;

  function setBackToTopVisible(visible) {
    if (!backToTopButton) return;
    backToTopButton.style.visibility = visible ? "visible" : "hidden";
    backToTopButton.style.opacity = visible ? "1" : "0";
    backToTopButton.style.transform = visible ? "scale(1)" : "scale(0.92)";
  }

  function onScroll() {
    setBackToTopVisible(window.scrollY > SHOW_AFTER_PX);
  }

  if (backToTopButton) {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // 3) Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
