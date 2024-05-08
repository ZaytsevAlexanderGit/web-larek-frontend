import { Component } from './base/Component';
import { createElement, ensureElement, formatNumber } from '../utils/utils';
import { EventEmitter } from './base/events';

interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button =
			ensureElement<HTMLButtonElement>('.basket__button', this.container);

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:open');
			});
		}

		this.items = [];
	}

	protected _total: HTMLElement;

	set total(total: number) {
		this.setText(this._total, `${formatNumber(total)} синапсов`);
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this.setDisabled(this._button, false);
			this._list.replaceChildren(...items);
		} else {
			this.setDisabled(this._button, true);
			this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
				textContent: 'Корзина пуста',
			}));
		}
	}
}