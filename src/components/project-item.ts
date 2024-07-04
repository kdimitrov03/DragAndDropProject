import { Component } from "./base-components";
import { Draggable } from "../models/drag-and-drop";
import { Project } from "../models/project";
//Project Item Class
export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;
  get persons() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} persons`;
    }
  }
  constructor(hostId: string, project: Project) {
    //super(the id of the template we gonna use,where we gonna store the values(id of the host),
    //if we want to add at start(true) else at the
    //end,the id we want to give to the element if we want)
    super("single-project", hostId, false, project.id);
    this.project = project;
    this.configure();
    this.renderContent();
  }
  //add dragstart and dragend event listeners to the project element
  configure(): void {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler); //
  }
  //add the text content to the project element
  renderContent(): void {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }

  dragStartHandler=(event: DragEvent)=>{
    event.dataTransfer!.setData(
      "text/plain",
      this.project.id + " " + this.project.status
    );
    event.dataTransfer!.effectAllowed = "move";
  }
  dragEndHandler=(_event: DragEvent)=> {}
}
