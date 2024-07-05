//Project input class
///<
import { Component } from "./base-components";
import { Validatable, validate } from "../util/validation";
import { projectState } from "../state/project-state";
//ProjectInput:class which takes care of the user input with validation and event listener for submitting
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;
  constructor() {
    //super(the id of the template we gonna use,where we gonna store the values(id of the host),
    //if we want to add at start(true) else at the
    //end,the id we want to give to the element if we want)
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
  private submitHandler = (event: Event) => {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    //if user input is correct we receive the array
    if (Array.isArray(userInput)) {
      projectState.addProject(userInput[0], userInput[1], userInput[2]);
      this.clearUserInputs();
    }
  };

  private clearUserInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }
  //gets and validates user input
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;
    //adds the requirements for each input and then calls the validate function to check if they meet the requirements
    const titleMinLength = 4;
    const titleMaxLength = 20;
    const titleIsRequired = true;
    const descriptionMinLength = 7;
    const descriptionMaxLength = 50;
    const descriptionIsRequired = true;
    const peopleMinValue = 2;
    const peopleIsRequired = true;
    const peopleMaxValue = 9;
    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: titleIsRequired,
      minLength: titleMinLength,
      maxLength: titleMaxLength,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: descriptionIsRequired,
      minLength: descriptionMinLength,
      maxLength: descriptionMaxLength,
    };
    const peopleValidatable: Validatable = {
      value: parseInt(enteredPeople, 10),
      required: peopleIsRequired,
      minValue: peopleMinValue,
      maxValue: peopleMaxValue,
    };
    const titleIsValid = validate(titleValidatable);
    const descriptionIsValid = validate(descriptionValidatable);
    const peopleIsValid = validate(peopleValidatable);
    if (!titleIsValid || !descriptionIsValid || !peopleIsValid) {
      let errorText = "";
      if (!titleIsValid) {
        if (titleIsRequired && enteredTitle === "") {
          errorText += `Title is required \n`;
        }
        if (titleIsRequired && enteredTitle !== "") {
          if (titleMinLength > enteredTitle.length) {
            errorText += `Title needs to have a minimum of ${titleValidatable.minLength} characters\n`;
          }
          if (titleMaxLength < enteredTitle.length) {
            errorText += `Title can have a maximum of ${titleValidatable.maxLength} characters\n`;
          }
        }
      }
      if (!descriptionIsValid) {
        if (descriptionIsRequired && enteredDescription === "") {
          errorText += `Description is required \n`;
        }
        if (descriptionIsRequired && enteredDescription !== "") {
          if (descriptionMinLength > enteredDescription.length) {
            errorText += `Description needs to have a minimum of ${descriptionValidatable.minLength} characters\n`;
          }
          if (descriptionMaxLength < enteredDescription.length) {
            errorText += `Description can have a maximum of ${descriptionValidatable.maxLength} characters\n`;
          }
        }
      }
      if (!peopleIsValid) {
        if (peopleIsRequired && enteredPeople === "") {
          errorText += `Number of people is required \n`;
        }
        if (peopleIsRequired && enteredPeople !== "") {
          if (peopleMinValue > +enteredPeople) {
            errorText += `There needs to be a minimum of ${peopleValidatable.minValue} people\n`;
          }
          if (peopleMaxValue < +enteredPeople) {
            errorText += `There can be a maximum of ${peopleValidatable.maxValue} people\n`;
          }
        }
      }
      alert(errorText);
    } else {
      return [enteredTitle, enteredDescription, parseInt(enteredPeople, 10)];
    }
  }
}
