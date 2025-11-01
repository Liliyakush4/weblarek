import { Card } from './Card';
import { IProductCard, ICatalogItemView } from './interfaces';

export class CatalogItem extends Card<IProductCard> implements ICatalogItemView {
  constructor(protected template: HTMLTemplateElement) {
    // клонируем первый элемент из шаблона
    const element = template.content.firstElementChild?.cloneNode(true) as HTMLElement;
    if (!element) throw new Error('Шаблон карточки пустой!');
    super(element);
  }

  render(data: IProductCard): HTMLElement {
    this.id = data.id;
    this.title = data.title;
    this.image = data.image;
    this.category = data.category;
    this.price = data.price;
    return this.container;
  }

  onClick(handler: (item: IProductCard) => void): void {
    this.container.addEventListener('click', () => {
      const itemData: IProductCard = {
        id: this.id,
        title: this.title,
        image: this.image,
        category: this.category,
        price: this.price
      };
      handler(itemData);
    });
  }
}
