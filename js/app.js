const botonAgregarTarea = document.querySelector('#add-btn')
const contenedorDeTareas = document.querySelector('#task-list')
const inputTextoTarea = document.querySelector('#task-input')
let tareas = []

botonAgregarTarea.addEventListener('click', function () {
    const textoTarea = inputTextoTarea.value
    if (!textoTarea) return
    
    vaciarValor(inputTextoTarea)
    agregarTarea({texto: textoTarea, completada: false })
    renderizarTareas()
})


document.addEventListener('keydown', (event) =>{
    const textoTarea = inputTextoTarea.value
    
    if (!textoTarea) return

    if (event.key === 'Enter'){
        agregarTarea({texto: textoTarea, completada: false })
        renderizarTareas()
    }
})

function agregarTarea(objeto) {
    tareas.push(objeto)
}

function vaciarValor(elemento) {
    elemento.value = ''
}

function renderizarTareas() {
    contenedorDeTareas.innerHTML = ''
    let tareaFormato = ''

    for (let i = 0; i < tareas.length; i++) {
        tareaFormato += `
                <li class="task-item ${tareas[i].completada ? 'task-item--completed' : '' }" data-index="${i}">
                    <button class="task-item__toggle" aria-pressed="false" aria-label="Marcar como completada: ${tareas[i].texto}">
                        <span class="task-item__checkbox" aria-hidden="true"></span>
                        <span class="task-item__text">${tareas[i].texto}</span>
                    </button>
                    <button class="task-item__delete" id="item-delete__button" type="button" aria-label="Eliminar tarea: ${tareas[i].texto}">
                        ✕
                    </button>
                </li>`
    }
    contenedorDeTareas.innerHTML = tareaFormato
}

contenedorDeTareas.addEventListener('click', function (event) {
    if (!event.target.closest('#item-delete__button'))  return
    eliminarTarea(event.target)
})

function eliminarTarea(boton) {
    const tareaItem = boton.closest('.task-item')
    const indexTarea = tareaItem.dataset.index
    tareas.splice(indexTarea,1)
    renderizarTareas()
}

contenedorDeTareas.addEventListener('click', function (event) {
    if (!event.target.closest('.task-item__toggle'))  return
    completarTarea(event.target)
})

function completarTarea(boton) {
    const tareaItem = boton.closest('.task-item')
    const indexTarea = tareaItem.dataset.index
    tareas[indexTarea].completada = !tareas[indexTarea].completada
    renderizarTareas()
}