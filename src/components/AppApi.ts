import { IApi, IOrder, IProduct } from '../types';
import { ApiListResponse } from './base/api';

export class AppApi {
	private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

	getProducts(): Promise<ApiListResponse<IProduct>> {
		return this._baseApi.get<ApiListResponse<IProduct>>('/product/').then((items) => items)
	}

	getProduct(productID:string): Promise<IProduct> {
		return this._baseApi.get<IProduct>(`/product/${productID}`).then((items) => items)
	}

	postOrder(data: IOrder):Promise<IOrder> {
		return this._baseApi.post<IOrder>('/order', data). then((answer) => answer)
	}
}