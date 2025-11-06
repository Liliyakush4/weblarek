import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';
import { categoryMap } from '../../utils/constants';

// описывает данные, которые можно передать методу рендер
interface IPreview {
  product: IProduct;
  inCart: boolean;
}

function getCategoryClass(rawCategory: string) {
  const mappedClass = (categoryMap as Record<string, string>)[rawCategory];
  return mappedClass ?? categoryMap['другое'];
}
function applyCategoryClass(element: Element, category: string) {
  element.classList.remove(...Object.values(categoryMap));
  element.classList.add(getCategoryClass(category));
}

export class ProductPreview extends Component<IPreview> {
  protected imageElement: HTMLImageElement;
  protected titleElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected categoryElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected actionButton: HTMLButtonElement;

  private currentProduct?: IProduct;
  private inCartFlag = false;

  constructor(
    protected events: IEvents,
    template: HTMLTemplateElement = ensureElement<HTMLTemplateElement>('#card-preview')
  ) {
    const rootNode = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
    super(rootNode);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.titleElement = ensureElement('.card__title', this.container);
    this.descriptionElement = ensureElement('.card__text', this.container);
    this.categoryElement = ensureElement('.card__category', this.container);
    this.priceElement = ensureElement('.card__price', this.container);
    this.actionButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.actionButton.addEventListener('click', () => {
      if (!this.currentProduct) return;
      if (this.currentProduct.price === null) return;
      this.events.emit(this.inCartFlag ? 'product:remove' : 'product:add', {
        id: this.currentProduct.id,
      });
    });
  }

  // вызывается при установке нового товара
  set product(product: IProduct) {
    this.currentProduct = product;

    this.imageElement.src = product.image;
    this.imageElement.alt = product.title;

    this.titleElement.textContent = product.title;
    this.descriptionElement.textContent = product.description;

    this.categoryElement.textContent = product.category;
    applyCategoryClass(this.categoryElement, product.category);

    this.priceElement.textContent =
      product.price === null ? 'Бесценно' : `${product.price} синапсов`;

    if (product.price === null) {
      this.actionButton.disabled = true;
      this.actionButton.textContent = 'Недоступно';
    } else {
      this.actionButton.disabled = false;
      // текст кнопки выставится сеттером inCart
      this.inCart = this.inCartFlag;
    }
  }

  set inCart(flag: boolean) {
    this.inCartFlag = flag; // сохранение флага
    if (!this.currentProduct || this.currentProduct.price === null) return;
    this.actionButton.textContent = flag ? 'Удалить из корзины' : 'В корзину';
  }
}