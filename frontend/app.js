// ==========================================
// GESTOR DE TAREAS POR MATERIAS
// ==========================================

// Estado de la aplicación
const tareas = [];
const materias = [];
let materiaSeleccionada = null;
let timeoutBusqueda = null;
const API_BASE = '/api';

// Elementos del DOM
const inputTarea = document.getElementById('inputTarea');
const btnAgregar = document.getElementById('btnAgregar');
const listaTareas = document.getElementById('listaTareas');
const totalTareasEl = document.getElementById('totalTareas');
const tareasPendientesEl = document.getElementById('tareasPendientes');
const buscadorInput = document.getElementById('buscadorInput');
const buscadorWrapper = document.getElementById('buscadorWrapper');
const buscadorSpinner = document.getElementById('buscadorSpinner');
const mensajeBuscando = document.getElementById('mensajeBuscando');
const resultadosBusqueda = document.getElementById('resultadosBusqueda');
const listaResultados = document.getElementById('listaResultados');
const listaMaterias = document.getElementById('listaMaterias');
const inputMateria = document.getElementById('inputMateria');
const btnAgregarMateria = document.getElementById('btnAgregarMateria');
const tituloMateria = document.getElementById('tituloMateria');
const subtituloMateria = document.getElementById('subtituloMateria');
const btnVolver = document.getElementById('btnVolver');
const btnToggleSidebar = document.getElementById('btnToggleSidebar');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

async function solicitarApi(ruta, opciones = {}) {
    const respuesta = await fetch(`${API_BASE}${ruta}`, {
        ...opciones,
        headers: { 'Content-Type': 'application/json', ...opciones.headers }
    });
    const datos = respuesta.status === 204 ? null : await respuesta.json();
    if (!respuesta.ok) {
        const error = new Error(datos?.details ? Object.values(datos.details).join('. ') : datos?.error || 'No se pudo completar la operación');
        error.status = respuesta.status;
        throw error;
    }
    return datos;
}

async function cargarDatos() {
    const [materiasApi, tareasApi] = await Promise.all([
        solicitarApi('/materias'),
        solicitarApi('/tareas')
    ]);
    materias.splice(0, materias.length, ...materiasApi);
    tareas.splice(0, tareas.length, ...tareasApi);
}

async function migrarDatosLocales() {
    const tareasGuardadas = localStorage.getItem('tareas_app');
    const materiasGuardadas = localStorage.getItem('materias_app');
    if (!tareasGuardadas && !materiasGuardadas) return;

    const tareasLocales = tareasGuardadas ? JSON.parse(tareasGuardadas) : [];
    const materiasLocales = materiasGuardadas ? JSON.parse(materiasGuardadas) : [];
    if (!Array.isArray(tareasLocales) || !Array.isArray(materiasLocales)) {
        throw new Error('Los datos locales anteriores tienen un formato inválido y no se eliminaron');
    }

    const materiaIds = new Map();
    for (const materiaLocal of materiasLocales) {
        let materia = materias.find(item => item.nombre.trim().toLowerCase() === String(materiaLocal.nombre).trim().toLowerCase());
        if (!materia) {
            try {
                materia = await solicitarApi('/materias', {
                    method: 'POST',
                    body: JSON.stringify({ nombre: materiaLocal.nombre })
                });
                materias.push(materia);
            } catch (error) {
                if (error.status !== 409) throw error;
                await cargarDatos();
                materia = materias.find(item => item.nombre.trim().toLowerCase() === String(materiaLocal.nombre).trim().toLowerCase());
            }
        }
        if (materia) materiaIds.set(String(materiaLocal.id), materia.id);
    }

    for (const tareaLocal of tareasLocales) {
        if (typeof tareaLocal.texto !== 'string' || tareaLocal.texto.trim().length < 3) continue;
        const materiaId = tareaLocal.materiaId == null ? null : materiaIds.get(String(tareaLocal.materiaId)) ?? null;
        const duplicada = tareas.some(tarea => tarea.texto.trim().toLowerCase() === tareaLocal.texto.trim().toLowerCase() && String(tarea.materiaId) === String(materiaId));
        if (duplicada) continue;
        try {
            tareas.push(await solicitarApi('/tareas', {
                method: 'POST',
                body: JSON.stringify({
                    texto: tareaLocal.texto,
                    completada: tareaLocal.completada === true,
                    materiaId
                })
            }));
        } catch (error) {
            if (error.status !== 409) throw error;
        }
    }

    localStorage.removeItem('tareas_app');
    localStorage.removeItem('materias_app');
}

