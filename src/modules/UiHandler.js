import PubSub from "pubsub-js";
import tip_do from "../assets/images/tip.do.webp";
const UI_EVENTS = {
    displayTasks: "Display task in project clicked",
    displayProjects: "Display projects",
    priorityDisplay: "Display task by priority",
    updateUsername: "Edit and update username",
    todaySorting: "Display task sort by today",
    upcomingSorting: "Display future task",
}
const UI = () => {
    const projects = JSON.parse(localStorage.getItem("Project")) || [];
    const displayProjects = () => {
        const projectBox = document.querySelector('.projects');
        projectBox.innerHTML = "";
        projects.forEach(project => {
            const projectDetailContainer = document.createElement("div");
            projectDetailContainer.dataset.id = `${project.id}`;
            const btnWrapper = document.createElement("div");
            btnWrapper.classList.add("project_wrap");

            const btn = document.createElement("button");
            btn.classList.add("projectBTN");
            btn.setAttribute("data-id", project.id);
            btn.textContent = project.title;

            const delContainer = document.createElement("div");
            delContainer.dataset.id = "project_delBTN_container";

            const delIcon = document.createElement("i");
            delIcon.classList.add("fa-regular", "fa-circle-xmark", "delete_project-btn");
            delIcon.id = project.id;

            delContainer.appendChild(delIcon);
            if (project.title === "Default") {
                btnWrapper.appendChild(btn);
                projectDetailContainer.appendChild(btnWrapper);
            }
            else {
                btnWrapper.appendChild(btn);
                projectDetailContainer.appendChild(btnWrapper);
                projectDetailContainer.appendChild(delContainer);
            }
            projectBox.appendChild(projectDetailContainer);
        });
    };
    const displayTasks = (project) => {
        const taskContainer = document.querySelector('.tasks');
        taskContainer.innerHTML = "";
        taskContainer.dataset.id = project.id;
        if (project.tasks.length > 0) {
            taskContainer.classList.remove("empty");
            project.tasks.map(task => {
                const taskExist = document.querySelector(`[data-id="${task.id}"]`);
                if (taskExist) taskExist.remove();
                taskContainer.innerHTML += `
                    <div class="tasks_items with_aside ${task.complete === true? "completed":""}" data-id="${task.id}">
                        <input type="checkbox" class="checkBox" ${task.complete === true? "checked":""}>
                        <div class="tasks_info">
                            <p id="${task.title}">${task.title}</p>
                            <p id="description">${task.description}</p>
                            <p id="due_date">${task.displayDate}</p>
                        </div>
                        <div>
                        <i class="fa-regular fa-circle-xmark fa-xl"></i>
                        <button class="${task.priority}">${task.priority}</button>
                        </div>
                    </div>
                    `;
            });
        }

        else {
            // const displayImage = document.createElement('img');
            // displayImage.src = tip_do;
            // displayImage.alt = "tip.do logo"
            // const displayMessage = document.createElement('p');
            // displayMessage.textContent = `No task in ${project.title}`;
            taskContainer.classList.add("empty");
            // taskContainer.appendChild(displayImage);
            // taskContainer.appendChild(displayMessage);
            taskContainer.innerHTML += `
            <div id=no_task_message>
            <img src="${tip_do}" alt="tip.do logo">
            <div id="message_wrapper">
            <p>No task in</p>
            <span>${project.title}</span>
            </div>
            </div>
            `
        }
        const showTaskWrapper = document.getElementById("showTaskWrapper");
        showTaskWrapper.style.display = "block";
        showTaskWrapper.innerHTML += `<i class="fa-solid fa-square-plus fa-2xl add_task" id="${project.id}"></i>`;
        // main.insertAdjacentHTML("beforeend", `<div id="showTaskWrapper"><i class="fa-solid fa-square-plus fa-2xl add_task" id="${project.id}"></i></div>`);
    };
    const prioritySortingDisplay = (priorityTask, priority) => {
        const taskContainer = document.querySelector('.tasks');
        const showTaskWrapper = document.querySelector("#showTaskWrapper");
        showTaskWrapper.style.display = "none";
        taskContainer.innerHTML = "";
        if (priorityTask.length > 0) {
            taskContainer.classList.remove("empty");
            priorityTask.forEach(task => {
                // const taskExist = document.querySelector(`[data-id="${task.id}"]`);
                // if (taskExist) taskExist.remove();
                taskContainer.innerHTML += `
                <div class="tasks_items with_aside ${task.complete === true? "completed":""}" data-id="${task.id}">
                        <input type="checkbox" class="checkBox" ${task.complete === true? "checked":""} data-id="${task.projectId}">
                        <div class="tasks_info">
                            <p id="${task.title}">${task.title}</p>
                            <p id="description">${task.description}</p>
                            <p id="due_date">${task.displayDate}</p>
                        </div>
                        <div>
                        <i class="fa-regular fa-circle-xmark fa-xl"></i>
                        <button class="${task.priority}">${task.priority}</button>
                        </div>
                    </div>
                    `;
            });
        }
        else {
            taskContainer.classList.add('empty');
            taskContainer.innerHTML += `
            <div id=no_task_message>
            <img src="${tip_do}" alt="tip.do logo">
            <div id="message_wrapper">
            <p>No task with</p>
            <span>${priority} priority</span>
            </div>
            </div>
            `;
        }
        
    }
    const dateSortingUi = () => {
        const taskContainer = document.querySelector('.tasks');
        const showTaskWrapper = document.querySelector("#showTaskWrapper");
        showTaskWrapper.style.display = "none";
        taskContainer.innerHTML = "";
        const todayUi = (allTodayTask) => {
            if (allTodayTask.length > 0) {
                taskContainer.classList.remove("empty");
                allTodayTask.forEach(task => {
                    // const taskExist = document.querySelector(`[data-id="${task.id}"]`);
                    // if (taskExist) taskExist.remove();
                    taskContainer.innerHTML += `
                <div class="tasks_items with_aside ${task.complete === true? "completed":""}" data-id="${task.id}">
                        <input type="checkbox" class="checkBox" ${task.complete === true? "checked":""} data-id="${task.projectId}">
                        <div class="tasks_info">
                            <p id="${task.title}">${task.title}</p>
                            <p id="description">${task.description}</p>
                            <p id="due_date">${task.displayDate}</p>
                        </div>
                        <div>
                        <i class="fa-regular fa-circle-xmark fa-xl"></i>
                        <button class="${task.priority}">${task.priority}</button>
                        </div>
                    </div>
                    `;
                });
            }
            else {
                taskContainer.classList.add('empty');
                taskContainer.innerHTML += `
            <div id=no_task_message>
            <img src="${tip_do}" alt="tip.do logo">
            <div id="message_wrapper">
            <p>No task <span>today</span> </p>
            </div>
            </div>
            `;
            }
        };
         const upcomingUi = (allUpcomingTask) => {
             if (allUpcomingTask.length > 0) {
                taskContainer.classList.remove("empty");
                allUpcomingTask.forEach(task => {
                    // const taskExist = document.querySelector(`[data-id="${task.id}"]`);
                    // if (taskExist) taskExist.remove();
                    taskContainer.innerHTML += `
                <div class="tasks_items with_aside ${task.complete === true? "completed":""}" data-id="${task.id}">
                        <input type="checkbox" class="checkBox" ${task.complete === true? "checked":""} data-id="${task.projectId}">
                        <div class="tasks_info">
                            <p id="${task.title}">${task.title}</p>
                            <p id="description">${task.description}</p>
                            <p id="due_date">${task.displayDate}</p>
                        </div>
                        <div>
                        <i class="fa-regular fa-circle-xmark fa-xl"></i>
                        <button class="${task.priority}">${task.priority}</button>
                        </div>
                    </div>
                    `;
                });
            }
            else {
                taskContainer.classList.add('empty');
                taskContainer.innerHTML += `
            <div id=no_task_message>
            <img src="${tip_do}" alt="tip.do logo">
            <div id="message_wrapper">
            <p>No <span>upcoming</span> task</p>
            </div>
            </div>
            `;
            }
         };
        return { todayUi, upcomingUi };
    };
    return { displayProjects, displayTasks, prioritySortingDisplay, dateSortingUi };
};

