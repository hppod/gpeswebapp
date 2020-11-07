import { Component, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ProcessoSeletivoService } from 'src/app/shared/services/processo-seletivo.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';
import { ProcessoSeletivo } from 'src/app/shared/models/processo-seletivo.model';
import { toFormData } from 'src/app/shared/functions/to-form-data.function';
import { toResponseBody } from 'src/app/shared/functions/to-response-body.function';
import { ProcessoSeletivoValidator } from "./../../../../shared/validations/processo-seletivo.validator";
import { ComponentCanDeactivate } from 'src/app/shared/guards/pending-changes.guard';
import { requiredFileType } from "../../../../shared/functions/upload-file-validator.function"
import { setLastUrl } from 'src/app/shared/functions/last-pagination';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-create-processo-seletivo',
  templateUrl: './create-processo-seletivo.component.html',
  styleUrls: ['./create-processo-seletivo.component.css']
})
export class CreateProcessoSeletivoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {

  private httpReq: Subscription

  processoSeletivoForm: FormGroup
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
    private _service: ProcessoSeletivoService,
    private _builder: FormBuilder,
    private _toastr: ToastrService,
    private _modal: BsModalService,
    private _unique: ProcessoSeletivoValidator
  ) { }

  ngOnInit(): void {
    this.getProcessoSeletivoWithParams()
    setLastUrl(this._router.url)
    this.processoSeletivoForm = this._builder.group({
      titulo: this._builder.control('', [Validators.required, Validators.maxLength(150)], this._unique.checkUniqueTitulo()),
      descricao: this._builder.control('', Validators.required),
      ordenacao: this._builder.control(null),
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
    if (this.processoSeletivoForm.dirty) {
      return false
    }
    return true
  }

  getProcessoSeletivoWithParams() {
    this.httpReq = this._service.getProcessoSeletivoWithParams('authenticated').subscribe(response => {
      if (response.status == 200)
        this.total = response.body['count']
    })
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: '15rem',
    minHeight: '10rem',
    maxHeight: 'auto',
    width: '100%',
    minWidth: '0',
    enableToolbar: true,
    showToolbar: true,
    placeholder: "Descrição...",
    translate: 'no',
    sanitize: true,
    outline: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['subscript', 'superscript'],
      ['fontSize', 'textColor', 'backgroundColor', 'heading', 'fontName'],
      ['link', 'unlink', 'insertImage', 'insertVideo', 'toggleEditorMode']
    ]
  };

  postProcessoSeletivo(form: ProcessoSeletivo) {
    this.success = false
    form.ordenacao = this.total + 1
    this.httpReq = this._service.postProcessoSeletivo(form)
    .subscribe(response => {
      this.processoSeletivoForm.reset()
      this.showToastrSuccess()
      this._router.navigate(['/admin/processo-seletivo/processo'])
    }, err => {
      this.processoSeletivoForm.reset()
      this.showToastrError()
      this._router.navigate(['/admin/processo-seletivo/processo'])
    })

  }

  Cancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a inserção do registro atual? Todos os dados serão perdidos." }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this._router.navigate(['/admin/processo-seletivo/processo'])
        this.processoSeletivoForm.reset()
      }
    })
  }

  showToastrSuccess() {
    this._toastr.success('Processo Seletivo foi adicionado com sucesso', null, {
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
  get titulo() { return this.processoSeletivoForm.get('titulo') }
  get descricao() { return this.processoSeletivoForm.get('descricao') }

}
