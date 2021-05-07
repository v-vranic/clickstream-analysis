import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';

@Injectable({
    providedIn: 'root'
})
export class MockBackendService {

    private products: Array<Product> = [];
    private categories = new Array<Category>();
    private responseDelay = 0;
    private images = {};

    constructor() { 
        this.initData();
    }

    getProduct(productId: String): Observable<Product> {
        let product = this.products.find(product => product.id === productId);
        return of(product).pipe(delay(this.responseDelay));
    }

    getProductsByCategory(categoryId: String): Observable<Product[]> { 
        let retProducts = this.products;
        if (categoryId) {
            retProducts =  this.products.filter(product => product.category.id === categoryId);
            
        }
        return of(retProducts).pipe(delay(this.responseDelay));
    }

    getCategories(): Array<Category> {
       return this.categories;
    }

    loginUser(): User {
        return new User('test', '1');   
    }

    checkout(): Observable<boolean> {
        return of(true).pipe(delay(1000));
    }
     
    initData() {
        let imagePath = 'assets/images/';
        this.images = {
            book1: imagePath + 'book1.jpg',
            book2: imagePath + 'notebook1.jpg',

            chair1: imagePath + 'chair1.jpg',
            chair2: imagePath + 'chair2.jpg',
            sofa1: imagePath + 'sofa1.jpg',
            lamp1: imagePath + 'lamp1.jpg',

            laptop1: imagePath + 'laptop1.jpg',
            usb1: imagePath + 'usb1.jpg',

            headphones1: imagePath + 'headphones1.jpg',

            smartwatch1: imagePath + 'smartwatch1.jpg',
            smartwatch2: imagePath + 'smartwatch2.jpg',

            bag1: imagePath + 'bag1.jpg',
            glasses1: imagePath + 'glasses1.jpg'
        };

        let category1 = new Category('1', 'electronics', 'Electronics');
        let category2 = new Category('2', 'furniture', 'Furniture');
        let category3 = new Category('3', 'books', 'Books');
        let category4 = new Category('4' ,'accessories', 'Accessories');
        let category5 = new Category('5', 'shoes', 'Shoes');
        let category6 = new Category('6', 'watches', 'Watches');
        this.categories.push(category1, category2, category3, category4,
            category5, category6);
        
        this.products.push(
            new Product('1', 'Laptop', null, '790.00', 'Example product', this.images['laptop1'], Object.assign({}, category1)),
            new Product('2', 'Headphones', null, '79.59', 'Example product', this.images['headphones1'], Object.assign({}, category1)),
            new Product('3', 'Book', null, '59.99', 'Example product', this.images['book1'], Object.assign({}, category3)),
            new Product('4', 'Notebook', null, '23.89', 'Example product', this.images['book2'], Object.assign({}, category3)),
            new Product('5', 'Chair', null, '80.00', 'Example product', this.images['chair1'], Object.assign({}, category2)),
            new Product('7', 'Smartwatch', null, '154.49', 'Example product', this.images['smartwatch1'], Object.assign({}, category6)),
            new Product('8', 'Usb Cable', null, '9.99', 'Example product', this.images['usb1'], Object.assign({}, category1)),
            new Product('14', 'Bag', null, '4.99', 'Example product', this.images['bag1'], Object.assign({}, category4)),
            new Product('15', 'Smartwatch', null, '190.49', 'Example product', this.images['smartwatch2'], Object.assign({}, category6)),
            new Product('16', 'Glasses', null, '19.99', 'Example product', this.images['glasses1'], Object.assign({}, category4)),
            new Product('17', 'Lamp', null, '30.00', 'Example product', this.images['lamp1'], Object.assign({}, category2)),
            new Product('18', 'Chair', null, '45.00', 'Example product', this.images['chair2'], Object.assign({}, category2)),
            new Product('19', 'Sofa', null, '250.00', 'Example product', this.images['sofa1'], Object.assign({}, category2)),
        );
    }
}