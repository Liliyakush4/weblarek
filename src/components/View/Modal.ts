import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IModal {
  isOpen: boolean;
  content?: HTMLElement | null;
}

export class Modal extends Component<IModal> {
  protected modalContainerElement: HTMLElement;
  protected contentElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    container: HTMLElement = ensureElement('#modal-container')
  ) {
    super(container);

    this.modalContainerElement = ensureElement<HTMLElement>('.modal__container', this.container);
    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    this.onBackdropClick = this.onBackdropClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    this.closeButton.addEventListener('click', () => this.close());
    this.container.addEventListener('mousedown', this.onBackdropClick);
  }

  protected onBackdropClick(event: MouseEvent) {
    if (!this.modalContainerElement.contains(event.target as Node)) this.close();
  }

  protected onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') this.close();
  }

  set content(node: HTMLElement | null | undefined) {
    this.contentElement.replaceChildren();
    if (node) this.contentElement.append(node);
  }

  set isOpen(value: boolean) {
    if (value) this.open();
    else this.close();
  }

  open() {
    this.container.classList.add('modal_active');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', this.onKeyDown);
  }

  close() {
    this.container.classList.remove('modal_active');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this.onKeyDown);
    this.contentElement.replaceChildren();
    this.events.emit('modal:closed');
  }
}