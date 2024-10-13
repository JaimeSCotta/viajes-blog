// auth.js
import { auth, db } from './firebase.js'; // Importa auth y db desde firebase.js
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail, deleteUser } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import { deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js'; // Importar deleteDoc correctamente desde Firestore
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
    })
    .catch(error => {
      const errorCode = error.code;
      let errorMessage = '';

      // Manejo específico de errores basados en el código de error devuelto por Firebase
      switch (errorCode) {
        case 'auth/invalid-email':
          errorMessage = 'El correo electrónico no tiene un formato válido.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'La cuenta de este usuario ha sido deshabilitada.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No se encontró ningún usuario con ese correo electrónico.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'La contraseña es incorrecta. Inténtalo de nuevo.';
          break;
        default:
          errorMessage = 'Ocurrió un error al iniciar sesión. Por favor, revisa tus credenciales.';
      }

      console.error('Error al iniciar sesión:', error.message);
      alert(errorMessage);
    });
});


// Cerrar sesión
document.getElementById('logoutBtn').addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      console.log('Sesión cerrada');
      localStorage.removeItem('userEmail');
      sessionStorage.removeItem('userEmail');
      localStorage.removeItem('authModalShown');
      sessionStorage.removeItem('authModalShown');
      localStorage.removeItem('bienvenidaShown');
      sessionStorage.removeItem('bienvenidaShown');
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
document.getElementById('registerBtn').addEventListener('click', (event) => {
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
      const errorCode = error.code;
      let errorMessage = '';

      // Manejo de errores específicos basados en el código de error
      switch (errorCode) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este correo electrónico ya está registrado. Por favor, usa otro.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El correo electrónico no tiene un formato válido.';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
          break;
        default:
          errorMessage = 'Ocurrió un error al registrarse. Inténtalo de nuevo más tarde.';
      }

      console.error('Error al registrarse:', error.message);
      alert(errorMessage);
    });
});


// // Eliminar usuario autenticado
document.getElementById('deleteUserBtn').addEventListener('click', () => {
  const user = auth.currentUser;

  if (user) {
    // Confirmar si el usuario realmente quiere eliminar la cuenta
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
    
    if (confirmDelete) {
      deleteUser(user)
        .then(() => {
          console.log('Usuario eliminado');
          alert('Tu cuenta ha sido eliminada correctamente.');
          // Redirigir a la página de inicio
          window.location.href = 'index.html'; 
        })
        .catch(error => {
          console.error("Error al eliminar la cuenta:", error);
          alert("Ocurrió un error al intentar eliminar la cuenta. Por favor, inténtalo de nuevo.");

        });
    }
  } else {
    alert('No hay un usuario autenticado.');
  }
});

// Eliminar usuario autenticado y sus datos de la base de datos
document.getElementById('deleteUserBtn').addEventListener('click', async () => {
  const user = auth.currentUser;

  if (user) {
    // Confirmar si el usuario realmente quiere eliminar la cuenta
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
    
    if (confirmDelete) {
      try {
        // 1. Eliminar los datos del usuario de la base de datos
        const favoritesRef = doc(db, 'favorites', user.uid); // Asume que los datos del usuario están en 'users' collection con el uid como documento.
        await deleteDoc(favoritesRef);
        console.log('Datos del usuario eliminados de la base de datos.');

        // 2. Eliminar la cuenta del usuario de la autenticación
        await deleteUser(user);
        console.log('Usuario eliminado de la autenticación.');

        alert('Tu cuenta y tus datos han sido eliminados correctamente.');
        // Redirigir a la página de inicio
        window.location.href = 'index.html'; 
      } catch (error) {
        console.error("Error al eliminar la cuenta o los datos del usuario:", error);
        alert("Ocurrió un error al intentar eliminar la cuenta. Por favor, inténtalo de nuevo.");
      }
    }
  } else {
    alert('No hay un usuario autenticado.');
  }
});

/* -- -------------------------------------------------------- -- */



