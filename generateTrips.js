document.addEventListener('DOMContentLoaded', function () {
  fetch('/viajes-blog/trips.json') // Ruta de tu archivo trips.json
    .then(response => response.json())
    .then(tripsData => {
      generateTrips(tripsData); // Llama a la función generateTrips pasando los datos del JSON
      loadFavorites();
    })
    .catch(error => console.error('Error al cargar los viajes:', error));
});

// Función para generar los viajes dinámicamente
function generateTrips(trips) {
const tripsContainer = document.querySelector('.main_trips');

trips.forEach(trip => {
    // Asigna automáticamente la imagen desde la carpeta, el nombre de la imagen debe coincidir con el id
    const imageUrl = `img/trips/${trip.id}.jpg`;

    // Estructura HTML de cada artículo
    const tripHtml = `
        <article>
            <img src="${imageUrl}" alt="${trip.name}">
            <h2>${trip.name}</h2>
            <a href="${trip.url}" class="read-more">Read More</a>
            <button class="fav-button" data-trip="${trip.id}" aria-label="Añadir a favoritos ${trip.name}" type="button">
                <i class="fa-solid fa-heart"></i>
            </button>
        </article>`;
    
    // Inserta el HTML generado en el contenedor
    tripsContainer.innerHTML += tripHtml;
});
}