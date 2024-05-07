import { Component } from '../base/Component';
import { ensureElement, formatNumber } from '../../utils/utils';

interface ISuccess {
	total: number;
}

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close =
			ensureElement<HTMLElement>('.order-success__close', this.container);

		this._total =
			ensureElement<HTMLElement>('.order-success__description', this.container);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(total: string) {
		this._total.textContent = total;
	}

	render(data?: Partial<ISuccess> | number): HTMLElement;
	render(total: number) {
		if (total) this.total = `Списано ${formatNumber(total)} синапсов`;
		super.render();
		return this.container;
	}
}