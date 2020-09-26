import { Component, OnInit } from '@angular/core';
import { Contato } from "./../../../shared/models/contato.model"
import { ContatoService } from "./../../../shared/services/contato.service"
import { AuthenticationService } from "./../../../shared/services/authentication.service"
import { Subscription } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';
import { ModalLoadingComponent } from 'src/app/web-components/common/modals/modal-loading/modal-loading.component';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-see-details-contato',
  templateUrl: './see-details-contato.component.html',
  styleUrls: ['./see-details-contato.component.css']
})
export class DetalhesContatoComponent implements OnInit {

  private httpReq: Subscription

  contato: Contato

  statusResponse: number
  messageApi: string
  isLoading: boolean

  modalRef: BsModalRef

  configLoadingModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    initialState: {
      message: "Excluindo contato...",
      withFooter: false
    }
  }

  constructor(
    private contatoService: ContatoService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _auth: AuthenticationService,
    private _modal: BsModalService,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    const descricao = this._activatedRoute.snapshot.params['descricao']

    this.getContatoWithDescricao(descricao)
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  get isAdmin() {
    return this._auth.isAdmin
  }


  getContatoWithDescricao(descricao: string) {
    this.isLoading = true
    this.httpReq = this.contatoService.getContatoByDescricao(descricao).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.contato = response.body['data']
      this.isLoading = false
    }, err => {
      this.messageApi = err.error['message']
      this.isLoading = false
    })
  }

  showToastrSuccess() {
    this._toastr.success('O contato foi excluído com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this._toastr.error('Houve um erro ao excluir o contato. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  canDelete(_id: string, descricao: string) {
    const initialState = { message: `Deseja excluir o contato "${descricao}" ?` }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.modalRef = this._modal.show(ModalLoadingComponent, this.configLoadingModal)
        this.contatoService.deleteParams = this.contatoService.deleteParams.set('_id', _id)
        this.httpReq = this.contatoService.deleteContato(_id).subscribe(response => {
          this._router.navigate(['/admin/contato'])
          this.contatoService.deleteParams = new HttpParams()
          this.modalRef.hide()
          this.showToastrSuccess()
        }, err => {
          this._router.navigate(['/admin/contato'])
          this.contatoService.deleteParams = new HttpParams()
          this.modalRef.hide()
          this.showToastrError()
        })
      }
    })
  }

}
