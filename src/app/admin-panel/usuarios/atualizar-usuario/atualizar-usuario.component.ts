import { Component, OnInit, HostListener } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { Subscription, Observable } from "rxjs"
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal"
import { ToastrService } from "ngx-toastr"
import { Usuario } from "./../../../shared/models/usuario.model"
import { UsuarioService } from "./../../../shared/services/usuario.service"
import { ModalDialogComponent } from "./../../../web-components/common/modals/modal-dialog/modal-dialog.component"
import { ComponentCanDeactivate } from "src/app/shared/guards/pending-changes.guard"
import { setLastUrl } from "src/app/shared/functions/last-pagination"

@Component({
  selector: 'app-atualizar-usuario',
  templateUrl: './atualizar-usuario.component.html',
  styleUrls: ['./atualizar-usuario.component.css']
})
export class AtualizarUsuarioComponent implements OnInit, ComponentCanDeactivate {

  httpReq: Subscription
  _formUsuario: FormGroup
  modalRef: BsModalRef
  User: Usuario
  messageApi: string
  statusResponse: number

  selectOptionCategory: any[] = [
    { value: 'Administrador' },
    { value: 'Editor' }
  ]

  constructor(
    private _router: Router,
    private _builder: FormBuilder,
    private _modal: BsModalService,
    private _toastr: ToastrService,
    private _service: UsuarioService,
    private _activatedRoute: ActivatedRoute
  ) {
    this.initForm()
  }

  ngOnInit() {
    this.getInfosToUpdate()
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
      nome: this._builder.control(null, [Validators.required]),
      user: this._builder.control(null, [Validators.required]),
      email: this._builder.control(null, [Validators.required]),
      role: this._builder.control(null, [Validators.required])
    })
  }

  getInfosToUpdate() {
    this.httpReq = this._service.getUserByUser(this._activatedRoute.snapshot.params['user']).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.User = response.body['data']
      this.populateFormWithValuesToUpdate(this.User)
    }, err => {
      this.statusResponse = err.status
      this.messageApi = err.err['message']
    })
  }

  populateFormWithValuesToUpdate(user: Usuario) {
    this._formUsuario.patchValue({
      nome: user['nome'],
      user: user['user'],
      email: user['email'],
      role: user['role']
    })
  }

  updateUser() {
    const user = this.user['user']
    const form = this._formUsuario.value
    this.httpReq = this._service.updateUser(user, form).subscribe(response => {
      this._formUsuario.reset()
      this._router.navigate(['/admin/usuario'])
      this.showToastrSuccess()
    }, err => {
      this._formUsuario.reset()
      this._router.navigate(['/admin/usuario'])
      this.showToastrError()
    })
  }

  canCancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a atualização do registro atual? Todos os dados serão perdidos." }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this._formUsuario.reset()
        this._router.navigate(['/admin/usuario'])
      }
    })
  }

  showToastrSuccess() {
    this._toastr.success("O usuário foi atualizado com sucesso", null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this._toastr.error("Houve um erro ao atualizar o usuário. Tente novamente.", null, {
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
