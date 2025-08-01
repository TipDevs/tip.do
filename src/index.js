import "./styles/styles.css";
import PubSub from "pubsub-js";
import { viewportTracker } from "./modules/viewportTracker";
import { folderLogic, TaskFolder } from "./modules/project";
import { taskLogic, Task } from "./modules/task";
import { UiHandlerLogic, UI_EVENTS, usernameUI } from "./modules/UiHandler";
import { displayTaskInProject } from "./modules/clickHandler";
displayTaskInProject();
viewportTracker();
document.addEventListener("DOMContentLoaded", () => {
    usernameUI();
    UiHandlerLogic().showProject();
    const projectTray = JSON.parse(localStorage.getItem("Project"));
    projectTray.map(project => {
        if (project.title === "Default") {
            PubSub.publish(UI_EVENTS.displayTasks, project);
        }
    })
});