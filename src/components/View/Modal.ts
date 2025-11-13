import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { AppEvents } from '../../types/events';

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
      this.close();
  });
  
  this.container.addEventListener('click', (event: MouseEvent) => {
    if (event.target === this.container) {
      this.close();
    }
  });
  }

  private get isOpen(): boolean {
    return this.container.classList.contains('modal_active');
  }

  setContent(content: HTMLElement): void {
    this.contentElement.replaceChildren(content);
  }

  private _handleEscape = (evt: KeyboardEvent) => {
    if (evt.key === 'Escape') {
      this.close();
    }
  };

  open(): void {
    if (!this.isOpen) {
    this.container.classList.add('modal_active');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', this._handleEscape);
    }
  }

  close(): void {
    this.container.classList.remove('modal_active');
    document.body.style.overflow = '';
    this.contentElement.replaceChildren();
    this.events.emit(AppEvents.ModalClosed);
    document.removeEventListener('keydown', this._handleEscape);
  }
}