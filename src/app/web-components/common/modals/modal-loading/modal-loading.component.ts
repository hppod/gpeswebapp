import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LottieAnimationViewModule } from "ng-lottie"
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-loading',
  templateUrl: './modal-loading.component.html',
  styleUrls: ['./modal-loading.component.css']
})
export class ModalLoadingComponent {

  @Input() message: string
  @Input() withFooter: boolean = false
  @Output() action = new EventEmitter
  lottieConfig: any

  constructor(private _bsModalRef: BsModalRef) {
    LottieAnimationViewModule.forRoot()
    this.lottieConfig = {
      path: 'assets/animations/loading.json',
      autoplay: true,
      loop: true
    }
  }

  close() {
    this._bsModalRef.hide()
  }

  cancel() {
    this.action.emit(true)
    this.close()
  }

}
