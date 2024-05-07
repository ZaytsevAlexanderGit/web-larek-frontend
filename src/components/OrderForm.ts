import { Form } from './common/Form';
import { IOrderForm } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

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