// menu.js
export function generateMenu() {
  document.addEventListener('DOMContentLoaded', function () {
    const checkSidebar = setInterval(() => {
      const sidebarList = document.querySelector('#sidebar ul');
      if (sidebarList) {
        clearInterval(checkSidebar);
        
        fetch('/viajes-blog/trips_logic/trips.json')
          .then(response => response.json())
          .then(data => {
            data.sort((a, b) => {
              if (a.year === b.year) {
                return a.name.localeCompare(b.name);
              }
              return b.year - a.year;
            });

            data.forEach(trip => {
              const li = document.createElement('li');
              const a = document.createElement('a');
              
              const baseUrl = 'https://jaimescotta.github.io/viajes-blog/';
              a.href = baseUrl + trip.url;
              a.textContent = `${trip.name}`;
              li.appendChild(a);
              sidebarList.appendChild(li);
            });
          })
          .catch(error => console.error('Error al cargar el archivo JSON:', error));
      }
    }, 100); // Comprueba cada 100 ms hasta que sidebar ul esté disponible
  });
}