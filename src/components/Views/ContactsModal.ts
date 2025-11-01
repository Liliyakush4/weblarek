import { FormModal } from "./FormModal";
import { ensureElement } from "../../utils/utils";
import { IContactsData, IContactsModal, IContactsValidation } from "./interfaces";

export class ContactsModal extends FormModal<IContactsData> implements IContactsModal {
    // Инициализируем свойства с ! чтобы показать TypeScript что они будут инициализированы
    protected emailInput!: HTMLInputElement;
    protected phoneInput!: HTMLInputElement;
    
    public onContacts?: (data: IContactsData) => void;

    constructor(container: HTMLElement, contactsTemplate: HTMLTemplateElement) {
        super(container, contactsTemplate, 'form[name="contacts"]');
    }

    // Инициализация специфичных элементов
    protected initializeForm(): void {
        super.initializeForm();
        
        const contentContainer = ensureElement<HTMLElement>('.modal__content', this.container);
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', contentContainer);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', contentContainer);

        this.bindContactsEvents();
    }

    // Привязка специфичных обработчиков
    protected bindContactsEvents(): void {
        this.emailInput.addEventListener('input', () => this.updateSubmitButton());
        this.phoneInput.addEventListener('input', () => this.updateSubmitButton());
    }

    // Валидация формы
    protected validateForm(): boolean {
        return this.validateEmail(this.emailInput.value) && 
               this.validatePhone(this.phoneInput.value);
    }

    // Валидация email
    private validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    // Валидация телефона
    private validatePhone(phone: string): boolean {
        const digitsOnly = phone.replace(/\D/g, '');
        return digitsOnly.length >= 10;
    }

    // Получение данных формы
    protected getFormData(): IContactsData {
        return {
            email: this.emailInput.value.trim(),
            phone: this.phoneInput.value.trim()
        };
    }

    // Очистка полей формы
    protected clearFormFields(): void {
        this.emailInput.value = '';
        this.phoneInput.value = '';
    }

    // Установка обработчика контактов
    setContactsHandler(handler: (data: IContactsData) => void): void {
        this.setSubmitHandler(handler);
    }

    // Установка ошибок валидации (исправленная версия)
    setValidationErrors(errors: Partial<IContactsValidation>): void {
        const errorMessages: string[] = [];
        if (errors.email) errorMessages.push('Введите корректный email');
        if (errors.phone) errorMessages.push('Введите корректный номер телефона');
        this.setFormErrors(errorMessages); // Используем переименованный метод
    }
}