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
const todoFolderStorage = () => {
  const key = "Project";

  const getTodoFolder = () => {
    return JSON.parse(localStorage.getItem(key)) || [];
  };

  const saveTodoFolder = (folderObj) => {
    const folders = getTodoFolder();

    // Prevent accidentally wrapping arrays
    if (Array.isArray(folderObj)) {
      return;
    }

    const index = folders.findIndex(f => f.id === folderObj.id);

    if (index !== -1) {
      folders[index] = folderObj;
    } else {
      folders.push(folderObj);
    }

    localStorage.setItem(key, JSON.stringify(folders));
  };

  return { getTodoFolder, saveTodoFolder };
};


PubSub.subscribe(EVENT.SAVE_FOLDER, (msg, folder) => {
  const folderStorageHandler = todoFolderStorage();
  folderStorageHandler.saveTodoFolder(folder);

  PubSub.publish(CLICK_EVENTS.update_project);
});

PubSub.subscribe(EVENT.DELETE_FOLDER, (msg, folderId) => {
    const folderStorageHandler = todoFolderStorage();
    const folders = folderStorageHandler.getTodoFolder();
    const filteredFolders = folders.filter(folder => folder.id !== folderId);
    folderStorageHandler.saveTodoFolder(filteredFolders);
    PubSub.publish(CLICK_EVENTS.update_project);
});

const FolderLogic = (() => {
    const addNewFolder = (folder) => PubSub.publish(EVENT.SAVE_FOLDER, folder);
    const deleteFolder = (folderId) => PubSub.publish(EVENT.DELETE_FOLDER, folderId);

    const initDefaultFolder = () => {
        const folders = todoFolderStorage().getTodoFolder();
        console.log(folders);
        let defaultFolder = folders.find(folder => folder.title === "Default");

        if (defaultFolder) return;
        else {
            defaultFolder = new TodoFolder("Default");
            addNewFolder(defaultFolder);
        }

        // return defaultFolder;
    };

    return { addNewFolder, deleteFolder, initDefaultFolder };
})();

const defaultFolder = FolderLogic.initDefaultFolder();
export { todoFolderStorage, TodoFolder, FolderLogic };