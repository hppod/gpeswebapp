import { Component, OnInit } from "@angular/core"
import { UsuarioService } from "./../../../shared/services/usuario.service"
import { Usuario } from "./../../../shared/models/usuario.model"
import { Subscription } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal"
import { ToastrService } from "ngx-toastr"
import { ModalDialogComponent } from "./../../../web-components/common/modals/modal-dialog/modal-dialog.component"
import { ModalLoadingComponent } from "./../../../web-components/common/modals/modal-loading/modal-loading.component"

@Component({
  selector: 'app-detalhes-usuario',
  templateUrl: './detalhes-usuario.component.html',
  styleUrls: ['./detalhes-usuario.component.css']
})
export class DetalhesUsuarioComponent implements OnInit {

  private httpReq: Subscription

  user: Usuario

  statusResponse: number
  messageApi: string
  isLoading: boolean
  modalRef: BsModalRef

  configLoadingModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    initialState: {
      message: "Excluindo usuário...",
      withFooter: false
    }
  }

  constructor(
    private _service: UsuarioService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _modal: BsModalService,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    const user = this._activatedRoute.snapshot.params['user']
    this.getUserByUser(user)
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  getUserByUser(user: string) {
    this.isLoading = true
    this.httpReq = this._service.getUserByUser(user).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.user = response.body['data']
      this.isLoading = false
    }, err => {
      this.messageApi = err.err['message']
      this.isLoading = false
    })
  }

  canDelete(user: string) {
    const initialState = { message: `Deseja excluir o usuário "${user}" ?` }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.modalRef = this._modal.show(ModalLoadingComponent, this.configLoadingModal)
        this.httpReq = this._service.deleteUserByUser(user).subscribe(response => {
          this._router.navigate(['/admin/usuario'])
          this.modalRef.hide()
          this.showToastrSuccess("O usuário foi excluido com sucesso")
        }, err => {
          this._router.navigate(['/admin/usuario'])
          this.modalRef.hide()
          this.showToastrError("Houve um erro ao excluir o usuário. Tente novamente.")
        })
      }
    })
  }

  showToastrSuccess(message: string) {
    this._toastr.success(message, null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError(message: string) {
    this._toastr.error(message, null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  resendMail() {
    this.configLoadingModal.initialState['message'] = `Reenviado e-mail para ${this.user['email']}...`
    this.modalRef = this._modal.show(ModalLoadingComponent, this.configLoadingModal)
    this.httpReq = this._service.resendMailToUser(this.user['email']).subscribe(response => {
      this.modalRef.hide()
      this.showToastrSuccess(`E-mail reenviado para ${this.user['email']}`)
    }, err => {
      this.modalRef.hide()
      this.showToastrError(`Houve um erro ao reenviar o e-mail. Tente novamente mais tarde.`)
    })
  }

}
