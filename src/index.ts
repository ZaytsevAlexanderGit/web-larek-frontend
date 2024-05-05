import './scss/styles.scss';
import { IApi, IOrder, IProduct, IProductsData } from './types';
import { EventEmitter, IEvents } from './components/base/events';
import {	ProductsData} from './components/ProductsData';
import { Api } from './components/base/api';
import { API_URL, settings } from './utils/constants';
import { AppApi } from './components/AppApi';

const events = new EventEmitter();
const productData = new ProductsData(events)

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

events.onAll((event) => {
	console.log(event.eventName, event.data)
})

// api.getProducts()
// 	.then((initialProducts) => {
// 		productData.items = initialProducts.items;
// 	})
// 	.catch((err) => {
// 		console.error(err);
// });

// events.on("products:changed", () => {
// 	console.log(productData.items)
// })
// events.on("basket:changed", () => {
// 	console.log(productData.basket)
// })

