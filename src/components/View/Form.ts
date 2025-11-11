import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IForm {
  textErrors: string;
}

export abstract class Form<T> extends Component<IForm & T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;
    protected abstract formName: string;

    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);

        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);
        
        this.container.addEventListener('submit', this.handleSubmit.bind(this));
    }

    protected handleSubmit(evt: Event) {
        evt.preventDefault();
        if (this.submitButton.disabled) return;
        this.submitForm();
    }

    protected abstract submitForm(): void;

    protected emitFormChange(data: object): void {
        this.events.emit('form:change', {
            form: this.formName,
            data: data
        });
    }

    set textErrors(text: string | null | undefined) {
        const t = text?.trim() ?? '';
        this.errorsElement.textContent = t;
        this.errorsElement.style.display = t ? 'block' : 'none';
    }

    public enableSubmitButton(): void {
        this.submitButton.disabled = false;
        this.submitButton.classList.remove('button_disabled');
    }

    public disableSubmitButton(): void {
        this.submitButton.disabled = true;
        this.submitButton.classList.add('button_disabled');
    }
}