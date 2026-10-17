document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // 0. GALAXIA 3D (Three.js) - galaxySpin
  // ==============================
  const canvas = document.getElementById("galaxy-canvas");

  if (canvas && typeof THREE !== "undefined") {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;
    camera.position.y = 1.5;
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);

    // Parámetros de la galaxia
    const parameters = {
      count: 18000,
      size: 0.025,
      radius: 8,
      branches: 4,
      spin: 1.4,
      randomness: 0.35,
      randomnessPower: 2.8,
      insideColor: "#ff3b3b",   // rojo suave (coincide con la marca)
      outsideColor: "#1b3984"  // azul oscuro espacial
    };

    // Generar galaxia
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3;

      // Radio con distribución más densa en el centro
      const radius = Math.pow(Math.random(), parameters.randomnessPower) * parameters.radius;

      // Ángulo de la rama
      const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

      // Ángulo de giro (más lejos = más girado)
      const spinAngle = radius * parameters.spin;

      // Aleatoriedad (grosor de los brazos)
      const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
      const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius * 0.4;
      const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

      positions[i3]     = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Color degradado del centro al exterior
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / parameters.radius);

      colors[i3]     = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      transparent: true,
      opacity: 0.9
    });

    const galaxy = new THREE.Points(geometry, material);
    // Inclinamos un poco la galaxia para que se vea más 3D
    galaxy.rotation.x = -0.4;
    scene.add(galaxy);

    // Estrellas de fondo (más lejanas y sutiles)
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 2500;
    const starsPositions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i++) {
      starsPositions[i] = (Math.random() - 0.5) * 80;
    }

    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starsPositions, 3));

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      depthWrite: false
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Animación
    const clock = new THREE.Clock();

    function animateGalaxy() {
      const elapsed = clock.getElapsedTime();

      // Rotación suave de la galaxia
      galaxy.rotation.y = elapsed * 0.08;

      // Rotación muy lenta de las estrellas de fondo
      stars.rotation.y = elapsed * 0.015;

      renderer.render(scene, camera);
      requestAnimationFrame(animateGalaxy);
    }

    animateGalaxy();

    // Resize
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
  }

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
  // 5. HERO - CAMBIO DE IMÁGENES (desactivado porque ahora usamos la galaxia)
  // ==============================
  // Se mantiene el código por si quieres volver a activarlo más adelante.
  /*
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
  */

  // ==============================
  // 6. TARJETAS CLICKEABLES
  // ==============================
  const servicesGrid = document.querySelector("#servicios .grid");

  if (servicesGrid) {
    servicesGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".card1, .card2, .card3, .card4");
      
      if (!card) return;

      e.stopPropagation();

      const extra = card.querySelector(".extra-content");
      if (!extra) return;

      const isOpen = extra.classList.contains("open");

      document.querySelectorAll("#servicios .extra-content.open").forEach(el => {
        el.classList.remove("open");
      });

      if (!isOpen) {
        extra.classList.add("open");
      }
    });
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#servicios .card1, #servicios .card2, #servicios .card3, #servicios .card4")) {
      document.querySelectorAll("#servicios .extra-content.open").forEach(el => {
        el.classList.remove("open");
      });
    }
  });

});