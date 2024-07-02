//Component Base Class
namespace App{
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;
    constructor(
      templateId: string,
      hostElementId: string,
      insertAtStart: boolean,
      elementId?: string
    ) {
      this.templateElement = document.getElementById(
        templateId
      )! as HTMLTemplateElement;
      //where we gonna insert the element
      this.hostElement = document.getElementById(hostElementId)! as T;
      //importedNode is a copy of the templateElements content
      const importedNode = document.importNode(
        this.templateElement.content,
        true
      );

      this.element = importedNode.firstElementChild as U;
      if (elementId) {
        this.element.id = elementId;
      }
      //insert the element at the start or end of the host element.
      this.attach(insertAtStart);
    }
    private attach(insertAtStart: boolean) {
      this.hostElement.insertAdjacentElement(
        insertAtStart ? "afterbegin" : "beforeend",
        this.element
      );
    }
    abstract configure(): void;
    abstract renderContent(): void;
  }
}