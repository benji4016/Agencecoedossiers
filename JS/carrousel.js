const track = document.getElementById('carouselTrack');
const images = track.querySelectorAll('.carousel-slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let index = 0;
const intervalTime = 4000;
let autoSlideInterval;

// Fonction pour déplacer le carrousel
function updateCarousel() {
  track.style.transform = `translateX(-${index * 100}%)`;
}

// Fonction pour démarrer l'auto-slide
function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    index = (index + 1) % images.length;
    updateCarousel();
  }, intervalTime);
}

// Fonction pour redémarrer le timer auto (quand clic manuel)
function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

// Clic bouton suivant
nextBtn.addEventListener('click', () => {
  index = (index + 1) % images.length;
  updateCarousel();
  resetAutoSlide();
});

// Clic bouton précédent
prevBtn.addEventListener('click', () => {
  index = (index - 1 + images.length) % images.length;
  updateCarousel();
  resetAutoSlide();
});

// Lancer le défilement automatique au chargement
startAutoSlide();
