import "./styles/styles.css";
import PubSub from "pubsub-js";
import { viewportTracker } from "./modules/viewportTracker";
import { UI_EVENTS, } from "./modules/UiHandler";
import { CLICK_EVENTS,} from "./modules/clickHandler";
viewportTracker();
document.addEventListener("DOMContentLoaded", () => {
    PubSub.publish(CLICK_EVENTS.update_project);
    PubSub.publish(UI_EVENTS.updateUsername);
    const projectTray = JSON.parse(localStorage.getItem("Project"));
    projectTray.map(project => {
        if (project.title === "Default") {
            PubSub.publish(CLICK_EVENTS.show_task, project);
        }
    })
});