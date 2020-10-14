import { Component, OnInit, OnDestroy, ViewEncapsulation, HostListener } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SobreService } from 'src/app/shared/services/sobre.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';
import { Sobre } from 'src/app/shared/models/sobre.model';
import { toFormData } from 'src/app/shared/functions/to-form-data.function';
import { toResponseBody } from 'src/app/shared/functions/to-response-body.function';
import { SobreValidator } from "./../../../shared/validations/sobre.validator"
import { ComponentCanDeactivate } from 'src/app/shared/guards/pending-changes.guard';
import { validatorFileType } from "../../../shared/functions/upload-img-validator.function"
import { setLastUrl } from 'src/app/shared/functions/last-pagination';
import { FileSnippet } from "./../../../web-components/common/file-uploader/FileSnippet.class"
import { FileUploaderService } from "./../../../web-components/common/file-uploader/file-uploader.service"
import { ModalUploadImagemComponent } from 'src/app/web-components/common/modals/modal-upload-imagem/modal-upload-imagem.component';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-create-sobre',
  templateUrl: './create-sobre.component.html',
  styleUrls: ['./create-sobre.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateSobreComponent implements OnInit, OnDestroy, ComponentCanDeactivate {

  private httpReq: Subscription

  sobreForm: FormGroup
  modalRef: BsModalRef

  total: number = 0
  isLoading: boolean

  success = false
  progress = 0

  Files: FileSnippet[] = new Array()
  blobFiles: File[] = new Array()

  configModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false
  }

  constructor(
    private _router: Router,
    private _service: SobreService,
    private _builder: FormBuilder,
    private _toastr: ToastrService,
    private _modal: BsModalService,
    private _unique: SobreValidator,
   private uploaderService: FileUploaderService,
    private ng2ImgMax: Ng2ImgMaxService
  ) { }

  ngOnInit(): void {
    this.getSobreWithParams()
    setLastUrl(this._router.url)
    this.sobreForm = this._builder.group({
      titulo: this._builder.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)], this._unique.checkUniqueTitulo()),
      descricao: this._builder.control('', Validators.required),
      file: this._builder.control(null, validatorFileType()),
      ordenacao: this._builder.control(null),
      status: this._builder.control(true)
    });
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.sobreForm.dirty) {
      return false
    }
    return true
  }

  getSobreWithParams() {
    this.httpReq = this._service.getSobreWithParams('authenticated').subscribe(response => {
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

  Cancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a inserção do registro atual? Todos os dados serão perdidos." }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this._router.navigate(['/admin/sobre'])
        this.sobreForm.reset()
      }
    })
  }

  setFiles() {
    this.Files = this.uploaderService.selectedFiles
  }

  resize() {
    let length = this.Files.length
    for (let index = 0; index < length; index++) {
      let image = this.Files[index].file
      this.ng2ImgMax.resizeImage(image, 100, 100).subscribe(result => {
        image = new File([result], result.name, {
          type: 'image/jpeg'
        })
      })
      this.blobFiles.push(image)
    }
  }

  addNewSobre(form: Sobre) {
    this.success = false
    this.setFiles()
    if (this.blobFiles) {
      this.resize()
      form.file = this.blobFiles[0]
      this.modalRef = this._modal.show(ModalUploadImagemComponent)
    }
    form.ordenacao = this.total + 1
    if (form.file != null) {
      this._service.postSobre(toFormData(this.sobreForm.value)).pipe(
        toResponseBody()
      ).subscribe(res => {
        console.log(this.sobreForm.value)
        this.success = true
        this.sobreForm.reset()
        this.modalRef.hide()
        this.showToastrSuccess()
        this._router.navigate(['/admin/sobre'])
      }, err => {
        this.sobreForm.reset()
        this.showToastrError()
        this._router.navigate(['/admin/sobre'])
      })
    } else {
      this._service.postSobre(toFormData(this.sobreForm.value))
        .subscribe(res => {
          console.log(this.sobreForm.value)
          this.sobreForm.reset()
          this.modalRef.hide()
          this.showToastrSuccess()
          this._router.navigate(['/admin/sobre'])
        }, err => {
          this.sobreForm.reset()
          this.modalRef.hide()
          this.showToastrError()
          this._router.navigate(['/admin/sobre'])
        })
    }
  }

  postSobre(){
    this.httpReq = this._service.createNewSobre(this.sobreForm.value).subscribe(response =>{
      this.sobreForm.reset()
      this.showToastrSuccess()
      this._router.navigate(['/admin/sobre'])
    }, err =>{
      this.sobreForm.reset()
      this.showToastrError()
      this._router.navigate(['/admin/sobre'])
    })
  }

  showToastrSuccess() {
    this._toastr.success('Sobre foi adicionado com sucesso', null, {
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

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  /**Getters */
  get titulo() { return this.sobreForm.get('titulo') }
  get descricao() { return this.sobreForm.get('descricao') }

}
