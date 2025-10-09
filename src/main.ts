import './scss/styles.scss';
import { Products } from './components/Models/Products';
import { ShoppingCart } from './components/Models/ShoppingCart';
import { BuyerData } from './components/Models/BuyerData';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/Models/WebLarekApi';
import { API_URL } from './utils/constants';

// экземпляр API
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// экземпляр Products
const productsModel = new Products();

// запрос к серверу для получения каталога товаров
console.log('Получение каталога товаров с сервера...');

webLarekApi.getProductList()
    .then(products => {
        // сохранение полученных данных в модель
        productsModel.saveData(products);
        
        console.log('Каталог товаров получен и сохранен:', productsModel.getProductList());
        
        // тестирование корзины (после получения товаров)
        testShoppingCart();
    })
    .catch(error => {
        console.error('Ошибка при загрузке каталога:', error);
        // Если сервер не доступен, используем тестовые данные
        productsModel.saveData(apiProducts.items);
        testShoppingCart();
    });

// Функция для тестирования корзины
function testShoppingCart() {
    const shoppingCartModel = new ShoppingCart();
    
    if (productsModel.getProductList().length > 0) {
        const products = productsModel.getProductList();

        // добавляем товары в корзину
        shoppingCartModel.addItem(products[0]);
        shoppingCartModel.addItem(products[1]);
        shoppingCartModel.addItem(products[0]); // дублируем первый товар

        console.log('Корзина протестирована. Товаров:', shoppingCartModel.getTotalCount());
    }

    // тестирование данных покупателя
    testBuyerData();
}

// Функция для тестирования данных покупателя
function testBuyerData() {
    const buyerDataModel = new BuyerData();

    const testBuyerData = {
        payment: 'card' as 'card',
        address: 'ул. Сахарная, д. 1',
        email: 'test@example.com',
        phone: '+79991234567'
    };

    buyerDataModel.setData(testBuyerData);
    console.log('Данные покупателя установлены');
}