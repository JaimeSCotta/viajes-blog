// Función para alternar favorito
function toggleFavorite(button) {
    const trip = button.getAttribute('data-trip');
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.includes(trip)) {
        // Si ya es favorito, lo quitamos
        favorites = favorites.filter(fav => fav !== trip);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        button.classList.remove('active');
    } else {
        // Si no es favorito, lo añadimos
        favorites.push(trip);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        button.classList.add('active');
    }
}

// Función para cargar los favoritos al iniciar la página
function loadFavorites() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const buttons = document.querySelectorAll('.fav-button');

    buttons.forEach(button => {
        const trip = button.getAttribute('data-trip');
        if (favorites.includes(trip)) {
            button.classList.add('active');
        }
    });
}

// Agregar evento a los botones de favorito
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.fav-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => toggleFavorite(button));
    });

    // Cargar los favoritos en la página
    loadFavorites();
});