import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentComponent } from 'src/app/modal-content/modal-content.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

    constructor(private ngbModal: NgbModal) {}

    openModal(content, callback?) {
        let modalRef = this.ngbModal.open(ModalContentComponent);
        modalRef.componentInstance.content = content;
        if (callback) {
          modalRef.result.then(callback, callback);
        }
    }
}    