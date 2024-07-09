//Type with the 4 Statuses a project can have
export type ProjectStatus = "Active" | "To-Do" | "Review" | "Finished";
export class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus,
    public parentId?: string
  ) {}
}
