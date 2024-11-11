// sidebar.js

import { generateMenu } from '../menu_logic/menu_main.js';

document.addEventListener("DOMContentLoaded", function() {
  const sidebar = `
    <!-- Barra lateral izquierda con todos los viajes -->
    <div id="sidebar" class="sidebar">
      <button class="hamburger" id="sidebarHamburger" aria-label="Abrir barra lateral" type="button">
        <i class="fas fa-bars"></i>
      </button>
      <button id="closeSidebar" class="close-btn" type="button">&times;</button>
      <ul>
        <!-- Contenido de la barra lateral -->
      </ul>
    </div>
  `;
  document.getElementById("sidebar-placeholder").innerHTML = sidebar;
  generateMenu();
});