// ==========================================
// FUNCIONES DE MATERIAS
// ==========================================

async function agregarMateria(nombre) {
    if (!nombre || !nombre.trim()) return;
    
    const nombreNormalizado = nombre.trim().toLowerCase();
    if (materias.some(m => m.nombre.toLowerCase() === nombreNormalizado)) {
        mostrarError('⚠️ Ya existe una materia con ese nombre');
        return;
    }
    
    try {
        materias.push(await solicitarApi('/materias', {
            method: 'POST',
            body: JSON.stringify({ nombre: nombre.trim() })
        }));
        renderizarMaterias();
        inputMateria.value = '';
    } catch (error) {
        mostrarError(error.message);
    }
}

async function eliminarMateria(id) {
    if (!confirm('¿Eliminar esta materia? Las tareas asociadas NO se eliminarán, quedarán sin materia.')) return;

    try {
        await solicitarApi(`/materias/${encodeURIComponent(id)}`, { method: 'DELETE' });
        await cargarDatos();
        if (String(materiaSeleccionada) === String(id)) {
            seleccionarMateria(null);
        } else {
            renderizarMaterias();
            renderizarTareas();
        }
    } catch (error) {
        mostrarError(error.message);
    }
}

async function ejecutarAccion(accion) {
    try {
        await accion();
    } catch (error) {
        mostrarError(error.message);
    }
}

