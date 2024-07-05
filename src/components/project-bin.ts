import { DragTarget } from "../models/drag-and-drop";
import { Component } from "./base-components";
import { projectState } from "../state/project-state";
import { ProjectStatus } from "../models/project";
export class ProjectBin
  extends Component<HTMLDivElement, HTMLDivElement>
  implements DragTarget
{
  constructor() {
    //super(the id of the template we gonna use,where we gonna store the values(id of the host),
    //if we want to add at start(true) else at the
    //end,the id we want to give to the element if we want)
    super("bin", "app", false, `deletionBin`);
    this.configure();
    this.renderContent();
  }
  configure(): void {
    const binIconDiv = this.element.querySelector("div")!;
    binIconDiv.addEventListener("dragover", this.dragOverHandler);
    binIconDiv.addEventListener("dragleave", this.dragLeaveHandler);
    binIconDiv.addEventListener("drop", this.dropHandler);
  }
  renderContent(): void {}
  dragOverHandler = (event: DragEvent): void => {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      //we add class droppable to the div of the element while we are dragging over it
      const binIconDiv = this.element.querySelector("div")!;
      binIconDiv.classList.add("droppable");
    }
  };
  dropHandler = (event: DragEvent): void => {
    const [prjId, oldStatus] = event
      .dataTransfer!.getData("text/plain")
      .split(" ");
    const confirmation = confirm("Are you sure you want to delete this item?");
    if (confirmation) {
      projectState.deleteProject(prjId);
    } else {
      projectState.moveProject(prjId, oldStatus as ProjectStatus);
    }
  };
  dragLeaveHandler = (_event: DragEvent): void => {
    const binIconDiv = this.element.querySelector("div")!;
    binIconDiv.classList.remove("droppable");
  };
}
