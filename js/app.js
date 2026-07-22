const botonAgregarTarea = document.querySelector('#add-btn')

const botonTodasTareas = document.querySelector('#button-all_tasks')
const botonTareasPendientes = document.querySelector('#button-pending_tasks')
const botonTareasCompletadas = document.querySelector('#button-complete_tasks')
const botonLimpiarTareas = document.querySelector('#clear-completed-btn')

const contenedorDeTareas = document.querySelector('#task-list')
const inputTextoTarea = document.querySelector('#task-input')
let tareas = []
let filtroActivo = 'all'

botonAgregarTarea.addEventListener('click', manejarAgregarTarea)

botonTodasTareas.addEventListener('click', mostrarTodasTareas)
botonTareasPendientes.addEventListener('click', mostrarTareasPendientes)
botonTareasCompletadas.addEventListener('click', mostrarTareasCompletadas)
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
    let tareasAMostrar = [...tareas]

    if (filtroActivo === 'pending') { tareasAMostrar = tareasAMostrar.filter(tarea => tarea.completada === false) }
    if (filtroActivo === 'completed') { tareasAMostrar = tareasAMostrar.filter(tarea => tarea.completada === true)}

    for (let i = 0; i < tareasAMostrar.length; i++) {
        tareaFormato += `
                <li class="task-item ${tareasAMostrar[i].completada ? 'task-item--completed' : '' }" data-index="${tareas.indexOf(tareasAMostrar[i])}">
                    <button class="task-item__toggle" aria-pressed="false" aria-label="Marcar como completada: ${tareasAMostrar[i].texto}">
                        <span class="task-item__checkbox" aria-hidden="true"></span>
                        <span class="task-item__text">${tareasAMostrar[i].texto}</span>
                    </button>
                    <button class="task-item__delete" type="button" aria-label="Eliminar tarea: ${tareasAMostrar[i].texto}">
                        ✕
                    </button>
                </li>`
    }
    contenedorDeTareas.innerHTML = tareaFormato
    actualizarEstadoVacio(tareasAMostrar)
    actualizarContadorPendientes()
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

function actualizarContadorPendientes() {
    const contador = document.querySelector('#pending-count')
    contador.textContent = `${tareas.filter(tarea => !tarea.completada).length} tareas pendientes`
}

function mostrarTodasTareas() {
    filtroActivo = 'all'
    botonTodasTareas.classList.add('task-filters__btn--active')
    botonTareasPendientes.classList.remove('task-filters__btn--active')
    botonTareasCompletadas.classList.remove('task-filters__btn--active')
    renderizarTareas()
}
function mostrarTareasPendientes() {
    filtroActivo = 'pending'
    botonTareasPendientes.classList.add('task-filters__btn--active')
    botonTareasCompletadas.classList.remove('task-filters__btn--active')
    botonTodasTareas.classList.remove('task-filters__btn--active')
    renderizarTareas()
}
function mostrarTareasCompletadas() {
    filtroActivo = 'completed'
    botonTareasCompletadas.classList.add('task-filters__btn--active')
    botonTareasPendientes.classList.remove('task-filters__btn--active')
    botonTodasTareas.classList.remove('task-filters__btn--active')
    renderizarTareas()
}

function limpiarCompletadas() {
    tareas = tareas.filter(tarea => tarea.completada === false)
    renderizarTareas()
}