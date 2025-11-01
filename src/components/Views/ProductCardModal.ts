import { BaseModal } from "./BaseModal";
import { Card } from "./Card";
import { IProductCardModal, IProductCardModalView } from "./interfaces";
import { IEvents } from "../base/Events";

export class ProductCardModal extends BaseModal implements IProductCardModalView {
    private card: Card<IProductCardModal>;
    protected descriptionElement: HTMLElement;
    protected addButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        // Используем композицию - создаем экземпляр Card
        this.card = new Card(container);
        
        // Дополнительные элементы для модального окна
        this.descriptionElement = this.ensureBemElement<HTMLElement>('card', 'text');
        this.addButton = this.ensureBemElement<HTMLButtonElement>('card', 'button');

        this.bindEvents();
    }

    // Делегируем методы карточке
    set id(value: string) { this.card.id = value; }
    set image(value: string) { this.card.image = value; }
    set title(value: string) { this.card.title = value; }
    set category(value: string) { this.card.category = value; }
    set price(value: number | null) { this.card.price = value; }
    set description(value: string) {
        this.setText(this.descriptionElement, value);
    }

    protected bindEvents(): void {
        this.addButton.addEventListener('click', () => {
            this.handleAddToCard();
        });

        // Закрытие по клику на оверлей
        this.modalContainer.addEventListener('click', (event) => {
            if (event.target === this.modalContainer) {
                this.handleClose();
            }
        });
    }

    setProductData(data: IProductCardModal): void {
        this.render(data);
    }

    setAddToCardHandler(handler: (product: IProductCardModal) => void): void {
        this.events.on('product:addToCard', handler);
    }

    setInCardStatus(inCart: boolean): void {
        this.addButton.disabled = inCart;
        this.addButton.textContent = inCart ? 'В корзине' : 'В корзину';
    }

    protected handleAddToCard(): void {
        const productData: IProductCardModal = {
            id: this.container.dataset.id || '',
            description: this.descriptionElement.textContent || '',
            image: (this.card as any).imageElement.src,
            title: (this.card as any).titleElement.textContent || '',
            category: (this.card as any).categoryElement.textContent || '',
            price: (this.card as any).extractPriceFromElement()
        };

        this.events.emit('product:addToCard', productData);
    }

    protected handleClose(): void {
        this.hide();
        this.events.emit('modal:close');
    }
}