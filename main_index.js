// main_index.js
import './auth_logic/auth_main.js';
import './favorites_logic/favorites_main.js';
import { generateTrips, generateMenu, setupSidebar } from './menu_logic/menu_main.js';

generateTrips();
generateMenu();
setupSidebar();
