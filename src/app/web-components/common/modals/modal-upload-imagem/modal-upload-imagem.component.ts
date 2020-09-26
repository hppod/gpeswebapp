import { Component } from '@angular/core';
import { LottieAnimationViewModule } from "ng-lottie"
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-upload-imagem',
  templateUrl: './modal-upload-imagem.component.html',
  styleUrls: ['./modal-upload-imagem.component.css']
})
export class ModalUploadImagemComponent {

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

}
