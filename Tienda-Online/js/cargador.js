fetch("menu.html")
  .then(res => res.text())
  .then(data => document.getElementById("menu").innerHTML = data);

fetch("footer.html")
  .then(res => res.text())
  .then(data => document.getElementById("footer").innerHTML = data);

fetch("./paginas/index.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("contenido").innerHTML = data;
  });

function cargarPaginas(url_pagina) {
  fetch(`paginas/${url_pagina}.html`)
    .then(res => res.text())
    .then(data => {
      document.getElementById("contenido").innerHTML = data;

      setTimeout(() => {
        if (url_pagina === "carrito" && typeof cargarCarrito === "function") {
          cargarCarrito();
        } else if (url_pagina === "index" && typeof mostrarProductosGuardados === "function") {
            mostrarProductosAleatorios();
        } else if (url_pagina === "Todoslosproductos" && typeof mostraSegunTipo === "function") {
          mostraSegunTipo();
        } else if (url_pagina === "inventario" && typeof mostrarProductosGuardados === "function") {
          mostrarProductosGuardados();
        } else if (url_pagina === "inventario" && typeof inicializarStocks === "function") {
          mostrarProductosGuardados();
        } else if (url_pagina === "facturas" && typeof cargarFacturas === "function") {
          cargarFacturas();  
        }
      }, 100);
    });
}

window.onload = () => cargarPaginas("index");

