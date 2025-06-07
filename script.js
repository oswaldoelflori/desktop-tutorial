let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTask');
    const tasksList = document.getElementById('tasksList');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const themeToggle = document.getElementById('themeToggle');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = 'Modo Claro';
    }

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
            taskText.addEventListener('dblclick', () => editTask(task, taskElement, taskText));

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
        if (tasks.some(t => t.text.toLowerCase() === text.toLowerCase())) {
            alert('La tarea ya existe');
            return;
        }
        const task = {
            id: Date.now(),
            text: text,
            status: false
        };
        tasks.push(task);
        saveTasks();
        renderTasks(currentFilter);
        taskInput.value = '';
    }

    // Función para marcar/desmarcar una tarea
    function toggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.status = !task.status;
            saveTasks();
            renderTasks(currentFilter);
        }
    }

    // Función para eliminar una tarea
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks(currentFilter);
    }

    function editTask(task, taskElement, taskTextElement) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.text;
        input.className = 'edit-input';

        const finishEdit = () => {
            const newText = input.value.trim();
            if (!newText) {
                renderTasks(currentFilter);
                return;
            }
            if (tasks.some(t => t.id !== task.id && t.text.toLowerCase() === newText.toLowerCase())) {
                alert('La tarea ya existe');
                input.focus();
                return;
            }
            task.text = newText;
            saveTasks();
            renderTasks(currentFilter);
        };

        input.addEventListener('blur', finishEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                finishEdit();
            }
        });

        taskElement.replaceChild(input, taskTextElement);
        input.focus();
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
            currentFilter = btn.dataset.filter;
            renderTasks(currentFilter);
        });
    });

    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark');
        themeToggle.textContent = isDark ? 'Modo Claro' : 'Modo Oscuro';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Inicializar la aplicación
    renderTasks(currentFilter);
});
