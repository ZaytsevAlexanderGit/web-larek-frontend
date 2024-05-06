import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { ProductsData } from './components/ProductsData';
import { Api } from './components/base/api';
import { API_URL, settings } from './utils/constants';
import { AppApi } from './components/AppApi';
import { OrderData } from './components/OrderData';
import { Product } from './components/Product';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import { Page } from './components/Page';

const events = new EventEmitter();
const api = new AppApi(new Api(API_URL, settings));

// Чтобы мониторить все события, для отладки
events.onAll((event) => {
	console.log(event.eventName, event.data);
});

// Все шаблоны
const productCatalogTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog');
const productModalTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview');
const productBasketTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');


//Модели данных приложения
const productData = new ProductsData(events);
const orderData = new OrderData(events);

// Глобальные контейнеры
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const page = new Page(document.body, events);
// );

const basketCounter: HTMLElement = ensureElement('.header__basket-counter');
let cardArray: HTMLElement[] = [];

events.on('products:changed', () => {
	productData.items.forEach((product, index) => {
		const productTemp = new Product(cloneTemplate(productCatalogTemplate),
			events);
		cardArray.push(
			productTemp.render(product, productData.isAvailableToBuy(product.id),
				index));
	});
	page.catalog = cardArray;
	cardArray = [];
});


events.on('basket:addProduct', (data: { id: string }) => {
	productData.addToBasket(productData.getProduct(data.id));
	modal.close();
	page.counter = productData.basket.length;
});

events.on('product:select', (data: { id: string }) => {
	const productTemp = new Product(cloneTemplate(productModalTemplate),
		events);
	const productFinded = productData.getProduct(data.id);
	modal.render({
		content: productTemp.render(productFinded,
			productData.isAvailableToBuy(productFinded.id)),
	});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем данные с сервера
api.getProducts()
	.then((initialProducts) => {
		productData.items = initialProducts.items;
	})
	.catch((err) => {
		console.error(err);
	});
