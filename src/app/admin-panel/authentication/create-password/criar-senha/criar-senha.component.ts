import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router, ActivatedRoute } from "@angular/router"
import { Subscription } from "rxjs"
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal"
import { ToastrService } from "ngx-toastr"
import { UsuarioService } from "./../../../../shared/services/usuario.service"
import { ModalLoadingComponent } from "./../../../../web-components/common/modals/modal-loading/modal-loading.component"

@Component({
  selector: 'app-criar-senha',
  templateUrl: './criar-senha.component.html',
  styleUrls: ['./criar-senha.component.css']
})
export class CriarSenhaComponent implements OnInit {

  private httpReq: Subscription

  _formCreatePassword: FormGroup
  modalRef: BsModalRef
  messageApi: string

  configLoadingModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    initialState: {
      message: "Definindo a senha...",
      withFooter: false
    }
  }

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _builder: FormBuilder,
    private _modal: BsModalService,
    private _router: Router,
    private _service: UsuarioService,
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
    return this._formCreatePassword.controls
  }

  /**Função que inicializa os formulários reativos do componente. */
  initForm() {
    this._formCreatePassword = this._builder.group({
      senha: this._builder.control(null, [Validators.required, Validators.minLength(6)]),
      confirmaSenha: this._builder.control(null, [Validators.required, Validators.minLength(6)])
    })
  }

  /**Função que define a nova senha do usuário quando ele recebe o convite para se cadastrar na plataforma. */
  setNewPassword() {
    if (this._formCreatePassword.invalid) {
      this.showToastrWarning('Para finalizar a criação da sua conta, é necessário informar a senha.')
    } else {
      this.modalRef = this._modal.show(ModalLoadingComponent, this.configLoadingModal)
      this._service.definePasswordNewUser(this._activatedRoute.snapshot.params['token'], this.f.senha.value, this.f.confirmaSenha.value).subscribe(response => {
        this._router.navigate(['/admin/auth/login'])
        this.modalRef.hide()
        this.showToastrSuccess('Senha definida com sucesso.')
      }, err => {
        this._router.navigate(['/admin/auth/login'])
        this.modalRef.hide()
        this.showToastrError(err)
      })
    }
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

  /**Função para exibir um toastr de advertência. */
  showToastrWarning(message: string) {
    this._toastr.warning(message, null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  /**Getters */
  /**Função que retorna o valor do input “senha”. */
  get senha() { return this._formCreatePassword.get('senha') }
  /**Função que retorna o valor do input “confirmaSenha”. */
  get confirmaSenha() { return this._formCreatePassword.get('confirmaSenha') }

}
