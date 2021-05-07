import { Category } from "./category";

export class Product {

    id: string;
    name: string;
    brand: string;
    price: string;
    description: string;
    imageUrl: string;
    category: Category;

    constructor(id: string, name: string, brand: string, price: string, 
        description: string, imageUrl: string, category: Category) {
        this.id = id;
        this.name = name;
        this.brand = brand;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this.category = category;
    }
}