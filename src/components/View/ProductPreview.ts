import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { CardWithCategoryImage } from './Card';
import { AppEvents } from '../../types/events';

interface IProductPreview {
  category: string;
  image: string;
  description: string;
}

export class ProductPreview extends CardWithCategoryImage<IProductPreview> {
  protected descriptionElement: HTMLElement;
  protected actionButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    template: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-preview')
  ) {
    const rootNode = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    super(events, rootNode);

    this.descriptionElement = ensureElement('.card__text', this.container);
    this.actionButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.actionButton.addEventListener('click', () => {
      this.events.emit(AppEvents.CardAction, { id: this.id });
    });
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
}