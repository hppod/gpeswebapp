import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LottieAnimationViewModule } from "ng-lottie"
import { BsModalRef } from 'ngx-bootstrap/modal'

@Component({
  selector: 'app-modal-error',
  templateUrl: './modal-error.component.html',
  styleUrls: ['./modal-error.component.css']
})
export class ModalErrorComponent {

  @Input() message: string
  @Input() withFooter: boolean = false
  @Output() action = new EventEmitter
  lottieConfig: any

  constructor(private _bsModalRef: BsModalRef) {
    LottieAnimationViewModule.forRoot()
    this.lottieConfig = {
      path: 'assets/animations/error.json',
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
