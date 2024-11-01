// favorites_utils.js
import { handleFavoriteToggle, loadFavorites } from './favorites_main.js';

// Actualizar el estado de los botones de favoritos
export function updateFavoriteButton(button, isFavorite) {
  if (isFavorite) {
    button.classList.add('active');
    button.innerHTML = '<i class="fa-solid fa-heart"></i>';
  } else {
    button.classList.remove('active');
    button.innerHTML = '<i class="fa-solid fa-heart"></i>';
  }
}

// Renderizar los favoritos en la interfaz de usuario
export function renderFavorites(favorites) {
  const favoritesContainer = document.querySelector(".favorites-container");

  if (!favoritesContainer) {
    console.error("No se encontró el contenedor de favoritos (.favorites-container) en el DOM.");
    return;
  }

  // Limpiar el contenido anterior
  favoritesContainer.innerHTML = "";

  if (favorites.length === 0) {
    console.log("No hay favoritos que mostrar.");
    favoritesContainer.innerHTML = "<p>No tienes viajes favoritos aún.</p>";
    return;
  }

  // Añadir cada favorito al contenedor
  favorites.forEach((favorite) => {
    const imageUrl = `img/trips/trip_covers/${favorite.id}.jpg`;

    const favoriteHtml = `
      <article>
        <img src="${imageUrl}" alt="${favorite.nombre}">
        <h2>${favorite.nombre}</h2>
        <a href="trip-details.html?tripId=${favorite.id}" class="read-more">Read More</a>
        <button class="fav-button active" data-trip-id="${favorite.id}" data-trip-name="${favorite.nombre}" aria-label="Eliminar de favoritos ${favorite.nombre}" type="button">
          <i class="fa-solid fa-heart"></i>
        </button>
      </article>`;

    favoritesContainer.innerHTML += favoriteHtml;
  });

  console.log(`Se renderizaron ${favorites.length} favoritos.`); // Depuración
  // Agregar manejador de eventos a cada botón de eliminar
  const buttons = document.querySelectorAll('.fav-button');
  buttons.forEach(button => {
    button.addEventListener('click', function () {
      const tripId = this.getAttribute('data-trip-id');
      const tripName = this.getAttribute('data-trip-name');

      // Delegar la lógica de alternar favorito a favorites.js
      handleFavoriteToggle(tripId, tripName, this);
    });
  });
}