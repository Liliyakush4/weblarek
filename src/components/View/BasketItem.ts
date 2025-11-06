import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';

interface IBasketItem {
  index: number;
  product: IProduct;
}

export class BasketItem extends Component<IBasketItem> {
  protected indexElement: HTMLElement;
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  private productId = '';

  constructor(protected events: IEvents, template: HTMLTemplateElement) {
    const rootNode = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    super(rootNode);

    this.indexElement = ensureElement('.basket__item-index', this.container);
    this.titleElement = ensureElement('.card__title', this.container);
    this.priceElement = ensureElement('.card__price', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.deleteButton.addEventListener('click', () =>
      this.events.emit('cart:remove', { id: this.productId })
    );
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }

  set product(product: IProduct) {
    this.productId = product.id;
    this.titleElement.textContent = product.title;
    this.priceElement.textContent =
      product.price === null ? 'Бесценно' : `${product.price} синапсов`;
  }
}
