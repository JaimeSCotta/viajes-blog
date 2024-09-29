// generateTrips.js
import { saveFavorite, removeFavorite, loadFavorites } from './favorites.js'; 
import { auth, db } from './firebase.js';
import { doc, getDoc, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';

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

  // Ahora agrega los event listeners para los botones de favoritos
  const favButtons = document.querySelectorAll('.fav-button');
  favButtons.forEach(button => {
    button.addEventListener('click', function () {
      const tripId = this.getAttribute('data-trip-id');
      const tripName = this.getAttribute('data-trip-name');

      // Aquí llamarás a la función que maneje la lógica de añadir o eliminar favorito
      toggleFavorite(tripId, tripName, this);
    });
  });
}

// Función para alternar el estado de un favorito (agregar o eliminar)
async function toggleFavorite(tripId, tripName, button) {
  const user = auth.currentUser; // Obtener el usuario autenticado

  if (!user) {
    alert("Debes iniciar sesión para agregar favoritos.");
    return;
  }

  try {
    // Cargar los favoritos del usuario
    const favoritesRef = doc(db, "favorites", user.uid);
    const docSnapshot = await getDoc(favoritesRef);

    if (docSnapshot.exists()) {
      const currentFavorites = docSnapshot.data().viajes || [];
      const isFavorite = currentFavorites.some(fav => fav.id === tripId);

      if (isFavorite) {
        // Si ya es favorito, eliminar
        await removeFavorite(tripId);
        button.innerHTML = '<i class="fa-solid fa-heart"></i> Favorito'; // Actualiza el botón a "Favorito"
      } else {
        // Si no es favorito, agregar
        await saveFavorite(tripId, tripName);
        button.innerHTML = '<i class="fa-solid fa-heart-broken"></i> Eliminar Favorito'; // Cambia el botón a "Eliminar"
      }
    } else {
      // Si no hay favoritos aún, agregar directamente
      await saveFavorite(tripId, tripName);
      button.innerHTML = '<i class="fa-solid fa-heart-broken"></i> Eliminar Favorito'; // Cambia el botón a "Eliminar"
    }
  } catch (error) {
    console.error("Error al alternar favorito:", error);
  }
}