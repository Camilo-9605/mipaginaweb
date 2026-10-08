document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // 1. MENÚ HAMBURGUESA
  // ==============================
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav");

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      nav.classList.toggle("active");
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        nav.classList.remove("active");
      });
    });
  }

  // ==============================
  // 2. HEADER SCROLLED
  // ==============================
  const header = document.querySelector(".header");

  window.addEventListener("scroll", () => {
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 40);
    }
  });

  // ==============================
  // 3. WHATSAPP
  // ==============================
  const whatsappBtn = document.querySelector(".whatsapp-float");
  let lastScroll = 0;

  if (whatsappBtn) {
    window.addEventListener("scroll", () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll && currentScroll > 150) {
        whatsappBtn.classList.add("hide");
      } else {
        whatsappBtn.classList.remove("hide");
      }

      lastScroll = currentScroll;
    });
  }

  // ==============================
  // 4. BANNER COOKIES
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

  // ==============================
  // 5. HERO - CAMBIO DE IMÁGENES
  // ==============================
  const images = [
    "images_optimizadas/ima1.jpg",
    "images_optimizadas/ima2.jpg",
    "images_optimizadas/ima3.jpg",
    "images_optimizadas/ima4.jpg"
  ];

  let currentIndex = 0;
  const hero = document.querySelector(".hero");

  if (hero) {
    hero.style.setProperty("--bg-before", `url(${images[0]})`);
    hero.style.setProperty("--bg-after", `url(${images[1]})`);

    function changeBackground() {
      const nextIndex = (currentIndex + 1) % images.length;

      if (hero.classList.contains("fade")) {
        hero.style.setProperty("--bg-before", `url(${images[nextIndex]})`);
        hero.classList.remove("fade");
      } else {
        hero.style.setProperty("--bg-after", `url(${images[nextIndex]})`);
        hero.classList.add("fade");
      }

      currentIndex = nextIndex;
    }

    setInterval(changeBackground, 4500);
  }

  // ==============================
  // 6. FONDO 3D ANIMADO
  // ==============================
  (function init3DBackground() {
    const container = document.getElementById("bg-3d");
    if (!container || typeof THREE === "undefined") return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Partículas
    const particlesCount = window.innerWidth < 768 ? 200 : 400;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      const isRed = Math.random() > 0.7;
      colors[i * 3] = isRed ? 0.88 : 1;
      colors[i * 3 + 1] = isRed ? 0.02 : 1;
      colors[i * 3 + 2] = isRed ? 0.02 : 1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animate() {
      requestAnimationFrame(animate);

      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0003;
      particles.rotation.y += mouseX * 0.0003;
      particles.rotation.x += mouseY * 0.0003;

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  })();

});