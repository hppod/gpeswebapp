import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AnimationOptions } from "ngx-lottie"
import { BsModalRef } from "ngx-bootstrap/modal"

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.css']
})
export class ModalDialogComponent {

  @Input() message: string
  @Input() condition: any
  @Output() action = new EventEmitter
  
  options: AnimationOptions = {
    path: 'assets/animations/alert.json',
    autoplay: true,
    loop: false
  }

  styles: Partial<CSSStyleDeclaration> = {
    marginLeft: '30%',
    marginTop: '0px'
  }

  constructor(private _bsModalRef: BsModalRef) { }

  decline() {
    this.action.emit(false)
    this.close()
  }

  confirm() {
    this.action.emit(true)
    this.close()
  }

  close() {
    this._bsModalRef.hide()
  }

}
