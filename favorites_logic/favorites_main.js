// favorites.js
import { isUserAuthenticated } from '../auth_logic/auth_utils.js';
import { getFavorites, saveFavorite, removeFavorite } from './favorites_handlers.js';
import { updateFavoriteButton, renderFavorites } from './favorites_utils.js';

// Función para manejar el toggle de un favorito (agregar o eliminar)
export async function handleFavoriteToggle(tripId, tripName, button) {
  const user = isUserAuthenticated();

  if (!user) {
    alert("Debes iniciar sesión para agregar favoritos.");
    return;
  }

  try {
    const userFavorites = await getFavorites(user.uid);
    const isFavorite = userFavorites.some(fav => fav.id === tripId);

    if (isFavorite) {
      await removeFavorite(user.uid, tripId); // Eliminar favorito
      updateFavoriteButton(button, false); // Actualizar botón
    } else {
      await saveFavorite(user.uid, tripId, tripName); // Agregar favorito
      updateFavoriteButton(button, true); // Actualizar botón
    }
  } catch (error) {
    console.error("Error al alternar favorito:", error);
  }
}

// Función para cargar los favoritos en index.html
export async function loadFavoritesIndex() {
  const user = isUserAuthenticated();
  if (!user) {
    console.log("No hay usuario autenticado");
    return;
  }
  try {
    const userFavorites = await getFavorites(user.uid);
    const favButtons = document.querySelectorAll('.fav-button');
    favButtons.forEach(button => {
      const tripId = button.getAttribute('data-trip-id');
      const isFavorite = userFavorites.some(fav => fav.id === tripId);
      updateFavoriteButton(button, isFavorite);
    });
  } catch (error) {
    console.error("Error al cargar los favoritos:", error);
  }
}

// Función para cargar los favoritos en favorites.html
export async function loadFavorites() {
  const user = isUserAuthenticated();
  if (!user) {
    console.log("No hay usuario autenticado.");
    return;
  }
  try {
    const userFavorites = await getFavorites(user.uid);
    const favButtons = document.querySelectorAll('.fav-button');
    favButtons.forEach(button => {
      const tripId = button.getAttribute('data-trip-id');
      const isFavorite = userFavorites.some(fav => fav.id === tripId);
      updateFavoriteButton(button, isFavorite);
    });

    renderFavorites(userFavorites); // Renderizar los favoritos en la página
  } catch (error) {
    console.error("Error al cargar los favoritos:", error);
  }
}