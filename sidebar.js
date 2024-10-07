// sidebar.js
const sidebar = document.getElementById("sidebar");
const openBtn = document.getElementById("openSidebar");
const closeBtn = document.getElementById("closeSidebar");

// Alternar la barra lateral al hacer clic en la hamburguesa
openBtn.addEventListener("click", function() {
    sidebar.classList.toggle("open");
    
    // Siempre mostrar ambos botones cuando la barra lateral esté abierta
    openBtn.style.display = "block"; // Asegúrate de que el botón hamburguesa siga visible
    closeBtn.style.display = "block"; // Asegúrate de que el botón cerrar (X) también esté visible
});

// Cerrar la barra lateral al hacer clic en la "X"
closeBtn.addEventListener("click", function() {
    sidebar.classList.remove("open");
    
    // Mantener el botón de hamburguesa visible
    openBtn.style.display = "block"; 
});
