let stream;
let correoUsuarioAEliminar = "";

function guardarUsuario() {
  const nombre = document.getElementById("txt_Nombre").value.trim();
  const apellido = document.getElementById("txt_apellido").value.trim();
  const email = document.getElementById("txt_email").value.trim().toLowerCase();
  const password = document.getElementById("txt_password").value;
  const idFotoUsuario = document.getElementById("foto_usuario").value;

  if (!nombre || !apellido || !email || !password || !idFotoUsuario) {

    if (Notification.permission === "granted") {
      completarCampos();
    } else {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          completarCampos();
        }
      });
    }
    return;
  }

  const adminEmails = [
    "ajtoapanta6@espe.edu.ec",
  ];

  if (adminEmails.includes(email)) {
    alert("Este correo ya está registrado.");
    if (Notification.permission === "granted") {
      correoregistrado();
    } else {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          correoregistrado();
        }
      });
    }
    return;
  }

  let personas = JSON.parse(localStorage.getItem("personas")) || [];

  if (personas.some(p => p.email === email)) {
    alert("Este correo ya está registrado.");
    return;
  }

  const persona = {
    nombre,
    apellido,
    email,
    password,
    tipo: "cliente",
    idFotoUsuario
  };

  personas.push(persona);
  localStorage.setItem("personas", JSON.stringify(personas));


  if (Notification.permission === "granted") {
    registro();
  } else {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        registro();
      }
    });
  }
  console.log(persona)
  deshabilitar_Camara();
  cargarPaginas('Login');
}
function completarCampos() {
  new Notification("Error", {
    body: "Complete todos los campos.",
    icon: "../public/img/icono_error.png"
  });
}
function correoregistrado() {
  new Notification("Error", {
    body: "Este correo ya esta utilizado.",
    icon: "../public/img/icono_error.png"
  });
}
function registro() {
  new Notification("Registro exitoso", {
    body: "Te has registrado correctamente. ¡Bienvenido!",
    icon: "../public/img/notification.jpg" // opcional
  });
}


function CerrarSesion() {
  sesionActiva = false;


  document.getElementById('btn_Login').style.display = 'inline-block';


  document.getElementById('li_admin_dropdown').style.display = 'none';

  document.getElementById('li_usuario_dropdown').style.display = 'none';


  if (typeof cargarPaginas === 'function') {
    cargarPaginas('index');
  }

}
function Login() {
  const emailInput = document.getElementById('txt_email_login');
  const passwordInput = document.getElementById('txt_password_login');
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;


  if (email === "ajtoapanta6@espe.edu.ec" && password === "12345") {
    sesionActiva = true;
    alert("Inicio de sesión como Administrador ");
    document.getElementById('btn_Login').style.display = 'none';
    document.getElementById('li_admin_dropdown').style.display = 'inline-block';
    cargarPaginas('index');
    return;
  }


  const personas = JSON.parse(localStorage.getItem("personas")) || [];
  const persona = personas.find(p => p.email === email && p.password === password);

  if (persona) {
    sesionActiva = true;
    alert(`Bienvenido, ${persona.nombre}`);
    localStorage.setItem("usuarioLogueado", JSON.stringify(persona));
    document.getElementById('btn_Login').style.display = 'none';


    const usuarioDropdown = document.getElementById('navbarDropdown_usuario');
    usuarioDropdown.style.display = 'inline-block';
    usuarioDropdown.textContent = persona.email;

    document.getElementById('li_usuario_dropdown').style.display = 'inline-block';
    cargarPaginas('index');
  } else {
    alert("Correo o contraseña incorrectos.");
    emailInput.value = '';
    passwordInput.value = '';
    emailInput.focus();
  }
}

function comprobarlogin() {
  if (sesionActiva) {
    cargarPaginas('facturacion');
  } else {
    console.log('Para poder pasar al pago, debe iniciar sesion');
    if (Notification.permission === "granted") {
      iniciar_sesion();
    } else {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          iniciar_sesion();
        }
      });
    }
  }
}

function  iniciar_sesion() {
  new Notification("Error", {
    body: "Para poder pasar al pago, debe iniciar sesion.",
    icon: "../public/img/icono_error.png"
  });
}

function habilitar_Camara() {
  document.getElementById('camara_foto').style.display = 'inline-block';
  document.getElementById('btn_hc').style.display = 'none';

  navigator.mediaDevices.getUserMedia({ video: true })
    .then(s => {
      stream = s;
      document.getElementById('my_camara').srcObject = stream;
    })
    .catch(error => {
      console.log(error);
    });
}

function deshabilitar_Camara() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    document.getElementById('my_camara').srcObject = null;
    document.getElementById('camara_foto').style.display = 'none';
    document.getElementById('btn_hc').style.display = 'inline-block';
  }
}

function tomarFoto() {
  const video = document.getElementById('my_camara');
  const canvas = document.getElementById('foto');
  const ctx = canvas.getContext('2d');

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  GuardarImagen(canvas);
}

