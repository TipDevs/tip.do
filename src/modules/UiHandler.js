import PubSub from "pubsub-js";
import { todoFolderStorage } from "./todo_folder.js";
import { todoListStorage } from "./todo_list.js";
import tip_do from "../assets/images/tip.do.webp";
const EVENTS = {
    folderTodoList: "Display todo lists in folder clicked",
    folderList: "Display folder lists"
}
const UIsubscribers = (() => {
    // const folders = todoFolderStorage.getTodoFolder();
    PubSub.subscribe(EVENTS.folderList, (msg, folders) => {
        const projectList = document.querySelector('.project_list');
        // const todoFolder = todoFolderStorage.getTodoFolder();
        folders.forEach(folder => {
            const projectBTN = document.createElement("button");
            projectBTN.innerHTML = `${folder.title} <i class="fa-regular fa-circle-xmark"></i>`;
            projectList.appendChild(projectBTN);
            console.log(folder.todos);
        });
    });
    PubSub.subscribe(EVENTS.folderTodoList, (msg, todos) => {
        const listContainer = document.querySelector('.lists');
        if (todos === ![]) {
            todos.forEach(todo => {
                const listInfo = document.createElement('div');
                listInfo.classList.add('lists_items');
                listInfo.innerHTML = `
                <input type="checkbox">
                <div class="lists_info">
                    <p id="title">${todo.title}</p>
                    <p id="description">${todo.description}</p>
                    <p id="due_date">${todo.dueDate}</p>
                </div>
                `;
                listContainer.appendChild(listInfo);
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
    })
})();
const UiHandlerLogic = (() => {
    const folders = todoFolderStorage.getTodoFolder();
    const addProject = () => {
        PubSub.publish(EVENTS.folderList, folders);
    }
    const showTodoListPerProject = () => {
        const todos = folders.map(folder => {
            return folder.todos;
        })
        PubSub.publish(EVENTS.folderTodoList, todos);
    };
    return { addProject, showTodoListPerProject };
})()
UiHandlerLogic.addProject();
UiHandlerLogic.showTodoListPerProject();

export { UiHandlerLogic };