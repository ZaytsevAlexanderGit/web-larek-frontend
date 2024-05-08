import { formErrors } from './constants';
import { IContactsForm, IOrderForm } from '../types';
import { ContactsForm, OrderForm } from '../components/Form';

export function pascalToKebab(value: string): string {
	return value.replace(/([a-z0–9])([A-Z])/g, '$1-$2').toLowerCase();
}

export function isSelector(x: any): x is string {
	return (typeof x === 'string') && x.length > 1;
}

export function isEmpty(value: any): boolean {
	return value === null || value === undefined;
}

export type SelectorCollection<T> = string | NodeListOf<Element> | T[];

export function ensureAllElements<T extends HTMLElement>(selectorElement: SelectorCollection<T>,
																												 context: HTMLElement = document as unknown as HTMLElement): T[] {
	if (isSelector(selectorElement)) {
		return Array.from(context.querySelectorAll(selectorElement)) as T[];
	}
	if (selectorElement instanceof NodeList) {
		return Array.from(selectorElement) as T[];
	}
	if (Array.isArray(selectorElement)) {
		return selectorElement;
	}
	throw new Error(`Unknown selector element`);
}

export type SelectorElement<T> = T | string;

export function ensureElement<T extends HTMLElement>(selectorElement: SelectorElement<T>,
																										 context?: HTMLElement): T {
	if (isSelector(selectorElement)) {
		const elements = ensureAllElements<T>(selectorElement, context);
		if (elements.length > 1) {
			console.warn(`selector ${selectorElement} return more then one element`);
		}
		if (elements.length === 0) {
			throw new Error(`selector ${selectorElement} return nothing`);
		}
		return elements.pop() as T;
	}
	if (selectorElement instanceof HTMLElement) {
		return selectorElement as T;
	}
	throw new Error('Unknown selector element');
}

export function cloneTemplate<T extends HTMLElement>(query: string | HTMLTemplateElement): T {
	const template = ensureElement(query) as HTMLTemplateElement;
	return template.content.firstElementChild.cloneNode(true) as T;
}

export function bem(block: string, element?: string, modifier?: string): {
	name: string,
	class: string
} {
	let name = block;
	if (element) name += `__${element}`;
	if (modifier) name += `_${modifier}`;
	return {
		name,
		class: `.${name}`,
	};
}

export function getObjectProperties(obj: object, filter?: (name: string,
																													 prop: PropertyDescriptor) => boolean): string[] {
	return Object.entries(
		Object.getOwnPropertyDescriptors(
			Object.getPrototypeOf(obj),
		),
	)
		.filter(([name, prop]: [string, PropertyDescriptor]) => filter ?
			filter(name, prop) : (name !== 'constructor'))
		.map(([name, prop]) => name);
}

/**
 * Устанавливает dataset атрибуты элемента
 */
export function setElementData<T extends Record<string, unknown> | object>(el: HTMLElement,
																																					 data: T) {
	for (const key in data) {
		el.dataset[ key ] = String(data[ key ]);
	}
}

/**
 * Получает типизированные данные из dataset атрибутов элемента
 */
export function getElementData<T extends Record<string, unknown>>(el: HTMLElement,
																																	scheme: Record<string, Function>): T {
	const data: Partial<T> = {};
	for (const key in el.dataset) {
		data[ key as keyof T ] = scheme[ key ](el.dataset[ key ]);
	}
	return data as T;
}

/**
 * Проверка на простой объект
 */
export function isPlainObject(obj: unknown): obj is object {
	const prototype = Object.getPrototypeOf(obj);
	return prototype === Object.getPrototypeOf({}) ||
		prototype === null;
}

export function isBoolean(v: unknown): v is boolean {
	return typeof v === 'boolean';
}

/**
 * Фабрика DOM-элементов в простейшей реализации
 * здесь не учтено много факторов
 * в интернет можно найти более полные реализации
 */
export function createElement<
	T extends HTMLElement
>(
	tagName: keyof HTMLElementTagNameMap,
	props?: Partial<Record<keyof T, string | boolean | object>>,
	children?: HTMLElement | HTMLElement [],
): T {
	const element = document.createElement(tagName) as T;
	if (props) {
		for (const key in props) {
			const value = props[ key ];
			if (isPlainObject(value) && key === 'dataset') {
				setElementData(element, value);
			} else {
				// @ts-expect-error fix indexing later
				element[ key ] = isBoolean(value) ? value : String(value);
			}
		}
	}
	if (children) {
		for (const child of Array.isArray(children) ? children : [children]) {
			element.append(child);
		}
	}
	return element;
}

export function formatNumber(x: number, sep = ' ') {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

export function checkItemCategory(category: string): string {
	let additionalClass = '';
	switch (category) {
		case  'софт-скил':
			additionalClass = '_soft';
			break;
		case 'другое':
			additionalClass = '_other';
			break;
		case 'дополнительное':
			additionalClass = '_additional';
			break;
		case 'кнопка':
			additionalClass = '_button';
			break;
		case 'хард-скил':
			additionalClass = '_hard';
	}
	return additionalClass;
}

export function validateOrder(form: OrderForm, data: IOrderForm) {
	const errors: typeof formErrors = {};
	if (!data.payment) {
		errors.email = 'Необходимо выбрать способ оплаты';
	}
	if (!data.address) {
		console.log(data.address);
		errors.address = 'Необходимо указать адрес';
	}
	const { payment, address } = errors;
	form.valid = !payment && !address;
	form.errors =
		Object.values({ address, payment }).filter(i => !!i).join('; ');
}

export function validateContacts(form: ContactsForm, data: IContactsForm) {
	const errors: typeof formErrors = {};
	if (!data.email) {
		errors.email = 'Необходимо указать email';
	}
	if (!data.phone) {
		errors.phone = 'Необходимо указать телефон';
	}
	const { email, phone } = errors;
	form.valid = !email && !phone;
	form.errors =
		Object.values({ phone, email }).filter(i => !!i).join('; ');
}
