import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { Subscription } from "rxjs"
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal"
import { ToastrService } from "ngx-toastr"
import { AuthenticationService } from "./../../../../shared/services/authentication.service"
import { ModalLoadingComponent } from "./../../../../web-components/common/modals/modal-loading/modal-loading.component"

@Component({
  selector: 'app-enviar-email',
  templateUrl: './enviar-email.component.html',
  styleUrls: ['./enviar-email.component.css']
})
export class EnviarEmailComponent implements OnInit {

  private httpReq: Subscription

  _formSendMail: FormGroup
  modalRef: BsModalRef
  messageApi: string

  configLoadingModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    initialState: {
      message: "Enviando e-mail de recuperação...",
      withFooter: false
    }
  }

  constructor(
    private _builder: FormBuilder,
    private _modal: BsModalService,
    private _router: Router,
    private _service: AuthenticationService,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    this.initForm()
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  /**Função que retorna os controles do formulário. */
  get f() {
    return this._formSendMail.controls
  }

  /**Função que inicializa os formulários reativos do componente. */
  initForm() {
    this._formSendMail = this._builder.group({
      email: this._builder.control(null, [Validators.required])
    })
  }

  /**Função que envia um e-mail de redefinição de senha para o usuário. */
  sendMail() {
    if (this._formSendMail.invalid) {
      this.showToastrWarning('Para realizar a recuperação de senha, é necessário informar o e-mail cadastrado.')
    } else {
      this.modalRef = this._modal.show(ModalLoadingComponent, this.configLoadingModal)
      this.httpReq = this._service.sendMailForgetPassword(this.f.email.value).subscribe(response => {
        this._router.navigate(['/admin/auth/login'])
        this.modalRef.hide()
        this.showToastrSuccess()
      }, err => {
        this._router.navigate(['/admin/auth/login'])
        this.modalRef.hide()
        this.showToastrError(err)
      })
    }
  }

  /**Função para exibir um toastr de sucesso. */
  showToastrSuccess() {
    this._toastr.success('E-mail de recuperação de senha enviado com sucesso.', null, {
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

  /**Função para exibir um toastr de advertência. */
  showToastrWarning(message: string) {
    this._toastr.warning(message, null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

}
