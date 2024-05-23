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

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container, events);
		this.events = events;

		if (container.classList.contains('gallery__item'))
			this.productButton = container;

		this.productCategory = container.querySelector('.card__category');
		this.productDescription = container.querySelector('.card__text');
		this.productImage = container.querySelector('.card__image');
		this.deleteButton = container.querySelector('.basket__item-delete');
		this.buyButton = container.querySelector('.button');
		this.productBasketNumber = container.querySelector('.basket__item-index');

		if (this.productButton) {
			this.productButton.addEventListener('click', () =>
				this.events.emit('product:select', { id: this.productId }));
		}

		if (this.buyButton) {
			this.buyButton.addEventListener('click', () =>
				// this.events.emit('basket:addProduct',
				this.events.emit('basket:toggleProduct',
					{ id: this.productId }),
			);
		}

		if (this.deleteButton) {
			this.deleteButton.addEventListener('click', () =>
				this.events.emit('basket:deleteProduct', { id: this.productId }),
			);
		}
	}

	set category(category: productCategory) {
		if (this.productCategory) {
			this.setText(this.productCategory, category);
			this.setClasses(this.productCategory, 'card__category');
			this.addClass(this.productCategory,
				`card__category${checkItemCategory(category)}`);
		}
	}

	set image(image: string) {
		if (this.productImage) {
			this.setImage(this.productImage, CDN_URL + image, this.title);
		}
	}

	set description(description: string) {
		if (this.productDescription) {
			this.setText(this.productDescription, description);
		}
	}

	setByeOptions(index: number, price: number | null) {
		let text = 'В корзину';
		if (price === null) {
			this.setDisabled(this.buyButton, true);
			text = 'Невозможно купить';
		} else this.setDisabled(this.buyButton, false);
		if (index > 0) text = 'Удалить из корзины';
		this.setText(this.buyButton, text);
	}

	render(productData: Partial<IProduct> | undefined,
	) {
		if (!productData) return this.container;

		if (this.productBasketNumber) {
			this.setText(this.productBasketNumber, productData.indexInBasket);
		}
		if (this.buyButton) {
			this.setByeOptions(productData.indexInBasket, productData.price);
		}

		super.render(productData);
		return this.container;
	}
}
