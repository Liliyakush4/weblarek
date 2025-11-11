import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface ICard {
  id: string;
  title: string;
  price: number | null;
}

export abstract class Card<T> extends Component<ICard & T> {
  protected titleElement: HTMLElement | null;
  protected priceElement: HTMLElement | null;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.titleElement = container.querySelector('.card__title');
    this.priceElement = container.querySelector('.card__price');
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
  
  set id(value: string) {
    this.container.dataset.id = value;
  }
}