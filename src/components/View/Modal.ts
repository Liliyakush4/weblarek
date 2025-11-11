import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<{}> {
  private contentElement: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(protected events: IEvents) {
    super(ensureElement('#modal-container'));

    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
  this.closeButton.addEventListener('click', () => {
    this.events.emit('modal:closed');
  });
  
  this.container.addEventListener('mousedown', (event: MouseEvent) => {
    if (!this.contentElement.contains(event.target as Node)) {
      this.events.emit('modal:closed');
    }
  });

  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.isOpen) {
      this.events.emit('modal:closed');
    }
  });
}

  private get isOpen(): boolean {
    return this.container.classList.contains('modal_active');
  }

  setContent(content: HTMLElement): void {
    this.contentElement.replaceChildren(content);
  }

  open(): void {
    if (!this.isOpen) {
    this.container.classList.add('modal_active');
    document.body.style.overflow = 'hidden';
   }
  }

  close(): void {
    this.container.classList.remove('modal_active');
    document.body.style.overflow = '';
    this.contentElement.replaceChildren();
  }
}