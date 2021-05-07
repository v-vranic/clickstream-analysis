import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../models/product';

@Component({
  selector: 'app-product-list-item',
  templateUrl: './product-list-item.component.html',
  styleUrls: ['./product-list-item.component.scss']
})
export class ProductListItemComponent implements OnInit {

  @Input()
  product: Product;
  
  @Input()
  isVertical: boolean;

  constructor() { }

  ngOnInit(): void {
  }
}
