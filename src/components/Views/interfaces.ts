/* Базовый интерфейс для модальных окон
Определяет общие методы и свойства всех модальных окон*/
export interface IModal {
    show(): void; // показать модальное окно
    hide(): void; // скрыть модальное окно
    readonly isOpen: boolean; // флаг открытого состояния
    onClose?: () => void; // опциональный колбэк при закрытии окна
}

/* Интерфейс для модальных окон с кнопками действий
Расширяет базовый интерфейс модального окна*/
export interface IActionModal extends IModal {
    buttonText: string; // текст на кнопке действия
    isButtonDisabled?: boolean; // флаг активности кнопки
    onAction?: () => void; // колбэк при нажатии на кнопку действия
    setButtonDisabled(disabled: boolean): void; // установить состояние кнопки (активна/неактивна)
    setButtonText(text: string): void; // установить текст кнопки
}

/* Интерфейс для модальных окон с контентом
Расширяет базовый интерфейс модального окна*/
export interface IContentModal extends IModal {
    content: HTMLElement | string; // содержимое модального окна: DOM-элемент или HTML-строка
    setContent(content: HTMLElement | string): void; // установить содержимое окна
}

/* Интерфейс для хедера
Содержит данные для отображения в шапке приложения*/
export interface IHeader {
    counter: number;
}

/* ИНТЕРФЕЙСЫ ДЛЯ КАРТОЧЕК ТОВАРОВ */

/* Базовый интерфейс карточки товара
Содержит основные данные для отображения товара в каталоге*/
export interface IProductCard {
    id: string;
    category: string;
    title: string;
    image: string;
    price: number | null;
}

/* Интерфейс расширенной карточки товара для модального окна
Расширяет базовую карточку дополнительной информацией*/
export interface IProductCardModal extends IProductCard {
    description: string; // подробное описание товара
}

/* Базовый интерфейс для представления карточки
Определяет метод отрисовки карточки с данными*/
export interface ICardView {
    render(data: IProductCard): HTMLElement; // отрисовать карточку с переданными данными
}

/* Интерфейс для карточки товара в каталоге
Расширяет базовый интерфейс карточки возможностью обработки кликов*/
export interface ICatalogItemView extends ICardView {
    onClick(handler: (item: IProductCard) => void): void; // установить обработчик клика по карточке
}

/* Интерфейс для модального окна карточки товара
Сочетает функциональность модального окна и работы с данными товара*/
export interface IProductCardModalView extends IModal {
    setProductData(data: IProductCardModal): void; // установить данные товара для отображения
    setAddToCardHandler(handler: (product: IProductCardModal) => void): void; // установить обработчик добавления в корзину
    setInCardStatus(inCart: boolean): void; // установить статус товара: в корзине или нет
    onAddToCard?: (product: IProductCardModal) => void; // колбэк при добавлении товара в корзину
}

/* Интерфейс для представления каталога товаров
Управляет отображением списка товаров и обработкой взаимодействий*/
export interface ICatalogView {
    items: IProductCard[]; // массив товаров для отображения
    render(items: IProductCard[]): HTMLElement; // отрисовать каталог с переданными товарами
    setOnClickHandler(handler: (item: IProductCard) => void): void; // установить обработчик клика по товарам
}

/* Интерфейс для элемента корзины (товара) */
export interface IBasketItem {
    id: string;
    title: string;
    price: number;
    index: number;
}

/* Интерфейс для представления элемента корзины */
export interface IBasketItemView {
    render(data: IBasketItem): HTMLElement;
    setDeleteHandler(handler: (id: string) => void): void;
}

/* Интерфейс для модального окна корзины */
export interface IBasketModal extends IModal {
  items: IBasketItem[]; // массив товаров в корзине
  total: number;
  setItems(items: IBasketItem[]): void;
  setTotal(total: number): void;
  setOrderHandler(handler: () => void): void; // принимает функцию, которая будет вызвана при нажатии на кнопку "Оформить"
  setDeleteHandler(handler: (id: string) => void): void; // принимает функцию, которая получает id удаляемого товара
  onOrder?: () => void;
}

/* Интерфейс для данных заказа */
export interface IOrderData {
    payment: 'card' | 'cash' | '';
    address: string;
}

/* Интерфейс для валидации заказа */
export interface IOrderValidation {
    payment: boolean;
    address: boolean;
}

/* Интерфейс для модального окна оформления заказа */
export interface IOrderModal extends IModal {
    setOrderHandler(handler: (data: IOrderData) => void): void;
    setValidationErrors(errors: Partial<IOrderValidation>): void;
    clearForm(): void;
    onOrder?: (data: IOrderData) => void;
}

/* Интерфейс для данных контактов */
export interface IContactsData {
    email: string;
    phone: string;
}

/* Интерфейс для валидации контактов */
export interface IContactsValidation {
    email: boolean;
    phone: boolean;
}

/* Интерфейс для модального окна контактов */
export interface IContactsModal extends IModal {
    setContactsHandler(handler: (data: IContactsData) => void): void;
    setValidationErrors(errors: Partial<IContactsValidation>): void;
    clearForm(): void;
    onContacts?: (data: IContactsData) => void;
}

/* Интерфейс для модального окна успешного заказа
Отображает информацию об успешном оформлении заказа*/
export interface ISuccessModal extends IModal {
    setTotal(value: number): void; // установить сумму заказа для отображения
    onAction?: () => void; // колбэк при закрытии окна
}

/* Интерфейс для данных успешного заказа */
export interface ISuccessModalData {
    total: number; // сумма заказа
    image?: string; // опциональный URL изображения для отображения
}