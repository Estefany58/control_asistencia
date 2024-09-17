// Simulación de base de datos
let carreras = [];
let semestres = [];
let cursos = [];
let materias = [];
let docentes = [];
let estudiantes = [];

// Cargar datos desde Local Storage al inicio
document.addEventListener('DOMContentLoaded', function() {
    carreras = JSON.parse(localStorage.getItem('carreras')) || [];
    semestres = JSON.parse(localStorage.getItem('semestres')) || [];
    cursos = JSON.parse(localStorage.getItem('cursos')) || [];
    materias = JSON.parse(localStorage.getItem('materias')) || [];
    docentes = JSON.parse(localStorage.getItem('docentes')) || [];
    estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];
    displayCarreras();
    displayCursos();
    displaySemestres();
    displayMaterias();
    displayDocentes();
    displayEstudiantes();
    updateSelectOptions(); // Actualizar select al cargar la página

});

// Manejo de inicio de sesión
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    authenticateUser(username, password).then(userRole => {
        if (userRole === 'admin') {
            window.location.href = 'admin.html';
        } else if (userRole === 'docente') {
            window.location.href = 'docente.html';
        } else if (userRole === 'estudiante') {
            window.location.href = 'estudiante.html';
        } else {
            alert('Credenciales incorrectas');
        }
    }).catch(error => {
        console.error('Error en la autenticación', error);
        alert('Error en la autenticación');
    });
});

function authenticateUser(username, password) {
    return new Promise((resolve, reject) => {
        // Simulación de autenticación
        const users = [
            { username: 'admin', password: 'admin123', role: 'admin' },
            { username: 'docente', password: 'docente123', role: 'docente' },
            { username: 'estudiante', password: 'estudiante123', role: 'estudiante' }
        ];

        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            resolve(user.role);
        } else {
            reject('Usuario no encontrado');
        }
    });
}

