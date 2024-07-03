import { Project } from "../models/project";
import { projectStatus } from "../models/project";
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
  private defaultProjectSate: projectStatus = "To-Do";
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
  public addProject(title: string, description: string, people: number): void {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      this.defaultProjectSate
    );
    this.projects.push(newProject);
    this.updateListners();
  }
  //the function receives the project id and the new status and sets the Status of the project to the new status
  moveProject(projectId: string, newStatus: projectStatus) {
    const project = this.projects.find((project) => project.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListners();
    }
  }
  //calls all stateChangeListeners with a copy of the project array
  private updateListners() {
    for (const listener of this.stateChangeListeners) {
      listener(this.projects.slice());
    }
  }
}

export const projectState = ProjectState.getInstance();
