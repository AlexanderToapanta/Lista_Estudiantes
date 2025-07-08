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
