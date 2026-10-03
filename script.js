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
    { passive: true }
  );

  // Mobile menu
  menu?.addEventListener("click", () => {
    const open = panel.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });

  panel?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => panel.classList.remove("open"));
  });

  // Reveal animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    observer.observe(element);
  });

  // Formspree form
  const form = document.getElementById("quoteForm");
  const message = document.getElementById("formMessage");
  const fileInput = document.getElementById("fileInput");

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const file = fileInput?.files?.[0];
    const submitButton = form.querySelector("button[type='submit']");

    // Browser-side file size check
    if (file && file.size > 10 * 1024 * 1024) {
      message.textContent =
        "Datoteka je veća od 10 MB. Molimo odaberite manju datoteku.";
      message.className = "form-message err";
      return;
    }

    submitButton.disabled = true;
    submitButton.innerHTML = "Šaljem...";

    message.textContent = "";
    message.className = "form-message";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        message.textContent =
          "Hvala! Vaš upit je uspješno poslan. Javićemo vam se uskoro.";
        message.className = "form-message ok";
        form.reset();
      } else {
        const data = await response.json().catch(() => null);

        if (data?.errors?.length) {
          message.textContent = data.errors
            .map((error) => error.message)
            .join(", ");
        } else {
          message.textContent =
            "Došlo je do greške pri slanju. Molimo pokušajte ponovo.";
        }

        message.className = "form-message err";
      }
    } catch (error) {
      console.error("Formspree error:", error);

      message.textContent =
        "Nije moguće poslati upit. Provjerite internet vezu i pokušajte ponovo.";
      message.className = "form-message err";
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Pošalji upit <span>→</span>';
    }
  });
});
