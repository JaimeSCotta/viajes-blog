// modals.js
document.addEventListener("DOMContentLoaded", function() {
  const modalsHTML = `
    <!-- Modal de bienvenida -->
    <div id="welcomeModal" class="modal">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>Bienvenido, <span id="userName"></span>!</h2>
        <p>Estamos felices de tenerte de vuelta.</p>
      </div>
    </div>

    <!-- Modal para Login -->
    <div id="authModal" class="modal">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>Login</h2>

        <div id="login-banner" class="banner-message">
          <p>Want to use favorites functionality? Sign in down here! Nevertheless, you can continue your visit without login but with limited functions.</p>
        </div>
        <div class="input-icon">
          <i class="fa fa-envelope"></i>
          <input type="email" id="email" placeholder="Email ID" required>
        </div>

        <div class="input-icon">
          <i class="fa fa-lock"></i>
          <input type="password" id="password" placeholder="Password" required>
        </div>

        <div class="checkbox-container remember-checkbox">
          <label><input type="checkbox"> Remember me</label>
          <a href="#" id="forgot-password" class="forgot-password">Forgot Password?</a>
        </div>

        <button id="signInBtn">Sign In</button>
        <p class="signup-link">Not registered? <a href="#" id="signUpBtn">Sign Up!</a></p>

        <div class="checkbox-policy-container">
          <label class="custom-checkbox">
            <input type="checkbox" id="terms" name="terms" required>
            <span class="checkmark"></span>
            Acepto los <a href="terms_and_privacy/terminos_uso.html" id="terminosLink">términos de uso</a> y la <a href="terms_and_privacy/politica_privacidad.html" id="privacidadLink">política de privacidad</a>
          </label>
        </div>
      </div>
    </div>

    <!-- Modal para Sign Up -->
    <div id="signUpModal" class="modal">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h2>Sign Up</h2>

        <div class="input-icon">
          <i class="fa fa-envelope"></i>
          <input type="email" id="newEmail" placeholder="New Email ID" required>
        </div>

        <div class="input-icon">
          <i class="fa fa-lock"></i>
          <input type="password" id="newPassword" placeholder="New Password" required>
        </div>

        <button id="registerBtn">Register</button>
      </div>
    </div>
  `;

  // Insertar el HTML de los modales en un contenedor específico
  document.getElementById('modals-placeholder').innerHTML = modalsHTML;
});

// Función para abrir un modal
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "block";
  }
}

// Función para cerrar un modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
  }
}

// Añadir eventos para cerrar los modales cuando se hace clic en el botón de cierre
document.querySelectorAll('.close-modal').forEach(btn => {
  btn.addEventListener('click', function() {
    closeModal(btn.closest('.modal').id);
  });
});

// Cerrar el modal si el usuario hace clic fuera de la ventana del modal
window.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal')) {
    closeModal(event.target.id);
  }
});

// Hacer que las funciones estén disponibles globalmente
window.openModal = openModal;
window.closeModal = closeModal;