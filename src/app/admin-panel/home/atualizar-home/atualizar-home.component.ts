import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { HomeService } from 'src/app/shared/services/home.service';
import { Home } from 'src/app/shared/models/home.model';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';
import { ComponentCanDeactivate } from 'src/app/shared/guards/pending-changes.guard';
import { setLastUrl } from 'src/app/shared/functions/last-pagination';

@Component({
  selector: 'app-atualizar-home',
  templateUrl: './atualizar-home.component.html',
  styleUrls: ['./atualizar-home.component.css']
})
export class AtualizarHomeComponent implements OnInit, ComponentCanDeactivate {

  messageApi: string
  httpReq: Subscription
  statusResponse: number
  homeForm: FormGroup
  modalRef: BsModalRef
  success = false

  home: Home

  configLoadingModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    initialState: {
      message: "Atualizando arquivo...",
      withFooter: false
    }
  }

  constructor(
    private _router: Router,
    private _builder: FormBuilder,
    private _modal: BsModalService,
    private _toastr: ToastrService,
    private _service: HomeService,
    private _activatedRoute: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    const title = this._activatedRoute.snapshot.params['title'];
    this.getData(title);
    setLastUrl(this._router.url);
  }

  ngOnDestoy() {
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

  initForm() {
    this.homeForm = this._builder.group({
      titulo: this._builder.control('', [Validators.required, Validators.maxLength(150)]),
      descricao: this._builder.control('', Validators.required),
      ordenacao: this._builder.control(null)
    })
  }

  preencheForm(home: Home) {
    this.homeForm.patchValue({
      titulo: home['titulo'],
      descricao: home['descricao'],
      ordenacao: home.ordenacao
    })
  }

  getData(title: string) {
    this.httpReq = this._service.getHomeByTitle(title).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.home = response.body['data']
      this.preencheForm(this.home)
    }, err => {
      this.statusResponse = err.status
      this.messageApi = err.error['message']
    })
  }

  updateHome() {
    this.httpReq = this._service.updateHome(this.home['titulo'], this.homeForm.value).subscribe(response => {
      this.homeForm.reset()
      this.success = true
      this._router.navigate(['/admin/home'])
      this.showToastrSuccess()
    }, err => {
      this.homeForm.reset()
      this._router.navigate(['/admin/home'])
      this.showToastrError()
    })
  }

  canCancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a atualização do registro atual? Todos os dados serão perdidos." }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.homeForm.reset()
        this._router.navigate(['/admin/home'])
      }
    })
  }

  showToastrSuccess() {
    this._toastr.success('A informação da Home foi atualizada com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this._toastr.error('Houve um erro ao atualizar a informação da Home. Tente novamente', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  /**Getters */
  get titulo() { return this.homeForm.get('titulo') }
  get descricao() { return this.homeForm.get('descricao') }


}
