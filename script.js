document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menu = document.getElementById("menuToggle");
  const panel = document.getElementById("navPanel");
  const preloader = document.getElementById("preloader");

  // Preloader
  window.addEventListener("load", () => {
    setTimeout(() => preloader?.classList.add("hide"), 250);
  });

  // Header on scroll
  window.addEventListener(
    "scroll",
    () => header?.classList.toggle("scrolled", window.scrollY > 25),
    { passive: true },
  );

  // Mobile menu toggle
  menu?.addEventListener("click", () => {
    const open = panel.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });

  panel?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => panel.classList.remove("open"));
  });

  // Reveal animations on scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    observer.observe(element);
  });
});
