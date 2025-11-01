import './scss/styles.scss';
import { CatalogItem } from './components/Views/CatalogItem';
import { Products } from './components/Models/Products';
import { apiProducts } from './utils/data';
import { ensureElement } from './utils/utils';

// --- Модель продуктов ---
const productsModel = new Products();

// Загружаем тестовые данные (или с сервера)
productsModel.saveData(apiProducts.items);

// --- Контейнер для каталога ---
const gallery = ensureElement<HTMLElement>('.gallery');
const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');

// --- Рендерим каталог ---
function renderCatalog() {
  gallery.innerHTML = ''; // очистка перед рендером
  productsModel.getProductList().forEach(product => {
    const card = new CatalogItem(catalogTemplate);
    gallery.appendChild(card.render(product));

    // Пример обработчика клика на карточку
    card.onClick(item => {
      console.log('Клик на товар:', item);
    });
  });
}

// Запуск рендера
renderCatalog();
console.log('Каталог успешно отрендерен');
