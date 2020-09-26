import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Sobre } from 'src/app/shared/models/sobre.model';
import { SobreService } from 'src/app/shared/services/sobre.service';
import { AuthenticationService } from "./../../../shared/services/authentication.service"
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';
import { ModalLoadingComponent } from 'src/app/web-components/common/modals/modal-loading/modal-loading.component';
import { AsiloWebApi } from 'src/app/app.api';
import { HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-detalhes-sobre',
  templateUrl: './detalhes-sobre.component.html',
  styleUrls: ['./detalhes-sobre.component.css']
})
export class DetalhesSobreComponent implements OnInit {

  private httpReq: Subscription

  sobre: Sobre
  file: string
  hasImage: boolean = false
  sobreForReorder: Sobre[]
  total: number

  statusResponse: number
  messageApi: string

  isLoading: boolean
  modalRef: BsModalRef

  configLoadingModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    initialState: {
      message: "Excluindo registro...",
      withFooter: false
    }
  }

  constructor(
    private _router: Router,
    private _service: SobreService,
    private _activatedRoute: ActivatedRoute,
    private _auth: AuthenticationService,
    private _modal: BsModalService,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    const titulo = this._activatedRoute.snapshot.params['title']

    this.getSobreWithTitle(titulo)
    this.getSobreWithParams()
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  get isAdmin() {
    return this._auth.isAdmin
  }

  getSobreWithTitle(title: string) {
    this.isLoading = true
    this.httpReq = this._service.getSobreByTitle(title).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.sobre = response.body['data']
      if (this.sobre['file'] != null) {
        this.file = `${AsiloWebApi}/public/download/thumbnail_gallery/${this.sobre['file']['filename']}`
        this.hasImage = true
      }
      this.isLoading = false
    }, err => {
      this.messageApi = err.error['message']
      this.isLoading = false
    })
  }

  showToastrSuccess() {
    this._toastr.success('O sobre foi excluído com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this._toastr.error('Houve um erro ao excluir o sobre. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  canDelete(title: string, _id: string) {
    const initialState = { message: `Deseja excluir o "${title}" ?` }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        if (this.sobre['file'] != null) {
          let filename = this.sobre['file']['filename']
          this.modalRef = this._modal.show(ModalLoadingComponent, this.configLoadingModal)
          this._service.deleteParams = this._service.deleteParams.set('filename', filename)
          this._service.deleteParams = this._service.deleteParams.set('_id', _id)
          this.httpReq = this._service.deleteSobre(_id).subscribe(response => {
            this.reorderAfterDelete(this.sobre.ordenacao)
            this.sobre = null
            this._router.navigate(['/admin/sobre/'])
            this._service.deleteParams = new HttpParams()
            this.modalRef.hide()
            this.showToastrSuccess()
          }, err => {
            this.sobre = null
            this._service.deleteParams = new HttpParams()
            this._router.navigate(['/admin/sobre/'])
            this.modalRef.hide()
            this.showToastrError()
          })
        } else {
          this.modalRef = this._modal.show(ModalLoadingComponent, this.configLoadingModal)
          this._service.deleteSobre(_id).subscribe(response => {
            this.reorderAfterDelete(this.sobre.ordenacao)
            this._router.navigate(['/admin/sobre/'])
            this.modalRef.hide()
            this.showToastrSuccess()
          }, err => {
            this._router.navigate(['/admin/sobre/'])
            this.modalRef.hide()
            this.showToastrError()
          })
        }
      }
    })
  }

  reorderAfterDelete(posicao) {

    for (posicao; posicao < this.sobreForReorder.length; posicao++) {
      this.sobreForReorder[posicao].ordenacao = posicao
    }

    this.sobreForReorder.forEach(element => {
      this.httpReq = this._service.updateOrder(element.titulo, element).subscribe(response => {
        this.statusResponse = response.status
        this.messageApi = response.body['message']
      }, err => {
        this.statusResponse = err.status
        this.messageApi = err.body['message']
      })
    })
  }

  getSobreWithParams() {
    this.httpReq = this._service.getSobreWithParams('authenticated').subscribe(response => {
      this.statusResponse = response.status

      if (response.status == 200) {
        this.messageApi = response.body['message']
        this.sobreForReorder = response.body['data']
        this.total = response.body['count']
      }
    }, err => {
      this.messageApi = err
    })
  }

}
