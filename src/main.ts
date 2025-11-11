import "./scss/styles.scss";
import { apiProducts } from "./utils/data";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/Events";
import { IProduct, IBuyer, OrderData } from "./types";
import { Products } from "./components/Models/Products";
import { ShoppingCart } from "./components/Models/ShoppingCart";
import { BuyerData } from "./components/Models/BuyerData";
import { WebLarekApi } from "./components/Models/WebLarekApi";
import { Modal } from "./components/View/Modal";
import { Gallery } from "./components/View/Gallery";
import { Header } from "./components/View/Header";
import { CatalogCard } from "./components/View/CatalogCard";
import { ProductPreview } from "./components/View/ProductPreview";
import { Basket } from "./components/View/Basket";
import { BasketItem } from "./components/View/BasketItem";
import { OrderStep1 } from "./components/View/OrderStep1";
import { OrderStep2 } from "./components/View/OrderStep2";
import { Success } from "./components/View/Success";
import { ensureElement } from "./utils/utils";

// брокер событий
const events = new EventEmitter();

// модели
const productsModel = new Products(events);
const shoppingCartModel = new ShoppingCart(events);
const buyerDataModel = new BuyerData(events);

// API
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// представления
const headerView = new Header(events, ensureElement('.header__container'));
const galleryView = new Gallery(events, ensureElement('.gallery'));
const modal = new Modal(events);
// шаблоны
const productPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const catalogCardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderStep1Template = ensureElement<HTMLTemplateElement>('#order');
const orderStep2Template = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// текущий контент внутри модального окна
let currentModal: any = null;

// открытие модального окна
function openModal(viewInstance: any) {
	currentModal = viewInstance;
	modal.open();
}

// изменение каталога товаров
events.on('catalog:changed', (data: { items: IProduct[] }) => {
	const cards = data.items.map(product => {
		const card = new CatalogCard(events, catalogCardTemplate);
		return card.render({
			id: product.id,
			title: product.title,
			price: product.price,
			category: product.category,
			image: product.image
		});
	});
	galleryView.cards = cards;
});

// изменение выбранного товара
events.on('product:selected', (data: { product: IProduct }) => {
	const productPreview = new ProductPreview(events, productPreviewTemplate);
	const inCart = shoppingCartModel.checkProductInCart(data.product.id);
	const node = productPreview.render({
		id: data.product.id,
		title: data.product.title,
		price: data.product.price,
		category: data.product.category,
		image: data.product.image,
		description: data.product.description
	});

	productPreview.setButtonState(inCart, data.product.price);

	modal.setContent(node);
	openModal(productPreview);
});

// изменение корзины
events.on('cart:changed', (data: { items: IProduct[]; total: number; count: number }) => {
	// обновляем счётчик в хедере
	headerView.counter = data.count;
	// если корзина открыта — перерисовываем её содержимое
	if (currentModal instanceof Basket) {
		const items = data.items.map((item, index) => {
			const basketItem = new BasketItem(events, basketItemTemplate);
			return basketItem.render({
				id: item.id,
				title: item.title,
				price: item.price,
				index: index + 1
			});
		});

		currentModal.items = items;
		currentModal.total = data.total;
	}
});

// изменение данных покупателя
events.on('buyer:changed', (data: IBuyer) => {
	console.log('Данные покупателя обновлены:', data);
});

// клик по карточке каталога
events.on('product:open', (data: { element: HTMLElement }) => {
	const productId = data.element.dataset.id;
	if (productId) {
		const product = productsModel.getProduct(productId);
		if (product) {
			productsModel.saveCard(product);
		}
	}
});

// клик по кнопке "в корзину"/"удалить" в карточке товара
events.on('card:action', (data: { element: HTMLElement }) => {
	const productId = data.element.dataset.id;
	if (productId) {
		const product = productsModel.getProduct(productId);
		if (product) {
			if (shoppingCartModel.checkProductInCart(productId)) {
				shoppingCartModel.removeItem(productId);
			} else {
				shoppingCartModel.addItem(product);
			}
			modal.close();
		}
	}
});

// клик по кнопке удаления товара из корзины
events.on('cart:remove', (data: { element: HTMLElement }) => {
	const productId = data.element.dataset.id;
	if (productId) {
		shoppingCartModel.removeItem(productId);
	}
});

