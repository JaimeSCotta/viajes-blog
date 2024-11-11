// header.js
document.addEventListener("DOMContentLoaded", function() {
const header = `
    <header class="site-header-trips">
      <div class="wrapper site-header__wrapper">
        <!-- Botón de hamburguesa -->
        <div class="nav-left">
          <button class="hamburger" id="openSidebar" aria-label="Abrir barra lateral" type="button">
            <i class="fas fa-bars"></i>
          </button>
        </div>
        <!-- Navegación principal (centrada) -->
        <nav class="nav nav-center">
          <ul>
            <li><a href="https://jaimescotta.github.io/viajes-blog/">Home</a></li>
            <li><a href="#" id="favoritesLink">Favorites</a></li>
          </ul>
        </nav>
        <!-- Imagen de "Sign In" -->
        <div class="auth-container">
          <img id="loginIcon" src="img/sign_in.png" alt="Login" class="login-icon">
          <div id="dropdownMenu" class="dropdown" style="display: none;">
            <p id="userNameDropdown">Nombre Usuario</p>
            <button id="logoutBtn">
              <i class="fas fa-sign-out-alt"></i> Sign out
            </button>
            <button id="deleteUserBtn" class="delete-account-btn">
              <i class="fas fa-user-times"></i> Delete account
            </button>
          </div>
        </div>
      </div>
    </header>
  `;
  document.getElementById("header-placeholder").innerHTML = header;
});