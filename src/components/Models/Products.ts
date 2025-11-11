import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Products {
// приватные поля для защищенных данных
  private _products: IProduct[];
  private _selectedCard: IProduct | null;

  constructor(private events: IEvents, initialProducts?: IProduct[]) {
    this._products = initialProducts ? [...initialProducts] : [];
    this._selectedCard = null;
  }

// геттеры для доступа к данным
  get products(): IProduct[] {
    return [...this._products]
  }

  get selectedCard(): IProduct | null {
    return this._selectedCard ? { ...this._selectedCard } : null;
}

// загрузка/обновлени каталога
  saveData(data: IProduct[]): void {
    this._products = [...data];
    this.events.emit('catalog:changed', { items: [...this._products] });
  }

  getProductList(): IProduct[] {
    return [...this._products]
  }

  getProduct(id: string): IProduct | undefined {
    return this._products.find(product => product.id === id);
  }
// выбор карточки
  saveCard(card: IProduct): void {
    this._selectedCard = { ...card };
    this.events.emit('product:selected', { product: {...this._selectedCard} });
  }

  getCard(): IProduct | null {
    return this._selectedCard ? { ...this._selectedCard } : null; 
  }
}