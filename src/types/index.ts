export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// интерфейс товара
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// интерфейс данных покупателя
export interface IBuyer {
    payment: 'card' | 'cash' | '';
    address: string;
    email: string;
    phone: string;
}

// типы для данных заказа
export type OrderData = IBuyer & {
    total: number;
    items: string[];
};

export type OrderResult = {
    id: string;
    total: number;
};

export type ProductListResponse = {
    total: number;
    items: IProduct[];
};

// тип для результата валидации
export type BuyerValidationErrors = Partial<Record<'payment' | 'address' | 'email' | 'phone', string>>;