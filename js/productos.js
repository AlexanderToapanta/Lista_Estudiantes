let idProductoSeleccionado = null;
let productoAEliminar = null;
const productos = {};
function abrirModalProducto() {
  document.getElementById('modalProducto').style.display = 'flex';
}

function cerrarModalProducto() {
  document.getElementById('modalProducto').style.display = 'none';
  document.getElementById('nombreProducto').value = '';
  document.getElementById('cantidadProducto').value = '';
  document.getElementById('precioProducto').value = '';
  document.getElementById('tipoProducto').value = '';
  document.getElementById('imagenProducto').value = '';
}

function imagenA64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

function generarIdUnico() {
  let productos = JSON.parse(localStorage.getItem('productos')) || [];
  if (productos.length === 0) return '1';
  const maxId = Math.max(...productos.map(p => parseInt(p.id)));
  return (maxId + 1).toString();
}

async function guardarProducto() {
  const nombre = document.getElementById('nombreProducto').value.trim();
  const cantidad = parseInt(document.getElementById('cantidadProducto').value);
  const precio = parseFloat(document.getElementById('precioProducto').value);
  const tipoRaw = document.getElementById('tipoProducto').value;
  const tipo = tipoRaw.trim().toLowerCase();

  console.log("Valor bruto tipo:", tipoRaw);
  console.log("Tipo procesado (id esperado):", tipo);

  const file = document.getElementById('imagenProducto').files[0];

  if (!nombre || isNaN(cantidad) || cantidad < 0 || isNaN(precio) || precio < 0 || !tipo || !file) {
    if (Notification.permission === "granted") {
      completar_campos();
    } else {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          completar_campos();
        }
      });
    } return;
  }


  try {
    const imagenBase64 = await imagenA64(file);

    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    if (!Array.isArray(productos)) productos = [];

    const nuevoId = productos.length > 0
      ? (Math.max(...productos.map(p => parseInt(p.id))) + 1).toString()
      : '1';

    const nuevoProducto = {
      id: nuevoId,
      nombre,
      cantidad,
      precio,
      tipo,
      imagen: imagenBase64
    };

    productos.push(nuevoProducto);
    localStorage.setItem('productos', JSON.stringify(productos));

    cerrarModalProducto();
    if (Notification.permission === "granted") {
      agregado_correctamente();
    } else {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          agregado_correctamente();
        }
      });
    }
    console.log('Producto guardado en localStorage:', nuevoProducto);


    if (typeof mostraSegunTipo === "function") {
      mostraSegunTipo();
    }
    mostrarProductosGuardados();

  } catch (err) {
    console.error('Error al convertir imagen:', err);
    if (Notification.permission === "granted") {
      error_guardar_producto();
    } else {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          error_guardar_producto();
        }
      });
    }
  }
}

function completar_campos() {
  new Notification("Error", {
    body: "Por favor, completa todos los campos requeridos.",
    icon: "../public/img/icono_error.png" // opcional
  });
}
function agregado_correctamente() {
  new Notification("Producto agregado", {
    body: "El producto se ha agregado correctamente.",
    icon: "../public/img/notification.jpg" // opcional
  });
}
function error_guardar_producto() {
  new Notification("Error", {
    body: "Error al guardar el producto.",
    icon: "../public/img/icono_error.png" // opcional
  });
}





