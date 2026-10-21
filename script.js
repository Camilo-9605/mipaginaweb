document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // 0. SISTEMA DE PARTÍCULAS - NIEVE REALISTA + SCROLL
  // ==============================
  const canvas = document.getElementById("galaxy-canvas");

  if (canvas && typeof THREE !== "undefined") {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.0015);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 1);

    // ========== TEXTURA SUAVE ==========
    function createSoftSnowflake() {
      const size = 128;
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const ctx = c.getContext("2d");

      const gradient = ctx.createRadialGradient(
        size / 2, size / 2, 0,
        size / 2, size / 2, size / 2
      );
      gradient.addColorStop(0.0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.12, "rgba(255, 255, 255, 0.85)");
      gradient.addColorStop(0.35, "rgba(255, 255, 255, 0.35)");
      gradient.addColorStop(0.65, "rgba(255, 255, 255, 0.08)");
      gradient.addColorStop(1.0, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      const texture = new THREE.CanvasTexture(c);
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      return texture;
    }

    const snowTexture = createSoftSnowflake();

    // ========== FUNCIÓN PARA CREAR CAPAS ==========
    function createSnowLayer(count, size, opacity, speedMultiplier, color) {
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);
      const data = [];

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        positions[i3]     = (Math.random() - 0.5) * 260;
        positions[i3 + 1] = Math.random() * 200 - 40;
        positions[i3 + 2] = (Math.random() - 0.5) * 220;

        const fallSpeed = -(Math.random() * 0.22 + 0.08) * speedMultiplier;
        const windX = (Math.random() - 0.5) * 0.06;
        const windZ = (Math.random() - 0.5) * 0.05;

        velocities[i3]     = windX;
        velocities[i3 + 1] = fallSpeed;
        velocities[i3 + 2] = windZ;

        data.push({
          phase: Math.random() * Math.PI * 2,
          sway: 0.3 + Math.random() * 0.7
        });
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        size: size,
        map: snowTexture,
        transparent: true,
        opacity: opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: color,
        sizeAttenuation: true,
        alphaTest: 0.01
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      return { points, positions, velocities, data, count, baseSpeed: speedMultiplier };
    }

    // ========== 3 CAPAS DE NIEVE ==========
    const layerFar  = createSnowLayer(2800, 1.6, 0.28, 0.55, 0xd8e8ff);
    const layerMid  = createSnowLayer(2200, 2.4, 0.42, 0.85, 0xe4f0ff);
    const layerNear = createSnowLayer(900,  3.6, 0.58, 1.25, 0xf0f7ff);

    const layers = [layerFar, layerMid, layerNear];

    // ========== SCROLL ==========
    let scrollY = 0;
    let targetScroll = 0;

    window.addEventListener("scroll", () => {
      targetScroll = window.scrollY;
    }, { passive: true });

    // ========== ANIMACIÓN ==========
    const clock = new THREE.Clock();
    let time = 0;

    function animate() {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();
      time += delta;

      // Suavizado del scroll (lerp)
      scrollY += (targetScroll - scrollY) * 0.06;

      // Progreso del scroll (0 a 1 aproximadamente)
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrollY / (maxScroll || 1), 1);

      // Velocidad extra de nieve según el scroll
      const scrollSpeedBoost = 1 + scrollProgress * 0.9;

      // Viento global suave
      const globalWindX = Math.sin(time * 0.35) * 0.035;
      const globalWindZ = Math.cos(time * 0.28) * 0.025;

      layers.forEach((layer, index) => {
        const pos = layer.points.geometry.attributes.position.array;

        // Parallax: las capas se mueven diferente según el scroll
        const parallaxFactor = (index + 1) * 0.015;
        layer.points.position.y = -scrollY * parallaxFactor * 0.08;

        for (let i = 0; i < layer.count; i++) {
          const i3 = i * 3;
          const d = layer.data[i];

          // Movimiento de caída + viento + boost por scroll
          pos[i3]     += layer.velocities[i3] + globalWindX;
          pos[i3 + 1] += layer.velocities[i3 + 1] * scrollSpeedBoost;
          pos[i3 + 2] += layer.velocities[i3 + 2] + globalWindZ;

          // Balanceo lateral suave
          pos[i3] += Math.sin(time * 0.8 + d.phase) * 0.012 * d.sway;

          // Reiniciar cuando sale por abajo
          if (pos[i3 + 1] < -55) {
            pos[i3]     = (Math.random() - 0.5) * 260;
            pos[i3 + 1] = 140 + Math.random() * 60;
            pos[i3 + 2] = (Math.random() - 0.5) * 220;
          }
        }

        layer.points.geometry.attributes.position.needsUpdate = true;
      });

      // Cámara reacciona al scroll
      const t = time * 0.05;
      camera.position.x = Math.sin(t) * 5 + scrollProgress * 4;
      camera.position.y = Math.cos(t * 0.5) * 2.5 + 14 - scrollProgress * 8;
      camera.position.z = 50 - scrollProgress * 12;
      camera.lookAt(0, 28 - scrollProgress * 10, 0);

      renderer.render(scene, camera);
    }

    animate();

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
  // 5. TARJETAS CLICKEABLES
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