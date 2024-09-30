// auth.js
import { auth } from './firebase.js'; // Importa auth desde firebase.js
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import { loadFavoritesIndex } from './favorites.js';

// Rutas de las imágenes
const signInImage = "img/sign_in.png"; // Imagen cuando el usuario no está autenticado
const loggedInImage = "img/logged.png"; // Imagen cuando el usuario está autenticado

// Registrar a un nuevo usuario
document.getElementById('registerBtn').addEventListener('click', () => {
  const newEmail = document.getElementById('newEmail').value;
  const newPassword = document.getElementById('newPassword').value;

  createUserWithEmailAndPassword(auth, newEmail, newPassword)
    .then(userCredential => {
      console.log('Usuario registrado:', userCredential.user);
      document.getElementById('signUpModal').style.display = 'none';
      alert('Usuario registrado correctamente');
    })
    .catch(error => {
      console.error('Error al registrarse:', error.message);
      alert('Error al registrarse: ' + error.message);
    });
});

// Manejar el estado de autenticación
onAuthStateChanged(auth, user => {
  if (user) {
    console.log('Usuario autenticado:', user.email);
    mostrarDialogoBienvenida(user.email, false); // No mostrar el modal repetidamente
    actualizarUIParaUsuarioAutenticado();

    loadFavoritesIndex(); // Carga de favoritos al estar autenticado

    // Aquí se cierra el modal de autenticación
    const authModal = document.getElementById('authModal');
    if (authModal) {
      authModal.style.display = 'none';
    }

  } else {
    console.log('Ningún usuario autenticado');
    actualizarUIParaUsuarioNoAutenticado();
    mostrarAuthModal(); // Mostrar modal de login si no hay usuario autenticado
  }
});

// Unificar la lógica de autenticación y modales en window.onload
window.onload = function() {
  const storedEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');

  if (storedEmail) {
    console.log('Sesión recordada:', storedEmail);
    mostrarDialogoBienvenida(storedEmail, false);
  }

  // Controlar la visibilidad del banner
  const loginBanner = document.getElementById('login-banner');
  loginBanner.style.display = auth.currentUser ? 'none' : 'block'; // Mostrar u ocultar banner
};

// Funciones para mostrar modales y manejar UI...
function mostrarDialogoBienvenida(email, showModal = true) {
  const welcomeModal = document.getElementById('welcomeModal');
  const userName = email.split('@')[0];
  document.getElementById('userName').innerText = userName;

  const modalShown = sessionStorage.getItem('welcomeModalShown');
  if (showModal && !modalShown) {
    welcomeModal.style.display = 'block';
    sessionStorage.setItem('welcomeModalShown', 'true');

    const closeWelcomeModal = document.querySelector('#welcomeModal .close-modal');
    closeWelcomeModal.addEventListener('click', () => {
      welcomeModal.style.display = 'none';
    });

    window.onclick = function(event) {
      if (event.target == welcomeModal) {
        welcomeModal.style.display = 'none';
      }
    };
  }
}

// Mostrar el modal de autenticación solo una vez por sesión
function mostrarAuthModal() {
  const authModal = document.getElementById('authModal');
  const modalShown = sessionStorage.getItem('authModalShown');

  if (!modalShown) {
    authModal.style.display = 'block';
    sessionStorage.setItem('authModalShown', 'true');

    const closeAuthModal = document.querySelector('#authModal .close-modal');
    closeAuthModal.addEventListener('click', () => {
      authModal.style.display = 'none';
    });

    window.onclick = function(event) {
      if (event.target == authModal) {
        authModal.style.display = 'none';
      }
    };
  }
}

// Actualiza la UI cuando el usuario está autenticado
function actualizarUIParaUsuarioAutenticado() {
  const loginIcon = document.getElementById('loginIcon');
  loginIcon.src = loggedInImage;
  loginIcon.alt = "User Menu";

  loginIcon.addEventListener('click', mostrarMenuDesplegable);
  document.getElementById('dropdownMenu').style.display = 'block'; 
  document.getElementById('login-banner').style.display = 'none';
}

// Mostrar el menú desplegable de logout
function mostrarMenuDesplegable() {
  const dropdownMenu = document.getElementById('dropdownMenu');
  dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
}

// Cuando el usuario no está autenticado
function actualizarUIParaUsuarioNoAutenticado() {
  const loginIcon = document.getElementById('loginIcon');
  loginIcon.src = signInImage;
  loginIcon.alt = "Login";

  loginIcon.addEventListener('click', mostrarAuthModal);
}

// Iniciar sesión
document.getElementById('signInBtn').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const rememberMe = document.querySelector('input[type="checkbox"]').checked;

  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      console.log('Sesión iniciada:', userCredential.user);

      if (rememberMe) {
        localStorage.setItem('userEmail', email);
        console.log('Sesión guardada con "Remember me" activado.');
      } else {
        sessionStorage.setItem('userEmail', email);
        console.log('Sesión iniciada sin recordar.');
      }

      document.getElementById('authModal').style.display = 'none'; // Cierra el modal
      mostrarDialogoBienvenida(userCredential.user.email);
      alert('Sesión iniciada correctamente');
    })
    .catch(error => {
      console.error('Error al iniciar sesión:', error.message);
      alert('Error al iniciar sesión: ' + error.message);
    });
});

// Cerrar sesión
document.getElementById('logoutBtn').addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      console.log('Sesión cerrada');
      localStorage.removeItem('userEmail');
      sessionStorage.removeItem('userEmail');
      alert('Sesión cerrada correctamente');
      location.reload(); // Recargar la página para volver al estado inicial
    })
    .catch(error => {
      console.error('Error al cerrar sesión:', error.message);
      alert('Error al cerrar sesión: ' + error.message);
    });
});

// Mostrar el modal de registro (Sign Up) cuando se hace clic en el enlace "Sign In!"
document.getElementById('signUpBtn').addEventListener('click', (event) => {
  event.preventDefault(); 
  document.getElementById('authModal').style.display = 'none';
  document.getElementById('signUpModal').style.display = 'block'; // Mostrar el modal de registro
});

// Cerrar el modal de registro
document.querySelector('#signUpModal .close-modal').addEventListener('click', () => {
  document.getElementById('signUpModal').style.display = 'none';
});

// Cerrar los modales al hacer clic fuera de ellos
window.onclick = function(event) {
  const signUpModal = document.getElementById('signUpModal');
  const authModal = document.getElementById('authModal');
  const welcomeModal = document.getElementById('welcomeModal');

  if (event.target == signUpModal) {
    signUpModal.style.display = 'none';
  }

  if (event.target == authModal) {
    authModal.style.display = 'none';
  }

  if (event.target == welcomeModal) {
    welcomeModal.style.display = 'none';
  }
};
