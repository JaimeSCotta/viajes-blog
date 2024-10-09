// generateTrips.js
import { auth } from './firebase.js'; // Importa auth desde firebase.js
import { handleFavoriteToggle, loadFavoritesIndex } from './favorites.js'; // Importa la lógica de favoritos desde favorites.js

document.addEventListener('DOMContentLoaded', function () {
  // Esperar a que se verifique el estado de autenticación
  auth.onAuthStateChanged(user => {
    // Cargar los viajes desde el JSON
    fetch('/viajes-blog/trips.json') // Ruta de tu archivo trips.json
      .then(response => response.json())
      .then(tripsData => {
        generateTrips(tripsData); // Llama a la función generateTrips pasando los datos del JSON

        // Solo cargar favoritos si hay un usuario autenticado
        if (user) {
          loadFavoritesIndex(); // Cargar los favoritos después de generar los viajes
        }
      })
      .catch(error => console.error('Error al cargar los viajes:', error));
  });
});

// Función para generar los viajes dinámicamente
function generateTrips(trips) {
  const tripsContainer = document.querySelector('.main_trips');
  tripsContainer.innerHTML = ""; // Limpia el contenedor antes de añadir los viajes

  // Verificar si el usuario está autenticado
  const user = auth.currentUser;

  trips.forEach(trip => {
    // Asigna automáticamente la imagen desde la carpeta, el nombre de la imagen debe coincidir con el id
    const imageUrl = `img/trips/${trip.id}.jpg`;

    // Estructura HTML de cada artículo
    let tripHtml = `
      <article>
        <img src="${imageUrl}" alt="${trip.name}">
        <h2>${trip.name}</h2>
        <a href="${trip.url}" class="read-more">Read More</a>
    `;

    // Solo añadir el botón de favoritos si el usuario está autenticado
    if (user) {
      tripHtml += `
        <button class="fav-button" data-trip-id="${trip.id}" data-trip-name="${trip.name}" aria-label="Añadir a favoritos ${trip.name}" type="button">
          <i class="fa-solid fa-heart"></i>
        </button>`;
    }

    // Cerrar el artículo
    tripHtml += `</article>`;

    // Inserta el HTML generado en el contenedor
    tripsContainer.innerHTML += tripHtml;
  });

  // Si hay un usuario autenticado, agrega los event listeners para los botones de favoritos
  if (user) {
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
}