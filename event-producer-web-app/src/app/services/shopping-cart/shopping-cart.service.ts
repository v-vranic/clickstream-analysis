import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product } from 'src/app/models/product';
import { MockBackendService } from '../mock-backend/mock-backend.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  private shoppingCart = {};
  private totalAmount: number = 0;
  private checkoutInProgress = false;

  constructor(private mockBackendService: MockBackendService) { }

  addProductToShoppingCart(product: Product) {
    if (!this.isCheckoutInProgress() && !this.shoppingCart[product.id]) {
      this.shoppingCart[product.id] = Object.assign({}, product);
      this.recalculateTotalAmount();
      return true;
    }
    return false;
  }

  removeFromShoppingCart(product: Product) {
    if (!this.isCheckoutInProgress()) {
      delete this.shoppingCart[product.id];
      this.recalculateTotalAmount();
      return true;
    }
    return false;
  }

  getShoppingCart() {
    return this.shoppingCart;
  }

  existsInShoppingCart(product: Product) {
    return !!this.shoppingCart[product.id];
  }

  getNumOfItemsInShoppingCart() {
    return Object.keys(this.shoppingCart).length;
  }

  recalculateTotalAmount() {
    this.totalAmount = Math.round(Object.values<Product>(this.shoppingCart)
      .reduce((amount: number, product: Product) => 
        amount += parseFloat(product.price), 0) * 100) / 100;
  }

  getTotalAmount() {
    return this.totalAmount;
  }

  clearShoppingCart() {
    this.shoppingCart = {};
    this.totalAmount = 0;
  }

  checkout() {
    this.checkoutInProgress = true;
    return this.mockBackendService.checkout()
      .pipe(
        tap(response => {
            if (response) {
              this.clearShoppingCart();
            }
            this.checkoutInProgress = false;
        })
      );
  }

  isCheckoutInProgress() {
    return this.checkoutInProgress;
  }
}
