export interface IProduct {
	id: string,
	description: string,
	image: string,
	title: string,
	category: productCategory,
	price: number,
	inBasket: boolean,
}

export interface IUser {
	payment: paymentCategory,
	address: string,
	email: string,
	telephone: string,
}

export interface IProductsData {
	items: IProduct[],
	updateProduct(product: IProduct, payload: Function | null):void,
	getProduct(productId: string):IProduct,
	checkValidation(data: Record<keyof TProductModal, string>):boolean,
}
export interface ICatalogData extends IProductsData{
	preview: string | null,
}


export interface IBasketData extends IProductsData{
	total: number,
	addProduct(product: IProduct, payload: Function | null):void,
	removeProduct(productID: string, payload: Function | null):void,
}

export interface IUserData {
	getUserInfo(): IUser;
	setUserInfo(userData: IUser): void;
	checkUserValidation(data: Record<keyof IUser, string>): boolean;
}

export type TProductCatalog = Pick<IProduct, "title"| "image" | "category" | "price" >
export type TProductModal = Pick<IProduct, "title" | "description" | "image" | "category" | "price" >
export type TProductBasket = Pick<IProduct, "title" | "price" >

export interface IApiSuccess {
	id : string,
	total: number,
}

export interface IApiError {
	error : string,
}

enum productCategory {
	soft = "софт-скил",
	hard = "хард-скил",
	button = "кнопка",
	additional = "дополнительное",
	other = "другое",
}

enum paymentCategory {
	online = "Онлайн",
	offline = "При получении",
}

export type ApiPostMethods = 'POST';

