import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class ShoppingCart {
  // используется массив объектов, где каждый объект содержит товар и его количество
  private items: IProduct[] = [];

  constructor(private events: IEvents, initialItems: IProduct[] = []) {
    this.items = [...initialItems];
    this.emitChanged();
  }

  getItems(): IProduct[] {
    return [...this.items];
}

  addItem(product: IProduct): void {
    if (!this.checkProductInCart(product.id)) {
      this.items.push(product);
      this.emitChanged();
     }
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(p => p.id !== productId);
    this.emitChanged();
  }


  clear(): void {
    this.items = [];
    this.emitChanged();
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, p) => sum + (p.price ?? 0), 0);
  }

  getTotalCount(): number {
    return this.items.length;
  }

  checkProductInCart(productId: string): boolean {
    return this.items.some(p => p.id === productId);
  }

  private emitChanged(): void {
    this.events.emit('cart:changed', {
      items: [...this.items],
      total: this.getTotalPrice(),
      count: this.items.length
    });
  }
}