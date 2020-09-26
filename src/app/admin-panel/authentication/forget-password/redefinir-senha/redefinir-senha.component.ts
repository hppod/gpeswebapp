import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router, ActivatedRoute } from "@angular/router"
import { Subscription } from "rxjs"
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal"
import { ToastrService } from "ngx-toastr"
import { AuthenticationService } from "./../../../../shared/services/authentication.service"
import { ModalLoadingComponent } from "./../../../../web-components/common/modals/modal-loading/modal-loading.component"

@Component({
  selector: 'app-redefinir-senha',
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.css']
})
export class RedefinirSenhaComponent implements OnInit {

  private httpReq: Subscription

  _formNewPassword: FormGroup
  modalRef: BsModalRef
  messageApi: string

  configLoadingModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    initialState: {
      message: "Redefinindo a senha...",
      withFooter: false
    }
  }

  constructor(
    private _activatedRoute: ActivatedRoute,
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
    return this._formNewPassword.controls
  }

  /**Função que inicializa os formulários reativos do componente. */
  initForm() {
    this._formNewPassword = this._builder.group({
      senha: this._builder.control(null, [Validators.required, Validators.minLength(6)]),
      confirmaSenha: this._builder.control(null, [Validators.required, Validators.minLength(6)])
    })
  }

  /**Função que define a nova senha do usuário em caso de redefinição de senha. */
  setNewPassword() {
    if (this._formNewPassword.invalid) {
      this.showToastrWarning('Para concluir a recuperação de senha, é necessário informar a nova senha.')
    } else {
      this.modalRef = this._modal.show(ModalLoadingComponent, this.configLoadingModal)
      this.httpReq = this._service.setNewPassword(this._activatedRoute.snapshot.params['token'], this.f.senha.value, this.f.confirmaSenha.value).subscribe(response => {
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
    this._toastr.success('Senha redefinida com sucesso.', null, {
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

  /**Getters */
  /**Função que retorna o valor do input “senha”. */
  get senha() { return this._formNewPassword.get('senha') }
  /**Função que retorna o valor do input “confirmaSenha”. */
  get confirmaSenha() { return this._formNewPassword.get('confirmaSenha') }

}
