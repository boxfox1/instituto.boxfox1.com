/* =========================================
FILE: /assets/js/main.js
Menu móvil + modal privacidad (estable V2)
- scroll lock con contador (panel+modal)
- cerrar con ESC, click fuera, click en links
========================================= */
(function () {
  const header = document.querySelector("[data-cabecera]");
  const navBtn = document.querySelector("[data-navbtn]");
  const panel = document.querySelector("[data-panel]");

  // =========================
  // Scroll shadow header
  // =========================
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-shadow", window.scrollY > 6);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // =========================
  // Scroll lock (contador)
  // =========================
  let lockCount = 0;
  const lockScroll = () => {
    lockCount += 1;
    if (lockCount === 1) {
      document.documentElement.style.overflow = "hidden";
    }
  };
  const unlockScroll = () => {
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      document.documentElement.style.overflow = "";
    }
  };

  // =========================
  // Panel móvil
  // =========================
  const isPanelOpen = () => panel && panel.classList.contains("is-open");

  const setPanel = (open) => {
    if (!panel || !navBtn) return;

    const willOpen = !!open;
    const isOpenNow = isPanelOpen();
    if (willOpen === isOpenNow) return;

    panel.classList.toggle("is-open", willOpen);
    panel.setAttribute("aria-hidden", willOpen ? "false" : "true");
    navBtn.setAttribute("aria-expanded", willOpen ? "true" : "false");

    if (willOpen) lockScroll();
    else unlockScroll();
  };

  // Click botón
  if (navBtn && panel) {
    navBtn.addEventListener("click", () => setPanel(!isPanelOpen()));

    // Click en links dentro del panel -> cerrar
    panel.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) setPanel(false);
    });

    // Click fuera del panel (cuando está abierto)
    document.addEventListener("click", (e) => {
      if (!isPanelOpen()) return;
      const clickedBtn = navBtn.contains(e.target);
      const clickedPanel = panel.contains(e.target);
      if (!clickedBtn && !clickedPanel) setPanel(false);
    });
  }

  // =========================
  // Modal privacidad
  // =========================
  const modal = document.getElementById("privacyModal");
  const openers = document.querySelectorAll("[data-open-privacy]");
  const closers = modal ? modal.querySelectorAll("[data-modal-close]") : [];
  let lastFocusEl = null;

  const isModalOpen = () => modal && modal.classList.contains("is-open");

  const openModal = (triggerEl) => {
    if (!modal || isModalOpen()) return;

    lastFocusEl = triggerEl || document.activeElement;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    lockScroll();

    // Enfocar el botón de cerrar (si existe)
    const closeBtn = modal.querySelector("[data-modal-close]");
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  };

  const closeModal = () => {
    if (!modal || !isModalOpen()) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    unlockScroll();

    // Regresar foco
    if (lastFocusEl && typeof lastFocusEl.focus === "function") {
      lastFocusEl.focus({ preventScroll: true });
    }
    lastFocusEl = null;
  };

  openers.forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(el);
    }),
  );

  closers.forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      closeModal();
    }),
  );

  // Click en backdrop cierra modal
  if (modal) {
    modal.addEventListener("click", (e) => {
      // si le das click al backdrop (o fuera del panel)
      if (e.target && e.target.hasAttribute("data-modal-close")) {
        e.preventDefault();
        closeModal();
      }
    });
  }

  // =========================
  // Tecla ESC cierra lo que esté abierto
  // (modal primero, luego panel)
  // =========================
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;

    if (isModalOpen()) {
      closeModal();
      return;
    }
    if (isPanelOpen()) setPanel(false);
  });
})();
