import {
	IProduct,
	IProductsData,
	TProductModal,
} from '../types';
import { IEvents } from './base/events';

export class ProductsData implements IProductsData {
	protected _items: IProduct[];
	protected events: IEvents;
	protected _preview: string | null;
	protected _basket:IProduct[] = [];

	constructor(events: IEvents) {
	this.events = events;
	}

	set items(items:IProduct[]) {
		this._items = items;
		this.events.emit("products:changed");
	}

	get items () {
		return this._items;
	}

	addProduct(item: IProduct) {
		this._items = [item, ...this._items]
		this.events.emit('products:changed')
	}

	deleteProduct(productID: string, payload: Function | null = null) {
		this._items = this._items.filter(item => item.id !== productID);

		if(payload) {
			payload();
		} else {
			this.events.emit('products:changed')
		}
	}

	updateProduct(product: IProduct, payload: Function | null  = null) {
		const findedItem = this._items.find((item) => item.id === product.id)
		Object.assign(findedItem, product);

		if (payload) {
			payload();
		} else {
			this.events.emit("products:changed");
		}
	}

	getProduct(productId: string): IProduct {
		return this._items.find((item) => item.id === productId)
	}

		//Подумать как сделать
	checkValidation(data: Record<keyof TProductModal, string>): boolean {
		return  true
	}

	set preview(productId: string | null) {
		if (!productId) {
			this._preview = null;
			return;
		}
		const selectedProduct = this.getProduct(productId);
		if (selectedProduct) {
			this._preview = productId;
			this.events.emit("product:selected");
		}
	}

	get preview() {
		return this._preview;
	}

	set basket(items:IProduct[]) {
		this._basket = items;
		this.events.emit("basket:changed");
	}

	get basket () {
		return this._basket;
	}

	addToBasket(product: IProduct, payload: Function | null = null) {
		const findedItem = this._items.find((item) => item.id === product.id)

		this._basket.push(findedItem);

		if (payload) {
			payload();
		} else {
			this.events.emit("basket:changed");
		}
	}

	removeFromBasket(productID: string, payload: Function | null = null) {
		this._basket = this._basket.filter(item => item.id !== productID)

		if (payload) {
			payload();
		} else {
			this.events.emit("basket:changed");
		}
	}

	isInBasket(productId: string): boolean {
		if (this._basket.find((item) => item.id === productId)) return true;
		return false;
	}

	isPossibleToBuy(productId: string): boolean {
		if (this._items.find((item) => item.id === productId).price !== null) return true;
		return false
	}
}
