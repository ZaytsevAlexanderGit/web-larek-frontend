import { Component } from './base/Component';
import { IProduct } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Product extends Component<IProduct> {
	protected events: IEvents;
	protected productButton?: HTMLElement;
	protected productTitle: HTMLElement;
	protected productDescription?: HTMLElement;
	protected productPrice: HTMLElement;
	protected productCategory?: HTMLElement;
	protected productBasketNumber?: HTMLElement;
	protected productImage?: HTMLImageElement;
	protected deleteButton?: HTMLButtonElement;
	protected buyButton?: HTMLButtonElement;

	constructor(protected container:HTMLElement, events:IEvents) {
		super(container);
		this.events = events;

		if (container.classList.contains("gallery__item")) this.productButton = container;
		this.productTitle = ensureElement<HTMLElement>('.card__title',container);
		this.productPrice = ensureElement<HTMLElement>('.card__price',container);
		try {
			this.productDescription = ensureElement<HTMLElement>('.card__text', container);
		}	catch(err) {
			// console.log(err.message);
		}
		try {
			this.productCategory = ensureElement<HTMLElement>('.card__category',container);
		} catch(err) {
			// console.log(err.message);
		}
		try {
			this.productImage = ensureElement<HTMLImageElement>('.card__image',container);
		} catch(err) {
			// console.log(err.message);
		}
		try {
			this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
		} catch(err) {
			// console.log(err.message);
		}
		try {
			this.buyButton = ensureElement<HTMLButtonElement>('.button',container);
		} catch(err) {
			// console.log(err.message);
		}
		try {
			this.productBasketNumber = ensureElement<HTMLButtonElement>('.basket__item-index',container);
		} catch(err) {
			// console.log(err.message);
		}


		if (this.productButton)
		this.productButton.addEventListener('click', () =>
			this.events.emit('product:select', { product: this })
		);

		if (this.deleteButton)
		this.deleteButton.addEventListener('click', () =>
			this.events.emit('basket:changed', { product: this })
		);

		if (this.buyButton)
		this.buyButton.addEventListener('click', () =>
			this.events.emit('basket:changed', { product: this})
		);

	}
}