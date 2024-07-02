namespace App {
  export enum ProjectStatus { //add two more to do and for review from review only to finished or active
    Active,
    Finished,
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
}