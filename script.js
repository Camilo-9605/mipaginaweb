document.getElementById("contactForm").addEventListener("submit", function(e){
  e.preventDefault();
  alert("Gracias por tu mensaje. Te contactaremos pronto.");
});

window.addEventListener("scroll", function(){
  const header = document.querySelector("header");
  header.classList.toggle("scrolled", window.scrollY > 50);
});



