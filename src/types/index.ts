import { ApiPostMethods } from '../components/base/api';

export interface IProduct {
	id: string,
	title: string,
	price: number,
	description: string,
	image: string,
	category: productCategory,
}

export interface IOrder {
	payment: string,
	email: string,
	phone: string,
	address: string,
	total: number,
	items: string[]
}

export interface IOrderData {
	order: IOrder,
}

export type IOrderForm = Pick<IOrder, 'payment' | 'address'>

export type IContactsForm = Pick<IOrder, 'email' | 'phone'>

export interface IProductsData {
	items: IProduct[],
	basket: IProduct[],
}

export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IApiSuccess {
	id: string,
	total: number,
}

export type productCategory =
	'софт-скил'
	| 'хард-скил'
	| 'кнопка'
	| 'дополнительное'
	| 'другое'
