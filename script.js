document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTask');
    const tasksList = document.getElementById('tasksList');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Función para renderizar las tareas
    function renderTasks(filter = 'all') {
        tasksList.innerHTML = '';
        
        const filteredTasks = filter === 'all' 
            ? tasks
            : tasks.filter(task => task.status === (filter === 'completed'));

        filteredTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.status;
            checkbox.addEventListener('change', () => toggleTask(task.id));

            const taskText = document.createElement('span');
            taskText.className = `task-text ${task.status ? 'completed' : ''}`;
            taskText.textContent = task.text;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            taskElement.appendChild(checkbox);
            taskElement.appendChild(taskText);
            taskElement.appendChild(deleteBtn);
            
            tasksList.appendChild(taskElement);
        });
    }

    // Función para agregar una nueva tarea
    function addTask(text) {
        const task = {
            id: Date.now(),
            text: text,
            status: false
        };
        tasks.push(task);
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }

    // Función para marcar/desmarcar una tarea
    function toggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.status = !task.status;
            saveTasks();
            renderTasks();
        }
    }

    // Función para eliminar una tarea
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    // Función para guardar las tareas en localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Event listeners
    addTaskBtn.addEventListener('click', () => {
        const text = taskInput.value.trim();
        if (text) {
            addTask(text);
        }
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const text = taskInput.value.trim();
            if (text) {
                addTask(text);
            }
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTasks(btn.dataset.filter);
        });
    });

    // Inicializar la aplicación
    renderTasks();
});
