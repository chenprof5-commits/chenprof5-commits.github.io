(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
  const progress = document.querySelector(".scroll-progress");
  let ticking = false;
  const updateProgress = () => {
    const range = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${range > 0 ? window.scrollY / range : 0})`;
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) requestAnimationFrame(updateProgress);
    ticking = true;
  }, { passive: true });
  updateProgress();

  if (!reducedMotion.matches && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    document.querySelectorAll(".project-card, .hero-visual").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--pointer-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
        card.style.setProperty("--pointer-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
      });
    });
  }

  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        if (link.hash === `#${visible.target.id}`) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }, { rootMargin: "-18% 0px -65% 0px" });
    sections.forEach((section) => navObserver.observe(section));
  }

  if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

  const revealItems = [...document.querySelectorAll(".reveal")];
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove("will-reveal");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -6% 0px", threshold: 0.01 });

  document.documentElement.classList.add("motion-ready");
  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`);
    // Elements already on screen remain readable from the first frame.
    if (item.getBoundingClientRect().top > window.innerHeight * 0.92) {
      item.classList.add("will-reveal");
      revealObserver.observe(item);
    }
  });

  reducedMotion.addEventListener("change", (event) => {
    if (!event.matches) return;
    revealItems.forEach((item) => item.classList.remove("will-reveal"));
    revealObserver.disconnect();
  });
})();
