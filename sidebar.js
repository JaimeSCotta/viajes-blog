// sidebar.js

// Abrir y cerrar el sidebar con el botón de hamburguesa en el header
const openSidebarBtn = document.getElementById('openSidebar');
const closeSidebarBtn = document.getElementById('closeSidebar');
const sidebar = document.getElementById('sidebar');

openSidebarBtn.addEventListener('click', function() {
  sidebar.classList.add('active');
});

closeSidebarBtn.addEventListener('click', function() {
  sidebar.classList.remove('active');
});

// Abrir y cerrar el sidebar con el botón de hamburguesa dentro del sidebar
const sidebarHamburgerBtn = document.getElementById('sidebarHamburger');
sidebarHamburgerBtn.addEventListener('click', function() {
  sidebar.classList.toggle('active');
});

  