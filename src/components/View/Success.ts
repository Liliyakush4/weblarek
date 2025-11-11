import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface ISuccess {
  total: number;
}

export class Success extends Component<ISuccess> {
  protected descriptionElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

constructor(
  protected events: IEvents,
  template: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#success')
) {
  const rootNode = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
  super(rootNode);

    this.descriptionElement = ensureElement('.order-success__description', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this.closeButton.addEventListener('click', () => {
      this.events.emit('modal:closed');
    });
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}