import { Component, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/shared/services/home.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';
import { Home } from 'src/app/shared/models/home.model';
import { toFormData } from 'src/app/shared/functions/to-form-data.function';
import { toResponseBody } from 'src/app/shared/functions/to-response-body.function';
import { HomeValidator } from "./../../../shared/validations/home.validator";
import { ComponentCanDeactivate } from 'src/app/shared/guards/pending-changes.guard';
import { setLastUrl } from 'src/app/shared/functions/last-pagination';

@Component({
  selector: 'app-novo-home',
  templateUrl: './novo-home.component.html',
  styleUrls: ['./novo-home.component.css']
})

export class NovoHomeComponent implements OnInit, OnDestroy, ComponentCanDeactivate {

  private httpReq: Subscription;

  homeForm: FormGroup
  modalRef: BsModalRef

  total: number = 0
  isLoading: boolean

  success = false
  progress = 0

  configModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false
  }

  constructor(
    private _router: Router,
    private _service: HomeService,
    private _builder: FormBuilder,
    private _toastr: ToastrService,
    private _modal: BsModalService,
    private _unique: HomeValidator
  ) { }

  ngOnInit(): void {
    this.getHomeWithParams()
    setLastUrl(this._router.url)
    this.homeForm = this._builder.group({
      titulo: this._builder.control('', [Validators.required, Validators.maxLength(150)], this._unique.checkUniqueTitulo()),
      descricao: this._builder.control('', Validators.required),
      ordenacao: this._builder.control(null)
    });
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.homeForm.dirty) {
      return false
    }
    return true
  }

  getHomeWithParams() {
    this.httpReq = this._service.getHomeWithParams('authenticated').subscribe(response => {
      if (response.status == 200)
        this.total = response.body['count']
    })
  }

  postHome(form: Home) {
    this.success = false
    form.ordenacao = this.total + 1
    this.httpReq = this._service.createHome(form)
    .subscribe(response => {
      this.homeForm.reset()
      this.showToastrSuccess()
      this._router.navigate(['/admin/home'])
    }, err => {
      this.homeForm.reset()
      this.showToastrError()
      this._router.navigate(['/admin/home'])
    })

  }

  canCancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a inserção do registro atual? Todos os dados serão perdidos." }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this._router.navigate(['/admin/home'])
        this.homeForm.reset()
      }
    })
  }

  showToastrSuccess() {
    this._toastr.success('Informação da Home adicionada com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this._toastr.error('Houve um erro ao adicionar. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  /**Getters */
  get titulo() { return this.homeForm.get('titulo') }
  get descricao() { return this.homeForm.get('descricao') }

}
