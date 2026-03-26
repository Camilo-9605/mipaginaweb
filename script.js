document.getElementById("contactForm").addEventListener("submit", function(e){
  e.preventDefault();
  alert("Gracias por tu mensaje. Te contactaremos pronto.");
});

window.addEventListener("scroll", function(){
  const header = document.querySelector("header");
  header.classList.toggle("scrolled", window.scrollY > 50);
});


// Lista de imágenes en tu carpeta
  const images = [
    "images_optimizadas/ima1.jpg",
    "images_optimizadas/ima2.jpg",
    "images_optimizadas/ima3.jpg",
    "images_optimizadas/ima4.jpg"
    
  ];

  let currentIndex = 0;
  const hero = document.querySelector(".hero");

  function changeBackground() {
    hero.style.background = `
      linear-gradient(to right, rgba(29, 28, 28, 0.8), rgba(34,34,34,0.8)),
      url(${images[currentIndex]}) center/cover no-repeat
    `;
    currentIndex = (currentIndex + 1) % images.length;
  }

  // Cambiar cada 3 segundos
  setInterval(changeBackground, 3000);

  // Inicializar con la primera imagen
  changeBackground();


