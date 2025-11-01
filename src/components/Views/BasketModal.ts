import { BaseModal } from "./BaseModal";
import { ensureElement, cloneTemplate } from "../../utils/utils";
import { BasketItem } from "./BasketItem";
import { IBasketItem, IBasketModal } from "./interfaces";

// Класс модального окна корзины, наследуется от BaseModal
export class BasketModal extends BaseModal implements IBasketModal {
    // DOM-элементы модального окна
    protected itemsContainer: HTMLElement;    // контейнер для списка товаров
    protected totalElement: HTMLElement;      // элемент для отображения общей суммы
    protected orderButton: HTMLButtonElement; // кнопка "Оформить"
    protected basketItems: BasketItem[] = []; // массив элементов корзины
    protected contentContainer: HTMLElement;  // контейнер для контента модального окна
    
    public onOrder?: () => void; // колбэк для оформления заказа

    // Конструктор принимает контейнер и два шаблона
    constructor(
        container: HTMLElement,
        protected basketTemplate: HTMLTemplateElement, // шаблон всей корзины
        protected itemTemplate: HTMLTemplateElement    // шаблон одного элемента
    ) {
        super(container); // Вызываем конструктор BaseModal
        
        // Клонируем шаблон корзины (создаем DOM-структуру из template#basket)
        const basketContent = cloneTemplate(this.basketTemplate);
        // Находим контейнер для контента в модальном окне
        this.contentContainer = ensureElement<HTMLElement>('.modal__content', this.container);
        // Вставляем клонированную разметку корзины в контент модального окна
        this.contentContainer.appendChild(basketContent);
        
        // Теперь находим элементы внутри созданной разметки корзины
        this.itemsContainer = ensureElement<HTMLElement>('.basket__list', this.contentContainer);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.contentContainer);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.contentContainer);

        this.bindEvents(); // Навешиваем обработчики событий
    }

    // Метод для привязки обработчиков событий
    protected bindEvents(): void {
        // Обработчик клика по кнопке "Оформить"
        this.orderButton.addEventListener('click', () => {
            this.handleOrder(); // Вызываем метод обработки заказа
        });
    }

    // Сеттер для установки списка товаров
    set items(items: IBasketItem[]) {
        this.clearItems(); // Очищаем текущий список
        items.forEach(item => this.addItem(item)); // Добавляем каждый товар
        this.updateOrderButton(); // Обновляем состояние кнопки
    }

    // Сеттер для установки общей суммы
    set total(value: number) {
        this.setText(this.totalElement, `${value} синапсов`);
    }

    // Очистка списка товаров
    private clearItems(): void {
        this.itemsContainer.innerHTML = ''; // Очищаем HTML-контейнер
        this.basketItems = []; // Очищаем массив элементов
    }

    // Добавление одного товара в список
    private addItem(data: IBasketItem): void {
        // Создаем новый элемент корзины из шаблона
        const basketItem = new BasketItem(this.itemTemplate);
        // Рендерим элемент с данными и получаем DOM-элемент
        const renderedElement = basketItem.render(data);
        // Добавляем элемент в контейнер списка
        this.itemsContainer.appendChild(renderedElement);
        // Сохраняем ссылку на объект BasketItem в массиве
        this.basketItems.push(basketItem);
    }

    // Обновление состояния кнопки "Оформить"
    private updateOrderButton(): void {
        // Делаем кнопку активной только если есть товары в корзине
        this.orderButton.disabled = this.basketItems.length === 0;
    }

    // Установка обработчика оформления заказа
    setOrderHandler(handler: () => void): void {
        this.onOrder = handler; // Сохраняем колбэк
    }

    // Установка обработчиков удаления для всех элементов
    setDeleteHandler(handler: (id: string) => void): void {
        // Для каждого элемента корзины устанавливаем обработчик удаления
        this.basketItems.forEach(item => {
            item.setDeleteHandler(handler);
        });
    }

    // Альтернативный метод установки товаров (для интерфейса)
    setItems(items: IBasketItem[]): void {
        this.items = items; // Используем сеттер items
    }

    // Альтернативный метод установки суммы (для интерфейса)
    setTotal(total: number): void {
        this.total = total; // Используем сеттер total
    }

    // Обработчик нажатия кнопки "Оформить"
    private handleOrder(): void {
        this.onOrder?.(); // Вызываем колбэк, если он установлен
    }

    // Вспомогательный метод для установки текста
    protected setText(element: HTMLElement, text: string): void {
        element.textContent = text;
    }

    // Переопределяем метод show для обновления состояния при открытии
    show(): void {
        super.show(); // Вызываем родительский метод
        this.updateOrderButton(); // Обновляем кнопку
    }
}