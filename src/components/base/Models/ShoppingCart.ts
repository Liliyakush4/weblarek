import { IProduct } from "../../../types";

export class ShoppingCart {
  // используется массив объектов, где каждый объект содержит товар и его количество
  public items: Array<{ product: IProduct; quantity: number }>;

  constructor(initialItems?: Array<{ product: IProduct; quantity: number }>) {
    this.items = initialItems || [];
  }

  getItems(): Array<{ product: IProduct; quantity: number }> {
    return [...this.items];
}

  addItem(product: IProduct): void {
    // поиск существующего товара
    const existingItem = this.items.find(item => item.product.id === product.id);

      if (existingItem) {
    // если товар уже есть в корзине, увеличиваем его количество на 1
        existingItem.quantity +=1;
      } else {
    // если товара нет, добавим новый элемент с его количеством = 1
        this.items.push({
        product: { ...product },
        quantity: 1
       });
     }
  }

  removeItem(productId: string): void {
    const itemIndex = this.items.findIndex(items => items.product.id === productId);

    if (itemIndex !== -1) {
      this.items.splice(itemIndex, 1);
    }
  }

  clear(): void {
    this.items = [];
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => {
      // учитываем только товары с установленой ценой
      const price = item.product.price || 0;
      return total + (price * item.quantity);
    }, 0);
  }

  getTotalCount(): number {
    return this.items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }

  checkProductInCart(productId: string): boolean {
    return this.items.some(item => item.product.id === productId);
  }
}