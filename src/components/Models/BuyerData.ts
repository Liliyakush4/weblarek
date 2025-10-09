import { IBuyer, BuyerValidationErrors } from "../../types";

export class BuyerData {
  public data: IBuyer;

  constructor(initialData?: IBuyer) {
    //инициализируем данные
    this.data = initialData || {
      payment: '',
      address: '',
      email: '',
      phone: ''
    };
  }

setData(data: Partial<IBuyer>): void {
  this.data = {
    ...this.data,
    ...data
  };
}

getData(): IBuyer {
  return { ...this.data }; // возврат копии воизбежание мутаций
}

clear(): void {
  this.data = {
    payment: '',
    address: '',
    email: '',
    phone: ''
  };
}

validate(): BuyerValidationErrors {
  const errors: BuyerValidationErrors = {};

  // проверка каждого поля на пустоту
    if (!this.data.payment) {
      errors.payment = 'Способ оплаты не выбран';
    }
    if (!this.data.address?.trim()) {
      errors.address = 'Адрес не указан';
    }
    if (!this.data.email?.trim()) {
      errors.email = 'Email не указан';
    }
      if (!this.data.phone?.trim()) {
      errors.phone = 'Номер телефона не указан';
    }

    return errors;
    }
  }