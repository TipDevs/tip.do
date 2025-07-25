import "./styles/styles.css"
import { TodoFolder, todoFolderStorage } from "./modules/todo_folder.js";
import { TodoList, priorities } from "./modules/todo_list.js";
import { UiHandlerLogic } from "./modules/UiHandler.js";
import { projectDisplayer, addNewFolderClickEvent } from "./modules/clickHandler.js";
document.addEventListener("DOMContentLoaded", () => {
    todoFolderStorage();
    projectDisplayer();
    addNewFolderClickEvent();
    UiHandlerLogic().addProject();
});