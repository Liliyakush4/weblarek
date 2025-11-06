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

// экземпляр брокера событий
const events: IEvents = new EventEmitter();

// модели
const productsModel = new Products();
const shoppingCartModel = new ShoppingCart();
const buyerDataModel = new BuyerData();

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

// загрузка каталога
loadCatalog();

// контроль событий
// открыть корзину
events.on('basket:open', () => openBasket());

// открыть карточку товара
events.on('product:open', ({ id: productId }: { id: string }) => {
  const selectedProduct = productsModel.getProduct(productId);
  if (!selectedProduct) {
    console.error(`Product with id ${productId} not found`);
    return;
  }
  const isInCart = isProductInCart(productId);
  modalView.render({ content: productPreviewView.render({ product: selectedProduct, inCart: isInCart }) });
  modalView.open();
});

// добавить товар в корзину
events.on('product:add', ({ id: productId }: { id: string }) => {
  const selectedProduct = productsModel.getProduct(productId);
  if (!selectedProduct) {
    console.error(`Product with id ${productId} not found`);
    return;
  }
  shoppingCartModel.addItem(selectedProduct);
  updateBasketCounter();
  modalView.close();
});

// удалить товар из корзины внутри карточки товара
events.on('product:remove', ({ id: productId }: { id: string }) => {
  shoppingCartModel.removeItem(productId);
  updateBasketCounter();
  modalView.close();
});

// удалить товар из корзины внутри корзины
events.on('cart:remove', ({ id: productId }: { id: string }) => {
  shoppingCartModel.removeItem(productId);
  updateBasketCounter();
  openBasket();
});

// оформление заказа
events.on('order:open', () => {
  const currentBuyerData = buyerDataModel.getData();
  modalView.render({
    content: orderStepOneView.render({
      payment: currentBuyerData.payment,
      address: currentBuyerData.address,
    }),
  });
});
events.on('order:step1:submit', (payload: { payment: 'card' | 'cash' | ''; address: string }) => {
  buyerDataModel.setData({ ...buyerDataModel.getData(), ...payload });
  const currentBuyerData = buyerDataModel.getData();
  modalView.render({
    content: orderStepTwoView.render({
      email: currentBuyerData.email,
      phone: currentBuyerData.phone,
    }),
  });
});
events.on('order:step2:submit', async ({ email, phone }: { email: string; phone: string }) => {
  buyerDataModel.setData({ ...buyerDataModel.getData(), email, phone });
  const productsInCart = shoppingCartModel.getItems();
  const totalSum = calculateTotal(productsInCart);
  const orderPayload: OrderData = {
    ...buyerDataModel.getData(),
    total: totalSum,
    items: productsInCart.map((product) => product.id),
  };

  try {
    // отправляем заказ
    const orderResponse = await webLarekApi.submitOrder(orderPayload);
    shoppingCartModel.clear();
    updateBasketCounter();

    // очищаем данные
    buyerDataModel.setData({ payment: '', address: '', email: '', phone: '' });

    modalView.render({ content: successView.render({ total: orderResponse.total }) });
  } catch {
    alert('Ошибка оплаты. Повторите попытку');
  }
});

// внешнее закрытие модального окна по событию
events.on('modal:close', () => modalView.close());

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
  } finally {
    renderCatalog();
    updateBasketCounter();
  }
}

// рендер каталога
function renderCatalog() {
  const productsList = productsModel.getProductList();
  galleryView.render({ items: productsList });
}

// открыть корзину
function openBasket() {
  const productsInCart = shoppingCartModel.getItems();
  const totalSum = calculateTotal(productsInCart);
  modalView.render({ content: basketView.render({ items: productsInCart, total: totalSum }) });
  modalView.open();
}

// обновить счётчик корзины
function updateBasketCounter() {
  headerView.render({ counter: shoppingCartModel.getTotalCount() });
}

// подсчёт суммы
function calculateTotal(products: IProduct[]) {
  return products.reduce((sum, product) => sum + (product.price ?? 0), 0);
}

// проверка, есть ли товар в корзине
function isProductInCart(productId: string) {
  const productsInCart = shoppingCartModel.getItems();
  return productsInCart.some((product) => product.id === productId);
}