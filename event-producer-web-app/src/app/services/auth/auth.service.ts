import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user';
import { MockBackendService } from '../mock-backend/mock-backend.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUserSubject: BehaviorSubject<User> 
    = new BehaviorSubject<User>(null);

  constructor(private mockBackendService: MockBackendService) {
  }

  getAuthUserObservable() {
    return this.authUserSubject.asObservable();
  }

  getCurrentUserValue() {
    return this.authUserSubject.value;
  }

  getCurrentUserId() {
    if (this.getCurrentUserValue() != null
      && this.getCurrentUserValue().userId) {
      return this.getCurrentUserValue().userId;
    }
    return null;
  }

  login() {
    let user: User = this.mockBackendService.loginUser();
    this.authUserSubject.next(user);
  }

  logout() {
    this.authUserSubject.next(null);
  }
}
