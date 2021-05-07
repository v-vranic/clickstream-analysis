import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { ShoppingCartService } from '../services/shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy {

  public authUser;
  private authUserSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router,
    private shoppingCartService: ShoppingCartService) { 
    this.authUser = this.authService.getCurrentUserValue();
    this.authUserSubscription = this.authService.getAuthUserObservable()
      .subscribe(authUser => {
        this.authUser = authUser;
      });
  }

  ngOnInit(): void {
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  goToShoppingCart() {
    this.router.navigateByUrl('shopping-cart');
  }

  getNumOfItemsInCart() {
    return this.shoppingCartService.getNumOfItemsInShoppingCart();
  }

  ngOnDestroy(): void {
    if (this.authUserSubscription != null) {
      this.authUserSubscription.unsubscribe();
    }
  }

  reloadApp() {
    this.router.navigateByUrl('');
  }
}
