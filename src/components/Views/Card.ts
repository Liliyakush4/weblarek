import { Component } from "../base/Component";
import { setElementData } from "../../utils/utils";
import { IProductCard } from "./interfaces";

export class Card<T extends IProductCard> extends Component<T> {
  protected imageElement?: HTMLImageElement;
  protected titleElement?: HTMLElement;
  protected categoryElement?: HTMLElement;
  protected priceElement?: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    // Безопасный поиск элементов внутри контейнера
    this.imageElement = container.querySelector<HTMLImageElement>('.card__image') || undefined;
    this.categoryElement = container.querySelector<HTMLElement>('.card__category') || undefined;
    this.titleElement = container.querySelector<HTMLElement>('.card__title') || undefined;
    this.priceElement = container.querySelector<HTMLElement>('.card__price') || undefined;
  }

  set id(value: string) {
    setElementData(this.container, { id: value });
  }

  set image(src: string) {
    if (this.imageElement) {
      this.imageElement.src = src;
      this.imageElement.alt = this.titleElement?.textContent || '';
    }
  }

  set title(value: string) {
    if (this.titleElement) this.titleElement.textContent = value;
  }

  set category(value: string) {
    if (this.categoryElement) {
      this.categoryElement.textContent = value;
      this.updateCategoryStyles(value);
    }
  }

  set price(value: number | null) {
    if (!this.priceElement) return;
    this.priceElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
  }

  protected updateCategoryStyles(category: string) {
    if (!this.categoryElement) return;
    const allClasses = [
      'card__category_soft',
      'card__category_other',
      'card__category_additional',
      'card__category_button',
      'card__category_hard'
    ];
    this.categoryElement.classList.remove(...allClasses);

    const map: Record<string, string> = {
      'софт-скил': 'card__category_soft',
      'другое': 'card__category_other',
      'дополнительное': 'card__category_additional',
      'кнопка': 'card__category_button',
      'хард-скил': 'card__category_hard'
    };
    this.categoryElement.classList.add(map[category] || 'card__category_other');
  }
}
