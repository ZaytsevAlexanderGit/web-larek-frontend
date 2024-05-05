# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Товар

```
export interface IProduct {
	id: string,
	description: string,
	image: string,
	title: string,
	category: productCategory,
	price: number,
	inBasket: boolean,
}
```

Интерфейс для модели данных товаров (каталог и корзина)

```
export interface ICatalog {
	total: number,
	items: IProduct[],
	preview: string | null,
	updateProduct(product: IProduct, payload: Function | null):void,
	getProduct(productId: string):IProduct,
	checkValidation(data: Record<keyof TProductModal, string>):boolean,
}

export interface IBasket {
	total: number,
	items: IProduct[],
	addProduct(product: IProduct, payload: Function | null):void,
	removeProduct(productID: string, payload: Function | null):void,
	getProduct(productId: string):IProduct,
	checkValidation(data: Record<keyof TProductModal, string>):boolean,
}
```

Данные товара, используемые для вывода на главном экране

```
export type TProductCatalog = Pick<IProduct, "title"| "image" | "category" | "price" >
```

Данные товара, используемые для вывода в модальном окне

```
export type TProductModal = Pick<IProduct, "title" | "description" | "image" | "category" | "price" >
```

Данные товара, используемые для вывода в корзине

```
export type TProductBasket = Pick<IProduct, "title" | "price" >
```

Интерфейс запроса покупки

