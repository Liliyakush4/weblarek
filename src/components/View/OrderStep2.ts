import { Form } from './Form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { AppEvents } from '../../types/events';

interface IOrderStep2 {
  email: string;
  phone: string;
  errors: string[];
}

export class OrderStep2 extends Form<IOrderStep2> {
  protected formName = 'step2';
  
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

    constructor(
    protected events: IEvents,
    template: HTMLTemplateElement
  ) {
    const container = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    super(events, container);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

    this.emailInput.addEventListener('input', () => {
      this.emitFormChange({ email: this.emailInput.value });
    });

    this.phoneInput.addEventListener('input', () => {
      this.emitFormChange({ phone: this.phoneInput.value });
    });
  }

  protected submitForm(): void {
    this.events.emit(AppEvents.OrderStep2Submit);
  }

  set email(value: string) {
    this.emailInput.value = value ?? '';
  }

  set phone(value: string) {
    this.phoneInput.value = value ?? '';
  }

  set errors(errors: string[]) {
    this.textErrors = errors.join('. ');
  }

  reset() {
    this.emailInput.value = '';
    this.phoneInput.value = '';
    this.textErrors = '';
    this.disableSubmitButton();
  }
}