import { Component } from '@angular/core';
import { BsModalRef } from "ngx-bootstrap/modal"
import { DomSanitizer, SafeResourceUrl, SafeUrl } from "@angular/platform-browser"

@Component({
  selector: 'app-modal-document',
  templateUrl: './modal-document.component.html',
  styleUrls: ['./modal-document.component.css']
})
export class ModalDocumentComponent {

  modalRef: BsModalRef
  isLoading: boolean
  documentPdf: string
  documentSanitizer: SafeResourceUrl

  constructor(
    private _bsModalRef: BsModalRef,
    private sanitizer: DomSanitizer
  ) {
    this.documentSanitizer = this.sanitizer.bypassSecurityTrustResourceUrl(this.documentPdf)
    this.isLoading = true
  }

  close() {
    this._bsModalRef.hide()
  }

  loadingComplete() {
    this.isLoading = false
  }
}
