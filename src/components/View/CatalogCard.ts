import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

interface ICatalogCard {
  id: string;
  title: string;
  category: string;
  priceText: string;
  image: string;
  disabled?: boolean;
}

function getCategoryClass(rawCategory: string) {
  const mappedClass = (categoryMap as Record<string, string>)[rawCategory];
  return mappedClass ?? categoryMap['другое'];
}
function applyCategoryClass(element: Element, category: string) {
  element.classList.remove(...Object.values(categoryMap));
  element.classList.add(getCategoryClass(category));
}

export class CatalogCard extends Component<ICatalogCard> {
  protected titleElement: HTMLElement;
  protected categoryElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  private productId = '';

  constructor(protected events: IEvents, template: HTMLTemplateElement) {
    const rootNode = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    super(rootNode);

    this.titleElement = ensureElement('.card__title', this.container);
    this.categoryElement = ensureElement('.card__category', this.container);
    this.priceElement = ensureElement('.card__price', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

    this.container.addEventListener('click', () => {
      if (!(this.container as HTMLButtonElement).disabled) {
        this.events.emit('product:open', { id: this.productId });
      }
    });
  }

  set id(value: string) {
    this.productId = value;
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    applyCategoryClass(this.categoryElement, value);
  }

  set priceText(value: string) {
    this.priceElement.textContent = value;
  }

  set image(src: string) {
    this.imageElement.src = src;
    this.imageElement.alt = this.titleElement.textContent ?? '';
  }

  set disabled(flag: boolean | undefined) {
    if (flag) this.container.classList.add('card_disabled');
    else this.container.classList.remove('card_disabled');
  }
}