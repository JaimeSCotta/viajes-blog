document.addEventListener('DOMContentLoaded', function () {
    fetch('trips.json')
      .then(response => response.json())
      .then(data => {
        // Ordenar por año y luego por nombre
        data.sort((a, b) => {
          if (a.year === b.year) {
            return a.name.localeCompare(b.name);
          }
          return b.year - a.year; // Orden descendente por año
        });
  
        // Generar el menú
        const sidebar = document.querySelector('#sidebar ul');
        data.forEach(trip => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = trip.url;
          a.textContent = `${trip.name}`;
          li.appendChild(a);
          sidebar.appendChild(li);
        });
      })
      .catch(error => console.error('Error al cargar el archivo JSON:', error));
  });
  