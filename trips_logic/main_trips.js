// main_trips.js
import '../auth_logic/auth_main.js';
import '../favorites_logic/favorites_main.js';
import { loadSidebar } from '../html_utils/sidebar.js';
import { generateMenu, setupSidebar } from '../menu_logic/menu_main.js';

document.addEventListener("DOMContentLoaded", async function() {
    await loadSidebar();  // Espera a que el sidebar se cargue
    generateMenu();       // Carga el menú una vez que el sidebar esté en el DOM
    setupSidebar();       // Configura los eventos del sidebar
});
