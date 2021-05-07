import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { mergeMap, tap, filter, map, switchMap } from 'rxjs/operators';
import { ClickstreamEventType } from '../models/clickstream-event';
import { Product } from '../models/product';
import { ClickstreamService } from '../services/clickstream/clickstream.service';
import { MockBackendService } from '../services/mock-backend/mock-backend.service';
import { ModalService } from '../services/modal/modal.service';
import { ShoppingCartService } from '../services/shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {

  private activatedRouteSubscription: Subscription;

  product: Product;

  constructor(private activatedRoute: ActivatedRoute, private mockBackendService: MockBackendService,
    private shoppingCartService: ShoppingCartService, private router: Router,
    private clickstreamService: ClickstreamService, private modalService: ModalService) {
  }

  addToCart() {
    if (this.product) {
      let isAdded = this.shoppingCartService.addProductToShoppingCart(this.product);
      if (isAdded) {
        this.clickstreamService.sendProductClickEvent(
          ClickstreamEventType.AddToCart, this.product
        );
        this.router.navigateByUrl('');
      } else {
        this.modalService.openModal('Cannot add product to shopping cart');
      }
    }
  }

  ngOnInit(): void {
    this.subscribeToRouteParams();
  }

  ngOnDestroy(): void {
    if (this.activatedRouteSubscription != null) {
      this.activatedRouteSubscription.unsubscribe();
    }
  }

  private subscribeToRouteParams() {
    this.activatedRouteSubscription = this.activatedRoute.params
      .pipe(
        filter(params => params && params['productId']),
        map(params => params['productId']),
        switchMap(productId => this.mockBackendService.getProduct(productId)),
        tap(product => this.product = product),
        switchMap(() => this.clickstreamService.getTrackerLoadedObservable()),
        filter(isLoaded => !!isLoaded)
      ).subscribe(() => {
        this.clickstreamService.sendProductClickEvent(
          ClickstreamEventType.ProductView, this.product
        );
      });
  }
}
