import PubSub from "pubsub-js";
import { todoFolderStorage } from "./todo_folder.js";
import { todoListStorage } from "./todo_list.js";
import tip_do from "../assets/images/tip.do.webp";
import { CLICK_EVENTS } from "./clickHandler.js";
const EVENTS = {
    folderTodoList: "Display todo lists in folder clicked",
    folderList: "Display folder lists"
}
const UIsubscribers = (() => {
    // Event that add projects to project display list
    PubSub.subscribe(EVENTS.folderList, (msg, folders) => {
        const projectList = document.querySelector('.project_list');
        projectList.innerHTML = "";
        folders.forEach(folder => {
            const projectDetailContainer = document.createElement("div");
            projectDetailContainer.id = `${folder.id}`;
            if (folder.title === "Default") {
            projectDetailContainer.innerHTML = `<button>${folder.title}</button>`   
            }
            else {
                projectDetailContainer.innerHTML = `<button>${folder.title}</button> <div id="project_delBTN_container"><i class="fa-regular fa-circle-xmark delete_project-btn" id="${folder.id}"></i></div>`;
            }
            projectList.appendChild(projectDetailContainer); 
        });
    });

    // Event that display list of todos in a particular project user clicked
    PubSub.subscribe(EVENTS.folderTodoList, (msg, folder) => {
        const main = document.querySelector('main');
        main.innerHTML = '';
        const listContainer = document.createElement('div');
        listContainer.classList.add('lists');
            if (folder.todos.length > 0) {
                folder.todos.map(todo => {
                    const listExist = document.querySelector(`#${todo.id}`);
                    if (listExist) listExist.remove();
                    listContainer.innerHTML = `
                    <div class="lists_items, with_aside" id="${todo.id}">
                        <input type="checkbox">
                        <div class="lists_info">
                            <p id="${todo.title}">${todo.title}</p>
                            <p id="description">${todo.description}</p>
                            <p id="due_date">${todo.dueDate}</p>
                        </div>
                    </div>
                    `;
                });
            }

            else {
                const displayImage = document.createElement('img');
                displayImage.src = tip_do;
                const displayMessage = document.createElement('p');
                displayMessage.textContent = "Nothing to do here";
                listContainer.innerHTML = "";
                listContainer.classList.add("empty");
                listContainer.appendChild(displayImage);
                listContainer.appendChild(displayMessage);
        }
        main.appendChild(listContainer);
        main.insertAdjacentHTML("beforeend", `<i class="fa-solid fa-square-plus fa-2xl add_list ${folder.id}"></i>`);
    });
})();

// Logic that publishes events
const UiHandlerLogic = () => {
    const folders = todoFolderStorage().getTodoFolder();
    const addProject = () => {
        PubSub.publish(EVENTS.folderList, folders);
    }
    const showToDos = (folder) => {
        PubSub.publish(EVENTS.folderTodoList, folder);
    };
    return { addProject, showToDos };
};
// UiHandlerLogic.addProject();
export { UiHandlerLogic };