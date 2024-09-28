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

// Al cargar la página, puedes verificar si hay un usuario almacenado en localStorage
window.onload = function() {
  const storedEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
  if (storedEmail) {
    console.log('Sesión recordada:', storedEmail);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        mostrarDialogoBienvenida(user.email, false); // Pasamos "false" para no mostrar modal repetidamente si ya lo hizo
      }
    });
  } else {
    mostrarAuthModal(); // Mostrar el modal de autenticación si no hay usuario autenticado
  }
};

// Función para mostrar el modal de bienvenida con el nombre de usuario
function mostrarDialogoBienvenida(email, showModal = true) {
  const welcomeModal = document.getElementById('welcomeModal');
  const userName = email.split('@')[0]; // Toma el nombre de usuario antes del "@" del correo
  document.getElementById('userName').innerText = userName; // Colocar el nombre en el modal

  const modalShown = sessionStorage.getItem('welcomeModalShown'); // Verificar si ya se mostró el modal

  if (showModal && !modalShown) {
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

    // Marcar el modal como mostrado
    sessionStorage.setItem('welcomeModalShown', 'true');
  }
}

// Función para mostrar el modal de autenticación solo una vez por sesión
function mostrarAuthModal() {
  const authModal = document.getElementById('authModal');
  const modalShown = sessionStorage.getItem('authModalShown'); // Verificar si ya se mostró el modal

  if (!modalShown) {
    authModal.style.display = 'block';

    // Ocultar el modal al hacer clic en el botón de cerrar
    const closeAuthModal = document.querySelector('#authModal .close-modal');
    closeAuthModal.addEventListener('click', () => {
      authModal.style.display = 'none';
    });

    // También cerrar el modal si se hace clic fuera del modal
    window.onclick = function(event) {
      if (event.target == authModal) {
        authModal.style.display = 'none';
      }
    };

    // Marcar el modal como mostrado
    sessionStorage.setItem('authModalShown', 'true');
  }
}

// Manejar el estado de autenticación
onAuthStateChanged(auth, user => {
  const banner = document.getElementById('login-banner');
  
  if (user) {
    // Usuario autenticado: Ocultar el banner y mostrar el modal si no se ha mostrado
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'block';
    banner.style.display = 'none'; // Ocultar banner si el usuario está autenticado

    // Mostrar el diálogo de bienvenida solo si aún no ha sido mostrado en la sesión actual
    mostrarDialogoBienvenida(user.email);
    console.log('Usuario autenticado:', user.email);
  } else {
    // No hay usuario autenticado: Mostrar el banner
    document.getElementById('loginBtn').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'none';
    banner.style.display = 'block'; // Mostrar banner si no hay usuario autenticado
    console.log('Ningún usuario autenticado');
    mostrarAuthModal(); // Mostrar el modal de autenticación si no hay usuario autenticado
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
  document.getElementById('authModal').style.display = 'none';
  document.getElementById('signUpModal').style.display = 'block';
});

// Cerrar el modal de Sign In (Registro)
document.querySelector('#signUpModal .close-modal').addEventListener('click', () => {
  document.getElementById('signUpModal').style.display = 'none';
});

// Cuando el usuario haga clic fuera del modal de Sign In, este se cierra
window.onclick = function(event) {
  const signUpModal = document.getElementById('signUpModal');
  if (event.target == signUpModal) {
    signUpModal.style.display = 'none';
  }
};

// Botón para registrar un nuevo usuario
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

// Al cargar la página, mostrar el banner de notificación
window.onload = () => {
  const loginBanner = document.getElementById('login-banner');
  
  onAuthStateChanged(auth, user => {
    if (!user) {
      loginBanner.style.display = 'block';
    } else {
      loginBanner.style.display = 'none';
    }
  });
};

// Cuando se cierre el modal, ocultar el banner
const closeModal = document.querySelector('.close-modal');
if (closeModal) {
  closeModal.addEventListener('click', () => {
    document.getElementById('login-banner').style.display = 'none';
  });
}