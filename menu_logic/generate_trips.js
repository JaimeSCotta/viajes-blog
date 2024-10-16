// generate_trips.js
import { auth } from '../firebase_logic/firebase.js'; // Importa auth desde firebase.js
import { handleFavoriteToggle, loadFavoritesIndex } from '../favorites_logic/favorites_main.js'; // Importa la lógica de favoritos desde favorites.js

export function generateTrips() {
  document.addEventListener('DOMContentLoaded', function () {
    auth.onAuthStateChanged(user => {
      fetch('/viajes-blog/trips_logic/trips.json') // Ruta del archivo trips.json
        .then(response => response.json())
        .then(tripsData => {
          displayTrips(tripsData); // Llama a la función displayTrips pasando los datos del JSON

          // Solo cargar favoritos si hay un usuario autenticado
          if (user) {
            loadFavoritesIndex(); // Cargar los favoritos después de generar los viajes
          }
        })
        .catch(error => console.error('Error al cargar los viajes:', error));
    });
  });
}

// Función para mostrar los viajes dinámicamente
function displayTrips(trips) {
  const tripsContainer = document.querySelector('.main_trips');
  tripsContainer.innerHTML = ""; // Limpia el contenedor antes de añadir los viajes

  const user = auth.currentUser;

  trips.forEach(trip => {
    const imageUrl = `img/trips/trip_covers/${trip.id}.jpg`;

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

    tripHtml += `</article>`;

    tripsContainer.innerHTML += tripHtml;
  });

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
