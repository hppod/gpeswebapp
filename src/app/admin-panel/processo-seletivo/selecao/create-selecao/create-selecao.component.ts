import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ProcessoSeletivoService } from 'src/app/shared/services/processo-seletivo.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';
import { Selecao } from 'src/app/shared/models/selecao.model';
import { ComponentCanDeactivate } from 'src/app/shared/guards/pending-changes.guard';
import { setLastUrl } from 'src/app/shared/functions/last-pagination';
import { SelecaoValidator } from 'src/app/shared/validations/selecao.validator';

@Component({
  selector: 'app-create-selecao',
  templateUrl: './create-selecao.component.html',
  styleUrls: ['./create-selecao.component.css']
})
export class CreateSelecaoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {

  private httpReq: Subscription

  selecaoForm: FormGroup
  modalRef: BsModalRef

  isLoading: boolean

  success = false

  configModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false
  }

  constructor(
    private _router: Router,
    private _service: ProcessoSeletivoService,
    private _builder: FormBuilder,
    private _toastr: ToastrService,
    private _modal: BsModalService,
    private _unique: SelecaoValidator
  ) { }

  ngOnInit(): void {
    setLastUrl(this._router.url)
    this.selecaoForm = this._builder.group({
      titulo: this._builder.control('', [Validators.required], this._unique.checkUniqueTitulo()),
      dataInicio: this._builder.control(null, [Validators.required]),
      dataFim: this._builder.control(null, [Validators.required]),
      status: this._builder.control(true)
    });
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.selecaoForm.dirty) {
      return false
    }
    return true
  }

  postSelecao(form: Selecao) {
    this.success = false
    this.httpReq = this._service.postSelecao(form)
    .subscribe(response => {
      this.selecaoForm.reset()
      this.showToastrSuccess()
      this._router.navigate(['/admin/processo-seletivo/selecao'])
    }, err => {
      this.selecaoForm.reset()
      this.showToastrError()
      this._router.navigate(['/admin/processo-seletivo/selecao'])
    })

  }

  Cancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a inserção do registro atual? Todos os dados serão perdidos." }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this._router.navigate(['/admin/processo-seletivo/selecao'])
        this.selecaoForm.reset()
      }
    })
  }

  showToastrSuccess() {
    this._toastr.success('Seleção foi adicionada com sucesso', null, {
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
  get titulo() { return this.selecaoForm.get('titulo') }
  get dataInicio() { return this.selecaoForm.get('dataInicio') }
  get dataFim() { return this.selecaoForm.get('dataFim') }

}
