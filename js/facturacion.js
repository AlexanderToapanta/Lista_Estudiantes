let facturasFiltradas = null;

function verificarMetodoPago(selectElement) {
  const metodo = selectElement.value;


  const modalTarjeta = document.getElementById("tarjeta-modal");
  const modalTransferencia = document.getElementById("transferencia-modal");
  const paypalFrame = document.getElementById("paypal-frame");


  modalTarjeta.style.display = "none";
  modalTransferencia.style.display = "none";
  paypalFrame.style.display = "none";


  if (metodo === "tarjeta") {
    modalTarjeta.style.display = "block";
  } else if (metodo === "transferencia") {
    modalTransferencia.style.display = "block";
  } else if (metodo === "paypal") {
    paypalFrame.style.display = "block";
  }
}

function cerrarModalTarjeta() {
  document.getElementById("tarjeta-modal").style.display = "none";
}

function cerrarModalTransferencia() {
  document.getElementById("transferencia-modal").style.display = "none";
}

function cerrarModalTarjeta() {
  document.getElementById("tarjeta-modal").style.display = "none";
}

function realizarPago() {
  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const codigoPostal = document.getElementById('codigo-postal').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const latitud = document.getElementById('txt_Latitud').value.trim();
  const longitud = document.getElementById('txt_Longitud').value.trim();

  if (!nombre || !apellido || !codigoPostal || !telefono || !latitud || !longitud) {
    mostrarMensaje("Por favor, complete todos los campos, incluyendo la ubicación.");
    return;
  }

  const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
  if (!usuarioLogueado || !usuarioLogueado.email) {
    mostrarMensaje("No hay un usuario logueado.");
    return;
  }

  const email = usuarioLogueado.email;
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (carrito.length === 0) {
    mostrarMensaje("El carrito está vacío. Agrega productos antes de pagar.");
    return;
  }

  let facturas = JSON.parse(localStorage.getItem("facturas")) || [];
  const nuevoId = facturas.length > 0 ? facturas[facturas.length - 1].id + 1 : 1;

  const factura = {
    id: nuevoId,
    nombre,
    apellido,
    codigoPostal,
    telefono,
    email,
    latitud: parseFloat(latitud),
    longitud: parseFloat(longitud),
    fecha: new Date().toISOString(),
    productos: carrito
  };

  facturas.push(factura);
  localStorage.setItem("facturas", JSON.stringify(facturas));
  console.log("Factura guardada:", factura);

  if (Notification.permission === "granted") {
    crearPago();
  } else {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        crearPago();
      }
    });
  }

  localStorage.removeItem("carrito");
  cargarPaginas('index');
}

// Función para mostrar la notificación
function crearPago() {
  new Notification("Pago realizado", {
    body: "Tu pago se ha procesado correctamente. ¡Gracias por tu compra!",
    icon: "../public/img/notification.jpg" // opcional
  });
}


function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-ES');
}

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-ES');
}

function cargarFacturas() {
  const facturas = JSON.parse(localStorage.getItem('facturas')) || [];
  const contenedor = document.getElementById('facturas-listado');
  contenedor.innerHTML = '';

  if (facturas.length === 0) {
    contenedor.innerHTML = '<p>No se encontraron facturas.</p>';
    return;
  }

  facturas.forEach(factura => {
    const nombreCompleto = `${factura.nombre} ${factura.apellido}`;
    let subtotal = 0;

    const productosHTML = factura.productos && factura.productos.length > 0
      ? `<ul>${factura.productos.map(p => {
        const totalItem = p.precio * p.cantidad;
        subtotal += totalItem;
        return `<li>${p.nombre} — $${p.precio.toFixed(2)} × ${p.cantidad} = $${totalItem.toFixed(2)}</li>`;
      }).join('')}</ul>`
      : '<p>No hay productos registrados.</p>';

    const iva = subtotal * 0.15;
    const total = subtotal + iva;
    const mapaId = `map-${factura.id}`;

    const html = `
      <div class="compra-item mb-5">
        <div class="compra-header">
          <span class="compra-label">ID compra</span>
          <span class="compra-value">${factura.id}</span>
        </div>

        <div class="compra-row">
          <span class="compra-label">Fecha</span>
          <span class="compra-value">${formatearFecha(factura.fecha)}</span>
        </div>

        <div class="compra-row">
          <span class="compra-label">Nombre</span>
          <span class="compra-value">${nombreCompleto}</span>
        </div>

        <div class="compra-row">
          <span class="compra-label">Código postal</span>
          <span class="compra-value">${factura.codigoPostal}</span>
        </div>

        <div class="compra-row">
          <span class="compra-label">Teléfono</span>
          <span class="compra-value">${factura.telefono}</span>
        </div>

        <div class="compra-row">
          <span class="compra-label">Email</span>
          <span class="compra-value">${factura.email}</span>
        </div>

        <div class="compra-row">
          <span class="compra-label">Ubicación</span>
          <span class="compra-value">Lat: ${factura.latitud}, Long: ${factura.longitud}</span>
        </div>

        <div id="${mapaId}" style="height: 300px; margin: 10px 0;"></div>

        <div class="compra-row">
          <span class="compra-label">Productos comprados</span>
          <span class="compra-value">${productosHTML}</span>
        </div>

        <div class="compra-row" style="font-weight:bold;">
          <span class="compra-label">Subtotal</span>
          <span class="compra-value">$${subtotal.toFixed(2)}</span>
        </div>

        <div class="compra-row" style="font-weight:bold;">
          <span class="compra-label">IVA (15%)</span>
          <span class="compra-value">$${iva.toFixed(2)}</span>
        </div>

        <div class="compra-row" style="font-weight:bold;">
          <span class="compra-label">Total</span>
          <span class="compra-value">$${total.toFixed(2)}</span>
        </div>
      </div>
    `;

    contenedor.insertAdjacentHTML('beforeend', html);
  });


  facturas.forEach(factura => {
    Mapa(factura.id);
  });
}



