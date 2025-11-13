import { IEvents } from '../base/Events';
import { CardWithCategoryImage } from './Card';
import { AppEvents } from '../../types/events';

interface ICatalogCard {
  category: string;
  image: string;
}

export class CatalogCard extends CardWithCategoryImage<ICatalogCard> {
  constructor(protected events: IEvents, template: HTMLTemplateElement) {
    const rootNode = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    super(events, rootNode);

    this.container.addEventListener('click', () => {
        this.events.emit(AppEvents.ProductOpen, { id: this.id });
    });
  }
}