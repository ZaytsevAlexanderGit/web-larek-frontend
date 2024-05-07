import './scss/styles.scss';

import { Api } from './components/base/api';
import { AppApi } from './components/AppApi';
import { API_URL, initialData, settings } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { ProductsData } from './components/ProductsData';
import {
	BasketProduct,
	CatalogProduct,
	ModalProduct,
} from './components/Product';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { ContactsForm, OrderForm } from './components/Form';
import { Success } from './components/Success';
import { IOrder } from './types';
import {
	cloneTemplate,
	ensureElement,
	validateContacts,
	validateOrder,
} from './utils/utils';

const events = new EventEmitter();
const api = new AppApi(new Api(API_URL, settings));

// // Чтобы мониторить все события, для отладки
events.onAll((event) => {
	console.log(event.eventName, event.data);
});

//-----------------------------------------------
// Определяем все шаблоны

// Шаблон товара на главной странице
const productCatalogTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog');
// Шаблон товара в модальном окне покупки товара
const productModalTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview');
// Шаблон товара в корзине
const productBasketTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');
// Шаблон корзины
const basketTemplate =
	ensureElement<HTMLTemplateElement>('#basket');
// Шаблон формы ввода типа оплаты и адреса
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
// Шаблон формы ввода почты и телефона
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
// Шаблон окончания заказа
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

//-----------------------------------------------
// Модели данных приложения

// Модель данных товаров и корзины
const productData = new ProductsData(events);

//-----------------------------------------------
// Глобальная переменная для формирования заказа на отправку
export let orderForSend: IOrder = initialData;

//-----------------------------------------------
// Глобальные контейнеры

// Контейнер модального окна
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
// Контейнер основных элементов страницы
const page = new Page(document.body, events);

//-----------------------------------------------
// Переиспользуемые части интерфейса

// Карточка для показа в модальном окне
const productModalTemp = new ModalProduct(cloneTemplate(productModalTemplate),
	events);
// Корзина
const basket = new Basket(cloneTemplate(basketTemplate), events);
// Форма с оплатой и адресом
export const order = new OrderForm(cloneTemplate(orderTemplate), events);
// Форма с телефонм и почтой
export const contacts = new ContactsForm(cloneTemplate(contactsTemplate),
	events);
// Подтверждение заказа
const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		modal.close();
		productData.basket = [];
	},
});

//-----------------------------------------------
// Бизнес-логика - операции при определенных событиях

// Изменились элементы каталога
events.on('products:changed', () => {
	const cardArray: HTMLElement[] = [];
	productData.items.forEach((product, index) => {
		const productTemp = new CatalogProduct(
			cloneTemplate(productCatalogTemplate),
			events);
		cardArray.push(
			productTemp.render(product));
	});
	page.catalog = cardArray;
});

// Поменялась корзина
events.on('basket:changed', () => {
	page.counter = productData.basket.length;
});


// Выбрали товар на главной странице
events.on('product:select', (data: { id: string }) => {
	const foundedProduct = productData.getProduct(data.id);
	modal.render({
		content: productModalTemp.render(foundedProduct,
			productData.isAvailableToBuy(foundedProduct.id)),
	});
});

// Добавление товара в корзину
events.on('basket:addProduct', (data: { id: string }) => {
	productData.addToBasket(productData.getProduct(data.id));
	modal.close();
	page.counter = productData.basket.length;
});


// Открытие корзины
events.on('basket:open', () => {
		basket.items = productData.basket.map((product, index) => {
			const productBasketTemp = new BasketProduct(
				cloneTemplate(productBasketTemplate),
				events);
			return productBasketTemp.render(product, index + 1);
		});
		basket.total = productData.basketTotalPrice;
		modal.render({
			content: basket.render(productData.basket.length === 0),
		});
	},
);

// Удаление товара из корзины
events.on('basket:deleteProduct', (data: { id: string }) => {
	productData.removeFromBasket(data.id);
	page.counter = productData.basket.length;
	events.emit('basket:open');
});

// Изменилось одно из полей в формах, обновляем и валидируем
events.on(/^(order|contacts)\..*:change/,
	(data: {
		field: keyof Pick<IOrder, 'payment' | 'phone' | 'address' | 'email'>,
		value: string,
	}) => {
		orderForSend[ data.field ] = data.value;
		if (data.field === 'payment' || data.field === 'address') {
			validateOrder();
		} else {
			validateContacts();
		}
	});

// Открытие формы для указания адреса и выбора типа оплаты
events.on('order:open', () => {
	orderForSend.total = productData.basketTotalPrice;
	orderForSend.items = productData.basket.map(item => item.id);
	modal.render({
		content: order.render({
			address: '',
			payment: 'online',
			valid: false,
			errors: [],
		}),
	});
});

// Открытие формы для указания телефона и адреса почты
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Открытие окончательной формы удачного заказа
events.on('contacts:submit', () => {
	api.postOrder(orderForSend)
		.then((answer) => {
			modal.render({
				content: success.render(productData.basketTotalPrice),
			});
		})
		.catch((err) => {
			alert(err);
		});
});

//-----------------------------------------------
// Общее

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// Разблокируем прокрутку страницы если открыта модалка
events.on('modal:close', () => {
	page.locked = false;
	orderForSend = initialData;
});

//-----------------------------------------------
// Запуск приложения

// Получаем данные с сервера
api.getProducts()
	.then((initialProducts) => {
		productData.items = initialProducts.items;
	})
	.catch((err) => {
		console.error(err);
	});
