import { IProduct } from "../../types";
import { IProductsModel } from "../../types";

export class Products implements IProductsModel {
  // приватные поля для защищенных данных
  private _products: IProduct[];
  private _selectedCard: IProduct | null;

  constructor(initialProducts?: IProduct[]) {
    this._products = initialProducts ? [...initialProducts] : [];
    this._selectedCard = null;
  }

// геттеры для доступа к данным
  get products(): IProduct[] {
    return [...this._products]
  }

  get selectedCart(): IProduct | null {
    return this._selectedCard ? { ...this._selectedCard } : null;
  }

  saveData(data: IProduct[]): void {
    this._products = [...data];
  }

  getProductList(): IProduct[] {
    return [...this._products]
  }

  getProduct(id: string): IProduct | undefined {
    return this._products.find(product => product.id === id);
  }

  saveCard(card: IProduct): void {
    this._selectedCard = { ...card };
  }

  getCard(): IProduct | null {
    return this._selectedCard ? { ...this._selectedCard } : null; 
  }
}