// открытие корзины
events.on('basket:open', () => {
	const basket = new Basket(events, basketTemplate);

	const items = shoppingCartModel.getItems().map((item, index) => {
		const basketItem = new BasketItem(events, basketItemTemplate);
		return basketItem.render({
			id: item.id,
			title: item.title,
			price: item.price,
			index: index + 1
		});
	});

	const basketNode = basket.render({
		items,
		total: shoppingCartModel.getTotalPrice()
	});

	modal.setContent(basketNode);
	openModal(basket);
});

// клик на "оформить заказ"
events.on('order:open', () => {
	const orderStep1 = new OrderStep1(events, orderStep1Template);

	const errors = buyerDataModel.validate();
	const step1Errors = [errors.payment, errors.address].filter(Boolean) as string[];

	const isValid =
		step1Errors.length === 0 &&
		!!buyerDataModel.data.payment &&
		!!buyerDataModel.data.address.trim();

	const node = orderStep1.render({
		payment: buyerDataModel.data.payment,
		address: buyerDataModel.data.address,
		errors: step1Errors
	});

	if (isValid) {
		orderStep1.enableSubmitButton();
	} else {
		orderStep1.disableSubmitButton();
	}

	modal.setContent(node);
	openModal(orderStep1);
});

// отправка первой формы
events.on('order:step1:submit', () => {
	const orderStep2 = new OrderStep2(events, orderStep2Template);

	const errors = buyerDataModel.validate();
	const step2Errors = [errors.email, errors.phone].filter(Boolean) as string[];

	const isValid =
		step2Errors.length === 0 &&
		!!buyerDataModel.data.email.trim() &&
		!!buyerDataModel.data.phone.trim();

	const node = orderStep2.render({
		email: buyerDataModel.data.email,
		phone: buyerDataModel.data.phone,
		errors: step2Errors
	});

	if (isValid) {
		orderStep2.enableSubmitButton();
	} else {
		orderStep2.disableSubmitButton();
	}

	modal.setContent(node);
	openModal(orderStep2);
});

// отправка второй формы
events.on('order:step2:submit', () => {
	const orderData: OrderData = {
		...buyerDataModel.data,
		total: shoppingCartModel.getTotalPrice(),
		items: shoppingCartModel.getItems().map(item => item.id)
	};

	webLarekApi.submitOrder(orderData)
		.then(result => {
			const success = new Success(events, successTemplate);
			const node = success.render({ total: result.total });

			modal.setContent(node);
			openModal(success);

			shoppingCartModel.clear();
			buyerDataModel.clear();
		})
		.catch(error => {
			console.error('Ошибка оформления заказа:', error);
		});
});

// изменение данных в формах
events.on('form:change', (data: { form: string; data: Partial<IBuyer> }) => {
	buyerDataModel.setData(data.data);

	const errors = buyerDataModel.validate();

	if (data.form === 'step1' && currentModal instanceof OrderStep1) {
		const step1Errors = [errors.payment, errors.address].filter(Boolean) as string[];

		const isValid =
			step1Errors.length === 0 &&
			!!buyerDataModel.data.payment &&
			!!buyerDataModel.data.address.trim();

		if (isValid) {
			currentModal.enableSubmitButton();
		} else {
			currentModal.disableSubmitButton();
		}

		currentModal.textErrors = step1Errors.join('. ');
	} else if (data.form === 'step2' && currentModal instanceof OrderStep2) {
		const step2Errors = [errors.email, errors.phone].filter(Boolean) as string[];

		const isValid =
			step2Errors.length === 0 &&
			!!buyerDataModel.data.email.trim() &&
			!!buyerDataModel.data.phone.trim();

		if (isValid) {
			currentModal.enableSubmitButton();
		} else {
			currentModal.disableSubmitButton();
		}

		currentModal.textErrors = step2Errors.join('. ');
	}
});

// закрытие модального окна
events.on('modal:closed', () => {
	modal.close();
	currentModal = null;
});

// загрузка данных
webLarekApi.getProductList()
	.then(products => {
		if (products.length > 0) {
			productsModel.saveData(products);
			console.log('Каталог товаров получен с сервера');
		} else {
			productsModel.saveData(apiProducts.items);
			console.log('Используются тестовые данные');
		}
	})
	.catch(error => {
		console.error('Ошибка при загрузке каталога:', error);
		productsModel.saveData(apiProducts.items);
	});
