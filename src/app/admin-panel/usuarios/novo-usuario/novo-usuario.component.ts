import { Component, OnInit, HostListener } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { Subscription, Observable } from "rxjs"
import { ToastrService } from "ngx-toastr"
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal"
import { UsuarioService } from "./../../../shared/services/usuario.service"
import { UsuarioValidator } from "./../../../shared/validations/usuario.validator"
import { ModalDialogComponent } from "./../../../web-components/common/modals/modal-dialog/modal-dialog.component"
import { ComponentCanDeactivate } from "src/app/shared/guards/pending-changes.guard"
import { setLastUrl } from "src/app/shared/functions/last-pagination"

@Component({
  selector: 'app-novo-usuario',
  templateUrl: './novo-usuario.component.html',
  styleUrls: ['./novo-usuario.component.css']
})
export class NovoUsuarioComponent implements OnInit, ComponentCanDeactivate {

  httpReq: Subscription
  modalRef: BsModalRef
  _formUsuario: FormGroup
  isLoading: boolean

  selectOptionCategory: any[] = [
    { value: 'Administrador' },
    { value: 'Editor' }
  ]

  constructor(
    private _builder: FormBuilder,
    private _modal: BsModalService,
    private _service: UsuarioService,
    private _router: Router,
    private _toastr: ToastrService,
    private _unique: UsuarioValidator
  ) { }

  ngOnInit() {
    this.initForm()
    setLastUrl(this._router.url)
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this._formUsuario.dirty) {
      return false
    }
    return true
  }

  initForm() {
    this._formUsuario = this._builder.group({
      nome: this._builder.control(null, [Validators.required], this._unique.checkUniqueNome()),
      user: this._builder.control(null, [Validators.required], this._unique.checkUniqueUsuario()),
      email: this._builder.control(null, [Validators.required], this._unique.checkUniqueEmail()),
      role: this._builder.control(null, [Validators.required])
    })
  }

  canCancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a inserção do registro atual? Todos os dados serão perdidos." }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this._router.navigate(['/admin/usuario'])
        this._formUsuario.reset()
      }
    })
  }

  addNewUser() {
    this.isLoading = true
    this.httpReq = this._service.createNewUser(this._formUsuario.value).subscribe(response => {
      this._formUsuario.reset()
      this.isLoading = false
      this.showToastrSuccess()
      this._router.navigate(['/admin/usuario'])
    }, err => {
      this._formUsuario.reset()
      this.isLoading = false
      this.showToastrError()
      this._router.navigate(['/admin/usuario'])
    })
  }

  showToastrSuccess() {
    this._toastr.success("O usuário foi adicionado com sucesso", null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this._toastr.error("Houve um erro ao adicionar o usuário. Tente novamente.", null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  /**Getters */
  get nome() { return this._formUsuario.get('nome') }
  get user() { return this._formUsuario.get('user') }
  get email() { return this._formUsuario.get('email') }
  get role() { return this._formUsuario.get('role') }

}
