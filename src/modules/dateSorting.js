import { isToday, isFuture, parseISO } from "date-fns";
import PubSub from "pubsub-js";
import { UI_EVENTS } from "./UiHandler";
const taskSortByDate = function () {
    const projectTray = JSON.parse(localStorage.getItem("Project"));
    const todayTask = () => {
        const allTodayTasks = projectTray.flatMap(project => project.tasks.filter(task => isToday(parseISO(task.dueDate))));
        PubSub.publish(UI_EVENTS.todaySorting, allTodayTasks);
    }
    const upcomingTask = () => {
        const allUpcomingTasks = projectTray.flatMap(project => project.tasks.filter(task => isFuture(parseISO(task.dueDate))));
        PubSub.publish(UI_EVENTS.upcomingSorting, allUpcomingTasks);
        console.log(allUpcomingTasks);
    }
    return { todayTask, upcomingTask };
}

PubSub.subscribe("today sorting", () => {
    taskSortByDate().todayTask();
});
PubSub.subscribe("upcoming task", () => {
    taskSortByDate().upcomingTask();
});