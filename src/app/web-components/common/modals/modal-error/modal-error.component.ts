import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AnimationOptions } from "ngx-lottie"
import { BsModalRef } from 'ngx-bootstrap/modal'

@Component({
  selector: 'app-modal-error',
  templateUrl: './modal-error.component.html',
  styleUrls: ['./modal-error.component.css']
})
export class ModalErrorComponent {

  @Input() message: string
  @Input() withFooter: boolean = false
  @Input() condition: any
  @Output() action = new EventEmitter

  options: AnimationOptions = {
    path: 'assets/animations/loading.json',
    autoplay: true,
    loop: false
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
