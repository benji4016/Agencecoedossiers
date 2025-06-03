document.addEventListener("DOMContentLoaded", () => {
  const includeElements = document.querySelectorAll("[data-include]");

  includeElements.forEach(async (el) => {
    const file = el.getAttribute("data-include");
    if (file) {
      try {
        const response = await fetch(file);
        if (response.ok) {
          const content = await response.text();
          el.innerHTML = content;
        } else {
          el.innerHTML = "Erreur de chargement du fichier: " + file;
        }
      } catch (error) {
        el.innerHTML = "Erreur de chargement du fichier: " + file;
      }
    }
  });
});