function buscarFacturas() {
  const criterio = document.getElementById('criterioBusquedaFactura').value;
  const valor = document.getElementById('valorBusquedaFactura').value.trim().toLowerCase();
  const facturas = JSON.parse(localStorage.getItem('facturas')) || [];

  if (!valor) {
    mostrarMensaje("Por favor, ingrese un valor para buscar.");
    return;
  }

  facturasFiltradas = facturas.filter(factura => {
    const campo = factura[criterio]?.toString().toLowerCase();
    return campo && campo.includes(valor);
  });

  if (facturasFiltradas.length === 0) {
    mostrarMensaje("El producto que busca no existe.");
  }

  mostrarFacturas(facturasFiltradas);
}
function mostrarFacturas(facturas) {
  const contenedor = document.getElementById("facturas-listado");
  if (!contenedor) return;

  contenedor.innerHTML = '';

  if (facturas.length === 0) {
    contenedor.innerHTML = "<p>No se encontraron facturas.</p>";
    return;
  }

  facturas.forEach(factura => {
    const nombreCompleto = `${factura.nombre} ${factura.apellido}`;
    let subtotal = 0;

    const productosHTML = factura.productos && factura.productos.length > 0
      ? `<ul>${factura.productos.map(p => {
        const totalItem = p.precio * p.cantidad;
        subtotal += totalItem;
        return `<li>${p.nombre} — $${p.precio.toFixed(2)} × ${p.cantidad} = $${totalItem.toFixed(2)}</li>`;
      }).join('')}</ul>`
      : '<p>No hay productos registrados.</p>';

    const iva = subtotal * 0.15;
    const total = subtotal + iva;
    const mapaId = `map-${factura.id}`;

    const html = `
      <div class="compra-item mb-5">
        <div class="compra-header">
          <span class="compra-label">ID compra</span>
          <span class="compra-value">${factura.id}</span>
        </div>

        <div class="compra-row">
          <span class="compra-label">Fecha</span>
          <span class="compra-value">${formatearFecha(factura.fecha)}</span>
        </div>

        <div class="compra-row">
          <span class="compra-label">Nombre</span>
          <span class="compra-value">${nombreCompleto}</span>
        </div>

        <div class="compra-row">
          <span class="compra-label">Código postal</span>
          <span class="compra-value">${factura.codigoPostal}</span>
        </div>

        <div class="compra-row">
          <span class="compra-label">Teléfono</span>
          <span class="compra-value">${factura.telefono}</span>
        </div>

        <div class="compra-row">
          <span class="compra-label">Email</span>
          <span class="compra-value">${factura.email}</span>
        </div>

        <div class="compra-row">
          <span class="compra-label">Ubicación</span>
          <span class="compra-value">Lat: ${factura.latitud}, Long: ${factura.longitud}</span>
        </div>

        <div id="${mapaId}" style="height: 300px; margin: 10px 0;"></div>

        <div class="compra-row">
          <span class="compra-label">Productos comprados</span>
          <span class="compra-value">${productosHTML}</span>
        </div>

        <div class="compra-row" style="font-weight:bold;">
          <span class="compra-label">Subtotal</span>
          <span class="compra-value">$${subtotal.toFixed(2)}</span>
        </div>

        <div class="compra-row" style="font-weight:bold;">
          <span class="compra-label">IVA (15%)</span>
          <span class="compra-value">$${iva.toFixed(2)}</span>
        </div>

        <div class="compra-row" style="font-weight:bold;">
          <span class="compra-label">Total</span>
          <span class="compra-value">$${total.toFixed(2)}</span>
        </div>
      </div>
    `;

    contenedor.insertAdjacentHTML('beforeend', html);
  });


  facturas.forEach(factura => {
    Mapa(factura.id);
  });
}



