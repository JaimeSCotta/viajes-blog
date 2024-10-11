// auth.js
import { auth, db } from './firebase.js'; // Importa auth y db desde firebase.js
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import { loadFavoritesIndex } from './favorites.js'; // Importado de loadFavorites

// Rutas de las imágenes de usuario
const signInImage = "img/sign_in.png"; // Imagen cuando el usuario no está autenticado
const loggedInImage = "img/logged.png"; // Imagen cuando el usuario está autenticado



/* -- Gestionar sesión: iniciar sesión - cerrar sesión -- */

// Iniciar sesión
document.getElementById('signInBtn').addEventListener('click', (event) => {
  const termsCheckbox = document.getElementById('terms');
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const rememberMe = document.querySelector('input[type="checkbox"]').checked;

  // Verificar si los términos están aceptados
  if (!termsCheckbox.checked) {
    event.preventDefault();
    alert('Debes aceptar los términos de uso y la política de privacidad para continuar.');
    return; // Salir de la función
  }

  // Verificar si los campos de correo y contraseña están completos
  if (!email || !password) {
    event.preventDefault();
    alert('Por favor, completa tanto el correo electrónico como la contraseña.');
    return; // Salir de la función
  }

  // Si los términos están aceptados y los campos están completos, continuar con el inicio de sesión
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

/* -- ---------------------------------------------------------------------- -- */



/* -- Gestionar usuarios: nuevo usuario - eliminar usuario -- */

// Registrar a un nuevo usuario
document.getElementById('registerBtn').addEventListener('click', () => {
  const newEmail = document.getElementById('newEmail').value;
  const newPassword = document.getElementById('newPassword').value;

  // Verificar si los campos de correo y contraseña están completos
  if (!newEmail || !newPassword) {
    event.preventDefault();
    alert('Por favor, completa tanto el correo electrónico como la contraseña.');
    return;
  }

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

// // Eliminar usuario autenticado
// document.getElementById('deleteUserBtn').addEventListener('click', () => {
//   const user = auth.currentUser;

//   if (user) {
//     // Confirmar si el usuario realmente quiere eliminar la cuenta
//     const confirmDelete = confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
    
//     if (confirmDelete) {
//       deleteUser(user)
//         .then(() => {
//           console.log('Usuario eliminado');
//           alert('Tu cuenta ha sido eliminada correctamente.');
//           // Redirigir a la página de inicio
//           window.location.href = 'index.html'; 
//         })
//         .catch(error => {
//           console.error('Error al eliminar el usuario:', error.message);
//           alert('Error al eliminar la cuenta: ' + error.message);
//         });
//     }
//   } else {
//     alert('No hay un usuario autenticado.');
//   }
// });

/* -- -------------------------------------------------------- -- */



/* -- Gestión otros: olvido de contraseña, usuario activo, inicio web -- */

// Función para enviar el correo de reseteo de contraseña
document.addEventListener('DOMContentLoaded', () => {
  function enviarCorreoResetPassword() {
    const email = document.getElementById('email').value; // Obtén el correo del input
  
    if (!email) {
      event.preventDefault();
      alert('Por favor, introduce tu dirección de correo electrónico.');
      return;
    }
  
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert('Se ha enviado un correo para restablecer tu contraseña. Revisa tu bandeja de entrada.');
      })
      .catch((error) => {
        console.error('Error al enviar el correo de reseteo:', error.message);
        alert('Error al enviar el correo de restablecimiento: ' + error.message);
      });
  }
  
  // Agrega el listener al botón "Forgot Password"
  const forgotPasswordBtn = document.getElementById('forgot-password');
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', (event) => {
      event.preventDefault(); // Evitar el comportamiento por defecto del enlace
      enviarCorreoResetPassword();
    });
  } else {
    console.error('El botón de "Olvidé mi contraseña" no se encontró.');
  }
});

// Mantener el usuario activo en caso de que se cierre la pestaña y se haya seleccionado ser recordado
window.onload = function() {
  const storedEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');

  if (storedEmail) {
    console.log('Sesión recordada:', storedEmail);
    mostrarDialogoBienvenida(storedEmail, false);
  }

  const loginBanner = document.getElementById('login-banner');
  if (auth.currentUser) {
    loginBanner.style.display = 'none';
  } else {
    loginBanner.style.display = 'block';
  }
};

// Inicio a la Web - Manejar el estado de autenticación
onAuthStateChanged(auth, user => {

  // mostrarAuthModal()  // Modal aparezca 1 vez

  if (user) {
    console.log('Usuario autenticado:', user.email);
    mostrarDialogoBienvenida(user.email, false); // No mostrar el modal repetidamente
    actualizarUIParaUsuarioAutenticado();
    loadFavoritesIndex(); 

  } else {
    console.log('Ningún usuario autenticado');
    actualizarUIParaUsuarioNoAutenticado();
  }
});

/* -- ------------------------------------------------------ -- */



// -- Gestión del icono de login autenticado - No autenticado -- //

// Autenticado
function actualizarUIParaUsuarioAutenticado() {
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

// No Autenticado
function actualizarUIParaUsuarioNoAutenticado() {
  const loginIcon = document.getElementById('loginIcon');
  loginIcon.src = signInImage; // Cambia la imagen al icono de iniciar sesión
  loginIcon.alt = "Login"; // Texto alternativo

  // Mostrar modal de autenticación al hacer clic
  loginIcon.addEventListener('click', () => {
    document.getElementById('authModal').style.display = 'block';
  });
  document.getElementById('dropdownMenu').style.display = 'none';
}

/* -- -------------------------------------------------------- -- */



/* -- Gestionar modales: modal bienvenida, sign in, sign up, cerrar modales -- */

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
  
  // Revisar si el modal ya fue mostrado en esta sesión
  const modalShown = sessionStorage.getItem('authModalShown');

  if (!modalShown) {
    authModal.style.display = 'block';
    sessionStorage.setItem('authModalShown', 'true'); 
  }
}

// Mostrar el modal de registro (Sign Up) cuando se hace clic en el enlace "Sign In!"
document.getElementById('signUpBtn').addEventListener('click', (event) => {
  event.preventDefault(); 
  document.getElementById('authModal').style.display = 'none';
  document.getElementById('signUpModal').style.display = 'block';
});

// Cerrar el modal de registro cuando se hace clic en el botón de cierre
document.querySelector('#signUpModal .close-modal').addEventListener('click', () => {
  document.getElementById('signUpModal').style.display = 'none';
});

// Cerrar los modales si se hace clic fuera de ellos
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

/* -- -------------------------------------------------------- -- */