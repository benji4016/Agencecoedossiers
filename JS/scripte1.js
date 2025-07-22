// Menu burger toggle
const burger = document.querySelector('.burger');
const menu = document.querySelector('.menu');

if (burger && menu) {
  burger.addEventListener('click', () => {
    menu.classList.toggle('active');
  });

  // Fermer menu au clic sur un lien (mobile)
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
    });
  });
}

// Slider automatique (optionnel)
const slider = document.querySelector('.slider');

if (slider) {
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
}

// Chargement dynamique des articles
fetch('http://localhost:3000/articles')
  .then(res => {
    if (!res.ok) throw new Error("Fichier JSON introuvable.");
    return res.json();
  })
  .then(data => {
    const lastArticles = data.slice(-3).reverse(); // 3 derniers articles
    const container = document.getElementById('articles-container');

    if (!container) {
      console.warn("Conteneur #articles-container introuvable dans le HTML.");
      return;
    }

    if (lastArticles.length === 0) {
      container.innerHTML = "<p>Aucun article disponible pour le moment.</p>";
      return;
    }

    lastArticles.forEach(article => {
      const articleDiv = document.createElement('div');
      articleDiv.classList.add('article-card');
      articleDiv.innerHTML = `
        <h3>${article.titre ?? "Sans titre"}</h3>
        <p>${article.contenu?.substring(0, 100) ?? "Contenu indisponible"}...</p>
        <a href="article.html?id=${article.id}">Lire plus</a>
      `;
      container.appendChild(articleDiv);
    });
  })
  .catch(error => {
    console.error('Erreur lors du chargement des articles :', error);
  });
