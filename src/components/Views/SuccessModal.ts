import { BaseModal } from "./BaseModal";
import { ISuccessModal } from "./interfaces";

export class SuccessModal extends BaseModal implements ISuccessModal {
    private descriptionElement: HTMLElement;
    private closeButton: HTMLButtonElement;
    private imageElement: HTMLImageElement;
    
    public onAction?: () => void;

    constructor(container: HTMLElement) {
        super(container);
        
        this.descriptionElement = this.ensureBemElement<HTMLElement>('order-success', 'description');
        this.closeButton = this.ensureBemElement<HTMLButtonElement>('order-success', 'close');
        
        // Простое создание элемента
        this.imageElement = document.createElement('img');
        this.imageElement.className = 'order-success__image';
        this.imageElement.alt = 'Успешное оформление заказа';
        
        const titleElement = this.ensureBemElement<HTMLElement>('order-success', 'title');
        this.container.insertBefore(this.imageElement, titleElement);
        
        this.bindEvents();
    }

    private bindEvents(): void {
        this.closeButton.addEventListener('click', () => {
            this.handleClose();
        });
    }

    set total(value: number) {
        this.setText(this.descriptionElement, `Списано ${value} синапсов`);
    }

    set image(src: string) {
        this.setImage(this.imageElement, src, 'Успешное оформление заказа');
    }

    setTotal(value: number): void {
        this.total = value;
    }

    private handleClose(): void {
        this.hide();
        this.onAction?.();
    }
}