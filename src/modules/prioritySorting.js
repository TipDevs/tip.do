import { taskLogic } from "./task";
import { UI_EVENTS } from "./UiHandler";
import PubSub from "pubsub-js";
const prioritySorting = function (priority) {
    const projectTray = JSON.parse(localStorage.getItem("Project"));
    const allPriorityTasks = projectTray.flatMap(project => project.tasks.filter(task => task.priority === priority));
    PubSub.publish(UI_EVENTS.priorityDisplay, { priorityTask: allPriorityTasks, priority: priority});
};

PubSub.subscribe("Priority display", (msg, priority) => {
    prioritySorting(priority);
})