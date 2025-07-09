

function guardarUsuario() {
  const nombre = document.getElementById("txt_Nombre").value.trim();
  const apellido = document.getElementById("txt_apellido").value.trim();
  const email = document.getElementById("txt_email").value.trim().toLowerCase();
  const password = document.getElementById("txt_password").value;

  if (!nombre || !apellido || !email || !password) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  const adminEmails = [
    "ajtoapanta6@espe.edu.ec",
  ];

  // Verificar si el email pertenece a uno reservado
  if (adminEmails.includes(email)) {
    alert("Este correo ya está registrado.");
    return;
  }

  let personas = JSON.parse(localStorage.getItem("personas")) || [];

  // Validar si el email ya existe entre los usuarios registrados
  if (personas.some(p => p.email === email)) {
    alert("Este correo ya está registrado.");
    return;
  }

  const persona = {
    nombre,
    apellido,
    email,
    password,
    tipo: "cliente"
  };

  personas.push(persona);
  localStorage.setItem("personas", JSON.stringify(personas));

  alert("Registro exitoso. Ahora puede iniciar sesión.");
  cargarPaginas('Login');
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

  // Admin quemado
 /*  if (email === "alexandertoapanata05@gmail.com" && password === "12346") {
    sesionActiva = true;
    alert("Inicio de sesión como Administrador General");
    document.getElementById('btn_Login').style.display = 'none';
    document.getElementById('btn_usuario').style.display = 'inline-block';
    cargarPaginas('index');
    return;
  } */

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
  usuarioDropdown.textContent = persona.nombre;    

  document.getElementById('li_usuario_dropdown').style.display = 'inline-block';
  cargarPaginas('index');
} else {
  alert("Correo o contraseña incorrectos.");
  emailInput.value = '';
  passwordInput.value = '';
  emailInput.focus();
}
}
