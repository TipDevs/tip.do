import PubSub from "pubsub-js";
import { todoFolderStorage } from "./todo_folder.js";
import { CLICK_EVENTS } from "./clickHandler.js";

// Events and Priorities factory
const setEventAndPriority = function () {
    const EVENTS = {
        SAVE_TODO: "save to-do to folder",
        DELETE_TODO: "delete to-do from folder",
        EDIT_TODO: "edit and update to-do in folder",
    }
    const PRIORITIES = {
        high: "High",
        medium: "Medium",
        low: "Low",
    }
    return { EVENTS, PRIORITIES };
};

// class constructor for todo list
class TodoList {
    constructor(title, description, priority = setEventAndPriority().PRIORITIES.medium, dueDate) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.id = crypto.randomUUID();
    }
}

// Todo storage
const todoListStorage = () => {
    const getFolderTodoStorage = () => {
        return todoFolderStorage().getTodoFolder();
    }
    const saveTodoToFolder = (newTodo, folder) => {
        folder.todos.push(newTodo);
        todoFolderStorage().saveTodoFolder(folder);
        // console.log(folder);
    }

    return { getFolderTodoStorage, saveTodoToFolder };
};

// Subscribe to save todo event
PubSub.subscribe(setEventAndPriority().EVENTS.SAVE_TODO, (msg, { todo, folderId }) => {
    const foldersTray = todoListStorage();
    const folders = foldersTray.getFolderTodoStorage();
    console.log(folders);
    folders.map(folder => {
        if (folder.id === folderId) {
            foldersTray.saveTodoToFolder(todo, folder);
        }
        PubSub.publish(CLICK_EVENTS.show_todos, folder);
    });
});

// Subscribe to delete todo event
PubSub.subscribe(setEventAndPriority().EVENTS.DELETE_TODO, (msg, { todoId }) => {
    const foldersTray = todoListStorage();
    const folders = foldersTray.getFolderTodoStorage();
    folders.map(folder => {
        const todos = folder.todos.filter(todo => todo.id !== todoId);
        saveTodoToFolder(todos, folder);
    });
    PubSub.publish(CLICK_EVENTS.update_project);
});

// Subscribe to edit todo event
PubSub.subscribe(setEventAndPriority().EVENTS.EDIT_TODO, (msg, { newTitle, newDescription, newPriority = setEventAndPriority.PRIORITIES.medium, newDueDate, todoId}) => {
    const foldersTray = todoListStorage();
    const folders = foldersTray.getFolderTodoStorage();
    folders.map(folder => {
        folder.todos.map(todo => {
            if (todoId === todo.id) {
                todo.title = newTitle;
                todo.description = newDescription;
                todo.priority = newPriority;
                todo.dueDate = newDueDate;
            }
            saveTodoToFolder(todo, folder);
        });
    });
    PubSub.publish(CLICK_EVENTS.update_project);
});

const TodoLogic = () => {
    const addTodo = (newTodo, containerId) => {
        console.log(`New Todo: ${newTodo}\n Container Id: ${containerId}`);
        PubSub.publish(setEventAndPriority().EVENTS.SAVE_TODO, { todo: newTodo, folderId: containerId});
    };
    const deleteTodo = (todoId) => PubSub.publish(setEventAndPriority().EVENTS.DELETE_TODO, { todoId });
    const editTodo = (newTitle, newDescription, newPriority, newDueDate, todoId) => {
        PubSub.publish(setEventAndPriority().EVENTS.EDIT_TODO, { newTitle, newDescription, newPriority, newDueDate, todoId});
    }
    return { addTodo, deleteTodo, editTodo };
};
export { todoListStorage, TodoLogic, setEventAndPriority, TodoList };
