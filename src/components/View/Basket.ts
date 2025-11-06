import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';
import { BasketItem } from './BasketItem';

interface IBasketView {
  items: IProduct[];
  total: number;
}

export class Basket extends Component<IBasketView> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected submitButton: HTMLButtonElement;
  protected itemTemplate: HTMLTemplateElement;

  constructor(
    protected events: IEvents,
    template: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#basket')
  ) {
    const rootNode = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    super(rootNode);

    this.listElement = ensureElement('.basket__list', this.container);
    this.totalElement = ensureElement('.basket__price', this.container);
    this.submitButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.itemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

    this.submitButton.addEventListener('click', () => {
      if (!this.submitButton.disabled) this.events.emit('order:open');
    });
  }

  set items(productsList: IProduct[]) {
    if (productsList.length === 0) {
      this.listElement.replaceChildren(document.createTextNode('Корзина пуста'));
      this.submitButton.disabled = true;
      return;
    }

    const fragment = document.createDocumentFragment();
    productsList.forEach((product, index) => {
      const listItem = new BasketItem(this.events, this.itemTemplate).render({
        index: index + 1,
        product,
      });
      fragment.append(listItem);
    });

    this.listElement.replaceChildren(fragment);
    this.submitButton.disabled = false;
  }

  set total(totalAmount: number) {
    this.totalElement.textContent = `${totalAmount} синапсов`;
  }
}