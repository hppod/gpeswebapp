import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AnimationOptions } from "ngx-lottie"
import { BsModalRef } from 'ngx-bootstrap/modal'

@Component({
  selector: 'app-modal-success',
  templateUrl: './modal-success.component.html',
  styleUrls: ['./modal-success.component.css']
})
export class ModalSuccessComponent {

  @Input() message: string
  @Input() withFooter: boolean = false
  @Input() condition: any
  @Output() action = new EventEmitter

  options: AnimationOptions = {
    path: 'assets/animations/success.json',
    autoplay: true,
    loop: false
  }

  styles: Partial<CSSStyleDeclaration> = {
    marginLeft: '30%',
    marginTop: '0px'
  }

  constructor(private _bsModalRef: BsModalRef) { }

  close() {
    this._bsModalRef.hide()
  }

  ok() {
    this.action.emit(true)
    this.close()
  }

}
