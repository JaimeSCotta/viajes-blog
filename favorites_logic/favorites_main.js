// favorites_main.js
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import { getFavorites, saveFavorite, removeFavorite } from './favorites_handlers.js';
import { updateFavoriteButton, renderFavorites } from './favorites_utils.js';

const auth = getAuth();

// Función para manejar el toggle de un favorito (agregar o eliminar)
export async function handleFavoriteToggle(tripId, tripName, button) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("Debes iniciar sesión para agregar favoritos.");
      return;
    }

    try {
      console.log('Usuario autenticado toggle:', user.email);
      const userFavorites = await getFavorites(user.uid);
      console.log('Favoritos obtenido toggle:', userFavorites);
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
  });
}

// Función para cargar los favoritos en index.html
export async function loadFavoritesIndex() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      console.log("No hay usuario autenticado");
      return;
    }
    try {
      console.log('Usuario autenticado index:', user.email);
      const userFavorites = await getFavorites(user.uid);
      console.log('Favoritos obtenidos indx:', userFavorites);
      const favButtons = document.querySelectorAll('.fav-button');
      favButtons.forEach(button => {
        const tripId = button.getAttribute('data-trip-id');
        const isFavorite = userFavorites.some(fav => fav.id === tripId);
        updateFavoriteButton(button, isFavorite);
      });
    } catch (error) {
      console.error("Error al cargar los favoritos:", error);
    }
  });
}

// Función para cargar los favoritos en favorites.html
export async function loadFavorites() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      console.log("No hay usuario autenticado.");
      return;
    }
    try {
      console.log('Usuario autenticado load:', user.email);
      const userFavorites = await getFavorites(user.uid);
      console.log('Favoritos obtenidos load:', userFavorites);
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
  });
}