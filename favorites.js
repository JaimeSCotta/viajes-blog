import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";

const db = getFirestore(app);
const auth = getAuth(app);

// Función para guardar un favorito
export function saveFavorite(tripId, tripName) {
  onAuthStateChanged(auth, async (user) => {
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
  });
}

// Función para eliminar un favorito
export function removeFavorite(tripId) {
  onAuthStateChanged(auth, async (user) => {
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
  });
}

// Función para cargar los favoritos
export function loadFavorites() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userId = user.uid;
      const favoritesRef = doc(db, "favorites", userId);

      try {
        const docSnapshot = await getDoc(favoritesRef);

        if (docSnapshot.exists()) {
          const userFavorites = docSnapshot.data().viajes || [];
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
  });
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

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    
    document.body.appendChild(notification);
  
    setTimeout(() => {
      notification.remove();
    }, 3000); // Eliminar después de 3 segundos
  }
  

const favoritesButton = document.getElementById('favoritesLink'); // Asegúrate de que este ID es correcto

favoritesButton.addEventListener('click', (event) => {
  event.preventDefault(); // Evitar la navegación

  const user = getAuth().currentUser; // Obtener el usuario actual

  if (!user) {
    showNotification('Debes estar registrado para usar esta funcionalidad.');
  } else {
    // Aquí puedes redirigir a la página de favoritos si el usuario está autenticado
    window.location.href = 'favorites.html';
  }
});

// Placeholder para loadFavorites si no está definida aún
function loadFavorites() {
  console.log('Cargando favoritos...');
  // Aquí agregas la lógica para cargar los favoritos
}
