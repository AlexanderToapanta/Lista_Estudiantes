let sesionActiva = false;
function Registro( event) {
    event.preventDefault();
    let email = document.getElementById('txt_email_Registro').value.trim();
    let password = document.getElementById('txt_password_Registro').value.trim();
    let nombre = document.getElementById('txt_Nombre_Registro').value.trim();
    let apellido = document.getElementById('txt_apellido_Registro').value.trim();
    let fecha = document.getElementById('fecha').value;
    let correo_prueb = localStorage.getItem('correo_p');
    let latitud = document.getElementById('txt_Latitud').value;
    let longitud = document.getElementById('txt_Longitud').value;
    let foto = document.getElementById('foto_estudiante').value;
    const codigoPais = document.getElementById("codigo_pais").value;
  const telefono = document.getElementById("telefono").value.trim();
    let anio = document.getElementById('select_anio').value;

    let genero = document.querySelector('input[name="genero"]:checked');

    if (!email || !nombre || !apellido || !password || !fecha || !foto || !latitud || !longitud || !telefono || !codigo_pais || !anio) {
        alert('Por favor, completa todos los campos requeridos.');
        return;
    }

    if (!genero) {
        alert('Por favor, selecciona un género.');
        return;
    }

    if (email === correo_prueb) {
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
            }
        };
    });

    let estudiante = {
        nombre,
        apellido,
        email,
        password,
        fechaNacimiento: fecha,
        latitud,
        longitud,
        foto,
        telefono : numeroCompleto,
        genero: generoSeleccionado,
        año: anio,
        materias,
        promedio: null
    };

    let estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];
    estudiantes.push(estudiante);
    localStorage.setItem('estudiantes', JSON.stringify(estudiantes));

    deshabilitar_Camara();
    document.getElementById('foto_estudiante').value = '';
    document.getElementById("registroModalBody").textContent = "Registro exitoso!";
    const modal = new bootstrap.Modal(document.getElementById("registroModal"));
    modal.show();
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
    usuarioDropdown.textContent = estudiante.nombre;

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