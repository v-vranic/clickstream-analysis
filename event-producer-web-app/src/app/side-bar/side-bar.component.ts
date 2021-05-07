import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from '../models/category';
import { CategoryService } from '../services/category/category.service';
import { MockBackendService } from '../services/mock-backend/mock-backend.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit, OnDestroy {

  categories: Array<Category> = [];
  selectedCategory: Category;
  private selectedCategorySubscription: Subscription;
  private routeSubscription: Subscription;

  constructor(private categoryService: CategoryService, private mockBackendService: MockBackendService,
    private activatedRoute: ActivatedRoute, private router: Router) { 
    this.categories = this.mockBackendService.getCategories();
    this.selectedCategorySubscription = 
      this.categoryService.getSelectedCategoryObservable()
        .subscribe(category => {
          this.selectedCategory = category;
        });
  }

  ngOnInit(): void {
    this.routeSubscription = this.activatedRoute.params.subscribe(params => {
      if (params && params['categoryCode']) {
        let categoryToSelect = this.categories.find(category => category.code === params['categoryCode']);
        this.categoryService.changeSelectedCategory(categoryToSelect);
      } else {
        this.categoryService.changeSelectedCategory(null);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.selectedCategorySubscription != null) {
      this.selectedCategorySubscription.unsubscribe();
    }
    if (this.routeSubscription != null) {
      this.routeSubscription.unsubscribe();
    }
  }

  isCategorySelected(category: Category) { 
    return this.selectedCategory != null && category != null &&
      this.selectedCategory.id === category.id;
  }

  selectCategory(category: Category) {
    let url = 'products/';
    if (category && category.code) {
      url += category.code;
    }
    this.router.navigateByUrl(url);
  }
}
