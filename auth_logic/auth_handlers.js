// auth_handlers.js
import { auth, db } from 'firebase_logic/firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, deleteUser } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-auth.js";
import { deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';

/* -- Gestionar CERRAR sesión -- */
export function handleSignOut() {
  signOut(auth)
    .then(() => {
      localStorage.removeItem('userEmail');
      sessionStorage.removeItem('userEmail');
      localStorage.removeItem('authModalShown');
      sessionStorage.removeItem('authModalShown');
      localStorage.removeItem('bienvenidaShown');
      sessionStorage.removeItem('bienvenidaShown');
      console.log('Sesión cerrada');
      alert('Sesión cerrada correctamente');
      location.reload();
    })
    .catch(error => {
      console.error('Error al cerrar sesión:', error.message);
      alert('Error al cerrar sesión: ' + error.message);
    });
}

/* -- Gestionar INICIAR sesión -- */
export function handleSignIn(event) {
  event.preventDefault();
  const termsCheckbox = document.getElementById('terms');
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const rememberMe = document.querySelector('input[type="checkbox"]').checked;
  
  // Verificar si los términos están aceptados
  if (!termsCheckbox.checked) {
    event.preventDefault();
    alert('Debes aceptar los términos de uso y la política de privacidad para continuar.');
    return;
  }

  // Verificar si los campos de correo y contraseña están completos
  if (!email || !password) {
    alert('Por favor, completa tanto el correo electrónico como la contraseña.');
    return;
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
      document.getElementById('authModal').style.display = 'none';
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
}


/* -- Gestionar AGREGAR nuevo usuario -- */
export function handleSignUp(event) {
  event.preventDefault();
  const newEmail = document.getElementById('newEmail').value;
  const newPassword = document.getElementById('newPassword').value;

  if (!newEmail || !newPassword) {
    alert('Por favor, completa tanto el correo electrónico como la contraseña.');
    return;
  }

  createUserWithEmailAndPassword(auth, newEmail, newPassword)
    .then(userCredential => {
      console.log('Usuario registrado:', userCredential.user);
      alert('Usuario registrado correctamente');
      document.getElementById('signUpModal').style.display = 'none';
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
}


/* -- Gestionar ELIMINAR usuario -- */
export async function handleDeleteUser() {
  const user = auth.currentUser;

  if (user) {
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
}