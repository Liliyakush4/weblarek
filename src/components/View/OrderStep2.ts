import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IOrderStep2 {
  email: string;
  phone: string;
  errors?: string;
  canSubmit?: boolean;
}

export class OrderStep2 extends Component<IOrderStep2> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  private currentEmail = '';
  private currentPhone = '';

  constructor(
    protected events: IEvents,
    template: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#contacts')
  ) {
    const rootNode = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    super(rootNode);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.errorsElement = ensureElement('.form__errors', this.container);

    const onChange = () => {
      this.currentEmail = this.emailInput.value.trim();
      this.currentPhone = this.phoneInput.value.trim();
      this.validate();
    };

    // синхронизация значений полей с состоянием компонента
    this.emailInput.addEventListener('input', onChange);
    this.phoneInput.addEventListener('input', onChange);

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      if (this.submitButton.disabled) return;
      this.events.emit('order:step2:submit', {
        email: this.currentEmail,
        phone: this.currentPhone,
      });
    });
  }

  private validate() {
    const errors: string[] = [];
    if (!this.currentEmail) errors.push('Укажите email');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.currentEmail)) errors.push('Некорректный email');
    if (!this.currentPhone) errors.push('Укажите телефон');

    this.errors = errors.join('. ');
    this.canSubmit = errors.length === 0;
  }

  set email(value: string) {
    this.currentEmail = value ?? '';
    this.emailInput.value = this.currentEmail;
    this.validate();
  }

  set phone(value: string) {
    this.currentPhone = value ?? '';
    this.phoneInput.value = this.currentPhone;
    this.validate();
  }

  set errors(text: string) {
    this.errorsElement.textContent = text ?? '';
  }

  set canSubmit(flag: boolean) {
    this.submitButton.disabled = !flag;
  }
}