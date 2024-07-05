//Project ListClass
import { Component } from "./base-components";
import { DragTarget } from "../models/drag-and-drop";
import { Project } from "../models/project";
import { ProjectItem } from "./project-item";
import { ProjectStatus } from "../models/project";
import { projectState } from "../state/project-state";
//ProjectList: class which stores the projects and initializes them with the type of list
export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[] = [];
  constructor(private type: ProjectStatus) {
    //super(the id of the template we gonna use,where we gonna store the values(id of the host),
    //if we want to add at start(true) else at the
    //end,the id we want to give to the element if we want)
    super("project-list", "app", false, `${type}-projects`);
    this.configure();
    this.renderContent();
  }

  private renderProjects() {
    const listElement = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    //we clear the project list element
    listElement.innerHTML = "";
    //go through all the projects and add them to the ul of the project list instance
    for (const project of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, project);
    }
  }
  dragOverHandler = (event: DragEvent) => {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      //we add class droppable to the ul of the element while we are dragging over it
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  };

  dropHandler = (event: DragEvent) => {
    //on drop we set the new status of the object to the status of the droped area
    //except from review to to do which we don't want to allow so we revert the status to review
    const [prjId, oldStatus] = event
      .dataTransfer!.getData("text/plain")
      .split(" ");
    let newStatus: ProjectStatus;

    if (this.type === "Active") {
      newStatus = "Active";
    } else if (this.type === "To-Do") {
      if (oldStatus === "Review") {
        newStatus = "Review";
      } else {
        newStatus = "To-Do";
      }
    } else if (this.type === "Review") {
      newStatus = "Review";
    } else newStatus = "Finished";
    projectState.moveProject(prjId, newStatus);
  };
  dragLeaveHandler = (_event: DragEvent) => {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  };
  configure(): void {
    //add event listeners so that we can drag the drop elements into it
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);
    //adds a listener to the listeners array so that every time a project is added or has its status changed
    projectState.addListener((projects: Project[]) => {
      //filter the projects depending on the type of project list
      const relevantProjects = projects.filter((prj) => {
        if (this.type === "Active") {
          return prj.status === "Active";
        } else if (this.type === "To-Do") {
          return prj.status === "To-Do";
        } else if (this.type === "Review") {
          return prj.status === "Review";
        } else return prj.status === "Finished";
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }
  renderContent() {
    //adds an ID to the project list and Header to the Section that contains the projectList
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }
}
