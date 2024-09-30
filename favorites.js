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
        button.classList.remove('active');
        button.innerHTML = '<i class="fa-solid fa-heart"></i>'; // Cambiar texto del botón
      } else {
        await saveFavorite(tripId, tripName); // Agregar favorito
        button.classList.add('active');
        button.innerHTML = '<i class="fa-solid fa-heart"></i>'; // Cambiar texto del botón
      }
    } else {
      await saveFavorite(tripId, tripName); // Si no hay favoritos, agregar directamente
      button.classList.add('active');
      button.innerHTML = '<i class="fa-solid fa-heart"></i>';
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

// Función para cargar los favoritos en index.html
export async function loadFavoritesIndex() {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;
    const favoritesRef = doc(db, "favorites", userId);

    try {
      const docSnapshot = await getDoc(favoritesRef);

      if (docSnapshot.exists()) {
        const userFavorites = docSnapshot.data().viajes || [];
        const favButtons = document.querySelectorAll('.fav-button');
        favButtons.forEach(button => {
          const tripId = button.getAttribute('data-trip-id');
          const isFavorite = userFavorites.some(fav => fav.id === tripId);

          if (isFavorite) {
            button.classList.add('active'); // Añadir clase 'active'
            button.innerHTML = '<i class="fa-solid fa-heart"></i>'; // Corazón lleno
          } else {
            button.classList.remove('active'); // Asegúrate de quitar la clase 'active'
            button.innerHTML = '<i class="fa-solid fa-heart"></i>'; // Corazón vacío
          }
        });

        //renderFavorites(userFavorites);
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

// Función para cargar los favoritos en favorites.html
export async function loadFavorites() {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;
    console.log(`Cargando favoritos para el usuario: ${user.email} (${userId})`); // Depuración
    const favoritesRef = doc(db, "favorites", userId);

    try {
      const docSnapshot = await getDoc(favoritesRef);

      if (docSnapshot.exists()) {
        const userFavorites = docSnapshot.data().viajes || [];
        console.log(`Se encontraron ${userFavorites.length} favoritos.`); // Depuración

        const favButtons = document.querySelectorAll('.fav-button');
        favButtons.forEach(button => {
          const tripId = button.getAttribute('data-trip-id');
          const isFavorite = userFavorites.some(fav => fav.id === tripId);

          if (isFavorite) {
            button.classList.add('active'); // Añadir clase 'active'
            button.innerHTML = '<i class="fa-solid fa-heart"></i>'; // Corazón lleno
          } else {
            button.classList.remove('active'); // Asegúrate de quitar la clase 'active'
            button.innerHTML = '<i class="fa-solid fa-heart"></i>'; // Corazón vacío
          }
        });

        renderFavorites(userFavorites); // Renderizar los favoritos en la página
      } else {
        console.log("No se encontraron favoritos para este usuario."); // Depuración
      }
    } catch (error) {
      console.error("Error al cargar los favoritos:", error);
    }
  } else {
    console.log("No hay usuario autenticado."); // Depuración
  }
}

// Función para renderizar los favoritos en la página
function renderFavorites(favorites) {
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
    const imageUrl = `img/trips/${favorite.id}.jpg`;

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
      button.addEventListener('click', async (event) => {
        const tripId = button.getAttribute('data-trip-id');
        const tripName = button.getAttribute('data-trip-name');
  
        // Eliminar el favorito y volver a cargar la lista
        await removeFavorite(tripId);
        loadFavorites(); // Recargar la lista de favoritos
      });
    });
}
