//Project input class
import { Component } from "./base-components.js";
import { Validatable, validate } from "../util/validation.js";
import { autobind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;
  constructor() {
    //super(the id of the template we gonna use,where we gonna store the values,if we want to add at start(true) else at the
    //end,if we want to add an Id to the element we are creating)
    super("project-input", "app", true, "user-input");
    this.titleInputElement = this.element.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    )! as HTMLInputElement;
    this.configure();
  }
  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
  renderContent(): void {}
  //on submit
  @autobind
  private submitHandler(event: Event): void {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    //if user input is correct we receive the array
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      this.clearUserInputs();
    }
  }
  //cleans user input fields
  private clearUserInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }
  //gets and validates user input
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeoples = this.peopleInputElement.value;
    //adds the requirements for each input and then calls the validate function to check if they meet the requirements
    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 7,
    };
    const peopleValidatable: Validatable = {
      value: +enteredPeoples,
      required: true,
      minValue: 1,
    };
    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Please enter valid input");
    } else {
      return [enteredTitle, enteredDescription, Number(enteredPeoples)];
    }
  }
}
