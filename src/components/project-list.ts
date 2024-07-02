//Project ListClass
import { Component } from "./base-components.js";
import { DragTarget } from "../models/drag-and-drop.js";
import { Project } from "../models/project.js";
import { autobind } from "../decorators/autobind.js";
import { ProjectItem } from "./project-item.js";
import { ProjectStatus } from "../models/project.js";
import { projectState } from "../state/project-state.js";
export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[] = [];
  constructor(private type: "active" | "finished" | "to-do" | "review") {
    //super(the id of the template we gonna use,where we gonna store the values,if we want to add at start(true) else at the
    //end,if we want to add an Id to the element we are creating)
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
  @autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      //we add class droppable to the ul of the element while we are dragging over it
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }
  @autobind
  dropHandler(event: DragEvent) {
    //on drop we set the new status of the object to the status of the droped area
    //except from review to to do which we don't want to allow so we revert the status to review
    const [prjId, prjStatus] = event
      .dataTransfer!.getData("text/plain")
      .split(" ");
    let status;

    if (this.type === "active") {
      status = ProjectStatus.Active;
    } else if (this.type === "to-do") {
      if (+prjStatus === ProjectStatus.Review) {
        status = ProjectStatus.Review;
      } else {
        status = ProjectStatus.ToDo;
      }
    } else if (this.type === "review") {
      status = ProjectStatus.Review;
    } else status = ProjectStatus.Finished;
    projectState.moveProject(prjId, status);
  }
  @autobind
  dragLeaveHandler(_event: DragEvent) {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }
  configure(): void {
    //add event listeners so that we can drag the drop elements into it
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);
    //adds a listener to the listeners array so that every time a project is added or has its status changed
    projectState.addListener((projects: Project[]) => {
      //filter the projects depending on the type of project list(active or finished)
      const relevantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.Active;
        } else if (this.type === "to-do") {
          return prj.status === ProjectStatus.ToDo;
        } else if (this.type === "review") {
          return prj.status === ProjectStatus.Review;
        } else return prj.status === ProjectStatus.Finished;
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
