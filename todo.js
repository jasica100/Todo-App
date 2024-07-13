document.addEventListener('DOMContentLoaded', () => {
    const dateTimeDisplay = document.getElementById('dateTime');
    const nameInput = document.getElementById('name');
    const newTodoForm = document.getElementById('new-todo-form');
    const filterTodosSelect = document.getElementById('filter-todos');
    const todoList = document.getElementById('todo-list');
    const footer = document.getElementById('footer'); // Assuming your footer has id="footer"

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    nameInput.value = localStorage.getItem('username') || '';

    // Update date and time
    const updateDateTime = () => {
        const now = new Date();
        const formattedDateTime = now.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });
        dateTimeDisplay.textContent = formattedDateTime;
    };

    setInterval(updateDateTime, 1000);
    updateDateTime();

    nameInput.addEventListener('input', (e) => {
        localStorage.setItem('username', e.target.value);
    });

    // Custom alert function with headline
    function customAlert(title, message) {
        const formattedMessage = `${title}\n\n${message}`;
        window.alert(formattedMessage);
    }

    newTodoForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const content = document.getElementById('content').value.trim();
        const category = document.querySelector('input[name="category"]:checked')?.value;

        if (!content || !category) {
            customAlert('Validation Error', 'Please enter a todo item and select a category.');
            return;
        }

        const newTodo = {
            content,
            category,
            done: false
        };

        todos.push(newTodo);
        localStorage.setItem('todos', JSON.stringify(todos));
        e.target.reset();
        displayTodos(filterTodosSelect.value);
    });

    filterTodosSelect.addEventListener('change', (e) => {
        displayTodos(e.target.value);
    });

    const displayTodos = (filter = 'all') => {
        todoList.innerHTML = '';

        const filteredTodos = todos.filter(todo => {
            if (filter === 'complete') return todo.done;
            if (filter === 'incomplete') return !todo.done;
            return true;
        });

        filteredTodos.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.classList.add('todo-item');
            if (todo.done) todoItem.classList.add('done');

            const label = document.createElement('label');
            const input = document.createElement('input');
            const span = document.createElement('span');
            const content = document.createElement('div');
            const actions = document.createElement('div');
            const editButton = document.createElement('button');
            const deleteButton = document.createElement('button');

            input.type = 'checkbox';
            input.checked = todo.done;
            span.classList.add('bubble', todo.category);
            content.classList.add('todo-content');
            content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
            actions.classList.add('actions');
            editButton.classList.add('edit');
            editButton.textContent = 'Edit';
            deleteButton.classList.add('delete');
            deleteButton.textContent = 'Delete';

            label.appendChild(input);
            label.appendChild(span);
            actions.appendChild(editButton);
            actions.appendChild(deleteButton);
            todoItem.appendChild(label);
            todoItem.appendChild(content);
            todoItem.appendChild(actions);

            input.addEventListener('change', (e) => {
                todo.done = e.target.checked;
                localStorage.setItem('todos', JSON.stringify(todos));
                displayTodos(filterTodosSelect.value);
            });

            editButton.addEventListener('click', () => {
                const inputField = content.querySelector('input');
                inputField.removeAttribute('readonly');
                inputField.focus();
                inputField.addEventListener('blur', (e) => {
                    inputField.setAttribute('readonly', true);
                    todo.content = e.target.value;
                    localStorage.setItem('todos', JSON.stringify(todos));
                    displayTodos(filterTodosSelect.value);
                });
            });

            deleteButton.addEventListener('click', () => {
                todos = todos.filter(t => t !== todo);
                localStorage.setItem('todos', JSON.stringify(todos));
                displayTodos(filterTodosSelect.value);
            });

            todoList.appendChild(todoItem);
        });
    };

    displayTodos();
    // Scroll event listener to hide footer on scroll
    window.addEventListener('scroll', () => {
        const footer = document.querySelector('footer');
        // Check if scrolled down more than 100px, adjust as needed
        if (window.scrollY > 100) {
            footer.style.display = 'none';
        } else {
            footer.style.display = 'block';
        }
    });
});
