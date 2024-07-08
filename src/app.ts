//1. add code to github
//2. split code
//3. add documentation
//4. make changes (extend functionality)
//add two more to do and for review from review only to finished or active
import { ProjectInput } from "./components/project-input";
import { ProjectList } from "./components/project-list";
import { ProjectBin } from "./components/project-bin";
new ProjectInput();
new ProjectList("To-Do");
new ProjectList("Active");
new ProjectList("Review");
new ProjectList("Finished");
new ProjectBin();
