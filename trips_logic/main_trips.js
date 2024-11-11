// main_trips.js
import '../auth_logic/auth_main.js';
import '../favorites_logic/favorites_main.js';
import { generateMenu, setupSidebar } from '../menu_logic/menu_main.js';

document.addEventListener("DOMContentLoaded", function() {
    generateMenu();
    setupSidebar();
});