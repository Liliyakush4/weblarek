import { IBuyer } from "../../../types";

// тип для результата валидации
type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

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

validate(): ValidationResult {
  const errors: string[] = [];

  // проверка каждого поля на пустоту
    if (!this.data.payment.trim()) {
      errors.push('Способ оплаты не выбран');
    }
    if (!this.data.address.trim()) {
      errors.push('Адрес не указан');
    }
    if (!this.data.email.trim()) {
      errors.push('Email не указан');
    }
      if (!this.data.phone.trim()) {
      errors.push('Номер телефона не указан');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}