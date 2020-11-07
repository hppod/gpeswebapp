import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { SobreService } from 'src/app/shared/services/sobre.service';
import { Sobre } from 'src/app/shared/models/sobre.model';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';
import { toResponseBody } from 'src/app/shared/functions/to-response-body.function';
import { ComponentCanDeactivate } from 'src/app/shared/guards/pending-changes.guard';
import { validatorFileType } from 'src/app/shared/functions/upload-img-validator.function';
import { setLastUrl } from 'src/app/shared/functions/last-pagination';
import { FileSnippet } from 'src/app/web-components/common/file-uploader/FileSnippet.class';
import { FileUploaderService } from "./../../../web-components/common/file-uploader/file-uploader.service"
import { Ng2ImgMaxService } from 'ng2-img-max';
import { ModalUploadImagemComponent } from 'src/app/web-components/common/modals/modal-upload-imagem/modal-upload-imagem.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-atualizar-sobre',
  templateUrl: './atualizar-sobre.component.html',
  styleUrls: ['./atualizar-sobre.component.css']
})
export class AtualizarSobreComponent implements OnInit, ComponentCanDeactivate {

  messageApi: string
  httpReq: Subscription
  statusResponse: number
  sobreForm: FormGroup
  modalRef: BsModalRef
  modalUpload: BsModalRef

  Sobre: Sobre
  FileSnippet: FileSnippet[] = new Array()
  UploadedFiles: FileSnippet[] = new Array()
  blobFiles: File[] = new Array()
  FormData = new FormData()

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
    private _service: SobreService,
    private _activatedRoute: ActivatedRoute,
    private uploaderService: FileUploaderService,
    private ng2ImgMax: Ng2ImgMaxService
  ) {
    this.initForm()
  }

  ngOnInit() {
    const title = this._activatedRoute.snapshot.params['title']
    this.getData(title)
    // this.getFiles('tmb_fu', title)
    setLastUrl(this._router.url)
  }

  ngOnDestoy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.sobreForm.dirty) {
      return false
    }
    return true
  }

  initForm() {
    this.sobreForm = this._builder.group({
      titulo: this._builder.control(null, Validators.required),
      descricao: this._builder.control(null, Validators.required),
      ordenacao: this._builder.control(null),
      // file: this._builder.control(null, validatorFileType())
    })
  }

  preencheForm(sobre: Sobre) {
    this.sobreForm.patchValue({
      titulo: sobre['titulo'],
      descricao: sobre['descricao'],
      ordenacao: sobre.ordenacao
    })
  }

  getData(title: string) {
    this.httpReq = this._service.getSobreByTitle(title).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.Sobre = response.body['data']
      this.preencheForm(this.Sobre)
    }, err => {
      this.statusResponse = err.status
      this.messageApi = err.error['message']
    })
  }

 
  updateSobre() {
    this.httpReq = this._service.updateSobre(this.Sobre['titulo'], this.sobreForm.value).subscribe(response => {
      this.sobreForm.reset()
      this._router.navigate(['/admin/sobre'])
      this.showToastrSuccess()
    }, err => {
      this.sobreForm.reset()
      this._router.navigate(['/admin/sobre'])
      this.showToastrError()
    })
  }

  showToastrSuccessDelete() {
    this._toastr.success('Imagem apagada com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrErrorDelete() {
    this._toastr.error('Houve um erro ao apagar a imagem. Tente novamente', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  canCancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a atualização do registro atual? Todos os dados serão perdidos." }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.sobreForm.reset()
        this._router.navigate(['/admin/sobre'])
      }
    })
  }

  showToastrSuccess() {
    this._toastr.success('O sobre foi atualizado com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this._toastr.error('Houve um erro ao atualizar o sobre. Tente novamente', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  /**Getters */
  get titulo() { return this.sobreForm.get('titulo') }
  get descricao() { return this.sobreForm.get('descricao') }

}
