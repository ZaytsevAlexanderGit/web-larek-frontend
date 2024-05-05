import './scss/styles.scss';
import { IApi, IProduct } from './types';
import { EventEmitter, } from './components/base/events';
import {	ProductsData} from './components/ProductsData';
import { Api } from './components/base/api';
import { API_URL, settings } from './utils/constants';
import { AppApi } from './components/AppApi';
import { OrderData } from './components/OrderData';
import { Product } from './components/Product';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ProductsContainer } from './components/ProductsContainer';
import { initData } from './utils/tempConstants';

const events = new EventEmitter();
const productData = new ProductsData(events);
const orderData = new OrderData(events);

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

events.onAll((event) => {
	console.log(event.eventName, event.data)
})

const productCatalogTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog');

const productsContainer = new ProductsContainer(
	ensureElement<HTMLElement>('.gallery')
);

api.getProducts()
	.then((initialProducts) => {
		productData.items = initialProducts.items;
	})
	.catch((err) => {
		console.error(err);
});

// const product1 = new Product(cloneTemplate(productCatalogTemplate), events);
// const product2 = new Product(cloneTemplate(productCatalogTemplate), events);
// cardArray.push(product1.render(initData.items[0]));
// cardArray.push(product2.render(initData.items[1]));
const cardArray:HTMLElement[] = [];


//
// console.log(product1)

events.on("products:changed", () => {
	productData.items.forEach((product) =>{
		const productTemp = new Product(cloneTemplate(productCatalogTemplate), events);
		cardArray.push(productTemp.render(product));
	})
	productsContainer.render({catalog:cardArray})
})
// events.on("basket:changed", () => {
// 	console.log(productData.basket)
// })

