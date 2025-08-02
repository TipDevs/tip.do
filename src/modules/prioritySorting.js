import { taskLogic } from "./task";
import { UI_EVENTS } from "./UiHandler";
import PubSub from "pubsub-js";
const prioritySorting = function (priority) {
    const projectTray = JSON.parse(localStorage.getItem("Project"));
    const allPriorityTasks = projectTray.flatMap(project => project.tasks.filter(task => {
        const priorityMatched = task.priority === priority
        if (priorityMatched) {
            task.projectId = project.id;
        }
        return priorityMatched;
    }));
    PubSub.publish(UI_EVENTS.priorityDisplay, { priorityTask: allPriorityTasks, priority: priority});
};

PubSub.subscribe("Priority display", (msg, priority) => {
    prioritySorting(priority);
})