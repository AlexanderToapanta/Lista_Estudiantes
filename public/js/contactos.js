function validarNombre(input) {
  const mensaje = document.getElementById("ms_name");
  const valor = input.value.trim();

  if (valor.length < 5) {
    mensaje.textContent = "Debe tener al menos 5 caracteres.";
    mensaje.style.color = "red";
  } else {
    mensaje.textContent = "Correcto";
    mensaje.style.color = "green";
  }
}
function validarEmail(input) {
  const mensaje = document.getElementById("ms_email");
  const valor = input.value.trim();
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

   if (!regex.test(valor)) {
    mensaje.textContent = "Formato inválido.";
    mensaje.style.color = "red";
  } else {
    mensaje.textContent = "Correcto";
    mensaje.style.color = "green";
  }
}
function validarTelefono(input) {
  const mensaje = document.getElementById("ms_phone");
  const valor = input.value.trim();
  const regex = /^\d{10}$/;

   if (!regex.test(valor)) {
    mensaje.textContent = "Debe tener exactamente 10 números.";
    mensaje.style.color = "red";
  } else {
    mensaje.textContent = "Correcto";
    mensaje.style.color = "green";
  }
}

function validarMensaje(input) {
  const mensaje = document.getElementById("ms_message");
  const valor = input.value.trim();

   if (valor.length < 10) {
    mensaje.textContent = "Debe tener al menos 10 caracteres.";
    mensaje.style.color = "red";
  } else {
    mensaje.textContent = "Correcto";
    mensaje.style.color = "green";
  }
}



function mostrarNotificacion() {
  let boton = document.getElementById("submitButton");
  if (boton) {
    boton.addEventListener("click", () => {
      const nombre = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const telefono = document.getElementById("phone").value.trim();
      const mensaje = document.getElementById("message").value.trim();

      const camposllenos = nombre && email && telefono && mensaje;

      if (!("Notification" in window)) {
        alert("Este navegador no soporta notificaciones.");
        return;
      }
      if (camposllenos) {
        Notification.permission === "granted"
          ? crearNotificacion()
          : solicitarPermiso();
      } else {
        Notification.permission === "granted"
          ? crearNotificacionError()
          : solicitarPermisoError();
      }
    });
  }
}


async function solicitarPermiso() {
  const respuesta = await Notification.requestPermission();
  if (respuesta === "granted") {
    crearNotificacion();
  }

}

async function solicitarPermisoError() {
  const respuesta = await Notification.requestPermission();
  if (respuesta === "granted") {
    crearNotificacionError();
  }
}

function crearNotificacion() {
  const notification = new Notification('Enviado', {
    body: 'Tu mensaje ha sido enviado correctamente.',
    icon: '../public/img/notification.jpg'

  });
}

function crearNotificacionError() {
  new Notification("Error", {
    body: "Por favor completa todos los campos antes de enviar.",
    icon: "../public/img/icono_error.png",
  });
}

