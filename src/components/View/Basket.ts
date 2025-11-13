import { IEvents } from '../base/Events';
import { createElement, ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { AppEvents } from '../../types/events';

interface IBasket {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasket> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected emptyMessage: HTMLElement;

    constructor(
    protected events: IEvents,
    template: HTMLTemplateElement
  ) {
    const container = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    super(container);

    this.listElement = ensureElement('.basket__list', this.container);
    this.totalElement = ensureElement('.basket__price', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.emptyMessage = createElement<HTMLDivElement>('div', {
      className: 'basket__empty',
      textContent: 'Корзина пуста'
    });

    this.buttonElement.addEventListener('click', () => {
      if (!this.buttonElement.disabled) this.events.emit(AppEvents.OrderOpen);
    });
  }

  set items(items: HTMLElement[]) {
    this.listElement.innerHTML = '';
    
    if (items.length === 0) {
        this.listElement.appendChild(this.emptyMessage);
        this.buttonElement.disabled = true;
    } else {
        this.listElement.replaceChildren(...items);
        this.buttonElement.disabled = false;
    }
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }
}