// Navegación en el panel de administración
function navigate(option) {
    const contentDiv = document.getElementById('content');
    switch(option) {
        case 'carrera':
            contentDiv.innerHTML = `
                <h3>Gestión de Carrera</h3>
                <form id="carreraForm">
                    <input type="text" id="id_carrera" placeholder="ID Carrera" readonly><br>
                    <input type="text" id="establecimiento" placeholder="Establecimiento" required><br>
                    <input type="text" id="nomcarrera" placeholder="Nombre Carrera" required><br>
                    <button type="submit">Agregar Carrera</button>
                </form>
                <h4>Lista de Carreras</h4>
                <div id="carreraList"></div>
            `;
            document.getElementById('carreraForm').addEventListener('submit', addCarrera);
            displayCarreras();
            break;
        case 'semestre':
            contentDiv.innerHTML = `
                <h3>Gestión de Semestre</h3>
                <form id="semestreForm">
                    <input type="number" id="id_semestre" placeholder="ID Semestre (Numérico)" readonly><br>
                    <select id="id_carrera_semestre" required>
                        <option value="" disabled selected>Selecciona una Carrera</option>
                    </select><br>
                    <select id="id_curso_semestre" required>
                        <option value="" disabled selected>Selecciona un Curso</option>
                    </select><br>
                    <button type="submit">Agregar Semestre</button>
                </form>
                <h4>Lista de Semestres</h4>
                <div id="semestreList"></div>
            `;
            document.getElementById('semestreForm').addEventListener('submit', addSemestre);
            updateSelectOptions();
            displaySemestres();
            break;
        case 'curso':
            contentDiv.innerHTML = `
                <h3>Gestión de Curso</h3>
                <form id="cursoForm">
                    <input type="text" id="id_curso" placeholder="ID Curso" readonly><br>
                    <select id="id_carrera_curso" required>
                        <option value="" disabled selected>Selecciona una Carrera</option>
                    </select><br>
                    <select id="id_materia_curso" required>
                        <option value="" disabled selected>Selecciona una Materia</option>
                    </select><br>
                    <input type="text" id="curso" placeholder="Curso" required><br>
                    <button type="submit">Agregar Curso</button>
                </form>
                <h4>Lista de Cursos</h4>
                <div id="cursoList"></div>
            `;
            document.getElementById('cursoForm').addEventListener('submit', addCurso);
            updateSelectOptions();
            displayCursos();
            break;
        case 'materia':
            contentDiv.innerHTML = `
                <h3>Gestión de Materia</h3>
                <form id="materiaForm">
                    <input type="text" id="id_materia" placeholder="ID Materia" readonly><br>
                    <select id="id_docente_materia" required>
                        <option value="" disabled selected>Selecciona un Docente</option>
                    </select><br>
                    <input type="text" id="nombre_materia" placeholder="Nombre Materia" required><br>
                    <button type="submit">Agregar Materia</button>
                </form>
                <h4>Lista de Materias</h4>
                <div id="materiaList"></div>
            `;
            document.getElementById('materiaForm').addEventListener('submit', addMateria);
            updateSelectOptions();
            displayMaterias();
            break;
            case 'docente':
                contentDiv.innerHTML = `
                    <h3>Gestión de Docente</h3>
                    <form id="docenteForm">
                        <input type="number" id="id_docente" placeholder="ID Docente" readonly><br>
                        <select id="id_carrera_docente" required>
                            <option value="" disabled selected>Selecciona una Carrera</option>
                        </select><br>
                        <input type="text" id="nombre_docente" placeholder="Nombre Docente" required><br>
                        <input type="number" id="telefono_docente" placeholder="Teléfono" required><br>
                        <button type="submit">Agregar Docente</button>
                    </form>
                    <h4>Lista de Docentes</h4>
                    <div id="docenteList"></div>
                `;
                document.getElementById('docenteForm').addEventListener('submit', addDocente);
                updateSelectOptions();
                displayDocentes();
                break;
            case 'estudiante':
                contentDiv.innerHTML = `
                    <h3>Gestión de Estudiante</h3>
                    <form id="estudianteForm">
                        <input type="number" id="id_estudiante" placeholder="ID Estudiante" readonly><br>
                        <select id="id_curso_estudiante" required>
                          <option value="" disabled selected>Selecciona un curso</option>
                        </select><br>
                        <select id="id_carrera_estudiante" required>
                          <option value="" disabled selected>Selecciona una Carrera</option>
                        </select><br>
                        <input type="text" id="ci_estudiante" placeholder="Cédula de Identidad" required><br>
                        <input type="text" id="nombres_estudiante" placeholder="Nombres" required><br>
                        <input type="text" id="apellidos_estudiante" placeholder="Apellidos" required><br>
                        
                        <button type="submit">Agregar Estudiante</button>
                    </form>
                    <h4>Lista de Estudiantes</h4>
                    <div id="estudianteList"></div>
                `;
                document.getElementById('estudianteForm').addEventListener('submit', addEstudiante);
                updateSelectOptions();
                displayEstudiantes();
                break;
        default:
            contentDiv.innerHTML = `<p>Por favor selecciona una opción del menú.</p>`;
    }
}

// Funciones para manejar Carreras
function addCarrera(event) {
    event.preventDefault();

    const idCarrera = carreras.length > 0 ? carreras[carreras.length - 1].id_carrera + 1 : 1;
    const establecimiento = document.getElementById('establecimiento').value.toUpperCase();
    const nomCarrera = document.getElementById('nomcarrera').value.toUpperCase();

    const nuevaCarrera = {
        id_carrera: idCarrera,
        establecimiento: establecimiento,
        nomcarrera: nomCarrera
    };

    carreras.push(nuevaCarrera);
    localStorage.setItem('carreras', JSON.stringify(carreras));
    displayCarreras();
    updateSelectOptions(); // Actualizar select en semestre y curso
    document.getElementById('carreraForm').reset();
}

function displayCarreras() {
    const carreraListDiv = document.getElementById('carreraList');
    carreraListDiv.innerHTML = '';

    carreras.forEach(carrera => {
        const carreraDiv = document.createElement('div');
        carreraDiv.classList.add('carrera-item');
        carreraDiv.innerHTML = `
            <p>ID Carrera: ${carrera.id_carrera}</p>
            <p>Establecimiento: ${carrera.establecimiento}</p>
            <p>Nombre Carrera: ${carrera.nomcarrera}</p>
            <button onclick="editCarrera(${carrera.id_carrera})">Editar</button>
            <button onclick="deleteCarrera(${carrera.id_carrera})">Borrar</button>
            <hr>
        `;
        carreraListDiv.appendChild(carreraDiv);
    });
}

