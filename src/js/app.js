import { obtenerTareas, guardarTareas } from './storage.js';

// =============================================================================
// TODO (Fase 2): Importar canvas-confetti
// Una vez instalado el paquete con npm y configurado el importmap en index.html,
// importa la función de confeti aquí:
// import confetti from 'canvas-confetti';
// =============================================================================

import { obtenerTareas, guardarTareas } from './storage.js';
import confetti from 'canvas-confetti';

// Referencias a los elementos del DOM
const form = document.querySelector('#task-form');
const input = document.querySelector('#txt');
const listElement = document.querySelector('#task-list');
const counterElement = document.querySelector('#task-counter');
const filterButtons = document.querySelectorAll('.filter-btn');

// TODO (Fase 3): Obtén referencias a la barra de herramientas, contador y botones de filtro
// querySelector o querySelectorAll, '#task-counter' o '.filter-btn'

// Estado de la aplicación
let currentFilter = 'all'; // Valores posibles: 'all' | 'active' | 'completed'

const EMPTY_MESSAGES = {
  all: 'aunn no tienes tareas. agrega la primera!',
  active: 'No tienes tareas pendientes',
  completed: 'No hay tareas completadas aun',
};


/**
 * TODO (Fase 2): Disparar confeti con canvas-confetti
 * Implementa esta función para invocar la animación de confeti.
 * Consulta la documentación: https://www.npmjs.com/package/canvas-confetti
 */
function dispararConfeti() {
  confetti({
    particleCount: 120,
    spread: 75,
    origin: { y: 0.7 },
    disableForReducedMotion: true,
  });
}


/**
 * TODO (Fase 1 y 2): Alternar estado de completado
 * 1. Obtén la lista actual de tareas con obtenerTareas().
 * 2. Encuentra la tarea correspondiente por su id.
 * 3. Invierte su propiedad completed (si era false pasa a true, y viceversa).
 * 4. Si la tarea pasó a ser completada (true), llama a dispararConfeti().
 * 5. Guarda la lista actualizada con guardarTareas(list).
 * 6. Vuelve a ejecutar render() para refrescar la vista.
 * 
 * @param {number} id
 */
function toggleTarea(id) {
  const list = obtenerTareas();
  const task = list.find((t) => t.id === id);
  if (!task) return;

  task.completed = !task.completed;

  if (task.completed) dispararConfeti();

  guardarTareas(list);
  render();
}
/**
 * Elimina una tarea por su id y vuelve a renderizar.
 * @param {number} id
 */
function eliminarTarea(id) {
   const list = obtenerTareas().filter((t) => t.id !== id);
    guardarTareas(list);
    render();
}

/**
 * Renderiza la lista de tareas en el DOM.
 * 
 * TODO (Fase 1): Incluir un checkbox en cada elemento para marcar/desmarcar como completada.
 * TODO (Fase 3): Aplicar el filtro actual (currentFilter) antes de dibujar las tareas.
 * TODO (Fase 3): Actualizar el contador de tareas pendientes en el DOM.
 */
export function render() {
  const allTasks = obtenerTareas();

  // ---------------------------------------------------------------------------
  // 1. TODO (Fase 3): Actualizar contador de tareas pendientes
  // Calcula cuántas tareas tienen completed === false y actualiza el texto del contador.
  // ---------------------------------------------------------------------------
  const pending = allTasks.filter((t) => !t.completed).length;
  counterElement.textContent = `${pending} ${pending === 1 ? 'pendiente' : 'pendientes'}`;
  // ---------------------------------------------------------------------------
  // 2. TODO (Fase 3): Filtrar las tareas según currentFilter
  // Si currentFilter === 'active', muestra solo las tareas no completadas.
  // Si currentFilter === 'completed', muestra solo las completadas.
  // Si currentFilter === 'all', muestra todas.
  // ---------------------------------------------------------------------------
  const tasksToRender = allTasks; // Reemplaza esto con tu lógica de filtrado
      if (currentFilter === 'active') return !t.completed;
      if (currentFilter === 'completed') return t.completed;
      return true;
      });
  // 3. Limpiar la lista actual en el DOM
  listElement.innerHTML = '';

  // 4. Manejo de estado vacío
  if (tasksToRender.length === 0) {
    const emptyLi = document.createElement('li');
    emptyLi.className = 'empty-state';
    emptyLi.textContent = EMPTY_MESSAGES[currentFilter];
    listElement.appendChild(emptyLi);
    return;
  }
  // 5. Renderizado de cada elemento
  tasksToRender.forEach((task) => {
    const li = document.createElement('li');
    // TODO (Fase 1): Agrega la clase 'completed' al elemento si task.completed es true
    li.className = task.completed ? 'task-item completed' : 'task-item';

    const leftDiv = document.createElement('div');
    leftDiv.className = 'task-left';

    // TODO (Fase 1): Crea un <input type="checkbox" class="task-checkbox">
    // - asígnale checked = task.completed
    // - agrega un event listener 'change' que invoque toggleTarea(task.id)

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `Marcar "${task.txt}" como completada`);
    checkbox.addEventListener('change', () => toggleTarea(task.id));

    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.txt;

    // Agrega el checkbox y el span al contenedor izquierdo:
    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(span);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.type = 'button';
    // Agrega acción de borrado usando eliminarTarea(task.id);
    deleteBtn.setAttribute('aria-label', `Eliminar "${task.txt}"`);
    deleteBtn.addEventListener('click', () => eliminarTarea(task.id));


    li.appendChild(leftDiv);
    li.appendChild(deleteBtn);
    listElement.appendChild(li);
  });
}

// =============================================================================
// TODO (Fase 3): Configurar listeners para los botones de filtro
// Al hacer clic en un botón de filtro:
// 1. Remover la clase 'active' de todos los botones y agregarla al botón clickeado.
// 2. Actualizar currentFilter con el valor del filtro ('all', 'active', 'completed').
// 3. Llamar a render().
// =============================================================================

// Listeners de los botones de filtro
filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => {
      const isActive = b === btn;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-pressed', String(isActive));
    });
    currentFilter = btn.dataset.filter;
    render();
  });
});

// Listener para el envío del formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskText = input.value.trim();
  if (!taskText) return;

  const list = obtenerTareas();
  // TODO (Fase 1): Asegura que el nuevo objeto tarea incluya: completed: false
  list.push({
    id: Date.now(),
    txt: taskText,
    completed: false,
  });

  guardarTareas(list);
  input.value = '';
  render();
});

// Render inicial al cargar la página
render();
