// sidebar.js
const sidebar = document.getElementById("sidebar");
const openBtn = document.getElementById("openSidebar");
const closeBtn = document.getElementById("closeSidebar");

// Alternar la barra lateral al hacer clic en la hamburguesa
openBtn.addEventListener("click", function() {
    sidebar.classList.toggle("open");
});

// Cerrar la barra lateral al hacer clic en la "X"
closeBtn.addEventListener("click", function() {
    sidebar.classList.remove("open");
    openBtn.style.display = "block";
});

  