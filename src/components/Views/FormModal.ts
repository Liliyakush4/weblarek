import { BaseModal } from "./BaseModal";
import { ensureElement, cloneTemplate } from "../../utils/utils";

// Базовый класс для всех модальных окон с формами
export abstract class FormModal<T> extends BaseModal {
    protected form!: HTMLFormElement;
    protected submitButton!: HTMLButtonElement;
    protected errorsElement!: HTMLElement;
    
    // Абстрактные методы, которые должны реализовать дочерние классы
    protected abstract validateForm(): boolean;
    protected abstract getFormData(): T;
    protected abstract clearFormFields(): void;

    constructor(
        container: HTMLElement,
        protected template: HTMLTemplateElement,
        protected formSelector: string = 'form'
    ) {
        super(container);
        
        // Общая логика инициализации формы
        this.initializeForm();
        this.bindFormEvents();
    }

    // Инициализация формы
    protected initializeForm(): void {
        // Клонируем шаблон и вставляем в контент
        const formContent = cloneTemplate(this.template);
        const contentContainer = ensureElement<HTMLElement>('.modal__content', this.container);
        contentContainer.appendChild(formContent);
        
        // Находим общие элементы формы
        this.form = ensureElement<HTMLFormElement>(this.formSelector, contentContainer);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', contentContainer);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', contentContainer);

        this.updateSubmitButton();
    }

    // Привязка общих обработчиков событий
    protected bindFormEvents(): void {
        // Обработчик отправки формы
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleSubmit();
        });
    }

    // Обновление состояния кнопки отправки
    protected updateSubmitButton(): void {
        this.submitButton.disabled = !this.validateForm();
    }

    // Обработчик отправки формы
    protected handleSubmit(): void {
        if (this.submitButton.disabled) return;
        
        const formData = this.getFormData();
        (this as any).onSubmit?.(formData);
    }

    // Установка обработчика отправки
    protected setSubmitHandler(handler: (data: T) => void): void {
        (this as any).onSubmit = handler;
    }

    // Установка ошибок валидации (переименуем чтобы избежать конфликта)
    protected setFormErrors(errorMessages: string[]): void {
        this.errorsElement.textContent = errorMessages.join(', ');
        this.errorsElement.style.display = errorMessages.length > 0 ? 'block' : 'none';
    }

    // Очистка формы
    clearForm(): void {
        this.clearFormFields();
        this.errorsElement.textContent = '';
        this.errorsElement.style.display = 'none';
        this.updateSubmitButton();
    }

    // Переопределяем show и hide для очистки формы
    show(): void {
        super.show();
        this.clearForm();
    }

    hide(): void {
        super.hide();
        this.clearForm();
    }
}