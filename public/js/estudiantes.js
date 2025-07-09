function mostrarEstudiantesGuardados() {
    document.getElementById("valorBusqueda").value=" "
    console.log("Cargando estudiantes desde localStorage");

    const contenedor = document.getElementById("contenedor-estudiantes-dinamicos");
    if (!contenedor) return;

    let estudiantes = JSON.parse(localStorage.getItem("estudiantes"));
    if (!Array.isArray(estudiantes)) estudiantes = [];

    console.log("Estudiantes recuperados:", estudiantes);

    if (estudiantes.length === 0) {
        contenedor.innerHTML = "<p>No hay estudiantes para mostrar.</p>";
        return;
    }

    contenedor.innerHTML = estudiantes.map(est => {
        let materiasHtml = "";

        if (est.materias && typeof est.materias === 'object') {
            for (let nombre in est.materias) {
                const materia = est.materias[nombre];
                const notas = materia.notas || {};
                const promedio = calcularPromedioNotas(notas);
                materiasHtml += `<li><strong>${nombre}:</strong> ${promedio.toFixed(2)}</li>`;
            }
        }

        return `
            <div class="col-md-4 mb-4">
                <div class="card h-100" id="estudiante-${est.id}">
                    <img src="${est.foto}" class="card-img-top" alt="${est.nombre} ${est.apellido}" />
                    <div class="card-body">
                        <h5 class="card-title text-center">${est.nombre} ${est.apellido}</h5>
                        <p class="card-text"><strong>ID:</strong> ${est.id}</p>
                        <p class="card-text"><strong>Cédula:</strong> ${est.cedula || 'No registrada'}</p>
                        <p class="card-text"><strong>Email:</strong> ${est.email}</p>
                        <p class="card-text"><strong>Teléfono:</strong> ${est.telefono}</p>
                        <p class="card-text"><strong>Género:</strong> ${est.genero}</p>
                        <p class="card-text"><strong>Fecha de nacimiento:</strong> ${est.fechaNacimiento}</p>
                        <p class="card-text"><strong>Año:</strong> ${est.año}</p>
                        <div id="map-${est.id}" style="height: 200px;" class="my-3"></div>
                        <p class="card-text"><strong>Materias y Promedios:</strong></p>
                        <ul>${materiasHtml}</ul>
                    </div>
                    <div class="card-footer text-center">
                        <button class="btn btn-outline-primary btn-sm" onclick="Ingresar_Notas(${est.id})">Ingresar Notas</button>
                        <button class="btn btn-outline-danger btn-sm" onclick="eliminarEstudiante(${est.id})">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    estudiantes.forEach(est => Mapa(est.id));
}


function calcularPromedioNotas(notas) {
    const todosLosParciales = [
        ...(notas.primerParcial || []),
        ...(notas.segundoParcial || []),
        ...(notas.tercerParcial || [])
    ];

    if (todosLosParciales.length === 0) return 0;

    const suma = todosLosParciales.reduce((acc, nota) => acc + parseFloat(nota), 0);
    return suma / todosLosParciales.length;
}

function mostrarEstudiantes(estudiantes) {
  const contenedor = document.getElementById("contenedor-estudiantes-dinamicos");
  if (!contenedor) return;

  if (estudiantes.length === 0) {
    contenedor.innerHTML = "<p>No hay estudiantes para mostrar.</p>";
    return;
  }

  contenedor.innerHTML = estudiantes.map(est => {
    let materiasHtml = "";
    if (est.materias && typeof est.materias === 'object') {
      for (let nombre in est.materias) {
        const materia = est.materias[nombre];
        const notas = materia.notas || {};
        const promedio = calcularPromedioNotas(notas);
        materiasHtml += `<li><strong>${nombre}:</strong> ${promedio.toFixed(2)}</li>`;
      }
    }

    return `
      <div class="col-md-4 mb-4">
        <div class="card h-100" id="estudiante-${est.id}">
          <img src="${est.foto}" class="card-img-top" alt="${est.nombre} ${est.apellido}" />
          <div class="card-body">
            <h5 class="card-title text-center">${est.nombre} ${est.apellido}</h5>
            <p class="card-text"><strong>ID:</strong> ${est.id}</p>
            <p class="card-text"><strong>Cédula:</strong> ${est.cedula || 'No registrada'}</p>
            <p class="card-text"><strong>Email:</strong> ${est.email}</p>
            <p class="card-text"><strong>Teléfono:</strong> ${est.telefono}</p>
            <p class="card-text"><strong>Género:</strong> ${est.genero}</p>
            <p class="card-text"><strong>Fecha de nacimiento:</strong> ${est.fechaNacimiento}</p>
            <p class="card-text"><strong>Año:</strong> ${est.año}</p>
            <div id="map-${est.id}" style="height: 200px;" class="my-3"></div>
            <p class="card-text"><strong>Materias y Promedios:</strong></p>
            <ul>${materiasHtml}</ul>
          </div>
          <div class="card-footer text-center">
            <button class="btn btn-outline-primary btn-sm" onclick="Ingresar_Notas(${est.id})">Ingresar Notas</button>
            <button class="btn btn-outline-danger btn-sm" onclick="eliminarEstudiante(${est.id})">Eliminar</button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  estudiantes.forEach(est => Mapa(est.id));
}

function buscar_estudiante() {
  const criterio = document.getElementById('criterioBusqueda').value;
  const valor = document.getElementById('valorBusqueda').value.trim().toLowerCase();

  let estudiantes = JSON.parse(localStorage.getItem("estudiantes"));
  if (!Array.isArray(estudiantes)) estudiantes = [];

  let resultados = [];

  if (criterio === "id") {
    resultados = estudiantes.filter(e => e.id.toString() === valor);
  } else if (criterio === "nombre") {
    resultados = estudiantes.filter(e => e.nombre.toLowerCase().includes(valor));
  } else if (criterio === "apellido") {
    resultados = estudiantes.filter(e => e.apellido.toLowerCase().includes(valor));
  } else if (criterio === "cedula") {
    resultados = estudiantes.filter(e => e.cedula.toLowerCase() === valor);
  } else if (criterio === "email") {
    resultados = estudiantes.filter(e => e.email.toLowerCase() === valor);
  } else if (criterio === "anio") {
    resultados = estudiantes.filter(e => e.año.toLowerCase() === valor);
  }

  if (resultados.length === 0) {
    alert("El estudiante que busca no existe.");
    document.getElementById("contenedor-estudiantes-dinamicos").innerHTML = "<p>No se encontraron estudiantes.</p>";
    return;
  }

  mostrarEstudiantes(resultados);
}

let estudianteSeleccionadoId = null;

function Ingresar_Notas(idEstudiante) {
  estudianteSeleccionadoId = idEstudiante;
  document.getElementById('materiaNombre').value = '';
  document.getElementById('nota1').value = '';
  document.getElementById('nota2').value = '';
  document.getElementById('nota3').value = '';
  document.getElementById('modalNotas').style.display = 'flex';
}

function cerrarModalNotas() {
  document.getElementById('modalNotas').style.display = 'none';
}

function guardarNotasParaEstudiante() {
  const materia = document.getElementById('materiaNombre').value.trim();
  const nota1 = parseFloat(document.getElementById('nota1').value);
  const nota2 = parseFloat(document.getElementById('nota2').value);
  const nota3 = parseFloat(document.getElementById('nota3').value);

  if (!materia || isNaN(nota1) || isNaN(nota2) || isNaN(nota3)) {
    alert('Completa todos los campos correctamente.');
    return;
  }

  const promedio = ((nota1 + nota2 + nota3) / 3).toFixed(2);

  let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
  const index = estudiantes.findIndex(e => e.id == estudianteSeleccionadoId);

  if (index === -1) {
    alert("Estudiante no encontrado.");
    cerrarModalNotas();
    return;
  }

  if (!estudiantes[index].materias) {
    estudiantes[index].materias = {};
  }

  estudiantes[index].materias[materia] = {
    notas: {
      primerParcial: [nota1],
      segundoParcial: [nota2],
      tercerParcial: [nota3]
    },
    promedio: parseFloat(promedio)
  };

  localStorage.setItem("estudiantes", JSON.stringify(estudiantes));
  cerrarModalNotas();
  mostrarEstudiantesGuardados();
  alert('Notas guardadas correctamente.');
}

function eliminarEstudiante(idEstudiante) {
  if (!confirm("¿Estás seguro de que deseas eliminar este estudiante? Esta acción no se puede deshacer.")) {
    return;
  }

  let estudiantes = JSON.parse(localStorage.getItem("estudiantes")) || [];
  const index = estudiantes.findIndex(e => e.id == idEstudiante);

  if (index === -1) {
    alert("Estudiante no encontrado.");
    return;
  }

  estudiantes.splice(index, 1); // Elimina del array
  localStorage.setItem("estudiantes", JSON.stringify(estudiantes)); // Guarda los cambios

  alert("Estudiante eliminado correctamente.");
  mostrarEstudiantesGuardados(); // Actualiza la vista
}

