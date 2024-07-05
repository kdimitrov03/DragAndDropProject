import { Project } from "../models/project";
import { ProjectStatus } from "../models/project";
type Listener<T> = (items: T[]) => void;
class State<T> {
  protected stateChangeListeners: Listener<T>[] = [];
  //array of stateChangeListeners where we store the functions that need to be called whenever the state changes or we add a project
  addListener(listenerFn: Listener<T>) {
    this.stateChangeListeners.push(listenerFn);
  }
}
//singleton we can only have one instance of project state class
//which is used to store the projects
//default projectState is set to be "To-Do"
export class ProjectState extends State<Project> {
  private defaultProjectSate: ProjectStatus = "To-Do";
  private projects: Project[] = [];
  private static instance: ProjectState;
  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }
  public addProject(
    title: string,
    description: string,
    people: number,
    projectId: string,
    parentId?: string
  ): void {
    const newProject = new Project(
      projectId,
      title,
      description,
      people,
      this.defaultProjectSate,
      parentId
    );
    this.projects.push(newProject);
    this.updateListners();
  }
  //the function receives the project id and the new status and sets the Status of the project to the new status
  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((project) => project.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListners();
    }
  }
  checkIfProjectIdExists(projectId: string): boolean {
    let idExists = false;
    this.projects.forEach((project) => {
      if (project.id === projectId) {
        idExists = true;
      }
    });
    return idExists;
  }

  getProject(projectId: string): Project | undefined {
    let projectToReturn: Project | undefined;

    projectToReturn = this.projects.find((project) => project.id === projectId);

    return projectToReturn;
  }
  //calls all stateChangeListeners with a copy of the project array
  private updateListners() {
    for (const listener of this.stateChangeListeners) {
      listener(this.projects.slice());
    }
  }
}

export const projectState = ProjectState.getInstance();
