import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LottieAnimationViewModule } from "ng-lottie"
import { BsModalRef } from "ngx-bootstrap/modal"

@Component({
  selector: 'app-boleto-dialog',
  templateUrl: './modal-boleto.component.html',
  styleUrls: ['./modal-boleto.component.css']
})
export class ModalBoletoComponent {

  @Input() boleto: string
  @Input() message: string
  @Input() codeBoleto: string
  @Input() withFooter: boolean = false
  @Output() action = new EventEmitter

  constructor(private _bsModalRef: BsModalRef) {
    LottieAnimationViewModule.forRoot()

  }

  close() {
    this._bsModalRef.hide()
  }

  ok() {
    this.action.emit(true)
    this.close()
  }

}
