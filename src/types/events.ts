export enum AppEvents {
    // Каталог
    CatalogChanged = 'catalog:changed',
    ProductSelected = 'product:selected',
    ProductOpen = 'product:open',
    
    // Корзина
    CartChanged = 'cart:changed',
    CartRemove = 'cart:remove',
    BasketOpen = 'basket:open',
    CardAction = 'card:action',
    
    // Заказ
    OrderOpen = 'order:open',
    OrderStep1Submit = 'order:step1:submit',
    OrderStep2Submit = 'order:step2:submit',
    SuccessClose = 'success:close',
    
    // Формы
    FormChange = 'form:change',
    
    // Модальное окно
    ModalClosed = 'modal:closed',
    
    // Покупатель
    BuyerChanged = 'buyer:changed'
}