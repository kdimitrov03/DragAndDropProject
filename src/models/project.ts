export enum ProjectStatus {
  Active,
  Finished,
  ToDo,
  Review,
}
export class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}
