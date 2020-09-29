import { Component, Input } from "@angular/core"
import { AnimationOptions } from "ngx-lottie"
import { BsModalRef } from "ngx-bootstrap/modal"

@Component({
  selector: 'app-modal-file-upload',
  templateUrl: './modal-file-upload.component.html',
  styleUrls: ['./modal-file-upload.component.css']
})
export class ModalFileUploadComponent {

  @Input() condition: any

  options: AnimationOptions = {
    path: 'assets/animations/loading.json',
    autoplay: true,
    loop: false
  }

  styles: Partial<CSSStyleDeclaration> = {
    display: 'block',
    marginTop: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto'
  }

  constructor(private _bsModalRef: BsModalRef) { }

  close() {
    this._bsModalRef.hide()
  }

}
