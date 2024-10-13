// sidebar.js

// Abrir y cerrar el sidebar con el botón de hamburguesa en el header
const openSidebarBtn = document.getElementById('openSidebar');
const closeSidebarBtn = document.getElementById('closeSidebar');
const sidebar = document.getElementById('sidebar');

openSidebarBtn.addEventListener('click', function() {
  sidebar.classList.add('open');
});

closeSidebarBtn.addEventListener('click', function() {
  sidebar.classList.remove('open');
});

// Abrir y cerrar el sidebar con el botón de hamburguesa dentro del sidebar
const sidebarHamburgerBtn = document.getElementById('sidebarHamburger');
sidebarHamburgerBtn.addEventListener('click', function() {
  sidebar.classList.toggle('open');
});

// Abrir el modal de ajustes
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeModal = document.querySelector('.close-modal');

settingsBtn.addEventListener('click', function() {
  settingsModal.style.display = 'block';

  // Aquí puedes llenar la información del perfil del usuario
  document.getElementById('userProfileName').textContent = 'John Doe'; 
  document.getElementById('userProfileEmail').textContent = 'johndoe@example.com';

closeModal.addEventListener('click', function() {
  settingsModal.style.display = 'none';
});
});

// Cerrar el modal cuando se hace clic fuera del contenido del modal
window.addEventListener('click', function(event) {
  if (event.target == settingsModal) {
    settingsModal.style.display = 'none';
  }
});