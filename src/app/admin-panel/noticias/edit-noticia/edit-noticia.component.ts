import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NoticiasService } from 'src/app/shared/services/noticias.service';
import { Noticia } from 'src/app/shared/models/noticia.model';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';
import { ComponentCanDeactivate } from 'src/app/shared/guards/pending-changes.guard';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { setLastUrl } from 'src/app/shared/functions/last-pagination';
import { FileSnippet } from 'src/app/web-components/common/file-uploader/FileSnippet.class';
import { FileUploaderService } from "./../../../web-components/common/file-uploader/file-uploader.service"
import { toResponseBody } from 'src/app/shared/functions/to-response-body.function';
import { ModalUploadImagemComponent } from 'src/app/web-components/common/modals/modal-upload-imagem/modal-upload-imagem.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-edit-noticia',
  templateUrl: './edit-noticia.component.html',
  styleUrls: ['./edit-noticia.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EditNoticiaComponent implements OnInit, ComponentCanDeactivate {

  noticiaForm: FormGroup
  messageApi: string
  noticia: Noticia
  httpReq: Subscription
  statusResponse: number
  modalRef: BsModalRef
  modalUpload: BsModalRef

  Noticia: Noticia
  FileSnippet: FileSnippet[] = new Array()
  UploadedFiles: FileSnippet[] = new Array()
  blobFiles: File[] = new Array()
  FormData = new FormData()

  constructor(
    private router: Router,
    private builder: FormBuilder,
    private modal: BsModalService,
    private toastr: ToastrService,
    private service: NoticiasService,
    private activatedRoute: ActivatedRoute,
    private ng2ImgMax: Ng2ImgMaxService,
    private uploaderService: FileUploaderService
  ) {
    this.initForm()
  }

  ngOnInit() {
    const title = this.activatedRoute.snapshot.params['title']
    setLastUrl(this.router.url)
    this.getData(title)
    this.getFiles('tmb_fu', title)
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.noticiaForm.dirty) {
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


  initForm() {
    this.noticiaForm = this.builder.group({
      titulo: this.builder.control('', [Validators.required]),
      descricao: this.builder.control('', [Validators.required]),
      imagemPrincipal: this.builder.control(''),
      file: this.builder.control(''),
    })
  }

  populateForm(data: Noticia) {
    this.noticiaForm.patchValue({
      titulo: data['titulo'],
      descricao: data['descricao']
    })
  }

  getData(title: string) {
    this.httpReq = this.service.getDataByTitle(title).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.Noticia = response.body['data']
      this.populateForm(this.Noticia)
      this.uploaderService.updateMainFile(this.Noticia['mainfile_index'])
    }, err => {
      this.statusResponse = err.status
      this.messageApi = err.error['message']
    })
  }

  getFiles(size: string, title: string) {
    this.httpReq = this.service.getFilesByTitle(size, title).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.FileSnippet = response.body['data']
      this.uploaderService.updateSelectedFiles(this.FileSnippet)
    }, err => {
      this.statusResponse = err.status
      this.messageApi = err.error['message']
    })
  }

  setFiles() {
    this.FileSnippet = this.uploaderService.selectedFiles
  }

  resize() {
    let length = this.FileSnippet.length
    for (let index = 0; index < length; index++) {
      if (typeof this.FileSnippet[index].file['fieldname'] == "undefined") {
        let image = this.FileSnippet[index].file
        this.ng2ImgMax.resizeImage(image, 626, 417).subscribe(result => {
          image = new File([result], result.name, {
            type: 'image/jpeg'
          })
        })
        this.blobFiles.push(image)
      } else {
        this.UploadedFiles.push(this.FileSnippet[index])
      }
    }
  }

  updateNoticia() {

    this.modalUpload = this.modal.show(ModalUploadImagemComponent)

    this.setFiles()
    this.resize()

    if (this.FileSnippet.length > 0) {
      this.blobFiles.forEach(img => {
        this.FormData.append("imagem", img, img.name)
      })
    }

    this.FormData.append("titulo", this.noticiaForm.value.titulo)
    this.FormData.append("descricao", this.noticiaForm.value.descricao)
    this.FormData.append("mainfile_index", this.uploaderService.mainFile.toString())
    this.FormData.append("uploadedfiles", JSON.stringify(this.UploadedFiles))

    this.service.updateNoticia(this.Noticia['titulo'], this.FormData).pipe(
      toResponseBody()
    ).subscribe(res => {
      this.noticiaForm.reset()
      this.router.navigate(['/admin/noticias'])
      this.modalUpload.hide()
      this.showToastrSuccess()
    }, err => {
      this.noticiaForm.reset()
      this.router.navigate(['/admin/noticias'])
      this.modalUpload.hide()
      this.showToastrError()
    })
  }

  canCancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a atualização do registro atual? Todos os dados serão perdidos." }
    this.modalRef = this.modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.noticiaForm.reset()
        this.router.navigate(['/admin/noticias'])
      }
    })
  }

  showToastrSuccess() {
    this.toastr.success('A notícia foi atualizada com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this.toastr.error('Houve um erro ao atualizar a notícia. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  /**Getters */
  get titulo() { return this.noticiaForm.get('titulo') }
  get descricao() { return this.noticiaForm.get('descricao') }

}
