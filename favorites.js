// favorites.js
import { db, auth } from './firebase.js'; // Importa db y auth desde firebase.js
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";

// Función para manejar el toggle de un favorito (agregar o eliminar)
export async function handleFavoriteToggle(tripId, tripName, button) {
  const user = auth.currentUser; // Obtener el usuario autenticado

  if (!user) {
    alert("Debes iniciar sesión para agregar favoritos.");
    return;
  }

  try {
    const favoritesRef = doc(db, "favorites", user.uid);
    const docSnapshot = await getDoc(favoritesRef);

    if (docSnapshot.exists()) {
      const currentFavorites = docSnapshot.data().viajes || [];
      const isFavorite = currentFavorites.some(fav => fav.id === tripId);

      if (isFavorite) {
        await removeFavorite(tripId); // Eliminar favorito
        button.innerHTML = '<i class="fa-solid fa-heart"></i>'; // Cambiar texto del botón
      } else {
        await saveFavorite(tripId, tripName); // Agregar favorito
        button.innerHTML = '<i class="fa-solid fa-heart-broken"></i>'; // Cambiar texto del botón
      }
    } else {
      await saveFavorite(tripId, tripName); // Si no hay favoritos, agregar directamente
      button.innerHTML = '<i class="fa-solid fa-heart-broken"></i>';
    }
  } catch (error) {
    console.error("Error al alternar favorito:", error);
  }
}

// Función para guardar un favorito
export async function saveFavorite(tripId, tripName) {
  const user = auth.currentUser; // Obtener el usuario actual
  if (user) {
    const userId = user.uid;
    const favoritesRef = doc(db, "favorites", userId);

    try {
      const docSnapshot = await getDoc(favoritesRef);

      if (docSnapshot.exists()) {
        const currentFavorites = docSnapshot.data().viajes || [];
        const updatedFavorites = [...currentFavorites, { id: tripId, nombre: tripName }];
        await updateDoc(favoritesRef, { viajes: updatedFavorites });
      } else {
        await setDoc(favoritesRef, { viajes: [{ id: tripId, nombre: tripName }] });
      }
    } catch (error) {
      console.error("Error al guardar el favorito: ", error);
    }
  } else {
    console.log("No hay usuario autenticado");
  }
}

// Función para eliminar un favorito
export async function removeFavorite(tripId) {
  const user = auth.currentUser; // Obtener el usuario actual
  if (user) {
    const userId = user.uid;
    const favoritesRef = doc(db, "favorites", userId);

    try {
      const docSnapshot = await getDoc(favoritesRef);

      if (docSnapshot.exists()) {
        const currentFavorites = docSnapshot.data().viajes || [];
        const updatedFavorites = currentFavorites.filter((trip) => trip.id !== tripId);
        await updateDoc(favoritesRef, { viajes: updatedFavorites });
      }
    } catch (error) {
      console.error("Error al eliminar el favorito: ", error);
    }
  } else {
    console.log("No hay usuario autenticado");
  }
}

// Función para cargar los favoritos
export async function loadFavorites() {
  const user = auth.currentUser; // Obtener el usuario actual
  if (user) {
    const userId = user.uid;
    const favoritesRef = doc(db, "favorites", userId);

    try {
      const docSnapshot = await getDoc(favoritesRef);

      if (docSnapshot.exists()) {
        const userFavorites = docSnapshot.data().viajes || [];

        // Aquí, además de renderizar los favoritos, actualiza los botones en la lista de viajes
        const favButtons = document.querySelectorAll('.fav-button');
        favButtons.forEach(button => {
          const tripId = button.getAttribute('data-trip-id');
          const isFavorite = userFavorites.some(fav => fav.id === tripId);

          if (isFavorite) {
            button.innerHTML = '<i class="fa-solid fa-heart-broken"></i>';
          }
        });

        renderFavorites(userFavorites); // Renderizar los favoritos en algún lugar de la UI
      } else {
        console.log("No se encontraron favoritos.");
      }
    } catch (error) {
      console.error("Error al cargar los favoritos: ", error);
    }
  } else {
    console.log("No hay usuario autenticado");
  }
}

// Función para renderizar los favoritos en la página
function renderFavorites(favorites) {
  const favoritesContainer = document.querySelector(".favorites-container");

  // Verificar si el contenedor existe en la página
  if (!favoritesContainer) {
    console.error("No se encontró el contenedor de favoritos (.favorites-container) en el DOM.");
    return; // Si no existe, salimos de la función
  }

  // Limpiar el contenido anterior
  favoritesContainer.innerHTML = "";

  // Añadir cada favorito al contenedor
  favorites.forEach((favorite) => {
    const tripElement = document.createElement("div");
    tripElement.classList.add("favorite-trip");
    tripElement.innerHTML = `<h3>${favorite.nombre}</h3> <p>ID: ${favorite.id}</p>`;
    favoritesContainer.appendChild(tripElement);
  });
}