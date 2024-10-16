// favorites_handlers.js
import { db } from '../firebase_logic/firebase.js';
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";

// Obtener referencia al documento de favoritos
export function getFavoritesDocRef(userId) {
  return doc(db, "favorites", userId);
}

// Obtener los favoritos de un usuario
export async function getFavorites(userId) {
  const favoritesRef = getFavoritesDocRef(userId);
  try {
    const docSnapshot = await getDoc(favoritesRef);
    return docSnapshot.exists() ? docSnapshot.data().viajes || [] : [];
  } catch (error) {
    console.error("Error al obtener el favorito: ", error);
  }
}

// Guardar un nuevo favorito
export async function saveFavorite(userId, tripId, tripName) {
  const favoritesRef = getFavoritesDocRef(userId);
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
}

// Eliminar un favorito
export async function removeFavorite(userId, tripId) {
  const favoritesRef = getFavoritesDocRef(userId);
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
}