import { Component } from './base/Component';
import { createElement, ensureElement, formatNumber } from '../utils/utils';
import { EventEmitter } from './base/events';

interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
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
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
				textContent: 'Корзина пуста',
			}));
		}
	}

	render(data?: Partial<IBasketView> | boolean): HTMLElement;
	render(isEmpty: boolean) {
		if (isEmpty) this._button.disabled = true;
		else this._button.disabled = false;
		super.render();
		return this.container;
	}
}