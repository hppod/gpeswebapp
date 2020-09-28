import { Component, Input } from '@angular/core';
import { AnimationOptions } from "ngx-lottie"
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-upload-imagem',
  templateUrl: './modal-upload-imagem.component.html',
  styleUrls: ['./modal-upload-imagem.component.css']
})
export class ModalUploadImagemComponent {

  @Input() condition: any

  options: AnimationOptions = {
    path: 'assets/animations/loading.json',
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

}
