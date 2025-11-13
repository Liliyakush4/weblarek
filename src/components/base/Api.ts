// объявление типа для HTTP-методов, которые отправляют данные
type ApiPostMethods = 'POST' | 'PUT' | 'DELETE'; // ограничивает типы методов

export class Api {
    readonly baseUrl: string; // базовый Url, readonly - нельзя изменить после создания экземпляра
    protected options: RequestInit; // доступен только в этомклассе и в наследующих

    constructor(baseUrl: string, options: RequestInit = {}) {
        this.baseUrl = baseUrl; // сохраняет базовый Url
        this.options = { // инициализирует опции запроса
            headers: { // устанавливает стандартный заголовок
                'Content-Type': 'application/json',
                ...(options.headers as object ?? {}) // распаковывааем переданные заголовки, если они есть, либо используем пустой объект
            } // оператор ?? для обработки null/undefined
        };
    }
    // защищенный метод для обработки ответов от сервера
    protected handleResponse<T>(response: Response): Promise<T> {
        if (response.ok) return response.json(); // если успешно, парсим json-тело ответа
        else return response.json() // если ошибка - парсим json и извлекаем сообщение об ошибке
            .then(data => Promise.reject(data.error ?? response.statusText)); // если в теле ответа есть поле error - используем его, иначе - используем стандартный текст статуса
    }
    // метод для GET-запросов
    get<T extends object>(uri: string) { // гарантия того, что джереник будет объектом
        return fetch(this.baseUrl + uri, { // fetch возвращает Promise
            ...this.options, // копируем базовые опции
            method: 'GET' // явно указываем метод
        }).then(this.handleResponse<T>); // обрабатываем ответ
    }
    // мметод для обработки запросов с телом POST/PUT/DELETE
    post<T extends object>(
        uri: string, // эндпоинт
        data: object, // данные для отправки
        method: ApiPostMethods = 'POST') { // метод по умолчанию POST

        return fetch(this.baseUrl + uri, {
            ...this.options,
            method,
            body: JSON.stringify(data) // сериализуем данные в JSON
        }).then(this.handleResponse<T>);
    }
}
