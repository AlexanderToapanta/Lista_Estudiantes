let sesionActiva = false;
function Registro(event) {
    event.preventDefault();

    let email = document.getElementById('txt_email_Registro').value.trim();
    let password = document.getElementById('txt_password_Registro').value.trim();
    let nombre = document.getElementById('txt_Nombre_Registro').value.trim();
    let apellido = document.getElementById('txt_apellido_Registro').value.trim();
    let fecha = document.getElementById('fecha').value;
    let cedula = document.getElementById('txt_cedula').value.trim();
    let latitud = document.getElementById('txt_Latitud').value;
    let longitud = document.getElementById('txt_Longitud').value;
    let foto = document.getElementById('foto_estudiante').value;
    const codigoPais = document.getElementById("codigo_pais").value;
    const telefono = document.getElementById("telefono").value.trim();
    let anio = document.getElementById('select_anio').value;
    let genero = document.querySelector('input[name="genero"]:checked');

    if (!email || !nombre || !apellido || !password || !fecha || !foto || !latitud || !longitud || !telefono || !codigoPais || !anio || !cedula) {
        alert('Por favor, completa todos los campos requeridos.');
        return;
    }

    if (!genero) {
        alert('Por favor, selecciona un género.');
        return;
    }

    if (!validarCedula(cedula)) {
        alert('Cédula inválida');
        return;
    }

    let estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];
    if (estudiantes.some(e => e.cedula === cedula)) {
        alert('La cédula ya está registrada');
        return;
    }
    if (estudiantes.some(e => e.email === email)) {
        alert('El correo ya está registrado');
        return;
    } 
    if (email === "ajtoapanta6@espe.edu.ec") {
        alert('Correo ya ingresado');
        return;
    }

    const numeroCompleto = `${codigoPais}${telefono}`;
    let generoSeleccionado = genero.value;

    let materiasBase = [
        "Lengua y Literatura",
        "Matemáticas",
        "Física",
        "Biología",
        "Química",
        "Emprendimiento",
        "Participación Estudiantil",
        "Educación Física",
        "Educación Artística"
    ];

    let materias = {};
    materiasBase.forEach(nombre => {
        materias[nombre] = {
            notas: {
                primerParcial: [],
                segundoParcial: [],
                tercerParcial: []
             },
            promedio: 0
        };
    });

    let contadorId = parseInt(localStorage.getItem  ('contador_estudiantes')) || 1;

    let estudiante = {
        id: contadorId,
        nombre,
        apellido,
        cedula,
        email,
        password,
        fechaNacimiento: fecha,
        latitud,
        longitud,
        foto,
        telefono: numeroCompleto,
        genero: generoSeleccionado,
        año: anio,
        materias,
    };

    estudiantes.push(estudiante);
    localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
    localStorage.setItem('contador_estudiantes', contadorId + 1);

    deshabilitar_Camara();
    document.getElementById('foto_estudiante').value = '';
      console.log('Producto guardado en localStorage:', estudiante);
    document.getElementById("registroModalBody").textContent = "Registro exitoso!";
    const modal = new bootstrap.Modal(document.getElementById("registroModal"));
    modal.show();
}
function validarCedula(cedula) {
    if (cedula.length !== 10 || isNaN(cedula)) return false;
    let digitos = cedula.split('').map(Number);
    let provincia = parseInt(cedula.substring(0, 2));
    if (provincia < 1 || provincia > 24) return false;

    let suma = 0;
    for (let i = 0; i < 9; i++) {
        let mult = (i % 2 === 0) ? 2 : 1;
        let res = digitos[i] * mult;
        if (res > 9) res -= 9;
        suma += res;
    }
    let verificador = (10 - (suma % 10)) % 10;
    return verificador === digitos[9];
}


function Login(event) {
  event.preventDefault();

  const emailInput = document.getElementById('inputEmail');
  const passwordInput = document.getElementById('inputPassword');
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  if (email === "ajtoapanta6@espe.edu.ec" && password === "12345") {
    sesionActiva = true;
    alert("Inicio de sesión como Administrador");
    document.getElementById('btn_Login').style.display = 'none';
    document.getElementById('li_admin_dropdown').style.display = 'inline-block';
    cargarPaginas('index');
    return;
  }

  const estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
  const estudiante = estudiantes.find(e => e.email === email && e.password === password);

  if (estudiante) {
    sesionActiva = true;
    alert(`Bienvenido, ${estudiante.nombre}`);
    localStorage.setItem("usuarioLogueado", JSON.stringify(estudiante));
    document.getElementById('btn_Login').style.display = 'none';

    const usuarioDropdown = document.getElementById('navbarDropdown_usuario');
    usuarioDropdown.style.display = 'inline-block';
    usuarioDropdown.textContent = estudiante.email;

    document.getElementById('li_usuario_dropdown').style.display = 'inline-block';
    cargarPaginas('index');
  } else {
    alert("Correo o contraseña incorrectos.");
    emailInput.value = '';
    passwordInput.value = '';
    emailInput.focus();
  }
}

function cerrarSesion() {
  sesionActiva = false;
  localStorage.removeItem("usuarioLogueado");
  document.getElementById('btn_Login').style.display = 'inline-block';
  document.getElementById('li_usuario_dropdown').style.display = 'none';
  document.getElementById('li_admin_dropdown').style.display = 'none';
  cargarPaginas('index');
}