import { Card } from './Card';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { CDN_URL, categoryMap } from '../../utils/constants';

interface IProductPreview {
  category: string;
  image: string;
  description: string;
}

export class ProductPreview extends Card<IProductPreview> {
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected categoryElement: HTMLElement;
  protected actionButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    template: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-preview')
  ) {
    const rootNode = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    super(events, rootNode);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.descriptionElement = ensureElement('.card__text', this.container);
    this.categoryElement = ensureElement('.card__category', this.container);
    this.actionButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.actionButton.addEventListener('click', () => {
      this.events.emit('card:action', { element: this.container });
    });
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.applyCategoryClass(value);
  }

  set image(value: string) {
    const imageURL = `${CDN_URL}/${value}`;
    this.setImage(this.imageElement, imageURL, this.title);
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  // метод для установки состояния кнопки
  setButtonState(inCart: boolean, price: number | null): void {
    if (price === null) {
      this.actionButton.disabled = true;
      this.actionButton.textContent = 'Недоступно';
    } else {
      this.actionButton.disabled = false;
      this.actionButton.textContent = inCart ? 'Удалить из корзины' : 'Купить';
    }
  }

  private applyCategoryClass(category: string): void {
    const categoryKey = category as keyof typeof categoryMap;
    const categoryClass = categoryMap[categoryKey] || 'card__category_other';
    this.categoryElement.className = `card__category ${categoryClass}`;
  }
}