import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { Category } from 'src/app/models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

    selectedCategorySubject: Subject<Category> 
        = new ReplaySubject<Category>(1);

    constructor() {}

    getSelectedCategoryObservable() {
        return this.selectedCategorySubject.asObservable();
    }

    changeSelectedCategory(category: Category) {
        this.selectedCategorySubject.next(category);
    }
}    