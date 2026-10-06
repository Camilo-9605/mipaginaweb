document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // 1. MENÚ HAMBURGUESA (Slide + Crossfade)
  // ==============================
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav");

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      nav.classList.toggle("active");
    });

    // Cerrar menú al hacer clic en un enlace
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        nav.classList.remove("active");
      });
    });
  }

  // ==============================
  // 2. HEADER FLOTANTE (efecto scrolled)
  // ==============================
  const header = document.querySelector(".header");

  window.addEventListener("scroll", () => {
    if (header) {
      if (window.scrollY > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
  });

  // ==============================
  // 3. BOTÓN WHATSAPP (esconder al bajar)
  // ==============================
  const whatsappBtn = document.querySelector(".whatsapp-float");
  let lastScroll = 0;

  if (whatsappBtn) {
    window.addEventListener("scroll", () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll && currentScroll > 150) {
        // Bajando → esconder
        whatsappBtn.classList.add("hide");
      } else {
        // Subiendo → mostrar
        whatsappBtn.classList.remove("hide");
      }

      lastScroll = currentScroll;
    });
  }

  // ==============================
  // 4. BANNER DE COOKIES
  // ==============================
  const cookieBanner = document.querySelector(".banner-cookies") || document.getElementById("banner-cookies");
  const acceptBtn = cookieBanner?.querySelector("button") || document.getElementById("accept-cookies");

  if (localStorage.getItem("cookiesAccepted")) {
    cookieBanner?.remove();
  }

  if (acceptBtn && cookieBanner) {
    acceptBtn.addEventListener("click", () => {
      localStorage.setItem("cookiesAccepted", "true");

      cookieBanner.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      cookieBanner.style.opacity = "0";
      cookieBanner.style.transform = "translateX(-50%) translateY(20px)";

      setTimeout(() => {
        cookieBanner.remove();
      }, 400);
    });
  }

});