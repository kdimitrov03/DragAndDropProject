namespace App {
  type Listener<T> = (items: T[]) => void;
  class State<T> {
    protected listeners: Listener<T>[] = [];
    //array of listeners where we store the functions that need to be called whenever the state changes or we add a project
    addListener(listenerFn: Listener<T>) {
      this.listeners.push(listenerFn);
    }
  }
  export class ProjectState extends State<Project> {
    private projects: Project[] = [];
    //singleton we can only have one instance of project state class
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
    //when creting a project we add a random id and set it to do
    public addProject(
      title: string,
      description: string,
      people: number
    ): void {
      const newProject = new Project(
        Math.random().toString(),
        title,
        description,
        people,
        ProjectStatus.ToDo
      );
      this.projects.push(newProject);
      this.updateListners();
    }

    moveProject(projectId: string, newStatus: ProjectStatus) {
      const project = this.projects.find((project) => project.id === projectId);
      if (project && project.status !== newStatus) {
        project.status = newStatus;
        this.updateListners();
      }
    }
    private updateListners() {
      for (const listener of this.listeners) {
        listener(this.projects.slice());
      }
    }
  }

  export const projectState = ProjectState.getInstance();
}