function editCarrera(idCarrera) {
    const carrera = carreras.find(c => c.id_carrera === idCarrera);

    if (carrera) {
        document.getElementById('id_carrera').value = carrera.id_carrera;
        document.getElementById('establecimiento').value = carrera.establecimiento;
        document.getElementById('nomcarrera').value = carrera.nomcarrera;

        // Elimina la carrera original para actualizarla
        deleteCarrera(idCarrera);
    }
}

function deleteCarrera(idCarrera) {
    carreras = carreras.filter(c => c.id_carrera !== idCarrera);
    localStorage.setItem('carreras', JSON.stringify(carreras));
    displayCarreras();
    updateSelectOptions(); // Actualizar select en semestre y curso
}

// Función para agregar Semestre
function addSemestre(event) {
    event.preventDefault();

    const idSemestre = document.getElementById('id_semestre').value || (semestres.length > 0 ? semestres[semestres.length - 1].id_semestre + 1 : 1);
    const idCarrera = parseInt(document.getElementById('id_carrera_semestre').value);
    const idCurso = parseInt(document.getElementById('id_curso_semestre').value);

    const semestreExistente = semestres.find(s => s.id_semestre === parseInt(idSemestre));
    if (semestreExistente) {
        alert('El ID del semestre ya existe.');
        return;
    }

    const nuevoSemestre = {
        id_semestre: parseInt(idSemestre),
        id_carrera: idCarrera,
        id_curso: idCurso
    };

    semestres.push(nuevoSemestre);
    localStorage.setItem('semestres', JSON.stringify(semestres));
    displaySemestres();
    updateSelectOptions(); // Actualizar select en curso
    document.getElementById('semestreForm').reset();
}

function displaySemestres() {
    const semestreListDiv = document.getElementById('semestreList');
    semestreListDiv.innerHTML = '';

    semestres.forEach(semestre => {
        const semestreDiv = document.createElement('div');
        semestreDiv.classList.add('semestre-item');
        const carrera = carreras.find(c => c.id_carrera === semestre.id_carrera);
        const curso = cursos.find(c => c.id_curso === semestre.id_curso);
        semestreDiv.innerHTML = `
            <p>ID Semestre: ${semestre.id_semestre}</p>
            <p>Carrera: ${carrera ? carrera.nomcarrera : 'Carrera no encontrada'}</p>
            <p>Curso: ${curso ? curso.curso : 'Curso no encontrado'}</p>
            <button onclick="editSemestre(${semestre.id_semestre})">Editar</button>
            <button onclick="deleteSemestre(${semestre.id_semestre})">Borrar</button>
            <hr>
        `;
        semestreListDiv.appendChild(semestreDiv);
    });
}

function editSemestre(idSemestre) {
    const semestre = semestres.find(s => s.id_semestre === idSemestre);

    if (semestre) {
        document.getElementById('id_semestre').value = semestre.id_semestre;
        document.getElementById('id_carrera_semestre').value = semestre.id_carrera;
        document.getElementById('id_curso_semestre').value = semestre.id_curso;

        // Elimina el semestre original para actualizarlo
        deleteSemestre(idSemestre);
    }
}

function deleteSemestre(idSemestre) {
    semestres = semestres.filter(s => s.id_semestre !== idSemestre);
    localStorage.setItem('semestres', JSON.stringify(semestres));
    displaySemestres();
    updateSelectOptions(); // Actualizar select en curso
}

// Función para agregar Curso
function addCurso(event) {
    event.preventDefault();

    const idCurso = cursos.length > 0 ? cursos[cursos.length - 1].id_curso + 1 : 1;
    const idCarrera = parseInt(document.getElementById('id_carrera_curso').value);
    const idMateria = parseInt(document.getElementById('id_materia_curso').value);
    const nombreCurso = document.getElementById('curso').value.toUpperCase();

    const nuevoCurso = {
        id_curso: idCurso,
        id_carrera: idCarrera,
        id_materia: idMateria,
        curso: nombreCurso
    };

    cursos.push(nuevoCurso);
    localStorage.setItem('cursos', JSON.stringify(cursos));
    displayCursos();
    updateSelectOptions(); // Actualizar select en semestre
    document.getElementById('cursoForm').reset();
}

