import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IGallery {
  cards: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
  constructor(
    protected events: IEvents,
    container: HTMLElement = ensureElement('.gallery')
  ) {
    super(container);
  }

  set cards(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}