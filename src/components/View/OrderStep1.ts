import { Form } from './Form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { IBuyer } from '../../types';
import { AppEvents } from '../../types/events';

interface IOrderStep1 {
  payment: IBuyer['payment'];
  address: string;
  errors: string[];
}

export class OrderStep1 extends Form<IOrderStep1> {
  protected formName = 'step1';
  
  protected payCardButton: HTMLButtonElement;
  protected payCashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  private currentPayment: IBuyer['payment'] | '' = '';

  constructor(
    protected events: IEvents,
    template: HTMLTemplateElement
  ) {
    const container = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    super(events, container);

    this.payCardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.payCashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this.payCardButton.addEventListener('click', () => {
      this.setPayment('card');
    });

    this.payCashButton.addEventListener('click', () => {
      this.setPayment('cash');
    });
    
    this.addressInput.addEventListener('input', () => {
      this.emitFormChange({ address: this.addressInput.value });
    });
  }

  private setPayment(payment: IBuyer['payment']): void {
    this.currentPayment = payment;
    this.updatePaymentButtons();
    this.emitFormChange({ payment });
  }

  private updatePaymentButtons(): void {
    this.payCardButton.classList.toggle('button_alt-active', this.currentPayment === 'card');
    this.payCashButton.classList.toggle('button_alt-active', this.currentPayment === 'cash');
  }

  protected submitForm(): void {
    this.events.emit(AppEvents.OrderStep1Submit);
  }

  set payment(value: IBuyer['payment']) {
    this.currentPayment = value || '';
    this.updatePaymentButtons();
  }

  set address(value: string) {
    this.addressInput.value = value ?? '';
  }

  set errors(errors: string[]) {
    this.textErrors = errors.join('. ');
  }

  reset() {
    this.addressInput.value = '';
    this.currentPayment = '';
    this.updatePaymentButtons();
    this.textErrors = '';
    this.disableSubmitButton();
  }
}