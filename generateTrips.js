// generateTrips.js
import { handleFavoriteToggle, loadFavorites } from './favorites.js'; // Importa la lógica de favoritos desde favorites.js

document.addEventListener('DOMContentLoaded', function () {
  fetch('/viajes-blog/trips.json') // Ruta de tu archivo trips.json
    .then(response => response.json())
    .then(tripsData => {
      generateTrips(tripsData); // Llama a la función generateTrips pasando los datos del JSON
      loadFavorites(); // Asegúrate de que loadFavorites esté correctamente importada
    })
    .catch(error => console.error('Error al cargar los viajes:', error));
});

// Función para generar los viajes dinámicamente
function generateTrips(trips) {
  const tripsContainer = document.querySelector('.main_trips');
  tripsContainer.innerHTML = ""; // Limpia el contenedor antes de añadir los viajes

  trips.forEach(trip => {
    // Asigna automáticamente la imagen desde la carpeta, el nombre de la imagen debe coincidir con el id
    const imageUrl = `img/trips/${trip.id}.jpg`;

    // Estructura HTML de cada artículo
    const tripHtml = `
      <article>
        <img src="${imageUrl}" alt="${trip.name}">
        <h2>${trip.name}</h2>
        <a href="${trip.url}" class="read-more">Read More</a>
        <button class="fav-button" data-trip-id="${trip.id}" data-trip-name="${trip.name}" aria-label="Añadir a favoritos ${trip.name}" type="button">
          <i class="fa-solid fa-heart"></i> Favorito
        </button>
      </article>`;

    // Inserta el HTML generado en el contenedor
    tripsContainer.innerHTML += tripHtml;
  });

  // Agrega los event listeners para los botones de favoritos
  const favButtons = document.querySelectorAll('.fav-button');
  favButtons.forEach(button => {
    button.addEventListener('click', function () {
      const tripId = this.getAttribute('data-trip-id');
      const tripName = this.getAttribute('data-trip-name');

      // Delegar la lógica de alternar favorito a favorites.js
      handleFavoriteToggle(tripId, tripName, this);
    });
  });
}