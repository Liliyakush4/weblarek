import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  protected counterElement: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
    // обращение к полю класса, которое содержит ссылку на DOM-элемент
    // применение к полю класса, которое содержит экземпляр системы событий метода системы событий для генерации события
    // уведомляет систему о необходимости открыть модальное окно корзины
    // название события, которое мы генерируем ("сущность: действие")
    // сеттер автоматически вызывается при использовании метода render() и наличия соответствующих данных