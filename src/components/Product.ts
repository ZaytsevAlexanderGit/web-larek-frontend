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
		this.setText(this.productTitle, title);
	}

	get title(): string {
		return this.productTitle.textContent;
	}

	set price(price: number | null) {
		if (price !== null)
			if (price.toString().length > 4) this.setText(this.productPrice,
				`${formatNumber(price)} синапсов`);
			else this.setText(this.productPrice, `${price} синапсов`);
		else this.setText(this.productPrice, `Бесценно`);
	}

	set id(id: string) {
		this.productId = id;
	}
}

export class RenderProduct extends Product {
	protected productButton: HTMLElement;
	protected productCategory: HTMLElement;
	protected productImage: HTMLImageElement;
	protected productDescription: HTMLElement;
	protected buyButton: HTMLButtonElement;
	protected productBasketNumber: HTMLElement;
	protected deleteButton: HTMLButtonElement;

	constructor(protected container: HTMLElement, events: IEvents, type: string) {
		super(container, events);
		this.events = events;

		// Шаблон товара каталога главной страницы
		switch (type) {
			case 'catalog': {
				this.productButton = container;
				this.productCategory =
					ensureElement<HTMLElement>('.card__category', container);
				this.productImage =
					ensureElement<HTMLImageElement>('.card__image', container);

				this.productButton.addEventListener('click', () =>
					this.events.emit('product:select', { id: this.productId }));
				break;
			}
			// Шаблон товара модальной страницы
			case 'modal': {
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
				break;
			}
			// Шаблон товара корзины страницы
			case 'basket': {
				this.deleteButton =
					ensureElement<HTMLButtonElement>('.basket__item-delete', container);
				this.productBasketNumber =
					ensureElement<HTMLButtonElement>('.basket__item-index', container);

				this.deleteButton.addEventListener('click', () =>
					this.events.emit('basket:deleteProduct', { id: this.productId }),
				);
				break;
			}
		}
	}

	set category(category: productCategory) {
		this.setText(this.productCategory, category);
		this.setClasses(this.productCategory, 'card__category');
		this.addClass(this.productCategory,
			`card__category${checkItemCategory(category)}`);
	}

	set image(image: string) {
		this.setImage(this.productImage, CDN_URL + image, this.title);
	}

	set description(description: string) {
		this.setText(this.productDescription, description);
	}

	canBuy(
		possibility: { aval: boolean, text: string },
	) {
		this.setDisabled(this.buyButton, !possibility.aval);
		this.setText(this.buyButton, possibility.text);
	}

	render(productData: Partial<IProduct> | undefined,
				 options?: { aval: boolean, text: string } | number) {
		if (!productData) return this.container;

		if (typeof options === 'number') {
			if (options !== null && this.productBasketNumber) {
				this.setText(this.productBasketNumber, options.toString());
			}
		} else {
			if (options !== null && this.buyButton) {
				this.canBuy(options);
			}
		}

		super.render(productData);
		return this.container;
	}
}