function renderizarMaterias() {
    if (!Array.isArray(materias)) {
        renderizarTareas();
        return;
    }
    
    if (materiaSeleccionada !== null && !materias.some(materia => String(materia.id) === String(materiaSeleccionada))) {
        materiaSeleccionada = null;
    }
    
    if (materiaSeleccionada === null) {
        tituloMateria.textContent = '📋 Todas las Tareas';
        subtituloMateria.textContent = 'Selecciona una materia para filtrar';
        btnVolver.style.display = 'none';
    } else {
        const materiaActiva = materias.find(materia => String(materia.id) === String(materiaSeleccionada));
        tituloMateria.textContent = `${materiaActiva.icono || '📚'} ${materiaActiva.nombre}`;
        subtituloMateria.textContent = 'Agrega tareas para esta materia';
        btnVolver.style.display = 'block';
    }

    listaMaterias.innerHTML = '';

    const liTodas = document.createElement('li');
    liTodas.className = `materia-item ${materiaSeleccionada === null ? 'activa' : ''}`;
    liTodas.innerHTML = `
        <div class="materia-icono materia-default">📋</div>
        <span class="materia-nombre">Todas las tareas</span>
        <span class="materia-contador">${tareas.length}</span>
    `;
    liTodas.addEventListener('click', () => seleccionarMateria(null));
    listaMaterias.appendChild(liTodas);
    
    materias.forEach(materia => {
        const li = document.createElement('li');
        li.className = `materia-item ${String(materiaSeleccionada) === String(materia.id) ? 'activa' : ''}`;
        const tareasMateria = tareas.filter(tarea => String(tarea.materiaId) === String(materia.id));
        li.innerHTML = `
            <div class="materia-icono ${materia.colorClass || 'materia-default'}">${materia.icono || '📚'}</div>
            <span class="materia-nombre">${escaparHTML(materia.nombre)}</span>
            <span class="materia-contador">${tareasMateria.length}</span>
            <button class="btn-eliminar-materia" title="Eliminar materia" aria-label="Eliminar materia">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;
        li.addEventListener('click', event => {
            if (!event.target.closest('.btn-eliminar-materia')) seleccionarMateria(materia.id);
        });
        li.querySelector('.btn-eliminar-materia').addEventListener('click', event => {
            event.stopPropagation();
            ejecutarAccion(() => eliminarMateria(materia.id));
        });
        listaMaterias.appendChild(li);
    });
}

function seleccionarMateria(id) {
    materiaSeleccionada = id;
    renderizarMaterias();
    if (buscadorInput.value.trim()) {
        ejecutarBusqueda(buscadorInput.value.trim());
    } else {
        renderizarTareas();
    }
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('abierto');
        sidebarOverlay.classList.remove('activo');
    }
}

function actualizarContadores() {
    const tareasFiltradas = obtenerTareasFiltradas();
    totalTareasEl.textContent = tareasFiltradas.length;
    tareasPendientesEl.textContent = tareasFiltradas.filter(tarea => !tarea.completada).length;
}

function obtenerTareasFiltradas() {
    return materiaSeleccionada === null
        ? [...tareas]
        : tareas.filter(tarea => String(tarea.materiaId) === String(materiaSeleccionada));
}

function tareaDuplicada(texto, excluirId = null) {
    const textoNormalizado = texto.trim().toLowerCase();
    return tareas.some(tarea => String(tarea.id) !== String(excluirId)
        && String(tarea.materiaId) === String(materiaSeleccionada)
        && tarea.texto.trim().toLowerCase() === textoNormalizado);
}

function validarTarea(texto, excluirId = null) {
    if (!texto || !texto.trim()) return { valido: false, mensaje: '❌ La tarea no puede estar vacía' };
    if (texto.trim().length < 3) return { valido: false, mensaje: '❌ La tarea debe tener al menos 3 caracteres' };
    if (texto.trim().length > 255) return { valido: false, mensaje: '❌ La tarea no puede superar los 255 caracteres' };
    if (tareaDuplicada(texto, excluirId)) return { valido: false, mensaje: '⚠️ Ya existe una tarea con ese nombre en esta materia' };
    return { valido: true, mensaje: '✅ Tarea válida' };
}

async function agregarTarea(texto) {
    const validacion = validarTarea(texto);
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        inputTarea.style.borderColor = '#d4867a';
        inputTarea.style.backgroundColor = '#fff5f5';
        setTimeout(() => {
            inputTarea.style.borderColor = '';
            inputTarea.style.backgroundColor = '';
        }, 2000);
        return;
    }

    try {
        tareas.unshift(await solicitarApi('/tareas', {
            method: 'POST',
            body: JSON.stringify({ texto: texto.trim(), materiaId: materiaSeleccionada })
        }));
        renderizarTareas();
        inputTarea.value = '';
        inputTarea.focus();
        if (buscadorInput.value.trim()) {
            buscadorInput.value = '';
            ocultarResultados();
        }
    } catch (error) {
        mostrarError(error.message);
    }
}

async function toggleTarea(id) {
    const tarea = tareas.find(item => String(item.id) === String(id));
    if (!tarea) return;
    await solicitarApi(`/tareas/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ completada: !tarea.completada })
    });
    await cargarDatos();
    if (buscadorInput.value.trim()) ejecutarBusqueda(buscadorInput.value.trim());
    else renderizarTareas();
}

