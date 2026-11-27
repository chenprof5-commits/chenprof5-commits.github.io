(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];

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
  revealItems.forEach((item) => {
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
