let facturasFiltradas = null;
function verificarMetodoPago(selectElement) {
  const metodo = selectElement.value;
  const modal = document.getElementById("tarjeta-modal");

  if (metodo === "tarjeta") {
    modal.style.display = "block";
  } else {
    modal.style.display = "none";
  }
}

function cerrarModalTarjeta() {
  document.getElementById("tarjeta-modal").style.display = "none";
}

function realizarPago() {
  // Obtener valores del formulario
  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const codigoPostal = document.getElementById('codigo-postal').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const telefono = document.getElementById('telefono').value.trim();

  if (!nombre || !apellido || !codigoPostal || !direccion || !telefono) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  // Obtener el email del usuario logueado
  const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));
  if (!usuarioLogueado || !usuarioLogueado.email) {
    alert("No hay un usuario logueado.");
    return;
  }
  const email = usuarioLogueado.email;

  // Obtener carrito actual
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (carrito.length === 0) {
    alert("El carrito está vacío. Agrega productos antes de pagar.");
    return;
  }

  // Obtener facturas previas o crear array vacío
  let facturas = JSON.parse(localStorage.getItem("facturas")) || [];

  // Crear nuevo id (1 si no hay facturas, o el último +1)
  const nuevoId = facturas.length > 0 ? facturas[facturas.length - 1].id + 1 : 1;

  // Crear objeto factura con carrito incluido
  const factura = {
    id: nuevoId,
    nombre,
    apellido,
    codigoPostal,
    direccion,
    telefono,
    email,
    fecha: new Date().toISOString(),
    productos: carrito // Agrego el carrito como propiedad "productos"
  };

  // Guardar factura en localStorage
  facturas.push(factura);
  localStorage.setItem("facturas", JSON.stringify(facturas));

  alert("Pago realizado con éxito. Factura ID: " + nuevoId);
  console.log("Factura guardada:", factura);

  // Opcional: Vaciar carrito después del pago
  localStorage.removeItem("carrito");

  // Aquí podrías limpiar el formulario o redirigir, etc.
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
    const nombreCompleto = factura.nombre + ' ' + factura.apellido;

    // Generar lista de productos y calcular total
    let totalCompra = 0;
    const productosHTML = factura.productos && factura.productos.length > 0
      ? `<ul>
          ${factura.productos.map(p => {
            const subtotal = p.precio * p.cantidad;
            totalCompra += subtotal;
            return `<li>${p.nombre} — $${p.precio.toFixed(2)} × ${p.cantidad} = $${subtotal.toFixed(2)}</li>`;
          }).join('')}
         </ul>`
      : '<p>No hay productos registrados.</p>';

    const html = `
      <div class="compra-item">
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
          <span class="compra-label">Dirección</span>
          <span class="compra-value">${factura.direccion}</span>
        </div>

        <div class="compra-row">
          <span class="compra-label">Email</span>
          <span class="compra-value">${factura.email}</span>
        </div>

        <div class="compra-row">
          <span class="compra-label">Productos comprados</span>
          <span class="compra-value">${productosHTML}</span>
        </div>

        <div class="compra-row" style="font-weight:bold; margin-top:8px;">
          <span class="compra-label">Total compra</span>
          <span class="compra-value">$${totalCompra.toFixed(2)}</span>
        </div>
      </div>
    `;

    contenedor.insertAdjacentHTML('beforeend', html);
  });
}



   function buscarFacturas() {
  const criterio = document.getElementById('criterioBusquedaFactura').value;
  const valor = document.getElementById('valorBusquedaFactura').value.trim().toLowerCase();
  const facturas = JSON.parse(localStorage.getItem('facturas')) || [];

  if (!valor) {
    alert("Por favor, ingrese un valor para buscar.");
    return;
  }

  facturasFiltradas = facturas.filter(factura => {
    const campo = factura[criterio]?.toString().toLowerCase();
    return campo && campo.includes(valor);
  });

  if (facturasFiltradas.length === 0) {
    alert("El producto que busca no existe.");
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
    let totalCompra = 0;

    const productosHTML = factura.productos && factura.productos.length > 0
      ? `<ul>${factura.productos.map(p => {
          const subtotal = p.precio * p.cantidad;
          totalCompra += subtotal;
          return `<li>${p.nombre} — $${p.precio.toFixed(2)} × ${p.cantidad} = $${subtotal.toFixed(2)}</li>`;
        }).join('')}</ul>`
      : '<p>No hay productos registrados.</p>';

    const html = `
      <div class="compra-item">
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
          <span class="compra-label">Dirección</span>
          <span class="compra-value">${factura.direccion}</span>
        </div>

        <div class="compra-row">
          <span class="compra-label">Email</span>
          <span class="compra-value">${factura.email}</span>
        </div>

        <div class="compra-row">
          <span class="compra-label">Productos comprados</span>
          <span class="compra-value">${productosHTML}</span>
        </div>

        <div class="compra-row" style="font-weight:bold; margin-top:8px;">
          <span class="compra-label">Total compra</span>
          <span class="compra-value">$${totalCompra.toFixed(2)}</span>
        </div>
      </div>
    `;

    contenedor.insertAdjacentHTML('beforeend', html);
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
    alert("No hay facturas para exportar.");
    return;
  }

  if (formato === 'pdf') {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) return alert("jsPDF no está disponible.");
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
