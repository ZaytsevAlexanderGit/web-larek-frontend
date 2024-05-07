import { Component } from './base/Component';
import { IProduct, productCategory } from '../types';
import { IEvents } from './base/events';
import { checkItemCategory, ensureElement, formatNumber } from '../utils/utils';
import { CDN_URL } from '../utils/constants';

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
	protected productId: string;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		if (container.classList.contains('gallery__item')) this.productButton =
			container;
		this.productTitle = ensureElement<HTMLElement>('.card__title', container);
		this.productPrice = ensureElement<HTMLElement>('.card__price', container);
		try {
			this.productDescription =
				ensureElement<HTMLElement>('.card__text', container);
		} catch (err) {
			// console.log(err.message);
		}
		try {
			this.productCategory =
				ensureElement<HTMLElement>('.card__category', container);
		} catch (err) {
			// console.log(err.message);
		}
		try {
			this.productImage =
				ensureElement<HTMLImageElement>('.card__image', container);
		} catch (err) {
			// console.log(err.message);
		}
		try {
			this.deleteButton =
				ensureElement<HTMLButtonElement>('.basket__item-delete', container);
		} catch (err) {
			// console.log(err.message);
		}
		try {
			this.buyButton = ensureElement<HTMLButtonElement>('.button', container);
		} catch (err) {
			// console.log(err.message);
		}
		try {
			this.productBasketNumber =
				ensureElement<HTMLButtonElement>('.basket__item-index', container);
		} catch (err) {
			// console.log(err.message);
		}


		if (this.productButton)
			this.productButton.addEventListener('click', () =>
				this.events.emit('product:select', { id: this.productId }),
			);

		if (this.deleteButton)
			this.deleteButton.addEventListener('click', () =>
				this.events.emit('basket:deleteProduct', { id: this.productId }),
			);

		if (this.buyButton)
			this.buyButton.addEventListener('click', () =>
				this.events.emit('basket:addProduct',
					{ id: this.productId }),
			);
	}

	set description(description: string) {
		if (this.productDescription)
			this.productDescription.textContent = description;
	}

	set title(title: string) {
		if (this.productTitle)
			this.productTitle.textContent = title;
	}

	set price(price: number | null) {
		if (this.productPrice) {
			if (price !== null)
				if (price.toString().length > 4) this.productPrice.textContent =
					`${formatNumber(price)} синапсов`;
				else this.productPrice.textContent = `${price} синапсов`;
			else this.productPrice.textContent = `Бесценно`;
		}
	}

	set category(category: productCategory) {
		if (this.productCategory) {
			this.productCategory.textContent = category;
			this.productCategory.className = '';
			this.productCategory.classList.add('card__category');
			this.productCategory.classList.add(
				`card__category${checkItemCategory(category)}`);
		}
	}

	set image(image: string) {
		if (this.productImage) {
			this.productImage.src = CDN_URL + image;
		}
	}

	set id(id: string) {
		this.productId = id;
	}

	canBuy(
		possibility: { aval: boolean, text: string },
	) {
		this.buyButton.disabled = !possibility.aval;
		this.buyButton.textContent = possibility.text;
	}

	render(data?: Partial<IProduct>): HTMLElement;
	render(productData: Partial<IProduct>,
				 options: { aval: boolean, text: string } | number): HTMLElement;

	render(productData: Partial<IProduct> | undefined,
				 options?: { aval: boolean, text: string } | number) {
		if (!productData) return this.container;
		if (this.productImage)
			this.productImage.alt = productData.title;

		if (options) {
			if (typeof options === 'number') {
				if (options !== null && this.productBasketNumber) {
					this.productBasketNumber.textContent = (options).toString();
				}
			} else {
				if (options !== null && this.buyButton) {
					this.canBuy(options);
				}
			}
		}

		super.render(productData);
		return this.container;
	}
}