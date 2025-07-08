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

function Mapa() {
    let estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];
    let email = document.getElementById('email_usuer').textContent.trim().toLowerCase();

    let estudiante = estudiantes.find(e => e.email.toLowerCase() === email);

    if (!estudiante) {
        alert('Estudiante no encontrado');
        return;
    }

    let latitud = parseFloat(estudiante.latitud);
    let longitud = parseFloat(estudiante.longitud);

    var map = L.map('map').setView([latitud, longitud], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.marker([latitud, longitud])
        .addTo(map)
        .bindPopup('Su ubicación actual es')
        .openPopup();
}
