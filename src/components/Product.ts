import { Component } from './base/Component';
import { IProduct, productCategory } from '../types';
import { IEvents } from './base/events';
import { checkItemCategory, ensureElement, formatNumber } from '../utils/utils';
import { CDN_URL } from '../utils/constants';

abstract class Product extends Component<IProduct> {
	protected events: IEvents;
	protected productTitle: HTMLElement;
	protected productPrice: HTMLElement;
	protected productId: string;

	protected constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.productTitle = ensureElement<HTMLElement>('.card__title', container);
		this.productPrice = ensureElement<HTMLElement>('.card__price', container);
	}

	set title(title: string) {
		this.productTitle.textContent = title;
	}

	set price(price: number | null) {
		if (price !== null)
			if (price.toString().length > 4) this.productPrice.textContent =
				`${formatNumber(price)} синапсов`;
			else this.productPrice.textContent = `${price} синапсов`;
		else this.productPrice.textContent = `Бесценно`;

	}

	set id(id: string) {
		this.productId = id;
	}
}

export class CatalogProduct extends Product {
	protected productButton: HTMLElement;
	protected productCategory: HTMLElement;
	protected productImage: HTMLImageElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container, events);
		this.events = events;

		this.productButton = container;
		this.productCategory =
			ensureElement<HTMLElement>('.card__category', container);
		this.productImage =
			ensureElement<HTMLImageElement>('.card__image', container);

		this.productButton.addEventListener('click', () =>
			this.events.emit('product:select', { id: this.productId }));
	}

	set category(category: productCategory) {
		this.productCategory.textContent = category;
		this.productCategory.className = '';
		this.productCategory.classList.add('card__category');
		this.productCategory.classList.add(
			`card__category${checkItemCategory(category)}`);
	}

	set image(image: string) {
		if (this.productImage) {
			this.productImage.src = CDN_URL + image;
		}
	}

	render(productData: Partial<IProduct>) {
		if (!productData) return this.container;
		this.productImage.alt = productData.title;
		super.render(productData);
		return this.container;
	}
}

export class ModalProduct extends Product {
	protected productCategory: HTMLElement;
	protected productImage: HTMLImageElement;
	protected productDescription: HTMLElement;
	protected buyButton: HTMLButtonElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container, events);
		this.events = events;

		this.productCategory =
			ensureElement<HTMLElement>('.card__category', container);
		this.productImage =
			ensureElement<HTMLImageElement>('.card__image', container);
		this.productDescription =
			ensureElement<HTMLElement>('.card__text', container);
		this.buyButton = ensureElement<HTMLButtonElement>('.button', container);

		this.buyButton.addEventListener('click', () =>
			this.events.emit('basket:addProduct',
				{ id: this.productId }),
		);
	}

	set category(category: productCategory) {
		this.productCategory.textContent = category;
		this.productCategory.className = '';
		this.productCategory.classList.add('card__category');
		this.productCategory.classList.add(
			`card__category${checkItemCategory(category)}`);
	}

	set image(image: string) {
		if (this.productImage) {
			this.productImage.src = CDN_URL + image;
		}
	}

	set description(description: string) {
		this.productDescription.textContent = description;
	}

	canBuy(
		possibility: { aval: boolean, text: string },
	) {
		this.buyButton.disabled = !possibility.aval;
		this.buyButton.textContent = possibility.text;
	}

	render(data?: Partial<IProduct>): HTMLElement;
	render(productData: Partial<IProduct>,
				 options: { aval: boolean, text: string }): HTMLElement;

	render(productData: Partial<IProduct> | undefined,
				 options?: { aval: boolean, text: string }) {
		if (!productData) return this.container;
		this.productImage.alt = productData.title;
		if (options) {
			if (options !== null && this.buyButton) {
				this.canBuy(options);
			}
		}
		super.render(productData);
		return this.container;
	}
}

export class BasketProduct extends Product {
	protected productBasketNumber: HTMLElement;
	protected deleteButton: HTMLButtonElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container, events);
		this.events = events;

		this.deleteButton =
			ensureElement<HTMLButtonElement>('.basket__item-delete', container);
		this.productBasketNumber =
			ensureElement<HTMLButtonElement>('.basket__item-index', container);

		this.deleteButton.addEventListener('click', () =>
			this.events.emit('basket:deleteProduct', { id: this.productId }),
		);
	}

	render(data?: Partial<IProduct>): HTMLElement;
	render(productData: Partial<IProduct>,
				 options: number): HTMLElement;

	render(productData: Partial<IProduct> | undefined,
				 options?: number) {
		if (!productData) return this.container;

		if (options) {
			if (options !== null && this.productBasketNumber) {
				this.productBasketNumber.textContent = (options).toString();
			}
		}

		super.render(productData);
		return this.container;
	}
}