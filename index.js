/* =========================================================
   JP Peng — Portfolio JS (Best-fit for current HTML/CSS)
   Features:
   1) Keyboard-only focus outlines (accessibility)
   2) Back-to-top button reveal
   3) Scroll-snap "page enter" animation via IntersectionObserver (.is-active)
   4) Optional smart snap assist (helps land exactly on pages, non-janky)
   5) PDF modal viewer (open/close, ESC, overlay click, focus trap, open new tab)
   6) Footer year auto-update
   7) Active nav link highlighting based on visible page/section
   ========================================================= */

(() => {
  "use strict";

  /* -----------------------------------------
    Helpers
  ---------------------------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------
    1) Focus outline only for keyboard users
  ---------------------------------------- */
  const handleFirstTab = (e) => {
    if (e.key === "Tab") {
      document.body.classList.add("user-is-tabbing");
      window.removeEventListener("keydown", handleFirstTab);
      window.addEventListener("mousedown", handleMouseDownOnce, { passive: true });
      window.addEventListener("touchstart", handleMouseDownOnce, { passive: true });
    }
  };

  const handleMouseDownOnce = () => {
    document.body.classList.remove("user-is-tabbing");
    window.removeEventListener("mousedown", handleMouseDownOnce);
    window.removeEventListener("touchstart", handleMouseDownOnce);
    window.addEventListener("keydown", handleFirstTab);
  };

  window.addEventListener("keydown", handleFirstTab);

  /* -----------------------------------------
    2) Footer year
  ---------------------------------------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* -----------------------------------------
    3) Back to top
  ---------------------------------------- */
  const backToTopButton = $(".back-to-top");
  const alterBackToTopStyles = (visible) => {
    if (!backToTopButton) return;
    backToTopButton.style.visibility = visible ? "visible" : "hidden";
    backToTopButton.style.opacity = visible ? "1" : "0";
    backToTopButton.style.transform = visible ? "scale(1)" : "scale(.92)";
  };

  const updateBackToTop = () => {
    if (!backToTopButton) return;
    alterBackToTopStyles(window.scrollY > 700);
  };

  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();

  /* -----------------------------------------
    4) IntersectionObserver: Page enter animation + Active nav highlighting
    - Adds .is-active to the most visible page/section
    - Highlights nav link pointing to the visible id
  ---------------------------------------- */
  const pages = $$(".page");
  const navLinks = $$(".nav__link");

  const setActiveNav = (id) => {
    if (!navLinks.length) return;
    navLinks.forEach((a) => {
      const href = a.getAttribute("href") || "";
      const isActive = href === `#${id}`;
      a.classList.toggle("is-active", isActive);
      if (isActive) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  };

  // Simple “most visible” tracking
  let mostVisibleId = null;

  const pageIO = new IntersectionObserver(
    (entries) => {
      // Determine which entry is currently most visible
      let best = null;
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
      }
      if (!best) return;

      const el = best.target;
      const id = el.id || null;

      // Add animation class to intersecting pages (respect reduced motion)
      if (!prefersReducedMotion) {
        el.classList.add("is-active");
      } else {
        // still add class so styles stay consistent even if animation disabled
        el.classList.add("is-active");
      }

      // Update active nav only for your main nav sections
      // (Projects/Experience/About/Contact are in nav; opener/closing are not)
      if (id && ["projects", "experience", "about", "contact", "home"].includes(id)) {
        if (mostVisibleId !== id) {
          mostVisibleId = id;
          setActiveNav(id);
        }
      }
    },
    {
      threshold: [0.15, 0.25, 0.35, 0.5, 0.65, 0.8],
      rootMargin: "-12% 0px -12% 0px",
    }
  );

  pages.forEach((p) => pageIO.observe(p));

  /* -----------------------------------------
    5) Optional Smart Snap Assist (non-janky)
    Why: Scroll-snap is great, but on some trackpads you land between sections.
    This gently snaps to the nearest page after scroll ends.
    - Disabled if prefers-reduced-motion
  ---------------------------------------- */
  if (!prefersReducedMotion) {
    let snapTimer = null;

    const getNearestPage = () => {
      if (!pages.length) return null;
      const mid = window.innerHeight / 2;
      let best = null;
      let bestDist = Infinity;
      for (const p of pages) {
        const r = p.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = p;
        }
      }
      return best;
    };

    const snapToNearest = () => {
      const target = getNearestPage();
      if (!target) return;

      // If already close enough, don't force a scroll
      const r = target.getBoundingClientRect();
      const delta = Math.abs(r.top);
      if (delta < 24) return;

      // Smooth snap
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    window.addEventListener(
      "scroll",
      () => {
        // Ignore if modal open
        if (isModalOpen()) return;

        clearTimeout(snapTimer);
        snapTimer = setTimeout(snapToNearest, 130);
      },
      { passive: true }
    );
  }

  /* -----------------------------------------
    6) PDF Modal Viewer
    Buttons: .js-open-pdf with data-pdf="path/to.pdf"
    Modal:   #pdf-modal
    Frame:   #pdf-frame
    Close:   .js-close-pdf or overlay click or ESC
  ---------------------------------------- */
  const modal = $("#pdf-modal");
  const pdfFrame = $("#pdf-frame");
  const openNewTabLink = $("#pdf-open-newtab");
  const openButtons = $$(".js-open-pdf");
  const closeButtons = $$(".js-close-pdf");

  let lastFocusedEl = null;

  function isModalOpen() {
    return modal && modal.getAttribute("aria-hidden") === "false";
  }

  function setPdfSrc(src) {
    if (!pdfFrame) return;
    pdfFrame.src = src || "";
    if (openNewTabLink) openNewTabLink.href = src || "#";
  }

  function openModal(pdfPath) {
    if (!modal) return;
    lastFocusedEl = document.activeElement;

    setPdfSrc(pdfPath);

    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const focusTarget =
      $(".js-close-pdf", modal) ||
      $("button, a, [tabindex]:not([tabindex='-1'])", modal);

    if (focusTarget) focusTarget.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    // Stop loading / free resources
    setPdfSrc("");

    // Restore focus
    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
      lastFocusedEl.focus();
    }
  }

  // Open handlers
  openButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const pdfPath = btn.getAttribute("data-pdf");
      if (!pdfPath) return;
      openModal(pdfPath);
    });
  });

  // Close handlers
  closeButtons.forEach((btn) => btn.addEventListener("click", closeModal));

  // Close on overlay click (only overlay, not the panel)
  if (modal) {
    modal.addEventListener("click", (e) => {
      const overlay = $(".modal__overlay", modal);
      if (overlay && e.target === overlay) closeModal();
    });
  }

  // ESC close
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isModalOpen()) {
      e.preventDefault();
      closeModal();
    }
  });

  // Focus trap
  window.addEventListener("keydown", (e) => {
    if (!isModalOpen() || e.key !== "Tab" || !modal) return;

    const focusables = $$(
      "a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex='-1'])",
      modal
    );

    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  /* -----------------------------------------
    7) Optional: Improve anchor navigation behavior with snap pages
    - When clicking nav link, we smoothly scroll to that section
  ---------------------------------------- */
  navLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const target = document.getElementById(href.slice(1));
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    });
  });

})();
