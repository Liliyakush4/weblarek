import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { CDN_URL, categoryMap } from '../../utils/constants';

interface ICard {
  id: string;
  title: string;
  price: number | null;
}

interface ICardWithCategoryImage {
  category: string;
  image: string;
}

export abstract class Card<T> extends Component<ICard & T> {
  protected titleElement: HTMLElement | null;
  protected priceElement: HTMLElement | null;

  private _id = '';

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.titleElement = container.querySelector('.card__title');
    this.priceElement = container.querySelector('.card__price');
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  set title(value: string) {
    if (this.titleElement) {
      this.titleElement.textContent = value;
    }
  }

  set price(value: number | null) {
    if (this.priceElement) {
      this.priceElement.textContent = value === null 
        ? 'Бесценно' 
        : `${value} синапсов`;
    }
  }
}

export abstract class CardWithCategoryImage<T> extends Card<ICardWithCategoryImage & T> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

   this.categoryElement = ensureElement('.card__category', this.container);
   this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
  }
  
  set category(value: string) {
    this.categoryElement.textContent = value;
    this.applyCategoryClass(value);
  }

  set image(imageName: string) {
    const imageURL = `${CDN_URL}/${imageName}`;
    this.setImage(this.imageElement, imageURL, this.title);
  }

   private applyCategoryClass(category: string): void {
    const categoryKey = category as keyof typeof categoryMap;
    const categoryClass = categoryMap[categoryKey] || 'card__category_other';
    this.categoryElement.className = `card__category ${categoryClass}`;
  }
}