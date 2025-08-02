import { isToday, isFuture, parseISO } from "date-fns";
import PubSub from "pubsub-js";
import { UI_EVENTS } from "./UiHandler";
const taskSortByDate = function () {
    const projectTray = JSON.parse(localStorage.getItem("Project"));
    const todayTask = () => {
        const allTodayTasks = projectTray.flatMap(project => project.tasks.filter(task => {
            const isMoment = isToday(parseISO(task.dueDate))
            if (isMoment) task.projectId = project.id;
            return isMoment;
        }));
        PubSub.publish(UI_EVENTS.todaySorting, allTodayTasks);
    }
    const upcomingTask = () => {
        const allUpcomingTasks = projectTray.flatMap(project => project.tasks.filter(task => {
            const isUpcoming = isFuture(parseISO(task.dueDate))
            if(isUpcoming) task.projectId = project.id;
            return isUpcoming;
        }));
        PubSub.publish(UI_EVENTS.upcomingSorting, allUpcomingTasks);
    }
    return { todayTask, upcomingTask };
}

PubSub.subscribe("today sorting", () => {
    taskSortByDate().todayTask();
});
PubSub.subscribe("upcoming task", () => {
    taskSortByDate().upcomingTask();
});