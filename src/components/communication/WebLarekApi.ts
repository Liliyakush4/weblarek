import { IApi, IProduct, OrderData, OrderResult, ProductListResponse } from "../../types";

export class WebLarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProductList(): Promise<IProduct[]> {
      const response = await this.api.get<ProductListResponse>('/product/');
      return response.items;
    }

  async submitOrder(orderData: OrderData): Promise<OrderResult> {
      const response = await this.api.post<OrderResult>('/order/', orderData);
      return response;
    }
  }