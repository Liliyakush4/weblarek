import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { IBuyer } from '../../types';

interface IOrderStep1 {
  payment: IBuyer['payment'];
  address: string;
  errors?: string;
  canSubmit?: boolean;
}

export class OrderStep1 extends Component<IOrderStep1> {
  protected payCardButton: HTMLButtonElement;
  protected payCashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  private currentPayment: IBuyer['payment'] = '';
  private currentAddress = '';

  constructor(
    protected events: IEvents,
    template: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#order')
  ) {
    const rootNode = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    super(rootNode);

    this.payCardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.payCashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
    this.errorsElement = ensureElement('.form__errors', this.container);

    this.payCardButton.addEventListener('click', () => this.setPayment('card'));
    this.payCashButton.addEventListener('click', () => this.setPayment('cash'));
    this.addressInput.addEventListener('input', () => {
      this.currentAddress = this.addressInput.value.trim();
      this.validate();
    });

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      if (this.submitButton.disabled) return;
      this.events.emit('order:step1:submit', {
        payment: this.currentPayment,
        address: this.currentAddress,
      });
    });
  }

  private setPayment(payment: IBuyer['payment']) {
    this.currentPayment = payment;
    this.payCardButton.classList.toggle('button_alt-active', payment === 'card');
    this.payCashButton.classList.toggle('button_alt-active', payment === 'cash');
    this.validate();
  }

  private validate() {
    const errors: string[] = [];
    if (!this.currentPayment) errors.push('Выберите способ оплаты');
    if (!this.currentAddress) errors.push('Укажите адрес доставки');
    this.errors = errors.join('. ');
    this.canSubmit = errors.length === 0;
  }

  set payment(value: IBuyer['payment']) {
    this.setPayment(value);
  }

  set address(value: string) {
    this.currentAddress = value ?? '';
    this.addressInput.value = this.currentAddress;
    this.validate();
  }

  set errors(text: string) {
    this.errorsElement.textContent = text ?? '';
  }

  set canSubmit(flag: boolean) {
    this.submitButton.disabled = !flag;
  }
}