/* -- Gestión otros: olvido de contraseña, inicio web -- */

// Función para enviar el correo de reseteo de contraseña
document.addEventListener('DOMContentLoaded', () => {
  function enviarCorreoResetPassword() {
    const email = document.getElementById('email').value; // Obtén el correo del input

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

// Inicio a la Web - Manejar el estado de autenticación
onAuthStateChanged(auth, user => {
  mostrarAuthModal()

  // const storedEmail = localStorage.getItem('userEmail');
  // if (storedEmail) {
  //   console.log('Usuario autenticado:', storedEmail);
  //   mostrarDialogoBienvenida(storedEmail);
  //   actualizarUIParaUsuarioAutenticado();
  //   loadFavoritesIndex();
  //   return;
  // } else {
  //   console.log('Ningún usuario autenticado');
  //   actualizarUIParaUsuarioNoAutenticado();
  //   return;
  // }

  if (user) {
    console.log('Usuario autenticado:', user.email);
    mostrarDialogoBienvenida(user.email);
    actualizarUIParaUsuarioAutenticado();
    loadFavoritesIndex(); 

  } else {
    console.log('Ningún usuario autenticado');
    actualizarUIParaUsuarioNoAutenticado();
  }
});

/* -- -------------------------------------------------------- -- */



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
function mostrarDialogoBienvenida(email) {
  const welcomeModal = document.getElementById('welcomeModal');
  const userName = email.split('@')[0]; // Toma el nombre de usuario antes del "@"
  const bienvenidaSessionShown = sessionStorage.getItem('bienvenidaShown');
  const bienvenidaLocalShown = localStorage.getItem('bienvenidaShown');
  
  if (bienvenidaLocalShown && !bienvenidaSessionShown) {
    console.log('Dar la bienvenida al usuario por volver.');
    document.getElementById('userName').innerText = userName;
    welcomeModal.style.display = 'block';
  }
  else if (!bienvenidaSessionShown && !bienvenidaLocalShown) {
    console.log('Dar la bienvenida al usuario.');
    document.getElementById('userName').innerText = userName;
    welcomeModal.style.display = 'block';
    sessionStorage.setItem('bienvenidaShown', 'true');
    localStorage.setItem('bienvenidaShown', 'true');
  }
  else {
    console.log('Ya se le dio la bienvenida al usuario.');
    return
  }
}

// Función para mostrar el modal de autenticación solo una vez por sesión
function mostrarAuthModal() {
  const authModal = document.getElementById('authModal');
  const modalShown = localStorage.getItem('authModalShown') || sessionStorage.getItem('authModalShown');

  // Verificar si hay un usuario autenticado
  if (auth.currentUser) {
    console.log('El usuario ya está autenticado, no mostrar el modal.');
    return;
  }

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

// Cerrar los modales al hacer clic en el botón de cierre
// Modal Sign UP
document.querySelector('#signUpModal .close-modal').addEventListener('click', () => {
  document.getElementById('signUpModal').style.display = 'none';
});

// Modal Sign IN
document.querySelector('#authModal .close-modal').addEventListener('click', () => {
  document.getElementById('authModal').style.display = 'none';
});

// Modal Welcome
document.querySelector('#welcomeModal .close-modal').addEventListener('click', () => {
  document.getElementById('welcomeModal').style.display = 'none';
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


/* -- Gestionar Favorites: verificar si se esta autenticado antes de redirigir a la pestaña de favorites -- */

// Verificar autenticación al hacer clic en "Favorites"
document.getElementById('favoritesLink').addEventListener('click', (event) => {
  event.preventDefault();

  // Verificar si el usuario está autenticado
  if (auth.currentUser) {
    // Si el usuario está autenticado, redirigir a favoritos
    window.location.href = 'favorites.html';
  } else {
    // Si el usuario no está autenticado, mostrar el modal de autenticación
    document.getElementById('authModal').style.display = 'block';
  }
});

/* -- -------------------------------------------------------- -- */