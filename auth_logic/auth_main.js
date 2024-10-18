// auth_main.js
import { loadFavoritesIndex } from '../favorites_logic/favorites_main.js';
import { auth } from '../firebase_logic/firebase.js';
import { handleSignIn, handleSignUp, handleSignOut, handleDeleteUser } from './auth_handlers.js';
import { showWelcomeModal, showSingInhModal, showSignUpModal, closeModals } from './auth_modal.js';
import { updateUIForAuthenticatedUser, updateUIForUnauthenticatedUser, verifyAuth } from './auth_utils.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";

// Eventos de botones
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('signInBtn')?.addEventListener('click', handleSignIn);
  document.getElementById('registerBtn')?.addEventListener('click', handleSignUp);
  document.getElementById('logoutBtn')?.addEventListener('click', handleSignOut);
  document.getElementById('deleteUserBtn')?.addEventListener('click', handleDeleteUser);
  document.getElementById('signUpBtn')?.addEventListener('click', showSignUpModal);
  document.getElementById('favoritesLink')?.addEventListener('click', verifyAuth);
});

// Inicio a la Web - Manejar el estado de autenticación
onAuthStateChanged(auth, user => {
  showSingInhModal();
  if (user) {
    console.log('Usuario autenticado:', user.email);
    showWelcomeModal(user.email);
    updateUIForAuthenticatedUser();
    loadFavoritesIndex();
    closeModals(); 
  } else {
    console.log('Ningún usuario autenticado');
    updateUIForUnauthenticatedUser();
    closeModals();
  }
});