function mostrarProductosGuardados() {
  console.log("Cargando productos desde localStorage");

  const contenedor = document.getElementById("contenedor-productos-dinamicos");
  if (!contenedor) return;

  let productos = JSON.parse(localStorage.getItem("productos"));
  if (!Array.isArray(productos)) productos = [];

  console.log("Productos recuperados:", productos);

  if (productos.length === 0) {
    contenedor.innerHTML = "<p>No hay productos para mostrar.</p>";
    return;
  }

  contenedor.innerHTML = productos.map(producto => `
        <div class="col-md-5">
            <div class="card h-100" id="${producto.id}">
                <img class="card-img-top" src="${producto.imagen}" alt="${producto.nombre}" />
                <div class="card-body p-4">
                    <div class="text-center">
                        <h5 class="fw-bolder">${producto.nombre}</h5>
                        <p class="card-text">ID: ${producto.id}</p>
                        <p class="card-text">$${producto.precio}</p>
                        <p class="card-text stock-${producto.id}" id="stock_${producto.id}">Stock: ${producto.cantidad}</p>
                        <p class="card-text">Tipo: ${producto.tipo}</p>
                    </div>
                </div>
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center">
                    <button class="btn btn-outline-primary btn-sm" onclick="abrirModalActualizarProducto(this)">Actualizar</button>
                    <br><br>
                    <button class="btn btn-outline-danger btn-sm " onclick="abrirModalEliminarProducto(this)">Eliminar producto</button>
                    </div>
                </div>
            </div>
        </div>
    `).join("");
}

function mostraSegunTipo() {
  const productos = JSON.parse(localStorage.getItem("productos")) || [];


  const tiposUnicos = [...new Set(productos.map(p => p.tipo.toLowerCase().replace(/\s+/g, "")))];

  tiposUnicos.forEach(tipoId => {
    const seccion = document.querySelector(`section#${tipoId} .row`);
    if (seccion) {
      seccion.innerHTML = '';
    }
  });

  productos.forEach(producto => {
    const tipoId = producto.tipo.toLowerCase().replace(/\s+/g, "");
    const seccion = document.querySelector(`section#${tipoId} .row`);

    if (seccion) {
      const card = document.createElement("div");
      card.className = "col-md-4";
      card.innerHTML = `
        <div class="card h-100">
          <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" />
          <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text stock-${producto.id}" id="stock_${producto.id}">Stock: ${producto.cantidad}</p>
            <p class="card-text">$${producto.precio}</p>
          </div>
          <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
            <div class="text-center">
              <a class="btn btn-outline-dark mt-auto" data-product="${producto.id}" 
                 onclick="agregarAlCarrito(this)" ${producto.cantidad === 0 ? "class='disabled' onclick='return false'" : ""}>
                 ${producto.cantidad === 0 ? "Sin stock" : "Add to cart"}
              </a>
            </div>
          </div>
        </div>
      `;
      seccion.appendChild(card);
    } else {
      console.warn(`No se encontró la sección para tipo: ${producto.tipo} (id buscado: ${tipoId})`);
    }
  });
}


function abrirModalEliminarProducto(boton) {
  const card = boton.closest('.card');
  const id = card.id;
  const nombre = card.querySelector('h5.fw-bolder').textContent;

  document.getElementById('idEliminarProducto').value = id;
  document.getElementById('mensajeEliminarProducto').textContent = `¿Deseas eliminar el producto "${nombre}" (ID: ${id})?`;
  document.getElementById('modalEliminarProducto').style.display = 'flex';
}

function cerrarModalEliminarProducto() {
  document.getElementById('modalEliminarProducto').style.display = 'none';
  document.getElementById('idEliminarProducto').value = '';
  document.getElementById('mensajeEliminarProducto').textContent = '';
}

function eliminarProducto() {
  const id = document.getElementById('idEliminarProducto').value;
  if (!id) {
    if (Notification.permission === "granted") {
      id_invalido();
    } else {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          id_invalido();
        }
      });
    }
    return;
  }

  idProductoAEliminar = id;
  abrirModalConfirmacion();
}

function id_invalido() {
  new Notification("Error", {
    body: "Error al guardar el producto.",
    icon: "../public/img/icono_error.png" // opcional
  });
}

function abrirModalConfirmacion() {
  document.getElementById('modalConfirmacionEliminar').style.display = 'flex';
}

function cerrarModalConfirmacion() {
  document.getElementById('modalConfirmacionEliminar').style.display = 'none';
}

