import { todoFolderStorage, TodoFolder, FolderLogic } from "./todo_folder";
import { setEventAndPriority } from "./todo_list";
import { UiHandlerLogic } from "./UiHandler";
import { TodoList, TodoLogic } from "./todo_list";
import PubSub from "pubsub-js";
const CLICK_EVENTS = {
    update_project: "update project list on dom",
    show_todos: "show to dos",
}

// 
const mobileMediaQuery = window.matchMedia('(max-width: 760px)');
const projectDisplayerEvent = () => {
    const folders = todoFolderStorage().getTodoFolder();
    const projectList = document.querySelector(".project_list");

    projectList.addEventListener("click", (e) => {
        const clickedButton = e.target.closest(".projectBTN");

        if (!clickedButton || !projectList.contains(clickedButton)) return;

        const projectId = clickedButton.dataset.id;

        folders.forEach(folder => {
            if (folder.id === projectId) {
                PubSub.publish(CLICK_EVENTS.show_todos, folder);
                if (mobileMediaQuery.matches) {
                    toggleAside.hideAsideEvent(mobileMediaQuery);
                }
            }
        });
    });
};

// 
const addNewFolderEvent = () => {
    const addNewFolderButton = document.querySelector('.Add_new_project');
    addNewFolderButton.addEventListener("click", () => {
        const formExist = document.querySelector('#pop_up_form');
        if (formExist) formExist.remove();
        const form = document.createElement('form');
        form.innerHTML = `
        <input id="new_project_title">
        <button id="Add_new_project">Add New Project</button>
        `;
        form.id = 'pop_up_form';
        addNewFolderButton.after(form);
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const new_project_title = document.querySelector('#new_project_title');
            // const Add_new_projectBTN = document.querySelector('#Add_new_project');
            if (new_project_title.value.trim() === '') return;
            const newProject = new TodoFolder(new_project_title.value.trim());
            FolderLogic.addNewFolder(newProject);
            setTimeout(() => {
                const newProjectAlert = document.createElement('div');
                newProjectAlert.classList.add('alert');
                newProjectAlert.textContent = "New project added";
                addNewFolderButton.after(newProjectAlert);
                setTimeout(() => {
                    // window.location.reload();
                    newProjectAlert.remove();
                }, 2000);
                }, 10);
        });
    });
    deleteProjectEvent();
};

// Use event delegation to ensure no errors when deleting.
const deleteProjectEvent = () => {
    const project_list = document.querySelector(".project_list");
    project_list.addEventListener("click", (e) => {
        const deleteProjectIcon = e.target.closest('.delete_project-btn');
        if (deleteProjectIcon) {
            const id = deleteProjectIcon.id;
            FolderLogic.deleteFolder(id);
            UiHandlerLogic().addProject();
        }
    })
};

const addNewTodoToFolderForm = () => {
    const folderTray = todoFolderStorage().getTodoFolder();
    const folderId = folderTray.map(folder => folder.id);
    const main = document.querySelector("main");
    const add_list_wrapper = document.querySelector("#add_list_wrapper");
        add_list_wrapper.addEventListener("click", (e) => {
            const addTodoQueryBtn = e.target.closest(".add_list");
            // const formExist = document.getElementById("new_task_form");
            // if (formExist) formExist.remove();
            const formContainer = document.createElement("div");
            formContainer.id = "new_task_form_container";
            const formContainerH2 = document.createElement("h2");
            formContainerH2.textContent = "Add New Task Form";
            const form = document.createElement("form");
            form.id = "new_task_form";
            form.innerHTML = `
                    <label for="task_title">Task Title
                    <input type="text" id="task_title" name="task_title" required>
                    </label>
                    <label for="task_description">Task Description
                    <textarea id="task_description" name="task_description" required>
                    </textarea>
                    </label>
                    <label for="priorities">Choose Priority
                    <select id="priorities" name="priorities">
                    <option value="${setEventAndPriority().PRIORITIES.high}">High</option>
                    <option value="${setEventAndPriority().PRIORITIES.medium}">Medium</option>
                    <option value="${setEventAndPriority().PRIORITIES.low}">Low</option>
                    </select>
                    </label>
                    <label for="dueDate">Due Date
                    <input type="date" id="dueDate" name="dueDate" required>
                    </label>
                    `
                ;
            const new_task_formButton = document.createElement("button");
            new_task_formButton.type = "submit";
            new_task_formButton.classList.add('submit');
            new_task_formButton.textContent = "Add New Task";
            form.appendChild(new_task_formButton);
            addNewTodoToFolderTray(form);
            formContainer.append(formContainerH2, form);
            main.appendChild(formContainer);
        });
}

const addNewTodoToFolderTray = (taskForm) => {
    const listContainer = document.querySelector('.lists');
    const listContainerId = listContainer.dataset.id;
  

  taskForm.addEventListener("submit", (event) => {
      event.preventDefault(); // stop the page from reloading
      const formContainer = document.querySelector("#new_task_form_container");

    // Always target fields *inside the form*
    const task_title = taskForm.querySelector("#task_title");
    const task_description = taskForm.querySelector("#task_description");
    const priorityOptions = taskForm.querySelector("#priorities");
    const dueDate = taskForm.querySelector("#dueDate");

    const newTask = new TodoList(
      task_title?.value.trim(),
      task_description?.value.trim(),
      priorityOptions?.value,
      dueDate?.value
    );

    //   console.log(newTask);
      TodoLogic().addTodo(newTask, listContainerId);
      formContainer.remove();
  });
};

PubSub.subscribe(CLICK_EVENTS.update_project, () => {
    UiHandlerLogic().addProject();
});
PubSub.subscribe(CLICK_EVENTS.show_todos, (msg, folder) => {
    UiHandlerLogic().showToDos(folder);
    addNewTodoToFolderForm();
});

const toggleAside = (function () {
    const showAside = document.querySelector('.show');
    const hideAside = document.querySelector('.hide');
    const aside = document.querySelector('aside');
    const main = document.querySelector('main');
    const body = document.querySelector("body");
    const hideAsideEvent = function (query) {
        if (query.matches) {
            aside.style.display = "none";
            body.classList.remove("with_aside");
            body.classList.add("no_aside");
            main.style.display = "flex"
            showAside.style.display = "block";
        }
        else {
            aside.style.display = "none";
            body.classList.remove("with_aside");
            body.classList.add("no_aside");
            main.classList.remove("with_aside")
            showAside.style.display = "block";
        }
    };

    const showAsideEvent = (query) => {
        if (query.matches) {
            aside.style.display = "flex";
            body.classList.remove("no_aside");
            body.classList.add("with_aside");
            main.style.display = "none";
            showAside.style.display = "none";
        }
        else {
            aside.style.display = "flex";
            body.classList.remove("no_aside");
            body.classList.add("with_aside");
            main.classList.add("with_aside")
            showAside.style.display = "none";
        }
    };

    showAside.addEventListener("click", () => {
        showAsideEvent(mobileMediaQuery);
    });
    hideAside.addEventListener("click", () => {
        hideAsideEvent(mobileMediaQuery);
    });
    return { hideAsideEvent, showAsideEvent };
})();
export { projectDisplayerEvent, addNewFolderEvent, CLICK_EVENTS };