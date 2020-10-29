import { Component, OnInit } from '@angular/core';
import { Publicacoes } from "./../../../shared/models/publicacoes.model"
import { PublicacoesService } from "./../../../shared/services/publicacoes.service"
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
  selector: 'app-detalhes-publicacoes',
  templateUrl: './detalhes-publicacoes.component.html',
  styleUrls: ['./detalhes-publicacoes.component.css']
})
export class DetalhesPublicacoesComponent implements OnInit {

  private httpReq: Subscription

  document: Publicacoes
  file: string

  modalRef: BsModalRef
  statusResponse: number
  messageApi: string
  isLoading: boolean

  configLoadingModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    initialState: {
      message: "Excluindo documento...",
      withFooter: false
    }
  }

  constructor(
    private _service: PublicacoesService,
    private _activatedRoute: ActivatedRoute,
    private _auth: AuthenticationService,
    private _router: Router,
    private _modal: BsModalService,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    const titulo = this._activatedRoute.snapshot.params['title']

    this.getDocumentWithTitle(titulo)
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  /**Função que retorna se o usuário logado tem permissão de administrador. */
  get isAdmin() {
    return this._auth.isAdmin
  }

  /**Função que busca os documentos do portal da transparência no banco de dados de acordo com os parâmetros informados. */
  getDocumentWithTitle(title: string) {
    this.isLoading = true
    this.httpReq = this._service.getPublicacaoByTitle(title).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.document = response.body['data']
      this.isLoading = false
    }, err => {
      this.messageApi = err.error['message']
      this.isLoading = false
    })
  }

  /**Função que abre um modal com a visualização do documento escolhido. */
  openModalWithDocument() {
    const file = `${GPESWebApi}/publicacoes/${this.document['file']['filename']}`
    const initialState = { documentPdf: file }
    this.modalRef = this._modal.show(ModalDocumentComponent, { initialState })
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

  /**Função que exibe um modal de pergunta ao usuário se ele permite que o documento seja excluído do banco de dados. */
  canDelete(titleDocument: string, _id: string, filename: string) {
    const initialState = { message: `Deseja excluir o documento "${titleDocument}" ?` }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.modalRef = this._modal.show(ModalLoadingComponent, this.configLoadingModal)
        this._service.deleteParams = this._service.deleteParams.set('filename', filename)
        this._service.deleteParams = this._service.deleteParams.set('_id', _id)
        this.httpReq = this._service.deleteDocument().subscribe(response => {
          this._router.navigate(['/admin/publicacoes/'])
          this._service.deleteParams = new HttpParams()
          this.modalRef.hide()
          this.showToastrSuccess('O documento foi excluido com sucesso')
        }, err => {
          this._router.navigate(['/admin/publicacoes/'])
          this._service.deleteParams = new HttpParams()
          this.modalRef.hide()
          this.showToastrError('Houve um erro ao excluir o documento. Tente novamente.')
        })
      }
    })
  }
}
