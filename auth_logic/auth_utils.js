// auth_utils.js
import { auth } from '../firebase_logic/firebase.js';
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";

// Rutas de las imágenes de usuario
const signInImage = "img/sign_in.png"; // Imagen cuando el usuario no está autenticado
const loggedInImage = "img/logged.png"; // Imagen cuando el usuario está autenticado

// -- Gestión del icono de login AUTENTICADO -- //
export function updateUIForAuthenticatedUser() {
  const loginIcon = document.getElementById('loginIcon');
  loginIcon.src = loggedInImage; // Cambiar a imagen de usuario autenticado
  loginIcon.alt = "User Menu"; // Cambiar el texto alternativo
  
  // Mostrar el nombre de usuario
  const user = auth.currentUser;
  if (user) {
    document.getElementById('userNameDropdown').textContent = user.email.split('@')[0]; // Solo nombre
  }

  // Mostrar el menú desplegable al hacer clic en la imagen
  loginIcon.addEventListener('click', () => {
    document.getElementById('authModal').style.display = 'none';
    const dropdownMenu = document.getElementById('dropdownMenu');
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block'; // Alterna el menú
  });
}


// -- Gestión del icono de login NO autenticado -- //
export function updateUIForUnauthenticatedUser() {
  const loginIcon = document.getElementById('loginIcon');
  loginIcon.src = signInImage; // Cambia la imagen al icono de iniciar sesión
  loginIcon.alt = "Login"; // Texto alternativo

  // Mostrar modal de autenticación al hacer clic
  loginIcon.addEventListener('click', () => {
    document.getElementById('authModal').style.display = 'block';
  });
  document.getElementById('dropdownMenu').style.display = 'none';
}


/* -- Gestionar: Verificar autenticación -- */
export function isUserAuthenticated() {
  return auth.currentUser;
}

/* -- Gestionar Favorites: Verificar autenticación al hacer clic en "Favorites" -- */
export function verifyAuth(event) {
  event.preventDefault();
  if (isUserAuthenticated) {
    // Si el usuario está autenticado, redirigir a favoritos
    window.location.href = 'favorites.html';
  } else {
    console.log('Boton favoritos seleccionado, pero no esta registrado, Mostrando modal de auth')
    // Si el usuario no está autenticado, mostrar el modal de autenticación
    document.getElementById('authModal').style.display = 'block';
  }
}


/* -- Gestión olvido de contraseña -- */
function resetPassword() {
  const email = document.getElementById('email').value;

  if (!email) {
    event.preventDefault();
    alert('Por favor, introduce tu dirección de correo electrónico.');
    return;
  }

  const confirmRecoverEmail = confirm('¿Estás seguro de que deseas recuperar tu cuenta?');
  if (confirmRecoverEmail) {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert('Se ha enviado un correo para restablecer tu contraseña. Revisa tu bandeja de entrada.');
      })
      .catch((error) => {
        const errorCode = error.code;
        let errorMessage = '';

        // Manejo de errores específicos basados en el código de error
        switch (errorCode) {
          case 'auth/invalid-email':
            errorMessage = 'El correo electrónico no tiene un formato válido.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No se encontró ningún usuario con ese correo electrónico.';
            break;
          default:
            errorMessage = 'Ocurrió un error al enviar el correo de restablecimiento. Inténtalo de nuevo más tarde.';
        }

        console.error('Error al enviar el correo de reseteo:', error.message);
        alert(errorMessage);
      });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Agrega el listener al botón "Forgot Password"
  const forgotPasswordBtn = document.getElementById('forgot-password');
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', (event) => {
      event.preventDefault(); // Evitar el comportamiento por defecto del enlace
      resetPassword();
    });
  } else {
    console.error('El botón de "Olvidé mi contraseña" no se encontró.');
  }
});


export function showError(message) {
    console.error(message);
    alert(message);
  }
  