function GuardarImagen(canvas) {
  try {
    const dataUrl = canvas.toDataURL('image/png');
    document.getElementById('foto_usuario').value = dataUrl;

    const personaLogueada = JSON.parse(localStorage.getItem('personaLogueada'));
    if (!personaLogueada) return;

    let personas = JSON.parse(localStorage.getItem('personas')) || [];
    const index = personas.findIndex(p => p.email === personaLogueada.email);
    if (index !== -1) {
      personas[index].foto = dataUrl;
      localStorage.setItem('personas', JSON.stringify(personas));

      personaLogueada.foto = dataUrl;
      localStorage.setItem('personaLogueada', JSON.stringify(personaLogueada));
    }
  } catch (e) {
    console.error('Error al convertir el canvas a Base64:', e);
  }
}

function mostrarUsuariosGuardados() {
  const contenedor = document.getElementById("usuarios-listado");
  if (!contenedor) return;

  let personas = JSON.parse(localStorage.getItem("personas"));
  if (!Array.isArray(personas)) personas = [];

  if (personas.length === 0) {
    contenedor.innerHTML = "<p>No hay usuarios registrados.</p>";
    return;
  }

  contenedor.innerHTML = personas.map((persona, index) => `
    <div class="col-md-4">
      <div class="card h-100">
        <img class="card-img-top" src="${persona.idFotoUsuario}" alt="Foto de ${persona.nombre}" />
        <div class="card-body text-center">
          <h5 class="fw-bold">${persona.nombre} ${persona.apellido}</h5>
          <p class="card-text">${persona.email}</p>
        </div>
        <div class="card-footer text-center">
          <button class="btn btn-danger btn-sm" onclick="abrirModalEliminarUsuario(this)">Eliminar usuario</button>
        </div>
      </div>
    </div>
  `).join("");
}
function buscarusuarios() {
  const criterio = document.getElementById('criterioBusquedaFactura').value;
  const valor = document.getElementById('valorBusquedaFactura').value.trim().toLowerCase();
  const contenedor = document.getElementById("usuarios-listado");

  let personas = JSON.parse(localStorage.getItem("personas"));
  if (!Array.isArray(personas)) personas = [];

  let resultados = personas.filter(p => {
    if (criterio === "nombre") return p.nombre.toLowerCase().includes(valor);
    if (criterio === "apellido") return p.apellido.toLowerCase().includes(valor);
    if (criterio === "email") return p.email.toLowerCase().includes(valor);
    return false;
  });

  if (resultados.length === 0) {
    alert("No se encontraron usuarios.");
    contenedor.innerHTML = "<p>No se encontraron usuarios.</p>";
    return;
  }

  contenedor.innerHTML = resultados.map((persona, index) => `
    <div class="col-md-4">
      <div class="card h-100">
        <img class="card-img-top" src="${persona.idFotoUsuario}" alt="Foto de ${persona.nombre}" />
        <div class="card-body text-center">
          <h5 class="fw-bold">${persona.nombre} ${persona.apellido}</h5>
          <p class="card-text">${persona.email}</p>
        </div>
        <div class="card-footer text-center">
          <button class="btn btn-danger btn-sm" onclick="abrirModalEliminarUsuario(this)">Eliminar usuario</button>
        </div>
      </div>
    </div>
  `).join("");
}


function limpiarBusquedausuarios() {
  document.getElementById('valorBusquedaFactura').value = "";
  mostrarUsuariosGuardados();
}

function abrirModalEliminarUsuario(boton) {
  const card = boton.closest('.card');
  const nombre = card.querySelector('h5.fw-bold').textContent;
  const correo = card.querySelector('p.card-text').textContent;

  document.getElementById('correoEliminarUsuario').value = correo;
  document.getElementById('mensajeEliminarUsuario').textContent = `¿Deseas eliminar al usuario "${nombre}" con correo: ${correo}?`;
  document.getElementById('modalEliminarUsuario').style.display = 'flex';
}

function cerrarModalEliminarUsuario() {
  document.getElementById('modalEliminarUsuario').style.display = 'none';
  document.getElementById('correoEliminarUsuario').value = '';
  document.getElementById('mensajeEliminarUsuario').textContent = '';
}

function eliminarUsuario() {
  const correo = document.getElementById('correoEliminarUsuario').value;
  if (!correo) {
    alert('Correo del usuario no válido.');
    return;
  }

  correoUsuarioAEliminar = correo;
  abrirModalConfirmacion();
}

function abrirModalConfirmacion() {
  document.getElementById('modalConfirmacionEliminar').style.display = 'flex';
}

function cerrarModalConfirmacion() {
  document.getElementById('modalConfirmacionEliminar').style.display = 'none';
}

function confirmarEliminarUsuario() {
  let personas = JSON.parse(localStorage.getItem('personas')) || [];
  const index = personas.findIndex(p => p.email === correoUsuarioAEliminar);

  if (index === -1) {
    alert('Usuario no encontrado.');
    cerrarModalConfirmacion();
    return;
  }

  personas.splice(index, 1);
  localStorage.setItem('personas', JSON.stringify(personas));

  cerrarModalConfirmacion();
  cerrarModalEliminarUsuario();
  alert('Usuario eliminado correctamente.');
  mostrarUsuariosGuardados();
}
