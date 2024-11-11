// sidebar.js
export function loadSidebar() {
  return new Promise((resolve) => {
    document.addEventListener("DOMContentLoaded", function() {
      const sidebar = `
        <div id="sidebar" class="sidebar">
          <button class="hamburger" id="sidebarHamburger" aria-label="Abrir barra lateral" type="button">
            <i class="fas fa-bars"></i>
          </button>
          <button id="closeSidebar" class="close-btn" type="button">&times;</button>
          <ul>
            <!-- Contenido de la barra lateral se cargará aquí -->
          </ul>
        </div>
      `;
      document.getElementById("sidebar-placeholder").innerHTML = sidebar;
      
      // Resuelve la promesa después de que el sidebar esté en el DOM
      resolve();
    });
  });
}
