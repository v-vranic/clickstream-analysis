export class ClickstreamEvent {

    eventTime: string;
    productId: string;
    categoryId: string;
    price: string;
    categoryCode: string;
    brand: string;
    userId: string;
    pagePath: string;

    constructor(eventTime?: string, productId?: string, 
        categoryId?: string, price?: string, 
        categoryCode?: string, brand?: string,
        userId?: string) {
            this.eventTime = eventTime;
            this.productId = productId;
            this.categoryId = categoryId;
            this.price = price;
            this.categoryCode = categoryCode;
            this.brand = brand;
            this.userId = userId;
    }
}

export enum ClickstreamEventType {
    PageView = 'page_view',
    ProductView = 'view',
    AddToCart = 'cart',
    RemoveFromCart = 'remove_from_cart',
    Purchase = 'purchase'
}