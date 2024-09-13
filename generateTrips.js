document.addEventListener('DOMContentLoaded', function () {
    fetch('/viajes-blog/trips.json')
      .then(response => response.json())
      .then(data => {
        // Selecciona el contenedor donde se añadirán los viajes
        const tripsContainer = document.querySelector('.main_trips');

        // Recorre cada entrada del JSON para crear los artículos
        data.forEach(trip => {
          // Crea un nuevo artículo para cada viaje
          const article = document.createElement('article');

          // Estructura del artículo con la información del JSON
          article.innerHTML = `
            <img src="./img/PXL_20240827_184443432.jpg" alt="${trip.name} ${trip.year}">
            <h2>${trip.name} ${trip.year}</h2>
            <a href="./${trip.url}" class="read-more">Read More</a>
            <button class="fav-button" data-trip="${trip.name.replace(/\s/g, '_')}_${trip.year}" 
                    aria-label="Añadir a favoritos ${trip.name} ${trip.year}" type="button">
              <i class="fa-solid fa-heart"></i>
            </button>
          `;

          // Añade el artículo generado al contenedor de los viajes
          tripsContainer.appendChild(article);
        });
      })
      .catch(error => console.error('Error al cargar los viajes:', error));
});
