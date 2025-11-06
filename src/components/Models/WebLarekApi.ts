import { IApi, IProduct, OrderData, OrderResult, ProductListResponse } from '../../types';
import { CDN_URL } from '../../utils/constants';

export class WebLarekApi {
  constructor(private readonly api: IApi) {}

  // список товаров
  async getProductList(): Promise<IProduct[]> {
    const response = await this.api.get<ProductListResponse>('/product/');

    const cdnBaseUrl = CDN_URL.replace(/\/$/, '');
    return response.items.map((product) => {
      const imageWithPng = product.image.replace(/\.svg$/i, '.png');
      const imageFileName = imageWithPng.replace(/^\//, '');
      const imageUrl = /^https?:\/\//i.test(imageWithPng)
        ? imageWithPng
        : `${cdnBaseUrl}/${imageFileName}`;

      return { ...product, image: imageUrl };
    });
  }

  // создание заказа
  async submitOrder(orderData: OrderData): Promise<OrderResult> {
    return this.api.post<OrderResult>('/order/', orderData);
  }
}