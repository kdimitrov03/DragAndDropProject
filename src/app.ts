//1. add code to github
//2. split code
//3. add documentation
//4. make changes (extend functionality)
//add two more to do and for review from review only to finished or active
import { ProjectInput } from "./components/project-input.js";
import { ProjectList } from "./components/project-list.js";
  //instance of the ProjectInput class which takes care of the user input with validation and event listeners for submitting
  new ProjectInput();
  //instances of the ProjectList class which stores the project and we initialize them with the type of list
  new ProjectList("to-do");
  new ProjectList("active");
  new ProjectList("review");
  new ProjectList("finished");


