import { Component } from "@angular/core"
import { LottieAnimationViewModule } from "ng-lottie"
import { BsModalRef } from "ngx-bootstrap/modal"

@Component({
  selector: 'app-modal-file-upload',
  templateUrl: './modal-file-upload.component.html',
  styleUrls: ['./modal-file-upload.component.css']
})
export class ModalFileUploadComponent {

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
