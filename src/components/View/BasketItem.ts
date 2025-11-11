import { Card } from './Card';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IBasketItem {
  index: number;
}

export class BasketItem extends Card<IBasketItem> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(protected events: IEvents, template: HTMLTemplateElement) {
    const rootNode = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    super(events, rootNode);

    this.indexElement = ensureElement('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.deleteButton.addEventListener('click', () =>
      this.events.emit('cart:remove', { element: this.container })
    );
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
