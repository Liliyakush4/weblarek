/* Типы HTTP-методов для запросов на сервер*/
export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

/* Интерфейс для работы с API
Описывает методы для выполнения HTTP-запросов*/
export interface IApi {
/* Выполняет GET-запрос для получения данных*/
    get<T extends object>(uri: string): Promise<T>;
/* Выполняет запрос на изменение данных (POST, PUT, DELETE)*/
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

/* Интерфейс товара в каталоге
Описывает структуру данных товара*/
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

/* Интерфейс данных покупателя
Содержит информацию для оформления заказа*/
export interface IBuyer {
    payment: 'card' | 'cash' | '';
    address: string;
    email: string;
    phone: string;
}

/*Тип данных полного заказа
Объединяет данные покупателя с информацией о заказе*/
export type OrderData = IBuyer & {
    total: number; // общая сумма заказа
    items: string[]; // массив ID товаров в заказе
};

/*Тип результата успешного оформления заказа
Данные, возвращаемые API после создания заказа*/
export type OrderResult = {
    id: string; // ID заказа
    total: number;  // общая сумма заказа для подтверждения
};



/* Тип ответа API для запроса списка товаров*/
export type ProductListResponse = {
    total: number; // общее количество товаров
    items: IProduct[]; // массив товаров
};

/*Тип для ошибок валидации данных покупателя
Содержит опциональные сообщения об ошибках для каждого поля*/
export type BuyerValidationErrors = Partial<Record<'payment' | 'address' | 'email' | 'phone', string>>;