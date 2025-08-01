import PubSub from "pubsub-js";
import { UI_EVENTS } from "./UiHandler";
import {format, parseISO} from "date-fns"
// // import { Taskproject, projectLogic } from "./Task_project.js";
// import { CLICK_EVENTS } from "./clickHandler.js";

// Events and Priorities factory
const setEventAndPriority = function () {
    const EVENTS = {
        SAVE_Task: "save to-do to project",
        DELETE_Task: "delete to-do from project",
        EDIT_Task: "edit and update to-do in project",
    }
    const PRIORITIES = {
        high: "High",
        medium: "Medium",
        low: "Low",
    }
    return { EVENTS, PRIORITIES };
};

// class constructor for Task list
class Task {
    constructor(title, description, priority = setEventAndPriority().PRIORITIES.medium, dueDate) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.displayDate = format(parseISO(dueDate), "eeee, MMM do, yyyy");
        this.id = crypto.randomUUID();
    }
}

// Task storage
const taskListStorage = () => {
    const getProjectTaskStorage = () => {
        return JSON.parse(localStorage.getItem("Project")) || [];
    }
    const saveTaskToProject = (newTask, project) => {
        project.tasks.push(newTask);
        // TaskprojectStorage().saveTaskproject(project);
    }

    return { getProjectTaskStorage, saveTaskToProject };
};

(function taskSubscribers() {
    // Subscribe to save Task event
    PubSub.subscribe(setEventAndPriority().EVENTS.SAVE_Task, (msg, { task, projectId }) => {
        const projectsTray = taskListStorage();
        const projects = projectsTray.getProjectTaskStorage();
        const updatedProjects = projects.map(project => {
            if (project.id === projectId) {
                projectsTray.saveTaskToProject(task, project);
                PubSub.publish(UI_EVENTS.displayTasks, project);
            }
            return project;
            // PubSub.publish(CLICK_EVENTS.show_task, project);
        });
        localStorage.setItem("Project", JSON.stringify(updatedProjects));
    });

    // Subscribe to delete Task event
    PubSub.subscribe(setEventAndPriority().EVENTS.DELETE_Task, (msg, { taskId, projectId }) => {
        const projectsTray = taskListStorage();
        const projects = projectsTray.getProjectTaskStorage();
        const updatedProjects = projects.map(project => {
            if (projectId === project.id) {
                const updatedTasks = project.tasks.filter(task => task.id !== taskId);
                project.tasks = updatedTasks;
                PubSub.publish(UI_EVENTS.displayTasks, project);
            }
            return project;
        });
        localStorage.setItem("Project", JSON.stringify(updatedProjects));
        // PubSub.publish(CLICK_EVENTS.update_project);
    });

    // Subscribe to edit Task event
    PubSub.subscribe(setEventAndPriority().EVENTS.EDIT_Task, (msg, { newTitle, newDescription, newPriority = setEventAndPriority.PRIORITIES.medium, newDueDate, taskId, projectId }) => {
        const projectsTray = taskListStorage();
        const projects = projectsTray.getProjectTaskStorage();
        const updatedProjects = projects.map(project => {
            if (project.id === projectId) {
                const updatedTasks = project.tasks.map(task => {
                if (taskId === task.id) {
                    task.title = newTitle;
                    task.description = newDescription;
                    task.priority = newPriority;
                    task.dueDate = newDueDate;
                }
                return task;
                });
                project.tasks = updatedTasks
                PubSub.publish(UI_EVENTS.displayTasks, project);
            }
            return project;
        });
        localStorage.setItem("Project", JSON.stringify(updatedProjects));
        // PubSub.publish(CLICK_EVENTS.update_project);
    });
})();

const taskLogic = () => {
    const addTask = (newTask, containerId) => {
        console.log(`New Task: ${newTask}\n Container Id: ${containerId}`);
        PubSub.publish(setEventAndPriority().EVENTS.SAVE_Task, { task: newTask, projectId: containerId});
    };
    const deleteTask = (taskId, containerId) => PubSub.publish(setEventAndPriority().EVENTS.DELETE_Task, { taskId: taskId, projectId: containerId });
    const editTask = (newTitle, newDescription, newPriority, newDueDate, taskId, containerId) => {
        PubSub.publish(setEventAndPriority().EVENTS.EDIT_Task, { newTitle: newTitle, newDescription: newDescription, newPriority: newPriority, newDueDate: newDueDate, taskId: taskId, projectId: containerId});
    }
    return { addTask, deleteTask, editTask };
};
export { taskLogic, Task };
