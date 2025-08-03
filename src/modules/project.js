import PubSub from "pubsub-js";
import { UI_EVENTS } from "./UiHandler";
class Project {
    constructor(title) {
        this.title = title;
        this.tasks = [];
        this.id = crypto.randomUUID();
    }
}
const EVENT = {
    SAVE_Project: "save project to local storage",
    DELETE_Project: "delete project from local storage", 
}
const projectStorage = (() => {

  const getProject = () => {
    return JSON.parse(localStorage.getItem("Project")) || [];
  };

  const saveProject = (projectObj) => {
    const projects = getProject();

    // Prevent accidentally wrapping arrays
    if (Array.isArray(projectObj)) {
      return;
    }

    const index = projects.findIndex(project => project.id === projectObj.id);

    if (index !== -1) {
      projects[index] = projectObj;
    } else {
      projects.push(projectObj);
    }

    localStorage.setItem("Project", JSON.stringify(projects));
  };
  return { getProject, saveProject };
})();


(function ProjectSubscribers() {
  PubSub.subscribe(EVENT.SAVE_Project, (msg, project) => {
    projectStorage.saveProject(project);
    PubSub.publish(UI_EVENTS.displayProjects);
  });

  PubSub.subscribe(EVENT.DELETE_Project, (msg, projectId) => {
    const projects = projectStorage.getProject();
    const updatedProjects = projects.filter(project => {
      if (project.title === "Default") {
        PubSub.publish(UI_EVENTS.displayTasks, project);
      }
      return project.id !== projectId
    });
    localStorage.setItem("Project", JSON.stringify(updatedProjects));
    PubSub.publish(UI_EVENTS.displayProjects);
  });
})();

const projectLogic = () => {
  const addNewProject = (project) => {
    PubSub.publish(EVENT.SAVE_Project, project)
  };
  const deleteProject = (projectId) => {
    PubSub.publish(EVENT.DELETE_Project, projectId);
  };
  const initDefaultProject = () => {
    const projects = projectStorage.getProject();
    let defaultProject = projects.find(project => project.title === "Default");
    if (!defaultProject) {
      defaultProject = new Project("Default");
      addNewProject(defaultProject);
    }
    return defaultProject;
  };
  return { addNewProject, deleteProject, initDefaultProject };
};
projectLogic().initDefaultProject();
export { Project, projectLogic };