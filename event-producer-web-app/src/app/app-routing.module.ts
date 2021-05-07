import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductComponent } from './product/product.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';

const routes: Routes = [
  {
    path: '', 
    redirectTo: 'products/',
    pathMatch: 'full'
  },
  {
    path: 'products', 
    redirectTo: 'products/',
    pathMatch: 'full'
  },
  {
    path: 'products/:categoryCode', 
    component: HomeComponent,
    children: [
      {
        path: '',
        component: ProductListComponent,
        pathMatch: 'full'
      },
      {
        path: ':productId',
        component: ProductComponent
      }
    ]
  },
  {
    path: 'shopping-cart',
    component: ShoppingCartComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
