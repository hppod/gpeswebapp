import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { NoticiasService } from 'src/app/shared/services/noticias.service';
import { NoticiaValidator } from "./../../../shared/validations/noticia.validator"
import { Router } from '@angular/router';
import { ModalDialogComponent } from "./../../../web-components/common/modals/modal-dialog/modal-dialog.component"
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

@Component({
  selector: 'app-create-noticia',
  templateUrl: './create-noticia.component.html',
  styleUrls: ['./create-noticia.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateNoticiaComponent implements OnInit, ComponentCanDeactivate {

  public noticiaForm: FormGroup
  modalRef: BsModalRef;
  modalUpload: BsModalRef;
  imagem: any = new Array();
  form = new FormData();
  Files: FileSnippet[] = new Array()
  blobFiles: File[] = new Array()

  constructor(
    public noticiaService: NoticiasService,
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
    this.noticiaForm = this.formBuilder.group({
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
    if (this.noticiaForm.dirty) {
      return false
    }
    return true
  }

  editorConfig = {
    editable: true,
    spellcheck: false,
    height: '10rem',
    minHeight: '8rem',
    width: '100%',
    imageEndPoint: false,
    translate: false,
    placeholder: 'Informe a descrição!',
    toolbar: [
      ['bold', 'italic', 'underline', 'strikeThrough'],
      [],
      ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent'],
      ['delete', 'removeFormat'],
      ['paragraph', 'blockquote', 'removeBlockquote', 'orderedList', 'unorderedList']
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

  postNoticia(): void {

    this.modalUpload = this._modal.show(ModalUploadImagemComponent)

    this.setFiles()
    this.resize()

    if (this.Files.length > 0) {
      this.blobFiles.forEach(img => {
        this.form.append("imagem", img, img.name);
      })
    }

    this.noticiaForm.value.imagemPrincipal = this.blobFiles[this.uploaderService.mainFile].name

    this.form.append("titulo", this.noticiaForm.value.titulo);
    this.form.append("descricao", this.noticiaForm.value.descricao);
    this.form.append("imagemPrincipal", this.noticiaForm.value.imagemPrincipal);
    this.form.append("mainfile_index", this.uploaderService.mainFile.toString())

    this.noticiaService.postNoticia(this.form).pipe(
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
    const initialState = { message: "Deseja cancelar a inserção da notícia atual?" }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.router.navigate(['/admin/noticias'])
        this.noticiaForm.reset()
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
  get titulo() { return this.noticiaForm.get('titulo') }
  get descricao() { return this.noticiaForm.get('descricao') }
  get imagemPrincipal() { return this.noticiaForm.get('imagemPrincipal') }
}
