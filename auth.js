// auth.js
import { auth, db } from './firebase.js'; // Importa auth y db desde firebase.js
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import { loadFavoritesIndex } from './favorites.js'; // Importado de loadFavorites

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

    // Ejecuta la carga de favoritos si el usuario está autenticado
    loadFavoritesIndex(); 

    // Cerrar el modal de autenticación si el usuario ya está autenticado
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

// Verifica el estado de autenticación cada vez que se carga la página
window.onload = function() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('Usuario autenticado:', user.email);
      mostrarDialogoBienvenida(user.email, false); // Mostrar solo una vez
      actualizarUIParaUsuarioAutenticado();
      loadFavoritesIndex(); // Cargar favoritos
    } else {
      console.log('Ningún usuario autenticado, mostrando modal de login');
      mostrarAuthModal(); // Mostrar modal de autenticación
    }
  });
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
  
  // Solo mostrar si el usuario no está autenticado
  if (!auth.currentUser) {
    const modalShown = sessionStorage.getItem('authModalShown');

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
}

// Actualiza la UI cuando el usuario está autenticado
function actualizarUIParaUsuarioAutenticado() {
  const loginIcon = document.getElementById('loginIcon');
  loginIcon.src = loggedInImage; // Cambiar a imagen de usuario autenticado
  loginIcon.alt = "User Menu"; // Cambiar el texto alternativo
  
  // Mostrar el nombre de usuario
  const user = auth.currentUser;
  if (user) {
    document.getElementById('userNameDropdown').textContent = user.email.split('@')[0]; // Solo nombre
  }

  // Mostrar el menú desplegable al hacer clic en la imagen (un solo evento)
  loginIcon.onclick = () => {
    const dropdownMenu = document.getElementById('dropdownMenu');
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block'; // Alterna el menú
  };
}

// Actualiza la UI cuando no hay un usuario autenticado
function actualizarUIParaUsuarioNoAutenticado() {
  const loginIcon = document.getElementById('loginIcon');
  loginIcon.src = signInImage; // Cambia la imagen al icono de iniciar sesión
  loginIcon.alt = "Login"; // Texto alternativo

  // Mostrar modal de autenticación al hacer clic
  loginIcon.onclick = () => {
    mostrarAuthModal();
  };
  document.getElementById('dropdownMenu').style.display = 'none';
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
      sessionStorage.removeItem('authModalShown'); // Reiniciar el estado del modal
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
  event.preventDefault(); // Evitar comportamiento por defecto del enlace
  document.getElementById('authModal').style.display = 'none';
  document.getElementById('signUpModal').style.display = 'block'; // Mostrar el modal de registro
});

// Cerrar el modal de registro cuando se hace clic en el botón de cierre
document.querySelector('#signUpModal .close-modal').addEventListener('click', () => {
  document.getElementById('signUpModal').style.display = 'none';
});

// Control para cerrar modales al hacer clic fuera de ellos
window.onclick = function(event) {
  const signUpModal = document.getElementById('signUpModal');
  const authModal = document.getElementById('authModal');
  
  if (event.target == signUpModal) {
    signUpModal.style.display = 'none';
  }

  if (event.target == authModal) {
    authModal.style.display = 'none';
  }

  const welcomeModal = document.getElementById('welcomeModal');
  if (event.target == welcomeModal) {
    welcomeModal.style.display = 'none';
  }
};