function displayCursos() {
    const cursoListDiv = document.getElementById('cursoList');
    cursoListDiv.innerHTML = '';

    cursos.forEach(curso => {
        const cursoDiv = document.createElement('div');
        cursoDiv.classList.add('curso-item');
        const carrera = carreras.find(c => c.id_carrera === curso.id_carrera);
        const materia = materias.find(m => m.id_materia === curso.id_materia);
        cursoDiv.innerHTML = `
            <p>ID Curso: ${curso.id_curso}</p>
            <p>Carrera: ${carrera ? carrera.nomcarrera : 'Carrera no encontrada'}</p>
            <p>Materia: ${materia ? materia.nombre : 'Materia no encontrada'}</p>
            <p>Curso: ${curso.curso}</p>
            <button onclick="editCurso(${curso.id_curso})">Editar</button>
            <button onclick="deleteCurso(${curso.id_curso})">Borrar</button>
            <hr>
        `;
        cursoListDiv.appendChild(cursoDiv);
    });
}

function editCurso(idCurso) {
    const curso = cursos.find(c => c.id_curso === idCurso);

    if (curso) {
        document.getElementById('id_curso').value = curso.id_curso;
        document.getElementById('id_carrera_curso').value = curso.id_carrera;
        document.getElementById('id_materia_curso').value = curso.id_materia;
        document.getElementById('curso').value = curso.curso;

        // Elimina el curso original para actualizarlo
        deleteCurso(idCurso);
    }
}

function deleteCurso(idCurso) {
    cursos = cursos.filter(c => c.id_curso !== idCurso);
    localStorage.setItem('cursos', JSON.stringify(cursos));
    displayCursos();
    updateSelectOptions(); // Actualizar select en semestre
}

// Función para agregar Materia
function addMateria(event) {
    event.preventDefault();

    const idMateria = materias.length > 0 ? materias[materias.length - 1].id_materia + 1 : 1;
    const idDocente = parseInt(document.getElementById('id_docente_materia').value);
    const nombreMateria = document.getElementById('nombre_materia').value.toUpperCase();

    const nuevaMateria = {
        id_materia: idMateria,
        id_docente: idDocente,
        nombre: nombreMateria
    };

    materias.push(nuevaMateria);
    localStorage.setItem('materias', JSON.stringify(materias));
    displayMaterias();
    updateSelectOptions(); // Actualizar select en curso
    document.getElementById('materiaForm').reset();
}

function displayMaterias() {
    const materiaListDiv = document.getElementById('materiaList');
    materiaListDiv.innerHTML = '';

    materias.forEach(materia => {
        const materiaDiv = document.createElement('div');
        materiaDiv.classList.add('materia-item');
        const docente = docentes.find(d => d.id_docente === materia.id_docente);
        materiaDiv.innerHTML = `
            <p>ID Materia: ${materia.id_materia}</p>
            <p>Docente: ${docente ? docente.nombre : 'Docente no encontrado'}</p>
            <p>Nombre Materia: ${materia.nombre}</p>
            <button onclick="editMateria(${materia.id_materia})">Editar</button>
            <button onclick="deleteMateria(${materia.id_materia})">Borrar</button>
            <hr>
        `;
        materiaListDiv.appendChild(materiaDiv);
    });
}

function editMateria(idMateria) {
    const materia = materias.find(m => m.id_materia === idMateria);

    if (materia) {
        document.getElementById('id_materia').value = materia.id_materia;
        document.getElementById('id_docente_materia').value = materia.id_docente;
        document.getElementById('nombre_materia').value = materia.nombre;

        // Elimina la materia original para actualizarla
        deleteMateria(idMateria);
    }
}

function deleteMateria(idMateria) {
    materias = materias.filter(m => m.id_materia !== idMateria);
    localStorage.setItem('materias', JSON.stringify(materias));
    displayMaterias();
    updateSelectOptions(); // Actualizar select en curso
}

