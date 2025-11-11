import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { Card } from './Card';
import { CDN_URL, categoryMap } from '../../utils/constants';

interface ICatalogCard {
  category: string;
  image: string;
}

export class CatalogCard extends Card<ICatalogCard> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(protected events: IEvents, template: HTMLTemplateElement) {
    const rootNode = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    super(events, rootNode);

    this.categoryElement = ensureElement('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

    this.container.addEventListener('click', () => {
        this.events.emit('product:open', { element: this.container });
    });
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.applyCategoryClass(value);
  }

  set image(imageName: string) {
    const imageURL = `${CDN_URL}/${imageName}`;
    this.setImage(this.imageElement, imageURL, this.title);
  }

   private applyCategoryClass(category: string): void {
    const categoryKey = category as keyof typeof categoryMap;
    const categoryClass = categoryMap[categoryKey] || 'card__category_other';
    this.categoryElement.className = `card__category ${categoryClass}`;
  }
}