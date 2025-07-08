function Localizacion() {
    let geolocation = navigator.geolocation;
    if (geolocation) {
        geolocation.getCurrentPosition(function (posiciones) {
            let latitud = posiciones.coords.latitude;
            let longitud = posiciones.coords.longitude;
            document.getElementById('txt_Latitud').value = latitud;
            document.getElementById('txt_Longitud').value = longitud;

            latitud = parseFloat(latitud);
            longitud = parseFloat(longitud);

            var map = L.map('map').setView([latitud, longitud], 13);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            L.marker([latitud, longitud])
                .addTo(map)
                .bindPopup('Su ubicación actual es')
                .openPopup();

        });
    } else {
        alert('No soporta la geolocation api')
    }
}

function Mapa(id) {
    const estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];
    const estudiante = estudiantes.find(e => e.id === id);

    if (!estudiante) {
        alert('Estudiante no encontrado');
        return;
    }

    const latitud = parseFloat(estudiante.latitud);
    const longitud = parseFloat(estudiante.longitud);

    const mapaId = `map-${id}`;
    const contenedor = document.getElementById(mapaId);

    if (!contenedor) {
        console.warn(`Contenedor con ID '${mapaId}' no encontrado.`);
        return;
    }

    contenedor.innerHTML = ''; // Limpia contenido previo

    const map = L.map(mapaId).setView([latitud, longitud], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.marker([latitud, longitud])
        .addTo(map)
        .bindPopup(`Ubicación de ${estudiante.nombre} ${estudiante.apellido}`)
        .openPopup();
}


