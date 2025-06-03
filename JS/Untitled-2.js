// Menu burger toggle
const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');

burger.addEventListener('click', () => {
  menu.classList.toggle('active');
});

// Fermer menu au clic sur un lien (mobile)
menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('active');
  });
});

// Exemple simple de slider automatique (optionnel)
const slider = document.querySelector('.slider');
let scrollAmount = 0;
const scrollStep = 310; // largeur image + gap
const maxScroll = slider.scrollWidth - slider.clientWidth;

setInterval(() => {
  scrollAmount += scrollStep;
  if (scrollAmount > maxScroll) scrollAmount = 0;
  slider.scrollTo({
    left: scrollAmount,
    behavior: 'smooth'
  });
}, 4000);
