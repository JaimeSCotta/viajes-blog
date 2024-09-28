// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBV-uF9QRdjQWDcSdVDY4H4N2IHaRk9sP0",
  authDomain: "viajes-blog.firebaseapp.com",
  projectId: "viajes-blog",
  storageBucket: "viajes-blog.appspot.com",
  messagingSenderId: "76235920794",
  appId: "1:76235920794:web:9cfacb175910f38bba5623"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Manejar el estado de autenticación
onAuthStateChanged(auth, user => {
  if (user) {
    console.log('Usuario autenticado:', user.email);
    mostrarDialogoBienvenida(user.email, false); // No mostrar el modal repetidamente
    actualizarUIParaUsuarioAutenticado();
  } else {
    console.log('Ningún usuario autenticado');
    mostrarAuthModal();
  }
});

// Unificar la lógica de autenticación y modales en window.onload
window.onload = function() {
  const storedEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');

  if (storedEmail) {
    console.log('Sesión recordada:', storedEmail);
    mostrarDialogoBienvenida(storedEmail, false); // No mostrar el modal repetidamente
  } else {
    mostrarAuthModal(); // Mostrar el modal de autenticación si no hay sesión
  }

  // Controlar la visibilidad del banner
  const loginBanner = document.getElementById('login-banner');
  if (auth.currentUser) {
    loginBanner.style.display = 'none';
  } else {
    loginBanner.style.display = 'block';
  }
};

// Función para mostrar el modal de bienvenida con el nombre de usuario
function mostrarDialogoBienvenida(email, showModal = true) {
  const welcomeModal = document.getElementById('welcomeModal');
  const userName = email.split('@')[0]; // Toma el nombre de usuario antes del "@"
  document.getElementById('userName').innerText = userName;

  const modalShown = sessionStorage.getItem('welcomeModalShown'); // Verificar si ya se mostró el modal
  if (showModal && !modalShown) {
    welcomeModal.style.display = 'block';
    sessionStorage.setItem('welcomeModalShown', 'true'); // Marcar como mostrado

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

// Función para mostrar el modal de autenticación solo una vez por sesión
function mostrarAuthModal() {
  const authModal = document.getElementById('authModal');
  const modalShown = sessionStorage.getItem('authModalShown'); // Verificar si ya se mostró el modal

  if (!modalShown) {
    authModal.style.display = 'block';
    sessionStorage.setItem('authModalShown', 'true'); // Marcar como mostrado

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
  document.getElementById('loginBtn').style.display = 'none';
  document.getElementById('logoutBtn').style.display = 'block';
  document.getElementById('login-banner').style.display = 'none'; // Ocultar banner si el usuario está autenticado
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