// main_favorites.js
import './auth_logic/auth_main.js';
import {loadFavorites} from './favorites_logic/favorites_main.js';
import { generateMenu, setupSidebar } from './menu_logic/menu_main.js';

loadFavorites();
generateMenu();
setupSidebar();