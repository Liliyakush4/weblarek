import { IBuyer, BuyerValidationErrors } from "../../types";
import { IEvents } from "../base/Events";

export class BuyerData {
  public data: IBuyer;

  constructor(private events: IEvents, initialData?: IBuyer) {
    //инициализируем данные
    this.data = initialData || {
      payment: '',
      address: '',
      email: '',
      phone: ''
    };
  }

setData(data: Partial<IBuyer>): void {
  this.data = { ...this.data, ...data };
  this.events.emit('buyer:changed', { ...this.data });
}

getData(): IBuyer {
  return { ...this.data }; // возврат копии воизбежание мутаций
}

clear(): void {
  this.data = { payment: '', address: '', email: '', phone: '' };
  this.events.emit('buyer:changed', { ...this.data });
}

validate(): BuyerValidationErrors {
  const errors: BuyerValidationErrors = {};
  // проверка каждого поля на пустоту
    if (!this.data.payment) errors.payment = 'Необходимо выбрать способ оплаты';
    if (!this.data.address?.trim()) errors.address = 'Необходимо указать адрес';
    if (!this.data.email?.trim())  errors.email = 'Укажите ваш email';
    if (!this.data.phone?.trim())  errors.phone = 'Укажите ваш номер телефона';
      return errors;
    }
  }