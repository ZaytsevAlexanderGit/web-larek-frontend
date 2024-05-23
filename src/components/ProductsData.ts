import { IProduct, IProductsData } from '../types';
import { IEvents } from './base/events';

export class ProductsData implements IProductsData {
	protected events: IEvents;
	protected _items: IProduct[];

	constructor(events: IEvents) {
		this.events = events;
	}

	get items() {
		return this._items;
	}

	set items(items: IProduct[]) {
		this._items = [];
		items.forEach((item) =>
			this._items.push({ indexInBasket: 0, ...item }),
		);
		this.events.emit('products:changed');
	}

	get basketSize(): number {
		return this._items.filter((item) => item.indexInBasket > 0).length;
	}

	get basketTotalPrice(): number {
		return this.items.reduce(
			(accum, currentValue) => {
				if (currentValue.indexInBasket > 0) return accum + currentValue.price;
				return accum;
			}, 0);
	}

	addProduct(item: IProduct) {
		this._items = [item, ...this._items];
		this.events.emit('products:changed');
	}

	deleteProduct(productID: string, payload: Function | null = null) {
		this._items = this._items.filter(item => item.id !== productID);

		if (payload) {
			payload();
		} else {
			this.events.emit('products:changed');
		}
	}

	updateProduct(product: IProduct, payload: Function | null = null) {
		const foundedItem = this._items.find((item) => item.id === product.id);
		Object.assign(foundedItem, product);

		if (payload) {
			payload();
		} else {
			this.events.emit('products:changed');
		}
	}

	getProduct(productId: string): IProduct {
		return this._items.find((item) => item.id === productId);
	}

	addToBasket(product: IProduct, payload: Function | null = null) {
		const foundedItem = this._items.find((item) => item.id === product.id);
		const maxIndex = (this._items.filter(
			item => item.indexInBasket !== 0)).length;
		foundedItem.indexInBasket = maxIndex + 1;

		if (payload) {
			payload();
		} else {
			this.events.emit('basket:changed');
		}
	}

	toggleToBasket(productID: string, payload: Function | null = null) {
		const foundedItem = this._items.find((item) => item.id === productID);
		const maxIndex = (this._items.filter(
			item => item.indexInBasket !== 0)).length;

		if (foundedItem.indexInBasket === 0) {
			foundedItem.indexInBasket = maxIndex + 1;
		} else {
			this.updateIndexes(foundedItem.indexInBasket);
			foundedItem.indexInBasket = 0;
		}
		if (payload) {
			payload();
		} else {
			this.events.emit('basket:open');
		}
	}


	removeFromBasket(productID: string, payload: Function | null = null) {
		const foundedItem = this._items.find((item) => item.id === productID);
		this.updateIndexes(foundedItem.indexInBasket);
		foundedItem.indexInBasket = 0;

		if (payload) {
			payload();
		} else {
			this.events.emit('basket:changed');
		}
	}

	updateIndexes(index: number) {
		this._items.forEach((item) => {
			if (item.indexInBasket >= index) item.indexInBasket--;
		});
	}
}
