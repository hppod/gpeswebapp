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

  /**Função para exibir um toastr de sucesso. */
  showToastrSuccess(message: string) {
    this._toastr.success(message, null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  /**Função para exibir um toastr de erro. */
  showToastrError(message: string) {
    this._toastr.error(message, null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

}
