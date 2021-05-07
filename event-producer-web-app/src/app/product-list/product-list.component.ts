import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Product } from '../models/product';
import { CategoryService } from '../services/category/category.service';
import { MockBackendService } from '../services/mock-backend/mock-backend.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {

  private selectedCategorySubscription: Subscription;
  products = [];

  constructor(private categoryService: CategoryService, private mockBackendService: MockBackendService,
    private router: Router) {
    this.selectedCategorySubscription =
      this.categoryService.getSelectedCategoryObservable()
        .pipe(
          mergeMap(category =>
            this.mockBackendService.getProductsByCategory(
              category ? category.id : null
            )
          )
        ).subscribe(products => 
          this.products = this.mapProductsForView(products)
        );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.selectedCategorySubscription != null) {
      this.selectedCategorySubscription.unsubscribe();
    }
  }

  private mapProductsForView(products: Array<Product>) {
    if (products != null) {
      let columnsPerRow = 3;
      let rows = Math.floor(products.length / columnsPerRow);
      if (products.length % columnsPerRow > 0) {
        rows++;
      }
      let productMatrix = [];
      for (let i = 0; i < rows; i++) {
        productMatrix.push([]);
      }
      for (let i = 0; i < products.length; i++) {
        let pRow = Math.floor(i / columnsPerRow);
        productMatrix[pRow].push(products[i]);
      }
      return productMatrix;
    }
    return [];
  }

  goToProduct(product: Product) {
    if (product && product.category) {
      this.router.navigateByUrl(
        'products/' + product.category.code + '/' + product.id
      );
    }
  }
}
