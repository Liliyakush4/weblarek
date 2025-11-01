import { FormModal } from "./FormModal";
import { ensureElement } from "../../utils/utils";
import { IOrderData, IOrderModal, IOrderValidation } from "./interfaces";

export class OrderModal extends FormModal<IOrderData> implements IOrderModal {
    protected cardButton!: HTMLButtonElement;
    protected cashButton!: HTMLButtonElement;
    protected addressInput!: HTMLInputElement;
    
    private selectedPayment: 'card' | 'cash' | '' = '';
    public onOrder?: (data: IOrderData) => void;

    constructor(container: HTMLElement, orderTemplate: HTMLTemplateElement) {
        super(container, orderTemplate, 'form[name="order"]');
    }

    // Инициализация специфичных для OrderModal элементов
    protected initializeForm(): void {
        super.initializeForm();
        
        // Находим специфичные элементы
        const contentContainer = ensureElement<HTMLElement>('.modal__content', this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', contentContainer);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', contentContainer);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', contentContainer);

        this.bindOrderEvents();
    }

    // Привязка специфичных обработчиков
    protected bindOrderEvents(): void {
        this.cardButton.addEventListener('click', () => this.selectPayment('card'));
        this.cashButton.addEventListener('click', () => this.selectPayment('cash'));
        this.addressInput.addEventListener('input', () => this.updateSubmitButton());
    }

    // Выбор способа оплаты
    private selectPayment(payment: 'card' | 'cash'): void {
        this.selectedPayment = payment;
        this.cardButton.classList.toggle('button_alt-active', payment === 'card');
        this.cashButton.classList.toggle('button_alt-active', payment === 'cash');
        this.updateSubmitButton();
    }

    // Валидация формы (реализация абстрактного метода)
    protected validateForm(): boolean {
        const isAddressValid = this.addressInput.value.trim().length > 0;
        const isPaymentValid = this.selectedPayment !== '';
        return isAddressValid && isPaymentValid;
    }

    // Получение данных формы (реализация абстрактного метода)
    protected getFormData(): IOrderData {
        return {
            payment: this.selectedPayment,
            address: this.addressInput.value.trim()
        };
    }

    // Очистка полей формы (реализация абстрактного метода)
    protected clearFormFields(): void {
        this.selectedPayment = '';
        this.addressInput.value = '';
        this.cardButton.classList.remove('button_alt-active');
        this.cashButton.classList.remove('button_alt-active');
    }

    // Установка обработчика заказа
    setOrderHandler(handler: (data: IOrderData) => void): void {
        this.setSubmitHandler(handler);
    }

    // Установка ошибок валидации
    setValidationErrors(errors: Partial<IOrderValidation>): void {
        const errorMessages: string[] = [];
        if (errors.payment) errorMessages.push('Выберите способ оплаты');
        if (errors.address) errorMessages.push('Введите корректный адрес');
        this.setFormErrors(errorMessages); // Используем переименованный метод
    }
}