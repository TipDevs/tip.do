import PubSub from "pubsub-js";
import { Project, projectLogic } from "./project";
import { Task, taskLogic } from "./task";
import { UiHandlerLogic, UI_EVENTS } from "./UiHandler";
import { asideToggler } from "./toggle";
import { newUser } from "./username";
import "./prioritySorting";
import "./dateSorting";

// global variables
const toggleAside = asideToggler();
const mobileMediaQuery = window.matchMedia('(max-width: 760px)');
const CLICK_EVENTS = {
    update_project: "update project list on dom",
    show_task: "show task",
};

// pubsub subscribers for click event.
(function clickSubscribers() {
    PubSub.subscribe(CLICK_EVENTS.update_project, () => {
        UiHandlerLogic().showProject();
    });
    PubSub.subscribe(CLICK_EVENTS.show_task, (msg, project) => {
        UiHandlerLogic().showTasks(project);
        addNewTaskForm();
    });
})();


// Use event delegation to ensure no errors when deleting.
const deleteProjectEvent = () => {
    const projectBox = document.querySelector(".projects");
    projectBox.addEventListener("click", (e) => {
        const deleteProjectIcon = e.target.closest('.delete_project-btn');
        if (deleteProjectIcon) {
            const id = deleteProjectIcon.id;
            projectLogic().deleteProject(id);
            UiHandlerLogic().showProject();
        }
    })
};

// 
const addNewProjectEvent = (() => {
    const addNewProjectButton = document.querySelector('.Add_new_project');
    addNewProjectButton.addEventListener("click", () => {
        const formContainerExist = document.querySelector('#pop_up_form');
        if (formContainerExist) formContainerExist.remove();
        const form = document.createElement('form');
        form.innerHTML = `
        <input id="new_project_title">
        <button id="Add_new_project">Add New Project</button>
        `;
        form.id = 'pop_up_form';
        addNewProjectButton.after(form);
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const new_project_title = document.querySelector('#new_project_title');
            // const Add_new_projectBTN = document.querySelector('#Add_new_project');
            if (new_project_title.value.trim() === '') return;
            const newProject = new Project(new_project_title.value.trim());
            projectLogic().addNewProject(newProject);
            setTimeout(() => {
                const newProjectAlert = document.createElement('div');
                newProjectAlert.classList.add('alert');
                newProjectAlert.textContent = "New project added";
                addNewProjectButton.after(newProjectAlert);
                setTimeout(() => {
                    newProjectAlert.remove();
                }, 2000);
            }, 10);
            form.remove();
            PubSub.publish(UI_EVENTS.displayTasks, newProject);
            if (mobileMediaQuery.matches) {
                toggleAside.hideAsideEvent(mobileMediaQuery);
            };
        });
    });
    deleteProjectEvent();
})();

const displayTaskInProject = () => {
    const projects = JSON.parse(localStorage.getItem("Project")) || [];
    const projectList = document.querySelector(".projects");

    projectList.addEventListener("click", (e) => {
        const clickedButton = e.target.closest(".projectBTN");

        if (!clickedButton || !projectList.contains(clickedButton)) return;

        const projectId = clickedButton.dataset.id;

        projects.forEach(project => {
            if (project.id === projectId) {
                const formContainerExist = document.getElementById("new_task_form_container");
                if (formContainerExist) formContainerExist.remove();
                PubSub.publish(CLICK_EVENTS.show_task, project);
                if (mobileMediaQuery.matches) {
                    // toggleAside.hideAside.addEventListener("click", () => {
                        toggleAside.hideAsideEvent(mobileMediaQuery);
                    // });
                }
            }
        });
    });
};

const addNewTaskForm = () => {
    // const projectTray = JSON.parse(localStorage.getItem("Project")) || [];
    // const projectId = projectTray.map(project => project.id);
    const main = document.querySelector("main");
    const showTaskWrapper = document.querySelector("#showTaskWrapper");
    showTaskWrapper.addEventListener("click", (e) => {
        const addTaskQueryBtn = e.target.closest(".add_task");
        const formContainerExist = document.getElementById("new_task_form_container");
        if (formContainerExist) formContainerExist.remove();
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
                    <textarea id="task_description" name="task_description" required></textarea>
                    </label>
                    <label for="priorities">Choose Priority
                    <select id="priorities" name="priorities">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
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
        addNewTaskToProjectTray(form);
        formContainer.append(formContainerH2, form);
        main.appendChild(formContainer);
    });
};

// Event listener function attached task form to add new task to task tray of a project
const addNewTaskToProjectTray = (taskForm) => {
    const taskContainer = document.querySelector('.tasks');
    const taskContainerId = taskContainer.dataset.id;
  

  taskForm.addEventListener("submit", (event) => {
      event.preventDefault(); // stop the page from reloading
      const formContainer = document.querySelector("#new_task_form_container");

    // Always target fields *inside the form*
    const task_title = taskForm.querySelector("#task_title");
    const task_description = taskForm.querySelector("#task_description");
    const priorityOptions = taskForm.querySelector("#priorities");
    const dueDate = taskForm.querySelector("#dueDate");

    const newTask = new Task(
      task_title?.value.trim(),
      task_description?.value.trim(),
      priorityOptions?.value,
      dueDate?.value
    );

    //   console.log(newTask);
      taskLogic().addTask(newTask, taskContainerId);
      formContainer.remove();
  });
};
toggleAside.showAside.addEventListener("click", () => {
    toggleAside.showAsideEvent(mobileMediaQuery);
});
toggleAside.hideAside.addEventListener("click", () => {
    toggleAside.hideAsideEvent(mobileMediaQuery);
});

// priority selector event listener
(function priorityEvent() {
    const priorityButtons = document.querySelectorAll(".priorities > button");
    priorityButtons.forEach(button => {
        button.addEventListener("click", () => {
            const buttonId = button.id;
            PubSub.publish("Priority display", buttonId);
            if (mobileMediaQuery.matches) {
                toggleAside.hideAsideEvent(mobileMediaQuery);
            }   
        });
    });
})();
(function dateSorting() {
    const todayTaskBtn = document.querySelector("#todayTaskBtn");
    const upcomingTaskBtn = document.querySelector("#upcomingTaskBtn");
    todayTaskBtn.addEventListener("click", () => {
        PubSub.publish("today sorting");
    });
    upcomingTaskBtn.addEventListener("click", () => {
        PubSub.publish("upcoming task")
    });
})();
(function editUsername() {
    const usernameMessageContainer = document.querySelector('#username_container');
    // const editUsernameBtn = usernameMessageContainer.querySelector('.edit_btn');
    const usernameForm = document.querySelector('#username_form');
    usernameMessageContainer.addEventListener("click", (event) => {
        event.target.closest(".edit_btn");
        usernameMessageContainer.style.display = "none";
        usernameForm.style.display = "block";
    });
    usernameForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const usernameFormInput = usernameForm.querySelector("input");
        newUser.userName = `${usernameFormInput.value}`;
        usernameMessageContainer.style.display = "block";
        usernameForm.reset();
        usernameForm.style.display = "none";
        PubSub.publish("edit username", newUser);
        PubSub.publish(UI_EVENTS.updateUsername);
        })
})();
export { displayTaskInProject };