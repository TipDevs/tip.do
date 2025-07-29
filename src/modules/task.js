import PubSub from "pubsub-js";
// // import { TaskFolder, FolderLogic } from "./Task_folder.js";
// import { CLICK_EVENTS } from "./clickHandler.js";

// Events and Priorities factory
const setEventAndPriority = function () {
    const EVENTS = {
        SAVE_Task: "save to-do to folder",
        DELETE_Task: "delete to-do from folder",
        EDIT_Task: "edit and update to-do in folder",
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
        this.id = crypto.randomUUID();
    }
}

// Task storage
const taskListStorage = () => {
    const getFolderTaskStorage = () => {
        return JSON.parse(localStorage.getItem("Project")) || [];
    }
    const saveTaskToFolder = (newTask, folder) => {
        folder.tasks.push(newTask);
        // TaskFolderStorage().saveTaskFolder(folder);
    }

    return { getFolderTaskStorage, saveTaskToFolder };
};

(function taskSubscribers() {
    // Subscribe to save Task event
    PubSub.subscribe(setEventAndPriority().EVENTS.SAVE_Task, (msg, { task, folderId }) => {
        const foldersTray = taskListStorage();
        const folders = foldersTray.getFolderTaskStorage();
        const updatedFolders = folders.map(folder => {
            if (folder.id === folderId) {
                foldersTray.saveTaskToFolder(task, folder);
            }
            return folder;
            // PubSub.publish(CLICK_EVENTS.show_task, folder);
        });
        localStorage.setItem("Project", JSON.stringify(updatedFolders));
    });

    // Subscribe to delete Task event
    PubSub.subscribe(setEventAndPriority().EVENTS.DELETE_Task, (msg, { taskId, folderId }) => {
        const foldersTray = taskListStorage();
        const folders = foldersTray.getFolderTaskStorage();
        const updatedFolders = folders.map(folder => {
            if (folderId === folder.id) {
                const updatedTasks = folder.tasks.filter(task => task.id !== taskId);
                folder.tasks = updatedTasks;
            }
            return folder;
        });
        localStorage.setItem("Project", JSON.stringify(updatedFolders));
        // PubSub.publish(CLICK_EVENTS.update_project);
    });

    // Subscribe to edit Task event
    PubSub.subscribe(setEventAndPriority().EVENTS.EDIT_Task, (msg, { newTitle, newDescription, newPriority = setEventAndPriority.PRIORITIES.medium, newDueDate, taskId, folderId }) => {
        const foldersTray = taskListStorage();
        const folders = foldersTray.getFolderTaskStorage();
        const updatedFolders = folders.map(folder => {
            if (folder.id === folderId) {
                const updatedTasks = folder.tasks.map(task => {
                if (taskId === task.id) {
                    task.title = newTitle;
                    task.description = newDescription;
                    task.priority = newPriority;
                    task.dueDate = newDueDate;
                }
                return task;
                });
                folder.tasks = updatedTasks
            }
            return folder;
        });
        localStorage.setItem("Project", JSON.stringify(updatedFolders));
        // PubSub.publish(CLICK_EVENTS.update_project);
    });
})();

const taskLogic = () => {
    const addTask = (newTask, containerId) => {
        console.log(`New Task: ${newTask}\n Container Id: ${containerId}`);
        PubSub.publish(setEventAndPriority().EVENTS.SAVE_Task, { task: newTask, folderId: containerId});
    };
    const deleteTask = (taskId, containerId) => PubSub.publish(setEventAndPriority().EVENTS.DELETE_Task, { taskId: taskId, folderId: containerId });
    const editTask = (newTitle, newDescription, newPriority, newDueDate, taskId, containerId) => {
        PubSub.publish(setEventAndPriority().EVENTS.EDIT_Task, { newTitle: newTitle, newDescription: newDescription, newPriority: newPriority, newDueDate: newDueDate, taskId: taskId, folderId: containerId});
    }
    return { addTask, deleteTask, editTask };
};
export { taskLogic, Task };