async function editarTarea(id) {
    const tarea = tareas.find(item => String(item.id) === String(id));
    if (!tarea) return;
    const texto = prompt('Editar tarea', tarea.texto);
    if (texto === null || texto.trim() === tarea.texto) return;
    const validacion = validarTarea(texto, id);
    if (!validacion.valido) {
        mostrarError(validacion.mensaje);
        return;
    }
    await solicitarApi(`/tareas/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ texto: texto.trim() })
    });
    await cargarDatos();
    if (buscadorInput.value.trim()) ejecutarBusqueda(buscadorInput.value.trim());
    else renderizarTareas();
}

async function eliminarTarea(id, elementoLi) {
    elementoLi.classList.add('eliminando');
    setTimeout(async () => {
        try {
            await solicitarApi(`/tareas/${encodeURIComponent(id)}`, { method: 'DELETE' });
            const indice = tareas.findIndex(tarea => String(tarea.id) === String(id));
            if (indice !== -1) tareas.splice(indice, 1);
            if (buscadorInput.value.trim()) ejecutarBusqueda(buscadorInput.value.trim());
            else renderizarTareas();
        } catch (error) {
            renderizarTareas();
            mostrarError(error.message);
        }
    }, 350);
}

// ==========================================
// FUNCIONES DE UI
// ==========================================

function escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

function mostrarError(mensaje) {
    document.querySelectorAll('.mensaje-error').forEach(el => el.remove());
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'mensaje-error';
    errorDiv.textContent = mensaje;
    
    const formTarea = document.querySelector('.form-tarea');
    formTarea.parentNode.insertBefore(errorDiv, formTarea);
    
    setTimeout(() => {
        errorDiv.style.animation = 'eliminarError 0.3s ease forwards';
        setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
}

function renderizarTareas(tareasAMostrar = null) {
    let tareasRender = tareasAMostrar !== null ? tareasAMostrar : obtenerTareasFiltradas();
    listaTareas.innerHTML = '';

    if (tareasRender.length === 0) {
        const mensaje = materiaSeleccionada ? 'No hay tareas para esta materia. ¡Añade una!' : 'No hay tareas aún. ¡Añade una!';
        listaTareas.innerHTML = `
            <li class="sin-tareas">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="3"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                <p>${mensaje}</p>
            </li>`;
        actualizarContadores();
        renderizarMaterias();
        return;
    }

    tareasRender.forEach(tarea => {
        const materia = materias.find(m => m.id === tarea.materiaId);
        const li = document.createElement('li');
        li.className = `tarea-item ${tarea.completada ? 'completada' : ''}`;
        li.setAttribute('data-id', tarea.id);

        const tagMateria = materia ? 
            `<span class="materia-tag" style="background-color: ${materia.color || '#e0d5c5'}; color: #4a3f35;">
                ${materia.icono || '📚'} ${escaparHTML(materia.nombre)}
            </span>` : '';

        li.innerHTML = `
            <input type="checkbox" class="checkbox-tarea" ${tarea.completada ? 'checked' : ''}>
            <span class="texto-tarea">${escaparHTML(tarea.texto)}</span>
            ${tagMateria}
            <button class="btn-editar" title="Editar tarea" aria-label="Editar tarea">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"></path>
                </svg>
            </button>
            <button class="btn-eliminar" title="Eliminar tarea">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </button>
        `;

        const checkbox = li.querySelector('.checkbox-tarea');
        checkbox.addEventListener('change', () => ejecutarAccion(() => toggleTarea(tarea.id)));

        const btnEditar = li.querySelector('.btn-editar');
        btnEditar.addEventListener('click', () => ejecutarAccion(() => editarTarea(tarea.id)));

        const btnEliminar = li.querySelector('.btn-eliminar');
        btnEliminar.addEventListener('click', () => eliminarTarea(tarea.id, li));

        listaTareas.appendChild(li);
    });

    actualizarContadores();
    renderizarMaterias();
}

function mostrarSpinner() {
    buscadorWrapper.classList.add('buscando');
    buscadorSpinner.classList.add('activo');
    mensajeBuscando.classList.add('visible');
}

function ocultarSpinner() {
    buscadorWrapper.classList.remove('buscando');
    buscadorSpinner.classList.remove('activo');
    mensajeBuscando.classList.remove('visible');
}

function ocultarResultados() {
    resultadosBusqueda.classList.remove('activo');
    listaResultados.innerHTML = '';
}

// ==========================================
// FUNCIONES DE BÚSQUEDA
// ==========================================

function buscarTareas(termino) {
    const tareasFiltradas = obtenerTareasFiltradas();
    if (!termino || !termino.trim()) return tareasFiltradas;
    
    const term = termino.toLowerCase().trim();
    return tareasFiltradas.filter(t => t.texto.toLowerCase().includes(term));
}

function ejecutarBusqueda(termino) {
    const resultados = buscarTareas(termino);
    
    listaResultados.innerHTML = '';
    
    if (termino && termino.trim()) {
        if (resultados.length > 0) {
            resultadosBusqueda.classList.add('activo');
            resultados.forEach(t => {
                const div = document.createElement('div');
                div.className = 'resultado-item';
                const materia = materias.find(m => m.id === t.materiaId);
                div.textContent = materia ? `${materia.icono || '📚'} ${t.texto} (${materia.nombre})` : t.texto;
                div.addEventListener('click', () => {
                    if (t.materiaId !== materiaSeleccionada) seleccionarMateria(t.materiaId);
                    setTimeout(() => {
                        const elemento = document.querySelector(`[data-id="${t.id}"]`);
                        if (elemento) {
                            elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            elemento.style.backgroundColor = '#fdf0d5';
                            setTimeout(() => { elemento.style.backgroundColor = ''; }, 2000);
                        }
                    }, 100);
                });
                listaResultados.appendChild(div);
            });
        } else {
            resultadosBusqueda.classList.add('activo');
            listaResultados.innerHTML = '<div class="resultado-item">No se encontraron tareas</div>';
        }
    } else {
        ocultarResultados();
    }

    renderizarTareas(resultados);
}

// ==========================================
// PERSONALIZADOR DE FONDO (MODAL)
// ==========================================

let fondoActual = {
    tipo: 'color',
    valor: '#f5f0e8',
    direccion: 'to right',
    imagenData: null
};

function cargarFondo() {
    const guardado = localStorage.getItem('fondo_personalizado');
    if (guardado) {
        try {
            const parsed = JSON.parse(guardado);
            fondoActual = { ...fondoActual, ...parsed };
            aplicarFondo();
        } catch (e) {
            console.error('Error al cargar fondo:', e);
        }
    }
    
    const imagenGuardada = sessionStorage.getItem('fondo_imagen');
    if (imagenGuardada && fondoActual.tipo === 'imagen') {
        fondoActual.imagenData = imagenGuardada;
        aplicarFondo();
    }
}

function guardarFondo() {
    const fondoAGuardar = {
        tipo: fondoActual.tipo,
        valor: fondoActual.tipo === 'imagen' ? '#f5f0e8' : fondoActual.valor,
        direccion: fondoActual.direccion
    };
    localStorage.setItem('fondo_personalizado', JSON.stringify(fondoAGuardar));
    
    if (fondoActual.tipo === 'imagen' && fondoActual.imagenData) {
        sessionStorage.setItem('fondo_imagen', fondoActual.imagenData);
    }
}

function aplicarFondo() {
    const body = document.body;
    body.classList.remove('fondo-imagen');
    body.style.backgroundImage = '';
    body.style.backgroundColor = '';
    
    switch (fondoActual.tipo) {
        case 'color':
            body.style.backgroundColor = fondoActual.valor;
            body.style.backgroundImage = `
                radial-gradient(ellipse at 15% 30%, rgba(200, 180, 150, 0.15) 0%, transparent 55%),
                radial-gradient(ellipse at 80% 25%, rgba(180, 160, 130, 0.1) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 75%, rgba(210, 190, 160, 0.12) 0%, transparent 50%),
                radial-gradient(ellipse at 25% 85%, rgba(195, 175, 145, 0.1) 0%, transparent 45%)
            `;
            break;
        case 'degradado':
            const [color1, color2] = fondoActual.valor.split(',');
            body.style.backgroundImage = `linear-gradient(${fondoActual.direccion}, ${color1}, ${color2})`;
            body.style.backgroundColor = color1;
            break;
        case 'imagen':
            if (fondoActual.imagenData) {
                body.classList.add('fondo-imagen');
                body.style.setProperty('--bg-imagen', `url(${fondoActual.imagenData})`);
            }
            break;
    }
}

function abrirModal() {
    document.getElementById('modalOverlay').classList.add('activo');
    document.getElementById('modalFondo').classList.add('activo');
    document.body.style.overflow = 'hidden';
    sincronizarUI();
}

function cerrarModal() {
    document.getElementById('modalOverlay').classList.remove('activo');
    document.getElementById('modalFondo').classList.remove('activo');
    document.body.style.overflow = '';
}

function sincronizarUI() {
    document.querySelectorAll('.tab-fondo').forEach(tab => {
        tab.classList.remove('activo');
        const tabName = fondoActual.tipo === 'color' ? 'colores' : fondoActual.tipo === 'degradado' ? 'degradados' : 'imagen';
        if (tab.dataset.tab === tabName) tab.classList.add('activo');
    });
    
    document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('activo'));
    const panelId = fondoActual.tipo === 'color' ? 'tabColores' : fondoActual.tipo === 'degradado' ? 'tabDegradados' : 'tabImagen';
    document.getElementById(panelId)?.classList.add('activo');
    
    if (fondoActual.tipo === 'color') {
        document.getElementById('inputColorPersonalizado').value = fondoActual.valor;
        document.getElementById('colorHexValue').textContent = fondoActual.valor;
        document.querySelectorAll('.color-option').forEach(btn => {
            btn.classList.remove('seleccionado');
            if (btn.dataset.color === fondoActual.valor) btn.classList.add('seleccionado');
        });
    }
    
    if (fondoActual.tipo === 'degradado') {
        const [c1, c2] = fondoActual.valor.split(',');
        document.getElementById('degradadoColor1').value = c1 || '#f5f0e8';
        document.getElementById('degradadoColor2').value = c2 || '#e8dcc8';
        document.getElementById('direccionDegradado').value = fondoActual.direccion;
        document.getElementById('previewDegradado').style.background = 
            `linear-gradient(${fondoActual.direccion}, ${c1 || '#f5f0e8'}, ${c2 || '#e8dcc8'})`;
    }
    
    if (fondoActual.tipo === 'imagen' && fondoActual.imagenData) {
        document.getElementById('previewImagen').src = fondoActual.imagenData;
        document.getElementById('previewContainer').style.display = 'block';
        document.getElementById('uploadArea').style.display = 'none';
    }
}

function inicializarPersonalizadorFondo() {
    cargarFondo();
    
    document.getElementById('btnPersonalizarFondo').addEventListener('click', abrirModal);
    document.getElementById('btnCerrarModal').addEventListener('click', cerrarModal);
    document.getElementById('modalOverlay').addEventListener('click', cerrarModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.getElementById('modalFondo').classList.contains('activo')) {
            cerrarModal();
        }
    });
    
    // Tabs
    document.querySelectorAll('.tab-fondo').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab-fondo').forEach(t => t.classList.remove('activo'));
            tab.classList.add('activo');
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('activo'));
            document.getElementById(tab.dataset.tab === 'colores' ? 'tabColores' : tab.dataset.tab === 'degradados' ? 'tabDegradados' : 'tabImagen').classList.add('activo');
            fondoActual.tipo = tab.dataset.tab === 'colores' ? 'color' : tab.dataset.tab === 'degradados' ? 'degradado' : 'imagen';
        });
    });
    
    // Colores
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            fondoActual.tipo = 'color';
            fondoActual.valor = btn.dataset.color;
            document.getElementById('inputColorPersonalizado').value = btn.dataset.color;
            document.getElementById('colorHexValue').textContent = btn.dataset.color;
            document.querySelectorAll('.color-option').forEach(b => b.classList.remove('seleccionado'));
            btn.classList.add('seleccionado');
        });
    });
    
    document.getElementById('inputColorPersonalizado').addEventListener('input', (e) => {
        fondoActual.tipo = 'color';
        fondoActual.valor = e.target.value;
        document.getElementById('colorHexValue').textContent = e.target.value;
        document.querySelectorAll('.color-option').forEach(b => b.classList.remove('seleccionado'));
    });
    
    // Degradados
    document.querySelectorAll('.degradado-option').forEach(btn => {
        btn.addEventListener('click', () => {
            fondoActual.tipo = 'degradado';
            fondoActual.valor = btn.dataset.colors;
            fondoActual.direccion = btn.dataset.direction;
            const [c1, c2] = btn.dataset.colors.split(',');
            document.getElementById('degradadoColor1').value = c1;
            document.getElementById('degradadoColor2').value = c2;
            document.getElementById('direccionDegradado').value = btn.dataset.direction;
            document.getElementById('previewDegradado').style.background = `linear-gradient(${btn.dataset.direction}, ${c1}, ${c2})`;
            document.querySelectorAll('.degradado-option').forEach(b => b.classList.remove('seleccionado'));
            btn.classList.add('seleccionado');
        });
    });
    
    document.getElementById('degradadoColor1').addEventListener('input', () => {
        fondoActual.tipo = 'degradado';
        const c1 = document.getElementById('degradadoColor1').value;
        const c2 = document.getElementById('degradadoColor2').value;
        fondoActual.valor = `${c1},${c2}`;
        document.getElementById('previewDegradado').style.background = 
            `linear-gradient(${document.getElementById('direccionDegradado').value}, ${c1}, ${c2})`;
        document.querySelectorAll('.degradado-option').forEach(b => b.classList.remove('seleccionado'));
    });
    
    document.getElementById('degradadoColor2').addEventListener('input', () => {
        fondoActual.tipo = 'degradado';
        const c1 = document.getElementById('degradadoColor1').value;
        const c2 = document.getElementById('degradadoColor2').value;
        fondoActual.valor = `${c1},${c2}`;
        document.getElementById('previewDegradado').style.background = 
            `linear-gradient(${document.getElementById('direccionDegradado').value}, ${c1}, ${c2})`;
        document.querySelectorAll('.degradado-option').forEach(b => b.classList.remove('seleccionado'));
    });
    
    document.getElementById('direccionDegradado').addEventListener('change', (e) => {
        fondoActual.direccion = e.target.value;
        const c1 = document.getElementById('degradadoColor1').value;
        const c2 = document.getElementById('degradadoColor2').value;
        document.getElementById('previewDegradado').style.background = `linear-gradient(${e.target.value}, ${c1}, ${c2})`;
    });
    
    // Imagen
    document.getElementById('uploadArea').addEventListener('click', () => {
        document.getElementById('inputImagen').click();
    });
    
    document.getElementById('inputImagen').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { alert('Por favor selecciona una imagen válida'); return; }
        if (file.size > 5 * 1024 * 1024) { alert('La imagen es demasiado grande. Máximo 5MB'); return; }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            fondoActual.imagenData = e.target.result;
            document.getElementById('previewImagen').src = e.target.result;
            document.getElementById('previewContainer').style.display = 'block';
            document.getElementById('uploadArea').style.display = 'none';
        };
        reader.readAsDataURL(file);
    });
    
    document.getElementById('btnQuitarImagen').addEventListener('click', () => {
        fondoActual.imagenData = null;
        document.getElementById('previewContainer').style.display = 'none';
        document.getElementById('uploadArea').style.display = '';
        document.getElementById('inputImagen').value = '';
    });
    
    // Botones de acción
    document.getElementById('btnAplicarFondo').addEventListener('click', () => {
        if (fondoActual.tipo === 'color') {
            fondoActual.valor = document.getElementById('inputColorPersonalizado').value;
        } else if (fondoActual.tipo === 'degradado') {
            fondoActual.valor = `${document.getElementById('degradadoColor1').value},${document.getElementById('degradadoColor2').value}`;
            fondoActual.direccion = document.getElementById('direccionDegradado').value;
        }
        aplicarFondo();
        guardarFondo();
        cerrarModal();
    });
    
    document.getElementById('btnRestaurarFondo').addEventListener('click', () => {
        fondoActual = { tipo: 'color', valor: '#f5f0e8', direccion: 'to right', imagenData: null };
        sessionStorage.removeItem('fondo_imagen');
        aplicarFondo();
        guardarFondo();
        sincronizarUI();
    });
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

async function inicializarApp() {
    inicializarPersonalizadorFondo();

    try {
        await cargarDatos();
        await migrarDatosLocales();
        await cargarDatos();
    } catch (error) {
        mostrarError(`No se pudo cargar el gestor. Verificá la conexión con PostgreSQL. ${error.message}`);
    }
    renderizarMaterias();
    renderizarTareas();
    
    btnAgregar.addEventListener('click', () => ejecutarAccion(() => agregarTarea(inputTarea.value)));
    inputTarea.addEventListener('keypress', (e) => { if (e.key === 'Enter') ejecutarAccion(() => agregarTarea(inputTarea.value)); });
    inputTarea.addEventListener('input', () => { inputTarea.style.borderColor = ''; inputTarea.style.backgroundColor = ''; });
    
    btnVolver.addEventListener('click', () => seleccionarMateria(null));
    btnAgregarMateria.addEventListener('click', () => ejecutarAccion(() => agregarMateria(inputMateria.value)));
    inputMateria.addEventListener('keypress', (e) => { if (e.key === 'Enter') ejecutarAccion(() => agregarMateria(inputMateria.value)); });
    
    buscadorInput.addEventListener('input', () => {
        mostrarSpinner();
        if (timeoutBusqueda) clearTimeout(timeoutBusqueda);
        timeoutBusqueda = setTimeout(() => { ejecutarBusqueda(buscadorInput.value); ocultarSpinner(); }, 500);
    });
    
    btnToggleSidebar.addEventListener('click', () => {
        sidebar.classList.toggle('abierto');
        sidebarOverlay.classList.toggle('activo');
    });
    
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('abierto');
        sidebarOverlay.classList.remove('activo');
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('abierto');
            sidebarOverlay.classList.remove('activo');
        }
    });
    
    console.log('✅ App inicializada correctamente');
}

document.addEventListener('DOMContentLoaded', inicializarApp);