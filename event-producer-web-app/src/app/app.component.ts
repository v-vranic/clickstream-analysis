import { Component } from '@angular/core';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ClickstreamService } from './services/clickstream/clickstream.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private ngbModalConfig: NgbModalConfig,
    private clickstreamService: ClickstreamService) {
    this.clickstreamService.loadTrackingScript();
    this.configureNgbModal();
  }

  configureNgbModal() {
    this.ngbModalConfig.animation = true;
    this.ngbModalConfig.centered = true;
  }
}
