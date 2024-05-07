import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { IContactsForm, IOrderForm } from '../types';

interface IFormState {
	valid: boolean;
	errors: string[];
}

export abstract class Form<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submit =
			ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);


		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	set errors(value: string) {
		this.setText(this._errors, value);
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	render(state: Partial<T> & IFormState) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}

	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			field,
			value,
		});
	}
}

export class OrderForm extends Form<IOrderForm> {
	protected _onlineButton: HTMLButtonElement;
	protected _offlineButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._onlineButton =
			ensureElement<HTMLButtonElement>('button[name=card]', this.container);
		this._offlineButton =
			ensureElement<HTMLButtonElement>('button[name=cash]', this.container);

		this._onlineButton.addEventListener('click', (e: Event) => {
			this.payment = 'online';
			this.onInputChange('payment', 'online');
		});

		this._offlineButton.addEventListener('click', (e: Event) => {
			this.payment = 'offline';
			this.onInputChange('payment', 'offline');
		});
	}

	set payment(value: string) {
		this._onlineButton.classList.toggle('button_alt-active',
			value === 'online');
		this._offlineButton.classList.toggle('button_alt-active',
			value === 'offline');
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}

export class ContactsForm extends Form<IContactsForm> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}