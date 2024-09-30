document.addEventListener('DOMContentLoaded', function () {
    fetch('/viajes-blog/trips.json')
      .then(response => response.json())
      .then(data => {
        data.sort((a, b) => {
          if (a.year === b.year) {
            return a.name.localeCompare(b.name);
          }
          return b.year - a.year;
        });

        const sidebar = document.querySelector('#sidebar ul');
        data.forEach(trip => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          
          // Construir la URL correctamente
          //const baseUrl = new URL(window.location.href).origin;
          const baseUrl = 'https://jaimescotta.github.io/viajes-blog/';
          //a.href = new URL(trip.url, baseUrl).href;
          a.href = baseUrl + trip.url;
          
          a.textContent = `${trip.name}`;
          li.appendChild(a);
          sidebar.appendChild(li);
        });
      })
      .catch(error => console.error('Error al cargar el archivo JSON:', error));
});