function addDocente(event) {
    event.preventDefault();

    const idDocente = docentes.length > 0 ? docentes[docentes.length - 1].id_docente + 1 : 1;
    const idCarrera = parseInt(document.getElementById('id_carrera_docente').value);
    const nombreDocente = document.getElementById('nombre_docente').value.toUpperCase();
    const telefonoDocente = document.getElementById('telefono_docente').value;

    const nuevoDocente = {
        id_docente: idDocente,
        id_carrera: idCarrera,
        nombre: nombreDocente,
        telefono: telefonoDocente
    };

    docentes.push(nuevoDocente);
    localStorage.setItem('docentes', JSON.stringify(docentes));
    displayDocentes();
    updateSelectOptions();
    document.getElementById('docenteForm').reset();
}

function displayDocentes() {
    const docenteListDiv = document.getElementById('docenteList');
    docenteListDiv.innerHTML = '';

    docentes.forEach(docente => {
        const docenteDiv = document.createElement('div');
        docenteDiv.classList.add('docente-item');
        const carrera = carreras.find(c => c.id_carrera === docente.id_carrera);
        docenteDiv.innerHTML = `
            <p>ID Docente: ${docente.id_docente}</p>
            <p>Carrera: ${carrera ? carrera.nomcarrera : 'Carrera no encontrada'}</p>
            <p>Nombre: ${docente.nombre}</p>
            <p>Teléfono: ${docente.telefono}</p>
            <button onclick="editDocente(${docente.id_docente})">Editar</button>
            <button onclick="deleteDocente(${docente.id_docente})">Borrar</button>
            <hr>
        `;
        docenteListDiv.appendChild(docenteDiv);
    });
}

function editDocente(idDocente) {
    const docente = docentes.find(d => d.id_docente === idDocente);

    if (docente) {
        document.getElementById('id_docente').value = docente.id_docente;
        document.getElementById('id_carrera_docente').value = docente.id_carrera;
        document.getElementById('nombre_docente').value = docente.nombre;
        document.getElementById('telefono_docente').value = docente.telefono;

        // Elimina el docente original para actualizarlo
        deleteDocente(idDocente);
    }
}

function deleteDocente(idDocente) {
    docentes = docentes.filter(d => d.id_docente !== idDocente);
    localStorage.setItem('docentes', JSON.stringify(docentes));
    displayDocentes();
    updateSelectOptions();
}

function addEstudiante(event) {
    event.preventDefault();

    const idEstudiante = estudiantes.length > 0 ? estudiantes[estudiantes.length - 1].id_estudiante + 1 : 1;
    const idCarrera = parseInt(document.getElementById('id_carrera_estudiante').value);
    const idCurso = parseInt(document.getElementById('id_curso_estudiante').value);
    const ciEstudiante = document.getElementById('ci_estudiante').value;
    const nombresEstudiante = document.getElementById('nombres_estudiante').value.toUpperCase();
    const apellidosEstudiante = document.getElementById('apellidos_estudiante').value.toUpperCase();
    

    const nuevoEstudiante = {
        id_estudiante: idEstudiante,
        id_carrera: idCarrera,
        id_curso: idCurso,
        ci: ciEstudiante,
        nombres: nombresEstudiante,
        apellidos: apellidosEstudiante
        
    };

    estudiantes.push(nuevoEstudiante);
    localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
    displayEstudiantes();
    updateSelectOptions();
    document.getElementById('estudianteForm').reset();
}

function displayEstudiantes() {
    const estudianteListDiv = document.getElementById('estudianteList');
    estudianteListDiv.innerHTML = '';

    estudiantes.forEach(estudiante => {
        const estudianteDiv = document.createElement('div');
        estudianteDiv.classList.add('estudiante-item');
        const carrera = carreras.find(c => c.id_carrera === estudiante.id_carrera);
        const curso = cursos.find(c => c.id_curso === estudiante.id_curso);
        estudianteDiv.innerHTML = `
            <p>ID Estudiante: ${estudiante.id_estudiante}</p>
            <p>Carrera = ${carrera ? carrera.nomcarrera : 'Carrera no encontrada'}</p>
            <p>Curso = ${curso ? curso.curso : 'Curso no encontrado'}</p>
            <p>Cédula de Identidad: ${estudiante.ci}</p>
            <p>Nombres: ${estudiante.nombres}</p>
            <p>Apellidos: ${estudiante.apellidos}</p>
            <button onclick="editEstudiante(${estudiante.id_estudiante})">Editar</button>
            <button onclick="deleteEstudiante(${estudiante.id_estudiante})">Borrar</button>
            <hr>
        `;
        estudianteListDiv.appendChild(estudianteDiv);
    });
}

