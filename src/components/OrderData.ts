import { IOrder, IOrderData, paymentCategory } from '../types';
import { IEvents } from './base/events';

export class OrderData implements IOrderData {
	protected events: IEvents;
	protected _order: IOrder;
	constructor(events: IEvents) {
		this.events = events;
	}

	set order(order :IOrder) {
		this._order = order;
	}

	get order() {
		return this._order ;
	}

	set email(email:string) {
		this._order.email = email;
	}
	set phone(phone:string) {
		this._order.phone = phone;
	}
	set address(address:string) {
		this._order.address = address;
	}
	set payment(payment:paymentCategory) {
		this._order.payment = payment;
	}

}