```
export interface IOrder {
	payment: paymentCategory,
	email: string,
	phone: string,
	address: string,
	total: number,
	items: string[]	
}
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:
- слой представления, отвечает за отображение данных на странице,
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы:
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

Дополнительно реализованы методы  onAll и  offAll  — для подписки на все события и сброса всех
подписчиков.

### Слой данных

#### Класс ProductsData
Базовый класс отвечает за хранение и логику работы с данными товаров.\
Конструктор класса принимает инстант брокера событий\
В полях класса хранятся следующие данные:
- _products: IProduct[] - массив объектов товаров
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- updateProduct(product: IProduct, payload: Function | null = null): void - обновляет данные товара в массиве. Если передан
колбэк, то выполняет его после обновления, если нет, то вызывает событие изменения массива.
- getProduct(productId: string): IProduct - возвращает товар по его id
- checkValidation(data: Record<keyof TProductModal, string>): boolean - проверяет объект с данными товара на валидность
- а так-же сеттеры и геттеры для сохранения и получения данных из полей класса

#### Класс CatalogData
Расширяет класс ProductsData. Предназначен для хранения данных для отображения на главной странице. Хранит данные о выбранном товаре для просмотра в модальном окне.
- _preview: string | null - id товара, выбранной для просмотра в модальной окне

#### Класс BasketData
Расширяет класс ProductsData. Предназначен для хранения данных для отображения корзины. Хранит данные о выбранном товаре для просмотра в модальном окне.
- total: number - хранит инофрмацию о общем количестве товаров в корзине.
- addProduct(product: IProduct, payload: Function | null):void - добавляет товар в массив товаров в корзине. Если передан
  колбэк, то выполняет его после добавления, если нет, то вызывает событие изменения массива.
- removeProduct(productID: string, payload: Function | null):void - удаляет товар из массива товаров в корзине по ID. Если передан
  колбэк, то выполняет его после добавления, если нет, то вызывает событие изменения массива.



#### Класс UserData
Класс отвечает за хранение и логику работы с данными покупателя.\
В полях класса хранятся следующие данные:
- payment: paymentCategory - Тип оплаты
- address: string - Адресс доставки
- email: string - Email покупателя
- telephone: string - Телефон покупателя
- events: IEvents - экземпляр класса `EventEmitter` для инициации событий. Сейчас никаких событий для пользователя не предусмотренно.

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- getUserInfo(): TUserPublicInfo - возвращает основные данные пользователя отображаемые на сайте
- setUserInfo(userData: IUser): void - сохраняет данные пользователя в классе
- checkValidation(data: Record<keyof TUserPublicInfo, string>): boolean - проверяет объект с данными пользователя на валидность


### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Modal
Родительский класс - реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модального окна. Клик в оверлей или на кнопку-крестик происходит закрытие попапа.
- constructor(template: HTMLTemplateElement, events: IEvents) Конструктор принимает темплейт, по которому будет составляться разметка страницы для последующего помещения в модальное окно и экземпляр класса `EventEmitter` для возможности инициации событий.

Поля класса
- modal: HTMLElement - элемент модального окна куда будут подставляться данные
- events: IEvents - брокер событий

#### Класс ModalWithConfirm
Расширяет класс Modal. Предназначен для реализации модального окна покупки товара и подтверждения покупки всех товаров в корзине.
При открытии модального окна сохраняет полученный в параметрах обработчик, который передается для выполнения при нажатии на кнопку.\
Поля класса:
- submitButton: HTMLButtonElement - Кнопка подтверждения
- _form: HTMLFormElement - элемент формы
- formName: string - значение атрибута name формы
- handleSubmit: Function - функция, на выполнение которой запрашивается подтверждение

Методы:
- setValid(isValid: boolean): void - изменяет активность кнопки подтверждения
- open(handleSubmit: Function): void - расширение родительского метода, принимает обработчик, который передается при инициации события подтверждения.
- get form: HTMLElement - геттер для получения элемента формы

#### Класс ModalWithForm
Расширяет класс Modal. Предназначен для реализации модального окна с формой содержащей поля ввода. При сабмите инициирует событие передавая в него объект с данными из полей ввода формы. При изменении данных в полях ввода инициирует событие изменения данных. Предоставляет методы для отображения ошибок и управления активностью кнопки сохранения.\
Поля класса:
- submitButton: HTMLButtonElement - Кнопка подтверждения
- _form: HTMLFormElement - элемент формы
- formName: string - значение атрибута name формы
- inputs: NodeListOf<HTMLInputElement> - коллекция всех полей ввода формы
- errors: Record<string, HTMLElement> - объект хранящий все элементы для вывода ошибок рядом с кнопкой сабмита формы с привязкой к атрибуту name инпутов

Методы:
- setValid(isValid: boolean): void - изменяет активность кнопки подтверждения
- getInputValues(): Record<string, string> - возвращает объект с данными из полей формы, где ключ - name инпута, значение - данные введенные пользователем
- setInputValues(data: Record<string, string>): void - принимает объект с данными для заполнения полей формы
- setError(data: { field: string, value: string, validInformation: string }): void - принимает объект с данными для отображения или сокрытия текстов ошибок под полями ввода
- showInputError (field: string, errorMessage: string): void - отображает полученный текст ошибки 
- hideInputError (field: string): void - очищает текст ошибки 
- close (): void - расширяет родительский метод дополнительно при закрытии очищая поля формы и деактивируя кнопку сохранения
- get form: HTMLElement - геттер для получения элемента формы

#### Класс Product
Отвечает за отображение товара. Может обображать в разных видах (главная страница, модалка и корзина)
в зависимости от входящего шаблона. В карточке товара задаются данные (заголовок, описание, цена и.т.д.) в соответствии с шаблоном.
Класс используется для отображения карточек товара на странице сайта. В конструктор класса передается DOM элемент темплейта. 
В классе устанавливаются слушатели на все интерактивные элементы, в результате взаимодействия с которыми пользователя генерируются соответствующие события.\
Поля класса содержат элементы разметки элементов карточки. Конструктор, кроме темплейта принимает экземпляр `EventEmitter` для инициации событий.\
Методы:
- setData(productData: IProduct): void - заполняет атрибуты элементов карточки данными. 
- deleteProduct(): void - метод для удаления разметки товара в корзине
- render(): HTMLElement - метод возвращает полностью заполненную карточку с установленными слушателями
- геттер id возвращает уникальный id карточки

#### Класс ProductBasket
Отвечает за отображение блока с товарами в корзине. Предоставляет метод `addProduct(productElement: HTMLElement)` для добавления Товаров 
в корзину и сеттер `container` для полного обновления содержимого. В конструктор принимает контейнер, в котором размещаются товары.

### Слой коммуникации

#### Класс AppApi
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `products:changed` - изменение массива товаров
- `product:selected` - выбор товара для показа в модальном окне
- `product:previewClear` - необходима очистка данных выбранного для показа в модальном окне товара
- `basket:change` - изменение статуса у товара (куплен/не куплен)

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `product:open` - открытие модального окна с подробным описанием товара
- `basket:open` - открытие модального окна с корзиной
- `address:open` - открытие модального окна с формой оплаты и адреса
- `userInfo:open` - открытие модального окна с формой информации о пользователе
- `success:open` - открытие модального окна после оформления заказа
- `product:select` - выбор товара для отображения в модальном окне
- `address:input` - изменение данных в форме с оплатой и адресом
- `userInfo:input` - изменение данных в форме с данными пользователя
- `basket:remove` - событие, генерирумеое при удалении товара из корзины
- `basket:submit` - сохранение информации по купленным товарам в модальном окне корзины
- `address:submit` - событие, генерируемое при подтверждении в модальном окне с покупкой
- `userInfo:submit` - событие, генерируемое при подтверждении в модальном окне данных пользователя
- `success:submit` - событие, генерируемое при нажатии "За новыми покупками!" в форме подтверждения
- `address:validation` - событие, сообщающее о необходимости валидации формы адреса
- `userInfo:validation` - событие, сообщающее о необходимости валидации формы данных пользователя