function editEstudiante(idEstudiante) {
    const estudiante = estudiantes.find(e => e.id_estudiante === idEstudiante);

    if (estudiante) {
        document.getElementById('id_estudiante').value = estudiante.id_estudiante;
        document.getElementById('id_carrera_estudiante').value = estudiante.id_carrera;
        document.getElementById('id_curso_estudiante').value = estudiante.id_curso;
        document.getElementById('ci_estudiante').value = estudiante.ci;
        document.getElementById('nombres_estudiante').value = estudiante.nombres;
        document.getElementById('apellidos_estudiante').value = estudiante.apellidos;
        

        // Elimina el estudiante original para actualizarlo
        deleteEstudiante(idEstudiante);
    }
}

function deleteEstudiante(idEstudiante) {
    estudiantes = estudiantes.filter(e => e.id_estudiante !== idEstudiante);
    localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
    displayEstudiantes();
    updateSelectOptions();
}

//cerrar sesión
function logout() {
    // Eliminar cualquier información de sesión que pueda estar almacenada
    localStorage.removeItem('token');      // localStorage
    sessionStorage.removeItem('token');    // sessionStorage
    document.cookie = 'session=; Max-Age=-99999999;';  // cookies

    // para Redirigir al usuario al index.html
    window.location.href = 'index.html';
}



// Función para actualizar los selects dependientes
function updateSelectOptions() {
    const carreraSelects = document.querySelectorAll('#id_carrera_semestre, #id_carrera_curso, #id_carrera_docente, #id_carrera_estudiante');
    const cursoSelects = document.querySelectorAll('#id_curso_semestre, #id_curso_estudiante');
    const materiaSelects = document.querySelectorAll('#id_materia_curso');
    const docenteSelects = document.querySelectorAll('#id_docente_materia');




    // Actualizar opciones en el select de carreras
    carreraSelects.forEach(select => {
        const selectedValue = select.value;
        select.innerHTML = '<option value="" disabled selected>Selecciona una Carrera</option>';
        carreras.forEach(carrera => {
            const option = document.createElement('option');
            option.value = carrera.id_carrera;
            option.textContent = carrera.nomcarrera;
            select.appendChild(option);
        });
        select.value = selectedValue; // Mantener la selección previa
    });

    // Actualizar opciones en el select de cursos
    cursoSelects.forEach(select => {
        const selectedValue = select.value;
        select.innerHTML = '<option value="" disabled selected>Selecciona un Curso</option>';
        cursos.forEach(curso => {
            const option = document.createElement('option');
            option.value = curso.id_curso;
            option.textContent = curso.curso;
            select.appendChild(option);
        });
        select.value = selectedValue; // Mantener la selección previa
    });

    // Actualizar opciones en el select de materias
    materiaSelects.forEach(select => {
        const selectedValue = select.value;
        select.innerHTML = '<option value="" disabled selected>Selecciona una Materia</option>';
        materias.forEach(materia => {
            const option = document.createElement('option');
            option.value = materia.id_materia;
            option.textContent = materia.nombre;
            select.appendChild(option);
        });
        select.value = selectedValue; // Mantener la selección previa
    });

    // Actualizar opciones en el select de docentes
    docenteSelects.forEach(select => {
        const selectedValue = select.value;
        select.innerHTML = '<option value="" disabled selected>Selecciona un Docente</option>';
        docentes.forEach(docente => {
            const option = document.createElement('option');
            option.value = docente.id_docente;
            option.textContent = docente.nombre;
            select.appendChild(option);
        });
        select.value = selectedValue; // Mantener la selección previa
    });
}