function confirmarEliminarProducto() {
  let productos = JSON.parse(localStorage.getItem('productos')) || [];
  const index = productos.findIndex(p => p.id === idProductoAEliminar);

  if (index === -1) {
    if (Notification.permission === "granted") {
      producto_no_encontrado();
    } else {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          producto_no_encontrado();
        }
      });
      cerrarModalConfirmacion();
      return;
    }

    productos.splice(index, 1);
    localStorage.setItem('productos', JSON.stringify(productos));

    cerrarModalConfirmacion();
    cerrarModalEliminarProducto();
    if (Notification.permission === "granted") {
      producto_eliminado();
    } else {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          producto_eliminado();
        }
      });

      if (typeof mostraSegunTipo === "function") {
        mostraSegunTipo();
      }
    }
  }
}
function producto_eliminado() {
  new Notification("Producto eliminado", {
    body: "El producto se ha eliminado correctamente.",
    icon: "../public/img/notification.jpg" // opcional
  });
}
function producto_no_encontrado() {
  new Notification("Error", {
    body: "Producto no encontrado.",
    icon: "../public/img/icono_error.png" // opcional
  });
}
function abrirModalActualizarProducto(boton) {
  const card = boton.closest(".card");
  const idProducto = card.id;

  const productos = JSON.parse(localStorage.getItem("productos")) || [];
  const producto = productos.find(p => p.id === idProducto);

  if (!producto) {
    if (Notification.permission === "granted") {
      producto_no_encontrado();
    } else {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          producto_no_encontrado();
        }
      });
    }
    return;
  }


  idProductoSeleccionado = idProducto;


  document.getElementById('nombreActualizarProducto').value = producto.nombre;
  document.getElementById('cantidadActualizarProducto').value = producto.cantidad;
  document.getElementById('precioActualizarProducto').value = producto.precio;
  document.getElementById('tipoActualizarProducto').value = producto.tipo.toLowerCase();


  document.getElementById('modalActualizarProducto').style.display = 'flex';
}
function cerrarModalActualizarProducto() {
  document.getElementById('modalActualizarProducto').style.display = 'none';
  document.getElementById('nombreActualizarProducto').value = '';
  document.getElementById('cantidadActualizarProducto').value = '';
  document.getElementById('precioActualizarProducto').value = '';
  document.getElementById('tipoActualizarProducto').value = '';
}

