const botonAgregarTarea = document.querySelector('#add-btn')

const botonTodasTareas = document.querySelector('#button-all_tasks')
const botonTareasPendientes = document.querySelector('#button-pending_tasks')
const botonTareasCompletadas = document.querySelector('#button-complete_tasks')
const botonLimpiarTareas = document.querySelector('#clear-completed-btn')

const listaBotonesFiltro = [botonTareasCompletadas,botonTareasPendientes,botonTodasTareas]

const contenedorDeTareas = document.querySelector('#task-list')
const inputTextoTarea = document.querySelector('#task-input')
let tareas = []
let filtroActivo = 'all'

const STORAGE_KEY = 'tareas'

botonAgregarTarea.addEventListener('click', manejarAgregarTarea)

botonTodasTareas.addEventListener('click', () => cambiarFiltro('all', botonTodasTareas))
botonTareasPendientes.addEventListener('click', () => cambiarFiltro('pending', botonTareasPendientes))
botonTareasCompletadas.addEventListener('click', () => cambiarFiltro('completed', botonTareasCompletadas))
botonLimpiarTareas.addEventListener('click', limpiarCompletadas)


document.addEventListener('keydown', (event) =>{
    if (event.key === 'Enter'){
        manejarAgregarTarea()
    }
})

function manejarAgregarTarea(){
    const textoTarea = inputTextoTarea.value
    if (!textoTarea) return

    vaciarValor(inputTextoTarea)
    agregarTarea({texto: textoTarea, completada: false})
    renderizarTareas()
}

function agregarTarea(objeto) {
    tareas.push(objeto)
}

function vaciarValor(elemento) {
    elemento.value = ''
}

function renderizarTareas() {
    contenedorDeTareas.innerHTML = ''
    let tareaFormato = ''
    let tareasAMostrar = filtrarTareas(tareas, filtroActivo)

    for (let i = 0; i < tareasAMostrar.length; i++) {
        tareaFormato += `
                <li class="task-item ${tareasAMostrar[i].completada ? 'task-item--completed' : '' }" data-index="${tareas.indexOf(tareasAMostrar[i])}">
                    <button class="task-item__toggle" aria-pressed="${tareasAMostrar[i].completada}" aria-label="Marcar como completada: ${tareasAMostrar[i].texto}">
                        <span class="task-item__checkbox" aria-hidden="true"></span>
                        <span class="task-item__text">${tareasAMostrar[i].texto}</span>
                    </button>
                    <button class="task-item__delete" type="button" aria-label="Eliminar tarea: ${tareasAMostrar[i].texto}">
                        ✕
                    </button>
                </li>
                `
    }
    contenedorDeTareas.innerHTML = tareaFormato
    actualizarEstadoVacio(tareasAMostrar)
    actualizarContadorPendientes()
    actualizarProgreso()
    guardarTareasLocalStorage()
}

function filtrarTareas(arreglo, filtro) {
    if (filtro === 'all') { 
        return arreglo
    }
    if (filtro === 'pending') { 
        return arreglo.filter(tarea => tarea.completada === false) 
    }
    if (filtro === 'completed') { 
        return arreglo.filter(tarea => tarea.completada === true)
    }
}

function actualizarEstadoVacio(lista) {
    const contenedorMensajesVacio = document.querySelector('#task-empty')
    contenedorMensajesVacio.hidden = lista.length !== 0
}

contenedorDeTareas.addEventListener('click', function (event) {
    if (event.target.closest('.task-item__delete')) {
        eliminarTarea(event.target)
    } else if (event.target.closest('.task-item__toggle')) {
        completarTarea(event.target)
    }
})

function obtenerIndiceTarea(boton){
    const tareaItem = boton.closest('.task-item')
    const indexTarea = tareaItem.dataset.index
    return indexTarea
}

function eliminarTarea(boton) {
    tareas.splice(obtenerIndiceTarea(boton),1)
    renderizarTareas()
}

function completarTarea(boton) {
    const index = obtenerIndiceTarea(boton)
    tareas[index].completada = !tareas[index].completada
    renderizarTareas()
}

function actualizarProgreso() {
    const barraProgreso = document.querySelector('.header__progress-bar')
    const tareasCompletadas =  tareas.filter((tarea) => tarea.completada)

    if (tareas.length === 0) {
        barraProgreso.style.width = '0%'
        return
    }

    const porcentajeProgreso = (tareasCompletadas.length / tareas.length) * 100
    barraProgreso.style.width = `${porcentajeProgreso}%` 
}

function actualizarContadorPendientes() {
    const contador = document.querySelector('#pending-count')
    contador.textContent = `${tareas.filter(tarea => !tarea.completada).length} tareas pendientes`
}

function cambiarFiltro(filtro, boton) {
    filtroActivo = filtro
    actualizarBotones(boton)
    renderizarTareas()
}

function actualizarBotones(botonActivo) {
    for (let i = 0; i < listaBotonesFiltro.length; i++) {
        listaBotonesFiltro[i].classList.remove('task-filters__btn--active')
        listaBotonesFiltro[i].setAttribute('aria-pressed', 'false')
    }
    botonActivo.classList.add('task-filters__btn--active')
    botonActivo.setAttribute('aria-pressed', 'true')
}

function limpiarCompletadas() {
    tareas = tareas.filter(tarea => tarea.completada === false)
    renderizarTareas()
}

function guardarTareasLocalStorage() {
    const datoToString = JSON.stringify(tareas)
    localStorage.setItem(STORAGE_KEY, datoToString)
}

function cargarTareasLocalStorage() {
    const datosCrudos = localStorage.getItem(STORAGE_KEY)
    tareas = datosCrudos ? JSON.parse(datosCrudos) : []
    renderizarTareas()
}

cargarTareasLocalStorage()