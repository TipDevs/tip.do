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
    taskFormEvent: "add event listener to task form",
    taskBtnEvent: "task button for form render always active",
};

// pubsub subscribers for click event.
// (function clickSubscribers() {
    PubSub.subscribe(CLICK_EVENTS.update_project, () => {
        UiHandlerLogic().showProject();
        displayTaskInProject();
        deleteProjectEvent();
    });
    PubSub.subscribe(CLICK_EVENTS.show_task, (msg, project) => {
        UiHandlerLogic().showTasks(project);
        PubSub.publish(CLICK_EVENTS.taskBtnEvent);
    });
    PubSub.subscribe(CLICK_EVENTS.taskBtnEvent, () => {
        // PubSub.unsubscribe(UI_EVENTS.editTaskForm);
        // PubSub.unsubscribe(UI_EVENTS.addTaskForm);
        addNewTaskForm();
    })
    PubSub.subscribe(CLICK_EVENTS.taskFormEvent, (msg, taskForm) => {
        addTaskToProjectTray(taskForm);
    })
// })();


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
        <i class="fa-regular fa-circle-xmark fa-xl cancelForm"></i>
        <input id="new_project_title" type="text">
        <button id="Add_new_project" type="submit">Add New Project</button>
        `;
        form.id = 'pop_up_form';
        addNewProjectButton.after(form);
        form.addEventListener("click", (event) => {
            const target = event.target;
            if (target.closest("#Add_new_project")) {
                event.preventDefault();
                const new_project_title = document.querySelector('#new_project_title');
                // const Add_new_projectBTN = document.querySelector('#Add_new_project');
                if (new_project_title.value.trim() === '') return;
                if (new_project_title.value.trim().length > 30) {
                    new_project_title.value = "Too long...";
                    setTimeout(() => {
                        new_project_title.value = "30 characters max!";
                        setTimeout(() => {
                            new_project_title.value = "";
                        }, 1500);
                    }, 1000);
                    return;
                }
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
                PubSub.publish(CLICK_EVENTS.show_task, newProject);
                PubSub.publish(CLICK_EVENTS.update_project);
                if (mobileMediaQuery.matches) {
                    toggleAside.hideAsideEvent(mobileMediaQuery);
                };    
            }
            if (target.closest(".cancelForm")) {
                form.remove();
            }
        });
    });
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
        PubSub.publish(CLICK_EVENTS.update_project);
    });
};

const addNewTaskForm = () => {
    const main = document.querySelector("main");
    main.addEventListener("click",  (e) => {
        const target = e.target;
        if (target.closest(".editTask_btn")) {
            const projectId = target.dataset.projectId;
            const taskId = target.dataset.taskId;
            PubSub.publish(UI_EVENTS.editTaskForm, { projectId: projectId, taskId: taskId });
        }
        if (target.closest(".add_task")) {
            PubSub.publish(UI_EVENTS.addTaskForm);
        }
    });
};

// Event listener function attached task form to add new task to task tray of a project
const addTaskToProjectTray = (taskForm) => {
    const taskContainer = document.querySelector('.tasks');
    const taskContainerId = taskContainer.dataset.id;
  

    taskForm.addEventListener("click", (event) => {
        const target = event.target;
        if (target.closest(".cancelForm")) {
            taskForm.remove();
            // PubSub.publish(CLICK_EVENTS.taskBtnEvent);
        }
        if (target.closest(".submit.addNew")) {
            event.preventDefault(); // stop the page from reloading
            // Always target fields *inside the form*
            const task_title = taskForm.querySelector("form #task_title");
            const task_description = taskForm.querySelector("form #task_description");
            const priorityOptions = taskForm.querySelector("form #priorities");
            const dueDate = taskForm.querySelector("form #dueDate");
            if (task_title.value.trim().length > 20) {
                task_title.value = "Too long...";
                setTimeout(() => {
                    task_title.value = "20 characters max!";
                    setTimeout(() => {
                        task_title.value = "";
                    }, 1500);
                }, 1000);
                return;
            }
            const newTask = new Task(
            task_title?.value.trim(),
            task_description?.value.trim(),
            priorityOptions?.value,
            dueDate?.value
            );
            taskLogic().addTask(newTask, taskContainerId);
            taskForm.remove();
        }
        if (target.closest(".submit.edit")) {
            event.preventDefault(); // stop the page from reloading
            // Always target fields *inside the form*
            const task_title = taskForm.querySelector("form #task_title");
            const task_description = taskForm.querySelector("form #task_description");
            const priorityOptions = taskForm.querySelector("form #priorities");
            const dueDate = taskForm.querySelector("form #dueDate");
            const projectId = target.dataset.projectId;
            const taskId = target.dataset.taskId;
            let oldTitle = task_title.value.trim();
            if (task_title.value.trim().length > 20) {
                task_title.value = "Too long...";
                setTimeout(() => {
                    task_title.value = "20 characters max!";
                    setTimeout(() => {
                        task_title.value = oldTitle;
                    }, 1500);
                }, 1000);
                return;
            }
            taskLogic().editTask(task_title.value.trim(), task_description.value.trim(), priorityOptions.value.trim(), dueDate.value.trim(), taskId, projectId);
            taskForm.remove();
        }
        PubSub.publish(CLICK_EVENTS.update_project);
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
        if (mobileMediaQuery.matches) {
            toggleAside.hideAsideEvent(mobileMediaQuery);
        };
    });
    upcomingTaskBtn.addEventListener("click", () => {
        PubSub.publish("upcoming task");
        if (mobileMediaQuery.matches) {
            toggleAside.hideAsideEvent(mobileMediaQuery);
        }
    });
})();
(function editUsername() {
    const usernameMessageContainer = document.querySelector('#username_container');
    // const editUsernameBtn = usernameMessageContainer.querySelector('.edit_btn');
    const usernameForm = document.querySelector('#username_form');
    usernameMessageContainer.addEventListener("click", (event) => {
        event.target.closest(".edit_btn");
        usernameMessageContainer.style.display = "none";
        usernameForm.style.display = "flex";
        usernameForm.querySelector("input").type = "text";
    });
    usernameForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const usernameFormInput = usernameForm.querySelector("input");
        if (usernameFormInput.value.length > 8) {
            usernameFormInput.value = "Too long...";
            setTimeout(() => {
                usernameFormInput.value = "8 characters max!";
                setTimeout(() => {
                    usernameFormInput.value = "";
                }, 1500);
            }, 1000);
            return;
        };
        newUser.userName = `${usernameFormInput.value}`;
        usernameMessageContainer.style.display = "block";
        usernameForm.reset();
        usernameForm.style.display = "none";
        PubSub.publish("edit username", newUser);
        PubSub.publish(UI_EVENTS.updateUsername);
        })
})();
(function toggleCompletionAndDeleteTaskEvent() { 
    const taskContainer = document.querySelector(".tasks");
    taskContainer.addEventListener("click", (event) => {
        const target = event.target;
        const task = target.closest(".tasks_items");
        if (!task) return;
        if (target.closest(".checkBox")) {
            const projectId = taskContainer.dataset.id || target.closest(".checkbox").dataset.id;
            const taskId = task.dataset.id;
            taskLogic().toggleCompletion(taskId, projectId);
            task.classList.toggle("completed");
        }
        if (target.closest(".deleteTask")) {
            const projectId = taskContainer.dataset.id || target.closest(".checkbox").dataset.id;
            const taskId = task.dataset.id;
            taskLogic().deleteTask(taskId, projectId);
            task.remove();
        }
        PubSub.publish(CLICK_EVENTS.update_project);
    });
})();
export { displayTaskInProject, CLICK_EVENTS };