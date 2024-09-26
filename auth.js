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
  const banner = document.getElementById('login-banner');
  
  if (user) {
    // Usuario autenticado: Ocultar el banner
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'block';
    banner.style.display = 'none'; // Ocultar banner si el usuario está autenticado
    console.log('Usuario autenticado:', user.email);
  } else {
    // No hay usuario autenticado: Mostrar el banner
    document.getElementById('loginBtn').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
    banner.style.display = 'block'; // Mostrar banner si no hay usuario autenticado
    console.log('Ningún usuario autenticado');
  }
});


// Iniciar sesión
document.getElementById('signInBtn').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const rememberMe = document.querySelector('input[type="checkbox"]').checked;

  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      console.log('Sesión iniciada:', userCredential.user);
      
      // Si el usuario marca "Remember Me", almacena la sesión en localStorage
      if (rememberMe) {
        auth.setPersistence(auth.Auth.Persistence.LOCAL);
        localStorage.setItem('userEmail', email); // También puedes almacenar el token de sesión
        console.log('Sesión guardada con "Remember me" activado.');
      } else {
        sessionStorage.setItem('userEmail', email); // Solo para la sesión actual
        console.log('Sesión iniciada sin recordar.');
      }

      document.getElementById('authModal').style.display = 'none'; // Cierra el modal
      document.getElementById('login-banner').style.display = 'none'; // Ocultar banner
      mostrarDialogoBienvenida(userCredential.user.email); // Mostrar mensaje bonito
      alert('Sesión iniciada correctamente');
    })
    .catch(error => {
      console.error('Error al iniciar sesión:', error.message);
      alert('Error al iniciar sesión: ' + error.message);
    });
});

// Registrarse
document.getElementById('signUpBtn').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      console.log('Usuario registrado:', userCredential.user);
      document.getElementById('authModal').style.display = 'none'; // Cerrar modal
      alert('Usuario registrado correctamente');
    })
    .catch(error => {
      console.error('Error al registrarse:', error.message);
      alert('Error al registrarse: ' + error.message);
    });
});

// Cerrar sesión
document.getElementById('logoutBtn').addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      console.log('Sesión cerrada');
      alert('Sesión cerrada correctamente');
    })
    .catch(error => {
      console.error('Error al cerrar sesión:', error.message);
      alert('Error al cerrar sesión: ' + error.message);
    });
});

// Al cargar la página, puedes verificar si hay un usuario almacenado en localStorage
window.onload = function() {
  const storedEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
  if (storedEmail) {
    console.log('Sesión recordada:', storedEmail);
    // Puedes directamente hacer el login con las credenciales guardadas si así lo deseas
  }
};

// Al cargar la página, mostrar el banner de notificación
window.onload = () => {
  const loginBanner = document.getElementById('login-banner');
  
  // Mostrar el banner solo si no está autenticado
  onAuthStateChanged(auth, user => {
    if (!user) {
      loginBanner.style.display = 'block';
    } else {
      loginBanner.style.display = 'none'; // Ocultar el banner si ya está autenticado
    }
  });
};

// Cuando se cierre el modal, ocultar el banner
closeModal.addEventListener('click', () => {
  document.getElementById('login-banner').style.display = 'none';
});

import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";

document.querySelector('.forgot-password').addEventListener('click', () => {
  const email = document.getElementById('email').value;

  if (!email) {
    alert('Por favor, ingresa tu correo electrónico para restablecer la contraseña.');
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert('Correo de restablecimiento de contraseña enviado. Revisa tu bandeja de entrada.');
    })
    .catch(error => {
      console.error('Error al enviar correo de restablecimiento:', error.message);
      alert('Error al enviar correo de restablecimiento: ' + error.message);
    });
});

// Función para mostrar el modal de bienvenida con el nombre de usuario
function mostrarDialogoBienvenida(email) {
  const welcomeModal = document.getElementById('welcomeModal');
  const userName = email.split('@')[0]; // Toma el nombre de usuario antes del "@" del correo
  document.getElementById('userName').innerText = userName; // Colocar el nombre en el modal
  welcomeModal.style.display = 'block';

  // Ocultar el modal al hacer clic en el botón de cerrar
  const closeWelcomeModal = document.querySelector('#welcomeModal .close-modal');
  closeWelcomeModal.addEventListener('click', () => {
    welcomeModal.style.display = 'none';
  });
  
  // También cerrar el modal si se hace clic fuera del modal
  window.onclick = function(event) {
    if (event.target == welcomeModal) {
      welcomeModal.style.display = 'none';
    }
  };
}