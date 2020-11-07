import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ProcessoSeletivoService } from 'src/app/shared/services/processo-seletivo.service';
import { ProcessoSeletivo } from 'src/app/shared/models/processo-seletivo.model';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';
import { ComponentCanDeactivate } from 'src/app/shared/guards/pending-changes.guard';
import { setLastUrl } from 'src/app/shared/functions/last-pagination';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-atualizar-processo-seletivo',
  templateUrl: './atualizar-processo-seletivo.component.html',
  styleUrls: ['./atualizar-processo-seletivo.component.css']
})
export class AtualizarProcessoSeletivoComponent implements OnInit, ComponentCanDeactivate {

  messageApi: string
  httpReq: Subscription
  statusResponse: number
  processoSeletivoForm: FormGroup
  modalRef: BsModalRef
  success = false

  processoSeletivo: ProcessoSeletivo

  configLoadingModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    initialState: {
      message: "Atualizando arquivo...",
      withFooter: false
    }
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

  constructor(
    private _router: Router,
    private _builder: FormBuilder,
    private _modal: BsModalService,
    private _toastr: ToastrService,
    private _service: ProcessoSeletivoService,
    private _activatedRoute: ActivatedRoute
  ) {
    this.initForm()
  }

  ngOnInit() {
    const title = this._activatedRoute.snapshot.params['title']
    this.getData(title)
    setLastUrl(this._router.url)
  }

  ngOnDestoy() {
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

  initForm() {
    this.processoSeletivoForm = this._builder.group({
      titulo: this._builder.control('', [Validators.required, Validators.maxLength(150)]),
      descricao: this._builder.control('', Validators.required),
      ordenacao: this._builder.control(null)
    })
  }

  preencheForm(processoSeletivo: ProcessoSeletivo) {
    this.processoSeletivoForm.patchValue({
      titulo: processoSeletivo['titulo'],
      descricao: processoSeletivo['descricao'],
      ordenacao: processoSeletivo.ordenacao
    })
  }

  getData(title: string) {
    this.httpReq = this._service.getProcessoSeletivoByTile(title).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.processoSeletivo = response.body['data']
      this.preencheForm(this.processoSeletivo)
    }, err => {
      this.statusResponse = err.status
      this.messageApi = err.error['message']
    })
  }


  updateProcessoSeletivo() {
      this.httpReq = this._service.update(this.processoSeletivo['titulo'], this.processoSeletivoForm.value).subscribe(response => {
        this.processoSeletivoForm.reset()
        this.success = true
        this._router.navigate(['/admin/processo-seletivo/processo'])
        this.showToastrSuccess()
      }, err => {
        this.processoSeletivoForm.reset()
        this._router.navigate(['/admin/processo-seletivo/processo'])
        this.showToastrError()
      })
  }

  canCancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a atualização do registro atual? Todos os dados serão perdidos." }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.processoSeletivoForm.reset()
        this._router.navigate(['/admin/processo-seletivo/processo'])
      }
    })
  }

  showToastrSuccess() {
    this._toastr.success('O processo seletivo foi atualizado com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this._toastr.error('Houve um erro ao atualizar o processo seletivo. Tente novamente', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  /**Getters */
  get titulo() { return this.processoSeletivoForm.get('titulo') }
  get descricao() { return this.processoSeletivoForm.get('descricao') }

}
