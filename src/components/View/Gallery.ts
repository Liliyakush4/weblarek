import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';
import { CatalogCard } from './CatalogCard';

interface IGallery {
  items: IProduct[];
}

export class Gallery extends Component<IGallery> {
  protected cardTemplate: HTMLTemplateElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement = ensureElement('main.gallery')
  ) {
    super(container);
    this.cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
  }

  set items(productsList: IProduct[]) {
    const fragment = document.createDocumentFragment();

    productsList.forEach((product) => {
      const cardNode = new CatalogCard(this.events, this.cardTemplate).render({
        id: product.id,
        title: product.title,
        category: mapCategory(product.category),
        priceText: product.price === null ? 'Бесценно' : `${product.price} синапсов`,
        image: product.image,
        disabled: false,
      });
      fragment.append(cardNode);
    });

    this.container.replaceChildren(fragment);
  }
}

function mapCategory(rawCategory: string) {
  const categoryDict: Record<string, string> = {
    soft: 'софт-скил',
    'софт-скил': 'софт-скил',
    hard: 'хард-скил',
    other: 'другое',
    другое: 'другое',
  };
  return categoryDict[rawCategory] ?? rawCategory;
}