async function actualizarProducto(boton) {
  if (!idProductoSeleccionado) {
    if (Notification.permission === "granted") {
      id_invalido();
    } else {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          id_invalido();
        }
      });
    }
    return;
  }

  const nombreActualizar = document.getElementById('nombreActualizarProducto').value.trim();
  const cantidadActualizar = parseInt(document.getElementById('cantidadActualizarProducto').value);
  const precioActualizar = parseFloat(document.getElementById('precioActualizarProducto').value);
  const tipoActualizar = document.getElementById('tipoActualizarProducto').value.trim().toLowerCase();
  const file = document.getElementById('imagenActualizarProducto').files[0];

  if (!nombreActualizar || isNaN(cantidadActualizar) || cantidadActualizar < 0 || isNaN(precioActualizar) || precioActualizar < 0 || !tipoActualizar) {
    if (Notification.permission === "granted") {
      completar_campos();
    } else {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          completar_campos();
        }
      });
    }
    return;
  }

  let productos = JSON.parse(localStorage.getItem('productos')) || [];
  const index = productos.findIndex(p => p.id === idProductoSeleccionado);

  if (index === -1) {
    if (Notification.permission === "granted") {
      producto_no_encontrado();
    } else {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          producto_no_encontrado();
        }
      });
    }
    return;
  }

  productos[index].nombre = nombreActualizar;
  productos[index].cantidad = cantidadActualizar;
  productos[index].precio = precioActualizar;
  productos[index].tipo = tipoActualizar;

  if (file) {
    try {
      productos[index].imagen = await imagenA64(file);
    } catch (err) {
      console.error('Error al convertir imagen:', err);
      if (Notification.permission === "granted") {
        error_guardar_producto();
      } else {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            error_guardar_producto();
          }
        });
      }
      return;
    }
  }

  localStorage.setItem('productos', JSON.stringify(productos));

  cerrarModalActualizarProducto();
  if (Notification.permission === "granted") {
    producto_actualizado();
  } else {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        producto_actualizado();
      }
    });

    if (typeof mostraSegunTipo === "function") {
      mostraSegunTipo();
    }

    if (typeof mostrarProductosGuardados === "function") {
      mostrarProductosGuardados();
    }
  }
}
function producto_actualizado() {
  new Notification("Producto actualizado", {
    body: "El producto se ha actualizado correctamente.",
    icon: "../public/img/notification.jpg" // opcional
  });
}


  function buscarProducto() {
    const criterio = document.getElementById('criterioBusqueda').value;
    const valor = document.getElementById('valorBusqueda').value.trim().toLowerCase();
    const contenedor = document.getElementById("contenedor-productos-dinamicos");

    let productos = JSON.parse(localStorage.getItem("productos"));
    if (!Array.isArray(productos)) productos = [];

    let resultados = [];

    if (criterio === "id") {
      resultados = productos.filter(p => p.id.toLowerCase() === valor);
    } else if (criterio === "nombre") {
      resultados = productos.filter(p => p.nombre.toLowerCase().includes(valor));
    } else if (criterio === "tipo") {
      resultados = productos.filter(p => p.tipo.toLowerCase() === valor);
    }

    if (resultados.length === 0) {
      if (Notification.permission === "granted") {
        producto_no_encontrado();
      } else {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            producto_no_encontrado();
          }
        });
      }
      contenedor.innerHTML = "<p>No se encontraron productos.</p>";
      return;
    }

    contenedor.innerHTML = resultados.map(producto => `
    <div class="col-md-5">
      <div class="card h-100" id="${producto.id}">
        <img class="card-img-top" src="${producto.imagen}" alt="${producto.nombre}" />
        <div class="card-body p-4">
          <div class="text-center">
            <h5 class="fw-bolder">${producto.nombre}</h5>
            <p class="card-text">ID: ${producto.id}</p>
            <p class="card-text">$${producto.precio}</p>
            <p class="card-text stock-${producto.id}" id="stock_${producto.id}">Stock: ${producto.cantidad}</p>
            <p class="card-text">Tipo: ${producto.tipo}</p>
          </div>
        </div>
        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
          <div class="text-center">
            <a class="btn btn-primary" onclick="abrirModalEliminarProducto(this)">Eliminar producto</a>
            <br><br>
            <a class="btn btn-primary" onclick="abrirModalActualizarProducto(this)">Actualizar</a>
          </div>
        </div>
      </div>
    </div>
  `).join("");
  }

  function mostrarProductosFijos() {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    if (productos.length === 0) return;

    const seleccionados = productos.slice(0, 4);

    const contenedor = document.getElementById("productosDestacados");
    contenedor.innerHTML = "";

    seleccionados.forEach(producto => {
      const card = document.createElement("div");
      card.className = "col-md-3 mb-4";
      card.innerHTML = `
      <div class="card h-100">
        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" />
        <div class="card-body">
          <h5 class="card-title">${producto.nombre}</h5>
          <p class="card-text stock-${producto.id}" id="stock_${producto.id}">Stock: ${producto.cantidad}</p>
          <p class="card-text">$${producto.precio}</p>
        </div>
        <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
          <div class="text-center">
            <a class="btn btn-outline-dark mt-auto" data-product="${producto.id}" 
              onclick="agregarAlCarrito(this)" ${producto.cantidad === 0 ? "class='disabled' onclick='return false'" : ""}>
              ${producto.cantidad === 0 ? "Sin stock" : "Add to cart"}
            </a>
          </div>
        </div>
      </div>
    `;
      contenedor.appendChild(card);
    });
  }



