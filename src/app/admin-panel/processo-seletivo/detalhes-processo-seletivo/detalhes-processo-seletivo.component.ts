import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProcessoSeletivo } from "./../../../shared/models/processo-seletivo.model"
import { ProcessoSeletivoService } from "./../../../shared/services/processo-seletivo.service"
import { AuthenticationService } from "./../../../shared/services/authentication.service"
import { Subscription } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
import { HttpParams } from '@angular/common/http'
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal"
import { ModalDocumentComponent } from "./../../../web-components/common/modals/modal-document/modal-document.component"
import { GPESWebApi } from 'src/app/app.api'
import { ModalDialogComponent } from "./../../../web-components/common/modals/modal-dialog/modal-dialog.component"
import { ModalLoadingComponent } from "./../../../web-components/common/modals/modal-loading/modal-loading.component"
import { ToastrService } from "ngx-toastr"

@Component({
  selector: 'app-detalhes-processo-seletivo',
  templateUrl: './detalhes-processo-seletivo.component.html',
  styleUrls: ['./detalhes-processo-seletivo.component.css']
})
export class DetalhesProcessoSeletivoComponent implements OnInit, OnDestroy {
  private httpReq: Subscription

  processoSeletivo: ProcessoSeletivo

  modalRef: BsModalRef
  statusResponse: number
  messageApi: string
  isLoading: boolean
  processoSeletivoForReorder: ProcessoSeletivo[]
  total: number

  configLoadingModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    initialState: {
      message: "Excluindo registro...",
      withFooter: false
    }
  }

  constructor(
    private _service: ProcessoSeletivoService,
    private _activatedRoute: ActivatedRoute,
    private _auth: AuthenticationService,
    private _router: Router,
    private _modal: BsModalService,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    const titulo = this._activatedRoute.snapshot.params['title']

    this.getProcessoSeletivoWithTitle(titulo)
    this.getProcessoSeletivoWithParams()
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  get isAdmin() {
    return this._auth.isAdmin
  }

  getProcessoSeletivoWithTitle(title: string) {
    this.isLoading = true
    this.httpReq = this._service.getProcessoSeletivoByTile(title).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.processoSeletivo = response.body['data']
      this.isLoading = false
    }, err => {
      this.messageApi = err.error['message']
      this.isLoading = false
    })
  }


  canDelete(title: string, _id: string) {
    const initialState = { message: `Deseja excluir o "${title}" ?` }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
          this.modalRef = this._modal.show(ModalLoadingComponent, this.configLoadingModal)
          this._service.delete(_id).subscribe(response => {
            this.reorderAfterDelete(this.processoSeletivo.ordenacao)
            this._router.navigate(['/admin/processo-seletivo/'])
            this.modalRef.hide()
            this.showToastrSuccess()
          }, err => {
            this._router.navigate(['/admin/processo-seletivo/'])
            this.modalRef.hide()
            this.showToastrError()
          })
        }
    })
  }

  showToastrSuccess() {
    this._toastr.success('O processo seletivo foi excluído com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this._toastr.error('Houve um erro ao excluir o processo seletivo. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  reorderAfterDelete(posicao) {

    for (posicao; posicao < this.processoSeletivoForReorder.length; posicao++) {
      this.processoSeletivoForReorder[posicao].ordenacao = posicao
    }

    this.processoSeletivoForReorder.forEach(element => {
      this.httpReq = this._service.updateOrder(element.titulo, element).subscribe(response => {
        this.statusResponse = response.status
        this.messageApi = response.body['message']
      }, err => {
        this.statusResponse = err.status
        this.messageApi = err.body['message']
      })
    })
  }

  getProcessoSeletivoWithParams() {
    this.httpReq = this._service.getProcessoSeletivoWithParams('authenticated').subscribe(response => {
      this.statusResponse = response.status

      if (response.status == 200) {
        this.messageApi = response.body['message']
        this.processoSeletivoForReorder = response.body['data']
        this.total = response.body['count']
      }
    }, err => {
      this.messageApi = err
    })
  }

}
