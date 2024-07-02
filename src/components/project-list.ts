//Project ListClass
///<reference path="base-components.ts"/>
///<reference path="../models/drag-and-drop.ts"/>
///<reference path="../decorators/autobind.ts"/>
///<reference path="../state/project-state.ts"/>
///<reference path="../models/project.ts"/>
namespace App {
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
        const listEl = this.element.querySelector("ul")!;
        listEl.classList.add("droppable");
      }
    }
    @autobind
    dropHandler(event: DragEvent) {
      const [prjId,prjStatus] = event.dataTransfer!.getData("text/plain").split(" ");
      let status;
     
      if (this.type === "active") {
        status = ProjectStatus.Active;
      } else if (this.type === "to-do") {
        if(+prjStatus===ProjectStatus.Review){
            status = ProjectStatus.Review
        }else{
        status = ProjectStatus.ToDo;}
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
}
