// auth_modal.js
import { auth } from '../firebase_logic/firebase.js';

/* -- Gestionar modales: BIENVENIDA -- */
export function showWelcomeModal(email) {
    const welcomeModal = document.getElementById('welcomeModal');
    const userName = email.split('@')[0];
    const bienvenidaSessionShown = sessionStorage.getItem('bienvenidaShown');
    const bienvenidaLocalShown = localStorage.getItem('bienvenidaShown');
    
    if (bienvenidaLocalShown && !bienvenidaSessionShown) {
      console.log('Dar la bienvenida al usuario por volver.');
      document.getElementById('userName').innerText = userName;
      welcomeModal.style.display = 'block';
    } else if (!bienvenidaSessionShown && !bienvenidaLocalShown) {
      console.log('Dar la bienvenida al usuario.');
      document.getElementById('userName').innerText = userName;
      welcomeModal.style.display = 'block';
      sessionStorage.setItem('bienvenidaShown', 'true');
      localStorage.setItem('bienvenidaShown', 'true');
    } else {
      console.log('Ya se le dio la bienvenida al usuario.');
      return
    }
  }
  

  /* -- Gestionar modales: LOGGIN (Sign In) -- */
  export function showSingInhModal() {
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

  /* -- Gestionar modales: REGISTRO (Sign Up) -- */
  export function showSignUpModal(event) {
    event.preventDefault();
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('signUpModal').style.display = 'block';
  }

  
  /* -- Gestionar modales: cerrar modales -- */
  export function closeModals() {
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
  }
  