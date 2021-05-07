import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { combineLatest, forkJoin, of, ReplaySubject, Subject } from 'rxjs';
import { filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { ClickstreamEvent, ClickstreamEventType } from 'src/app/models/clickstream-event';
import { Product } from 'src/app/models/product';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

declare var divolte: any;

@Injectable({
  providedIn: 'root'
})
export class ClickstreamService {

  private trackerLoadedSubject: Subject<boolean>
    = new ReplaySubject<boolean>(1);

  constructor(private authService: AuthService, private router: Router) { }

  private trackPageViews() {
    this.router.events.pipe(
        filter(event => event instanceof NavigationEnd),
        switchMap((event: NavigationEnd) => 
          this.getTrackerLoadedObservable().pipe(
            filter(isLoaded => !!isLoaded),
            map(() => event.urlAfterRedirects)
          )
        )
    ).subscribe(pagePath => {
      let clickEvent = new ClickstreamEvent();
      clickEvent.eventTime = new Date().toISOString();
      clickEvent.userId = this.authService.getCurrentUserId();
      clickEvent.pagePath = pagePath;
      this.sendClickEvent(ClickstreamEventType.PageView, clickEvent);
    });
  }

  private sendEvent(eventType: string, events: ClickstreamEvent | ClickstreamEvent[]) {
    if (this.isTrackingEnabled() && this.isTrackerLoaded()) {
      if (!eventType || !events) {
        throw new Error('Invalid event parameters');
      }
      [].concat(events).forEach(event => divolte.signal(eventType, event));
    }
  }

  sendClickEvent(eventType: string, events: ClickstreamEvent | ClickstreamEvent[]) {
    try {
      this.sendEvent(eventType, events);
    } catch (e) {
      console.error('Error sending click event', e);
    }
  }

  sendProductClickEvent(eventType: string, products: Product | Product[]) {
    try {
      if (this.isTrackingEnabled() && this.isTrackerLoaded()) {
        if (products == null) {
          throw new Error('Products cannot be null')
        }
        let eventTime = new Date().toISOString();
        [].concat(products)
          .map(product => this.createEventFromProduct(eventTime, product))
          .forEach(event => this.sendEvent(eventType, event));
      }
    } catch (e) {
      console.error('Error sending click event', e);
    }
  }

  getTrackerLoadedObservable() {
    return this.trackerLoadedSubject.asObservable();
  }

  onTrackerLoaded() {
    this.trackerLoadedSubject.next(true);
  }

  isTrackerLoaded() {
    return typeof divolte !== 'undefined';
  }

  isTrackingEnabled() {
    return environment.enableTracking && environment.trackingScriptUrl;
  }

  getTrackingScriptUrl() {
    return environment.trackingScriptUrl;
  }

  createEventFromProduct(eventTime: string, product: Product) {
    if (!eventTime) {
      throw new Error('Event time is not valid');
    }
    if (product == null || product.category == null) {
      throw new Error('Invalid product data');
    }
    let userId = this.authService.getCurrentUserId();
    return new ClickstreamEvent(
      eventTime,
      product.id,
      product.category.id,
      product.price,
      product.category.code,
      product.brand,
      userId
    );
  }

  loadTrackingScript() {
    try {
      if (this.isTrackingEnabled()) {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.getTrackingScriptUrl();
        script.onload = () => this.onTrackerLoaded();
        document.head.append(script);

        this.trackPageViews();
      }
    } catch (e) {
      console.error('Error loading tracking script');
    }
  }
}
