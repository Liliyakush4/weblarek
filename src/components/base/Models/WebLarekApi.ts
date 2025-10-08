import { IApi, IProduct, OrderData, OrderResult, ProductListResponse } from "../../../types";
export class WebLarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

// получение списка товаров
  async getProductList(): Promise<IProduct[]> {
    try {
      const response = await this.api.get<ProductListResponse>('/product/');
      return response.items;
    } catch (error) {
      console.error('Ошибка при получении списка товаров:', error);
      throw error;
    }
  }
// отправка заказа
  async submitOrder(orderData: OrderData): Promise<OrderResult> {
    try {
      const response = await this.api.post<OrderResult>('/order/', orderData);
      return response;
    } catch (error) {
      console.error('Ошибка при отправке заказа:', error);
      throw error;
    }
  }
}