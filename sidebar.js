// sidebar.js
const sidebar = document.getElementById("sidebar");
const openBtn = document.getElementById("openSidebar");
const closeBtn = document.getElementById("closeSidebar");

// Alternar la barra lateral al hacer clic en la hamburguesa
openBtn.addEventListener("click", function() {
    sidebar.classList.toggle("open");

    // Si la barra lateral está abierta, mostrar el botón de cerrar y ocultar el de hamburguesa
    if (sidebar.classList.contains("open")) {
        openBtn.style.display = "none"; // Ocultar botón hamburguesa
        closeBtn.style.display = "block"; // Mostrar botón cerrar (X)
    }
});

// Cerrar la barra lateral al hacer clic en la "X"
closeBtn.addEventListener("click", function() {
    sidebar.classList.remove("open");
    
    openBtn.style.display = "block"; // Mostrar botón hamburguesa
    closeBtn.style.display = "none"; // Ocultar botón cerrar (X)
}); 