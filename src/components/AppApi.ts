import { IApi, IApiSuccess, IOrder, IProduct } from '../types';
import { ApiListResponse } from './base/api';

export class AppApi {
	private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

	getProducts(): Promise<ApiListResponse<IProduct>> {
		return this._baseApi.get<ApiListResponse<IProduct>>('/product/');
	}

	getProduct(productID: string): Promise<IProduct> {
		return this._baseApi.get<IProduct>(`/product/${productID}`);
	}

	postOrder(data: IOrder): Promise<IApiSuccess> {
		return this._baseApi.post<IApiSuccess>('/order', data);
	}
}