import { IOrder, IOrderData } from '../types';
import { IEvents } from './base/events';
import { initialData } from '../utils/constants';

export class OrderData implements IOrderData {
	protected events: IEvents;
	protected _order: IOrder = initialData;

	constructor(events: IEvents) {
		this.events = events;
	}

	get order() {
		return this._order;
	}

	set order(order: IOrder) {
		this._order = order;
	}

	set email(email: string) {
		this._order.email = email;
	}

	set phone(phone: string) {
		this._order.phone = phone;
	}

	set address(address: string) {
		this._order.address = address;
	}

	set payment(payment: string,
	) {
		this._order.payment = payment;
	}

}