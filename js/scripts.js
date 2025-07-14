
let sesionActiva = false;

function agregarAlCarrito(boton) {
  const productoId = boton.getAttribute('data-product');
  let productos = JSON.parse(localStorage.getItem('productos')) || [];
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  const index = productos.findIndex(p => p.id === productoId);
  if (index === -1) {
    if (Notification.permission === "granted") {
      stock();
    } else {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          stock();
        }
      });
    }
    return;
  }


  let stockActual = parseInt(localStorage.getItem(`stock_${productoId}`));
  if (isNaN(stockActual)) stockActual = productos[index].cantidad;

  if (stockActual > 0) {
    stockActual -= 1;
    productos[index].cantidad = stockActual;


    const carritoIndex = carrito.findIndex(p => p.id === productoId);
    if (carritoIndex !== -1) {
      carrito[carritoIndex].cantidad += 1;
    } else {
      carrito.push({
        id: productos[index].id,
        nombre: productos[index].nombre,
        precio: productos[index].precio,
        imagen: productos[index].imagen,
        cantidad: 1
      });
    }

    localStorage.setItem('productos', JSON.stringify(productos));
    localStorage.setItem('carrito', JSON.stringify(carrito));
    localStorage.setItem(`stock_${productoId}`, stockActual);
    mostrarProductosFijos();
    mostraSegunTipo();
    cargarCarrito();
    actualizarContadorCarrito();
  } else {
    if (Notification.permission === "granted") {
      stock();
    } else {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          stock();
        }
      });
    }
  }
}
function stock() {
  new Notification("Error", {
    body: "No hay stock disponible.",
    icon: "../public/img/icono_error.png"
  });
}
function producto() {
  new Notification("Error", {
    body: "Producto no encontrado.",
    icon: "../public/img/icono_error.png"
  });
}

function cargarCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contenedor = document.getElementById("carrito");
  const subtotalElement = document.getElementById("subtotal");
  const ivaElement = document.getElementById("iva");
  const totalElement = document.getElementById("total");

  let subtotal = 0;

  if (contenedor) {
    contenedor.innerHTML = '';

    carrito.forEach((producto, index) => {
      const precioTotal = producto.precio * producto.cantidad;
      subtotal += precioTotal;

      const card = document.createElement("div");
      card.className = "col";
      card.innerHTML = `
        <div class="card h-100">
          <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
          <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">Cantidad: ${producto.cantidad}</p>
            <p class="card-text">Precio unitario: $${producto.precio}</p>
            <p class="card-text">Precio total: $${precioTotal.toFixed(2)}</p>
            <button class="btn btn-danger" onclick="eliminarDelCarrito(${index})">Eliminar uno</button>
          </div>
        </div>
      `;
      contenedor.appendChild(card);
    });

    const iva = subtotal * 0.15;
    const total = subtotal + iva;

    if (subtotalElement) subtotalElement.textContent = subtotal.toFixed(2);
    if (ivaElement) ivaElement.textContent = iva.toFixed(2);
    if (totalElement) totalElement.textContent = total.toFixed(2);
  }
}


function eliminarDelCarrito(index) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (index < 0 || index >= carrito.length) return;

  const productoEliminado = carrito[index];
  const productoId = productoEliminado.id;


  if (productoEliminado.cantidad > 1) {
    carrito[index].cantidad -= 1;
  } else {
    carrito.splice(index, 1);
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));


  let stockActual = parseInt(localStorage.getItem(`stock_${productoId}`));
  if (isNaN(stockActual)) {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    const producto = productos.find(p => p.id === productoId);
    stockActual = producto ? producto.cantidad : 0;
  }
  stockActual++;
  localStorage.setItem(`stock_${productoId}`, stockActual);

  let productos = JSON.parse(localStorage.getItem('productos')) || [];
  const idx = productos.findIndex(p => p.id === productoId);
  if (idx !== -1) {
    productos[idx].cantidad = stockActual;
    localStorage.setItem('productos', JSON.stringify(productos));
  }


  document.querySelectorAll(`.stock-${productoId}`).forEach(el => {
    el.textContent = `Stock: ${stockActual}`;
  });

  if (stockActual === 1) {
    document.querySelectorAll(`a.btn[data-product="${productoId}"]`).forEach(boton => {
      boton.classList.remove("disabled");
      boton.textContent = "Add to cart";
      boton.onclick = function () { agregarAlCarrito(this); };
    });
  }

  cargarCarrito();
  actualizarContadorCarrito();
}


function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contador = document.getElementById("cantidad_carrito");

  const cantidadTotal = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);

  if (contador) contador.textContent = cantidadTotal;
}






