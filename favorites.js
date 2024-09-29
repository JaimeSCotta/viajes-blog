// favorites.js
import { db, auth } from './firebase.js'; // Importa db y auth desde firebase.js
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";

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
            button.innerHTML = '<i class="fa-solid fa-heart-broken"></i> Eliminar Favorito';
          }
        });

        renderFavorites(userFavorites);
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

// Función para mostrar los favoritos en la página
function renderFavorites(favorites) {
  const favoritesContainer = document.querySelector(".favorites-container");
  favoritesContainer.innerHTML = "";

  favorites.forEach((favorite) => {
    const tripElement = document.createElement("div");
    tripElement.classList.add("favorite-trip");
    tripElement.innerHTML = `<h3>${favorite.nombre}</h3> <p>ID: ${favorite.id}</p>`;
    favoritesContainer.appendChild(tripElement);
  });
}

// Función para mostrar una notificación temporal
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerText = message;
  
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000); // Eliminar después de 3 segundos
}

// Verificar si el usuario está autenticado al presionar el botón de favoritos
const favoritesButton = document.getElementById('favoritesLink'); // Asegúrate de que este ID es correcto

favoritesButton.addEventListener('click', (event) => {
  event.preventDefault(); // Evitar la navegación

  const user = auth.currentUser; // Obtener el usuario actual desde auth importado

  if (!user) {
    showNotification('Debes estar registrado para usar esta funcionalidad.');
  } else {
    // Aquí puedes redirigir a la página de favoritos si el usuario está autenticado
    window.location.href = 'favorites.html';
  }
});