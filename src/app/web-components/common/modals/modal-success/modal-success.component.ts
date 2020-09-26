import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LottieAnimationViewModule } from "ng-lottie"
import { BsModalRef } from 'ngx-bootstrap/modal'

@Component({
  selector: 'app-modal-success',
  templateUrl: './modal-success.component.html',
  styleUrls: ['./modal-success.component.css']
})
export class ModalSuccessComponent {

  @Input() message: string
  @Input() withFooter: boolean = false
  @Output() action = new EventEmitter
  lottieConfig: any

  constructor(private _bsModalRef: BsModalRef) {
    LottieAnimationViewModule.forRoot()
    this.lottieConfig = {
      path: 'assets/animations/success.json',
      autoplay: true,
      loop: false
    }
  }

  close() {
    this._bsModalRef.hide()
  }

  ok() {
    this.action.emit(true)
    this.close()
  }

}
