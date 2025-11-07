import './scss/styles.scss';
import type { IProduct, OrderData } from './types';
import { Products } from './components/Models/Products';
import { ShoppingCart } from './components/Models/ShoppingCart';
import { BuyerData } from './components/Models/BuyerData';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/Models/WebLarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter, IEvents } from './components/base/Events';
import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
import { ProductPreview } from './components/View/ProductPreview';
import { Basket } from './components/View/Basket';
import { OrderStep1 } from './components/View/OrderStep1';
import { OrderStep2 } from './components/View/OrderStep2';
import { Success } from './components/View/Success';
import { Modal } from './components/View/Modal';

// брокер событий
const events: IEvents = new EventEmitter();

// модели
const productsModel = new Products(events);
const shoppingCartModel = new ShoppingCart(events);
const buyerDataModel = new BuyerData(events);

// API
const apiClient = new Api(API_URL);
const webLarekApi = new WebLarekApi(apiClient);

// представление
const headerView = new Header(events);
const galleryView = new Gallery(events);
const modalView = new Modal(events);
const productPreviewView = new ProductPreview(events);
const basketView = new Basket(events);
const orderStepOneView = new OrderStep1(events);
const orderStepTwoView = new OrderStep2(events);
const successView = new Success(events);

/* подписки на события моделей*/
// обновление каталога
events.on('catalog:changed', ({ items }: { items: IProduct[] }) => {
  galleryView.render({ items });
});

// счетчик корзины
events.on('cart:count', ({ count }: { count:number }) => {
  headerView.render( { counter: count });
});

// состав корзины изменился
events.on('cart:changed', ({ items, total }: { items: IProduct[]; total: number }) => {
modalView.isOpen && modalView.render({ content: basketView.render({ items, total }) });
});

// загрузка каталога
loadCatalog();

/* контроль пользовательских событий*/
// открыть корзину
events.on('basket:open', () => openBasket());

// открыть карточку товара
events.on('product:open', ({ id }: { id: string }) => {
  const product = productsModel.getProduct(id);
  if (!product) return console.error(`Продукт с ID ${id} не найден`);
  const inCart = shoppingCartModel.checkProductInCart(id);
  modalView.render({ content: productPreviewView.render({ product, inCart }) });
  modalView.open();
});

// добавить товар в корзину
events.on('product:add', ({ id }: { id: string }) => {
  const product = productsModel.getProduct(id);
  if (!product) return console.error(`Продукт с ID ${id} не найден`);
  shoppingCartModel.addItem(product);
  modalView.close();
});

// удалить товар из корзины внутри карточки товара
events.on('product:remove', ({ id }: { id: string }) => {
  shoppingCartModel.removeItem(id);
  modalView.close();
});

// удалить товар из корзины внутри корзины
events.on('cart:remove', ({ id }: { id: string }) => {
  shoppingCartModel.removeItem(id);
  openBasket();
});

// оформление заказа
events.on('order:open', () => {
  const d = buyerDataModel.getData();
  modalView.render({ content: orderStepOneView.render({ payment: d.payment, address: d.address }) });
});

events.on('order:step1:submit', (payload: { payment: 'card' | 'cash' | ''; address: string }) => {
  buyerDataModel.setData(payload);
  const d = buyerDataModel.getData();
  modalView.render({
    content: orderStepTwoView.render({ email: d.email, phone: d.phone }) });
});

events.on('order:step2:submit', async ({ email, phone }: { email: string; phone: string }) => {
  buyerDataModel.setData({ email, phone });

  const items = shoppingCartModel.getItems();
  const total = items.reduce((s, p) => s + (p.price ?? 0), 0);

  const orderPayload: OrderData = {
    ...buyerDataModel.getData(),
    total,
    items: items.map(p => p.id),
  };

  try {
    // отправляем заказ
    const orderResponse = await webLarekApi.submitOrder(orderPayload);
    // очищаем данные
    shoppingCartModel.clear();
    buyerDataModel.clear();
    modalView.render({ content: successView.render({ total: orderResponse.total })});
  } catch {
    alert('Ошибка оплаты. Повторите попытку');
  }
});

// внешнее закрытие модального окна по событию
events.on('modal:close', () => modalView.close());

headerView.render( { counter: shoppingCartModel.getTotalCount() });

// вспомогательные функции
async function loadCatalog() {
  try {
    const productsList = await webLarekApi.getProductList();
    productsModel.saveData(productsList);
  } catch {
    // фолбэк для картинок
    const cdnBaseUrl = CDN_URL.replace(/\/$/, '');
    const productsList = apiProducts.items.map((product) => {
      const imageWithPng = product.image.replace(/\.svg$/i, '.png');
      const imageFileName = imageWithPng.replace(/^\//, '');
      const imageUrl = /^https?:\/\//i.test(imageWithPng)
        ? imageWithPng
        : `${cdnBaseUrl}/${imageFileName}`;
      return { ...product, image: imageUrl };
    });
    productsModel.saveData(productsList);
  }
}

// открыть корзину
function openBasket() {
  const items = shoppingCartModel.getItems();
  const total = items.reduce((s, p) => s + (p.price ?? 0), 0);
  modalView.render({ content: basketView.render({ items, total }) });
  modalView.open();
}