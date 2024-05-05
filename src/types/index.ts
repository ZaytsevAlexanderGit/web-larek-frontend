import { ApiPostMethods } from '../components/base/api';

export interface IProduct {
	id: string,
	description: string,
	image: string,
	title: string,
	category: productCategory,
	price: number,
}

export interface IOrder {
	payment: paymentCategory,
	email: string,
	phone: string,
	address: string,
	total: number,
	items: string[]
}

export interface IProductsData {
	// total:number,
	items: IProduct[],
	preview: string | null,
	basket: IProduct[],
	addProduct(product: IProduct, payload: Function | null):void,
	deleteProduct(productID: string, payload: Function | null):void,
	updateProduct(product: IProduct, payload: Function | null):void,
	getProduct(productId: string):IProduct,
	checkValidation(data: Record<keyof TProductModal, string>):boolean,
}
// export interface ICatalogData extends IProductsData{
// 	preview: string | null,
// }
//
// export interface IBasketData extends IProductsData{
// 	basket: IProduct[],
// 	addProduct(product: IProduct, payload: Function | null):void,
// 	removeProduct(productID: string, payload: Function | null):void,
// }

// export interface IUserData {
// 	getUserInfo(): IUser;
// 	setUserInfo(userData: IUser): void;
// 	checkUserValidation(data: Record<keyof IUser, string>): boolean;
// }

export type TProductCatalog = Pick<IProduct, "title"| "image" | "category" | "price" >
export type TProductModal = Pick<IProduct, "title" | "description" | "image" | "category" | "price" >
export type TProductBasket = Pick<IProduct, "title" | "price" >

export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IApiSuccess {
	id : string,
	total: number,
}

export interface IApiError {
	error : string,
}

enum enumProductCategory {
	"софт-скил",
	"хард-скил",
	"кнопка",
	"дополнительное",
	"другое"
}

type productCategory = keyof typeof enumProductCategory;

enum enumPaymentCategory {
	"online",
	"offline",
}

type paymentCategory = keyof typeof enumPaymentCategory;


