import { todoFolderStorage, TodoFolder, FolderLogic } from "./todo_folder";
import { UiHandlerLogic } from "./UiHandler";
import PubSub from "pubsub-js";
const CLICK_EVENTS = {
    update_project: "update project list on dom",
}
const projectDisplayer = () => {
    const folders = todoFolderStorage.getTodoFolder();
    const projectList = document.querySelector(".project_list");

    projectList.addEventListener("click", (e) => {
        const clickedButton = e.target.closest("button");

        if (!clickedButton || !projectList.contains(clickedButton)) return;

        const projectTitle = clickedButton.textContent.trim();

        folders.forEach(folder => {
            if (folder.title === projectTitle) {
                UiHandlerLogic.showTodoListPerProjectClick(folder);
            }
        });
    });
};

const addNewFolderClickEvent= () => {
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
            const newProject = new TodoFolder(new_project_title.value.trim());
            FolderLogic.addNewFolder(newProject);
            // UiHandlerLogic.addProject();
            form.remove();
        });
    });
};
PubSub.subscribe(CLICK_EVENTS.update_project, () => {
    UiHandlerLogic().addProject();
})
export { projectDisplayer, addNewFolderClickEvent, CLICK_EVENTS };