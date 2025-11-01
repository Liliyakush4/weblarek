import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IBasketItem, IBasketItemView } from "./interfaces";

// Класс элемента корзины, наследуется от Component и реализует интерфейс
export class BasketItem extends Component<IBasketItem> implements IBasketItemView {
    // Объявляем DOM-элементы, которые будем использовать
    protected indexElement: HTMLElement;    // элемент для номера (1, 2, 3...)
    protected titleElement: HTMLElement;    // элемент для названия товара
    protected priceElement: HTMLElement;    // элемент для цены
    protected deleteButton: HTMLButtonElement; // кнопка удаления

    // Конструктор принимает HTML-шаблон элемента корзины
    constructor(protected template: HTMLTemplateElement) {
        // Вызываем конструктор родителя, передавая клонированное содержимое шаблона
        // template.content.cloneNode(true) создает глубокую копию содержимого шаблона
        super(template.content.cloneNode(true) as HTMLElement);
        
        // Находим элементы внутри нашего контейнера (this.container)
        // ensureElement гарантирует, что элемент будет найден, иначе выбросит ошибку
        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
    }

    // Сеттер для номера элемента - устанавливает текст в элемент индекса
    set index(value: number) {
        this.setText(this.indexElement, value.toString());
    }

    // Сеттер для названия товара
    set title(value: string) {
        this.setText(this.titleElement, value);
    }

    // Сеттер для цены товара
    set price(value: number) {
        this.setText(this.priceElement, `${value} синапсов`);
    }

    // Сеттер для ID товара - сохраняет в dataset контейнера
    set id(value: string) {
        this.container.dataset.id = value;
    }

    // Устанавливает обработчик удаления для кнопки
    setDeleteHandler(handler: (id: string) => void): void {
        this.deleteButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Останавливаем всплытие события, чтобы не триггерились другие обработчики
            const itemId = this.container.dataset.id; // Получаем ID из dataset
            if (itemId) {
                handler(itemId); // Вызываем переданный обработчик с ID товара
            }
        });
    }

    // Вспомогательный метод для установки текста в элемент
    protected setText(element: HTMLElement, text: string): void {
        element.textContent = text;
    }
}