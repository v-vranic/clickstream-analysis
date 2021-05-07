import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClickstreamEventType } from '../models/clickstream-event';
import { Product } from '../models/product';
import { AuthService } from '../services/auth/auth.service';
import { ClickstreamService } from '../services/clickstream/clickstream.service';
import { ModalService } from '../services/modal/modal.service';
import { ShoppingCartService } from '../services/shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  shoppingCart;

  constructor(private shoppingCartService: ShoppingCartService, 
    private router: Router, private authService: AuthService,
    private clickstreamService: ClickstreamService,
    private modalService: ModalService) {
    this.shoppingCart = this.shoppingCartService.getShoppingCart();
  }

  ngOnInit(): void {
  }

  removeFromShoppingCart(product: Product) {
    if (product) {
      let removed = this.shoppingCartService.removeFromShoppingCart(product);
      if (removed) {
        this.clickstreamService.sendProductClickEvent(ClickstreamEventType.RemoveFromCart, product);
      }
    }
  }

  getNumOfItemsInCart() {
    return this.shoppingCartService.getNumOfItemsInShoppingCart();
  }

  getTotalAmount() {
    return this.shoppingCartService.getTotalAmount();
  }

  checkout() {
    if (this.authService.getCurrentUserValue() != null) {
      let products = this.getArrayCopyOfShoppingCartItems(this.shoppingCart);
      this.shoppingCartService.checkout().subscribe(response => {
        if (response) {
          this.modalService.openModal('Checkout successful', () => this.router.navigateByUrl(''));
          this.clickstreamService.sendProductClickEvent(ClickstreamEventType.Purchase, products);
        }
      });
    } else {
      this.modalService.openModal('You need to be logged in to checkout');
    }
  }

  isCheckoutInProgress() {
    return this.shoppingCartService.isCheckoutInProgress();
  }

  private getArrayCopyOfShoppingCartItems(shoppingCart) {
    if (shoppingCart != null) {
      let cart = Object.assign({}, shoppingCart);
      return Object.values<Product>(cart);
    }
    return [];
  }
}
