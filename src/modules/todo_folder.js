import PubSub from "pubsub-js";
import { CLICK_EVENTS } from "./clickHandler";
class TodoFolder {
    constructor(title) {
        this.title = title;
        this.todos = [];
        this.id = crypto.randomUUID();
    }
}
const EVENT = {
    SAVE_FOLDER: "save to-do folder to local storage",
    DELETE_FOLDER: "delete to-do folder from local storage", 
}
const todoFolderStorage = (() => {
    const key = "Project";
    const getTodoFolder = () => {
        return JSON.parse(localStorage.getItem(key)) || [];
    }
    const saveTodoFolder = (folders) => {
    // Make sure folders is always an array
    if (!Array.isArray(folders)) {
        folders = [folders];
    }
        localStorage.setItem(key, JSON.stringify(folders));
    };

    PubSub.subscribe(EVENT.SAVE_FOLDER, (msg, folder) => {
        const folders = getTodoFolder();
        folders.push(folder);
        saveTodoFolder(folders);
        PubSub.publish(CLICK_EVENTS.update_project);
    });
    PubSub.subscribe(EVENT.DELETE_FOLDER, (msg, folderId) => {
        const folders = getTodoFolder();
        const filteredFolders = folders.filter(folder => folder.id !== folderId);
        saveTodoFolder(filteredFolders);
        PubSub.publish(CLICK_EVENTS.update_project);
    })
    return { getTodoFolder, saveTodoFolder };
})();

const FolderLogic = (() => {
    const addNewFolder = (folder) => PubSub.publish(EVENT.SAVE_FOLDER, folder);
    const deleteFolder = (folderId) => PubSub.publish(EVENT.DELETE_FOLDER, folderId);

    const initDefaultFolder = () => {
        const folders = todoFolderStorage.getTodoFolder();
        let defaultFolder = folders.find(folder => folder.title === "Default");

        if (!defaultFolder) {
            defaultFolder = new TodoFolder("Default");
            addNewFolder(defaultFolder);
        }

        return defaultFolder;
    };

    return { addNewFolder, deleteFolder, initDefaultFolder };
})();

const defaultFolder = FolderLogic.initDefaultFolder();
export { todoFolderStorage, TodoFolder, FolderLogic };