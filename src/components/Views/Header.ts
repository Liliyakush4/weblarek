import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IHeader } from "./interfaces";

export class Header extends Component<IHeader> {
  protected counterElement: HTMLElement;
  protected basketButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container); // найти элементы разметки в контсрукторе класса и сохранить в эти поля
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container); // метод гарантирует, что элемент будет найден, поиск только в этом контейнере

    this.basketButton.addEventListener('click', () => { // обращение к полю класса, которое содержит ссылку на DOM-элемент
      this.events.emit('basket: open'); // применение к полю класса, которое содержит экземпляр системы событий метода системы событий для генерации события
    // уведомляет систему о необходимости открыть модальное окно корзины
    // название события, которое мы генерируем ("сущность: действие")
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value); // сеттер автоматически вызывается при использовании метода render() и наличия соответствующих данных
  }
}