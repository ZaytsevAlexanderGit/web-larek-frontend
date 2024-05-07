import { IOrder } from '../types';

export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {};

export const initialData: IOrder = {
	'payment': 'online',
	'email': '',
	'phone': '',
	'address': '',
	'total': 0,
	'items': [],
};

export const formErrors: FormErrors = {};

export type FormErrors = Partial<Record<keyof IOrder, string>>;