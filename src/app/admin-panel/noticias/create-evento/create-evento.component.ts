import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { EventosService } from 'src/app/shared/services/eventos.service';
import { NoticiaValidator } from "../../../shared/validations/noticia.validator"
import { Router } from '@angular/router';
import { ModalDialogComponent } from "../../../web-components/common/modals/modal-dialog/modal-dialog.component"
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ComponentCanDeactivate } from 'src/app/shared/guards/pending-changes.guard';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { toResponseBody } from 'src/app/shared/functions/to-response-body.function';
import { ModalUploadImagemComponent } from 'src/app/web-components/common/modals/modal-upload-imagem/modal-upload-imagem.component';
import { setLastUrl } from 'src/app/shared/functions/last-pagination';
import { FileSnippet } from 'src/app/web-components/common/file-uploader/FileSnippet.class';
import { FileUploaderService } from 'src/app/web-components/common/file-uploader/file-uploader.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-create-evento',
  templateUrl: './create-evento.component.html',
  styleUrls: ['./create-evento.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateEventoComponent implements OnInit, ComponentCanDeactivate {

  public eventoForm: FormGroup
  modalRef: BsModalRef;
  modalUpload: BsModalRef;
  imagem: any = new Array();
  form = new FormData();
  Files: FileSnippet[] = new Array()
  blobFiles: File[] = new Array()

  constructor(
    public eventoService: EventosService,
    private formBuilder: FormBuilder,
    private _modal: BsModalService,
    private router: Router,
    private _toastr: ToastrService,
    private _unique: NoticiaValidator,
    private ng2ImgMax: Ng2ImgMaxService,
    private uploaderService: FileUploaderService
  ) { }

  ngOnInit(): void {
    setLastUrl(this.router.url)
    this.eventoForm = this.formBuilder.group({
      titulo: this.formBuilder.control('', [Validators.required], this._unique.checkUniqueTitulo()),
      descricao: this.formBuilder.control('', [Validators.required]),
      files: [''],
      imagem: [''],
      status: this.formBuilder.control(true),
      imagemPrincipal: this.formBuilder.control(null)
    })
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.eventoForm.dirty) {
      return false
    }
    return true
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

  configModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false
  }

  setFiles() {
    this.Files = this.uploaderService.selectedFiles
  }

  resize() {
    let length = this.Files.length
    for (let index = 0; index < length; index++) {
      let image = this.Files[index].file
      this.ng2ImgMax.resizeImage(image, 626, 417).subscribe(result => {
        image = new File([result], result.name, {
          type: 'image/jpeg'
        })
      })
      this.blobFiles.push(image)
    }
  }

  postEvento(): void {

    this.modalUpload = this._modal.show(ModalUploadImagemComponent)

    this.setFiles()
    this.resize()

    if (this.Files.length > 0) {
      this.blobFiles.forEach(img => {
        this.form.append("imagem", img, img.name);
      })
    }

    this.eventoForm.value.imagemPrincipal = this.blobFiles[this.uploaderService.mainFile].name

    this.form.append("titulo", this.eventoForm.value.titulo);
    this.form.append("descricao", this.eventoForm.value.descricao);
    this.form.append("imagemPrincipal", this.eventoForm.value.imagemPrincipal);
    this.form.append("mainfile_index", this.uploaderService.mainFile.toString())

    this.eventoService.postEvento(this.form).pipe(
      toResponseBody()
    ).subscribe(res => {
      this.eventoForm.reset()
      this.router.navigate(['/admin/noticias'])
      this.modalUpload.hide()
      this.showToastrSuccess()
    }, err => {
      this.eventoForm.reset()
      this.router.navigate(['/admin/noticias'])
      this.modalUpload.hide()
      this.showToastrError()
    })
  }

  canCancel() {
    const initialState = { message: "Deseja cancelar a inserção da notícia atual?" }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.router.navigate(['/admin/noticias'])
        this.eventoForm.reset()
      }
    })
  }

  showToastrSuccess() {
    this._toastr.success('A notícia foi adicionada com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this._toastr.error('Houve um erro ao adicionar a notícia. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  /**Getters */
  get titulo() { return this.eventoForm.get('titulo') }
  get descricao() { return this.eventoForm.get('descricao') }
  get imagemPrincipal() { return this.eventoForm.get('imagemPrincipal') }
}
