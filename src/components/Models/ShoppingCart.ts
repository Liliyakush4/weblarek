import { IProduct } from "../../types";

export class ShoppingCart {
  // используется массив объектов, где каждый объект содержит товар и его количество
  private items: IProduct[] = [];

  constructor(initialItems: IProduct[] = []) {
    this.items = [...initialItems];
  }

  getItems(): IProduct[] {
    return [...this.items];
}

  addItem(product: IProduct): void {
    if (!this.checkProductInCart(product.id)) {
      this.items.push(product);
     }
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(p => p.id !== productId);
  }


  clear(): void {
    this.items = [];
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
}