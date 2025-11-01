import { Component } from "../base/Component";
import { ensureElement, bem } from "../../utils/utils";
import { IModal } from "./interfaces";

export abstract class BaseModal extends Component<any> implements IModal {
    protected modalContainer: HTMLElement;
    public onClose?: () => void;

    constructor(
        container: HTMLElement,
        modalContainerSelector: string = '#modal-container'
    ) {
        super(container);
        this.modalContainer = ensureElement<HTMLElement>(modalContainerSelector);
    }

    show(): void {
        this.toggleClass(this.modalContainer, 'modal_active', true);
    }

    hide(): void {
        this.toggleClass(this.modalContainer, 'modal_active', false);
        this.onClose?.();
    }

    get isOpen(): boolean {
        return this.modalContainer.classList.contains('modal_active');
    }

    // вспомогательные методы для работы с классами
    protected toggleClass(element: HTMLElement, className: string, force?: boolean): void {
        element.classList.toggle(className, force);
    }

    protected setText(element: HTMLElement, text: string): void {
        element.textContent = text;
    }

    protected setImage(imgElement: HTMLImageElement, src: string, alt: string = ''): void {
        imgElement.src = src;
        imgElement.alt = alt;
    }

    // безопасное получение элемента с BEM
    protected ensureBemElement<T extends HTMLElement>(
        block: string,
        element: string,
        context?: HTMLElement
    ): T {
        const { class: selector } = bem(block, element);
        return ensureElement<T>(selector, context || this.container);
    }
}