const usernameUI = () => {
    const userInfoTray = JSON.parse(localStorage.getItem("Username")) || [];
    const usernameWrapper = document.querySelector('#username');
    if (Object.keys(userInfoTray).length > 0) {
        if (userInfoTray._username !== "") {
            const capitalizedUsername = userInfoTray._username.charAt(0).toUpperCase() + userInfoTray._username.slice(1).toLowerCase();
            usernameWrapper.textContent = `${capitalizedUsername}`;
        }
        else {
        usernameWrapper.textContent = `Username`;
    }
    }
    else {
        usernameWrapper.textContent = `Username`;
    }
};


// Event that add projects to project display task
PubSub.subscribe(UI_EVENTS.displayProjects, () => {
    UI().displayProjects();  
});

// Event that display task of tasks in a particular project user clicked
PubSub.subscribe(UI_EVENTS.displayTasks, (msg, project) => {
    UI().displayTasks(project);
});
// Event that display task of all project tasks by priority
PubSub.subscribe(UI_EVENTS.priorityDisplay, (msg, { priorityTask, priority }) => {
    UI().prioritySortingDisplay( priorityTask, priority );
});

PubSub.subscribe(UI_EVENTS.todaySorting, (msg, todayTasks) => {
    UI().dateSortingUi().todayUi(todayTasks);
})
PubSub.subscribe(UI_EVENTS.upcomingSorting, (msg, upcomingTasks) => {
    UI().dateSortingUi().upcomingUi(upcomingTasks)
})

// Event that make sure username get updated in real time.
PubSub.subscribe(UI_EVENTS.updateUsername, () => {
    usernameUI();
})

// Logic that publishes UI_EVENTS
const UiHandlerLogic = () => {
    const showProject = () => {
        PubSub.publish(UI_EVENTS.displayProjects);
    }
    const showTasks = (project) => {
        PubSub.publish(UI_EVENTS.displayTasks, project);
    };
    return { showProject, showTasks };
};
export { UiHandlerLogic, UI_EVENTS, usernameUI  };