function limpiarBusquedaFacturas() {
  document.getElementById('valorBusquedaFactura').value = "";
  facturasFiltradas = null;
  mostrarFacturas(JSON.parse(localStorage.getItem('facturas')) || []);
}

function exportar() {
  const modal = document.getElementById('modal-exportar');
  if (modal) {
    modal.style.display = 'block';
  }
}

function cerrarModal() {
  const modal = document.getElementById('modal-exportar');
  if (modal) {
    modal.style.display = 'none';
  }
}

function exportarFacturas(formato) {
  const facturas = facturasFiltradas || JSON.parse(localStorage.getItem('facturas')) || [];

  if (facturas.length === 0) {
    mostrarMensaje("No hay facturas para exportar.");
    return;
  }

  if (formato === 'pdf') {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) return mostrarMensaje("jsPDF no está disponible.");
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Listado de Facturas", 10, 10);
    let y = 20;
    facturas.forEach((f, i) => {
      const total = (f.productos || []).reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
      doc.text(`ID: ${f.id}`, 10, y);
      doc.text(`Nombre: ${f.nombre} ${f.apellido}`, 10, y + 6);
      doc.text(`Email: ${f.email}`, 10, y + 12);
      doc.text(`Fecha: ${new Date(f.fecha).toLocaleDateString()}`, 10, y + 18);
      doc.text(`Total: $${total.toFixed(2)}`, 10, y + 24);
      y += 36;
      if (y > 270 && i < facturas.length - 1) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save("facturas.pdf");

  } else if (formato === 'excel') {
    let csv = "ID,Nombre,Apellido,Email,Fecha,Total\n";
    facturas.forEach(f => {
      const total = (f.productos || []).reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
      csv += `${f.id},${f.nombre},${f.apellido},${f.email},${new Date(f.fecha).toLocaleDateString()},${total.toFixed(2)}\n`;
    });
    descargarArchivo(new Blob([csv], { type: "text/csv" }), "facturas.csv");

  } else if (formato === 'word') {
    let html = "<h1>Listado de Facturas</h1>";
    facturas.forEach(f => {
      const total = (f.productos || []).reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
      html += `
        <h3>Factura ID: ${f.id}</h3>
        <p><strong>Nombre:</strong> ${f.nombre} ${f.apellido}</p>
        <p><strong>Email:</strong> ${f.email}</p>
        <p><strong>Fecha:</strong> ${new Date(f.fecha).toLocaleDateString()}</p>
        <p><strong>Total:</strong> $${total.toFixed(2)}</p>
        <hr>`;
    });
    descargarArchivo(new Blob([html], { type: "application/msword" }), "facturas.doc");
  }

  cerrarModal();
}


function descargarArchivo(blob, nombreArchivo) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = nombreArchivo;
  link.click();
}

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
    mostrarMensaje('No soporta la geolocation api');
  }
}

function Mapa(id) {
  const facturas = JSON.parse(localStorage.getItem('facturas')) || [];
  const factura = facturas.find(f => f.id === id);

  if (!factura) {
    mostrarMensaje('Factura no encontrada');
    return;
  }

  const latitud = parseFloat(factura.latitud);
  const longitud = parseFloat(factura.longitud);

  const mapaId = `map-${id}`;
  const contenedor = document.getElementById(mapaId);

  if (!contenedor) {
    console.warn(`Contenedor con ID '${mapaId}' no encontrado.`);
    return;
  }

  contenedor.innerHTML = '';

  const map = L.map(mapaId).setView([latitud, longitud], 13);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  L.marker([latitud, longitud])
    .addTo(map)
    .bindPopup(`Ubicación de ${factura.nombre} ${factura.apellido}`)
    .openPopup();
}

function mostrarMensaje(texto, tipo = "info") {
  const contenedor = document.getElementById("mensajes");

  const colores = {
    info: "#007bff",
    success: "#28a745",
    warning: "#ffc107",
    danger: "#dc3545"
  };

  const card = document.createElement("div");
  card.style.background = colores[tipo] || colores.info;
  card.style.color = "#fff";
  card.style.padding = "10px 15px";
  card.style.marginTop = "10px";
  card.style.borderRadius = "5px";
  card.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
  card.style.minWidth = "250px";
  card.innerHTML = `
    <strong>${texto}</strong>
    <span style="float:right; cursor:pointer;" onclick="this.parentElement.remove()">&times;</span>
  `;

  contenedor.appendChild(card);

  // Desaparece a los 5 segundos
  setTimeout(() => {
    card.remove();
  }, 5000);
}
