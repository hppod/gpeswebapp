import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { EventosService } from 'src/app/shared/services/eventos.service';
import { Evento } from 'src/app/shared/models/evento.model';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';
import { ComponentCanDeactivate } from 'src/app/shared/guards/pending-changes.guard';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { setLastUrl } from 'src/app/shared/functions/last-pagination';
import { FileSnippet } from 'src/app/web-components/common/file-uploader/FileSnippet.class';
import { FileUploaderService } from "../../../web-components/common/file-uploader/file-uploader.service"
import { toResponseBody } from 'src/app/shared/functions/to-response-body.function';
import { ModalUploadImagemComponent } from 'src/app/web-components/common/modals/modal-upload-imagem/modal-upload-imagem.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-atualizar-evento',
  templateUrl: './atualizar-evento.component.html',
  styleUrls: ['./atualizar-evento.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AtualizarEventoComponent implements OnInit, ComponentCanDeactivate {

  eventoForm: FormGroup
  messageApi: string
  evento: Evento
  httpReq: Subscription
  statusResponse: number
  modalRef: BsModalRef
  modalUpload: BsModalRef

  Evento: Evento
  FileSnippet: FileSnippet[] = new Array()
  UploadedFiles: FileSnippet[] = new Array()
  blobFiles: File[] = new Array()
  FormData = new FormData()

  constructor(
    private router: Router,
    private builder: FormBuilder,
    private modal: BsModalService,
    private toastr: ToastrService,
    private service: EventosService,
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
    // this.getFiles('tmb_fu', title)
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


  initForm() {
    this.eventoForm = this.builder.group({
      titulo: this.builder.control('', [Validators.required]),
      descricao: this.builder.control('', [Validators.required]),
      date: this.builder.control('', [Validators.required])
      // imagemPrincipal: this.builder.control(''),
      // file: this.builder.control(''),
    })
  }

  populateForm(data: Evento) {
    this.eventoForm.patchValue({
      titulo: data['titulo'],
      descricao: data['descricao'],
      date: this.formatDate(data['date'])
    })
  }

  formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + (d.getDate() + 1);
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  getData(title: string) {
    this.httpReq = this.service.getEventoByTitle(title, 'authenticated').subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.Evento = response.body['data']
      this.populateForm(this.Evento)
      this.uploaderService.updateMainFile(this.Evento['mainfile_index'])
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

  updateEvento() {
    this.httpReq = this.service.updateEvento(this.Evento['titulo'], this.eventoForm.value).subscribe(response => {
      this.eventoForm.reset()
      this.router.navigate(['/admin/eventos'])
      this.showToastrSuccess()
    }, err => {
      this.eventoForm.reset()
      this.router.navigate(['/admin/eventos'])
      this.showToastrError()
    })
  }

  canCancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a atualização do evento atual? Todos os dados serão perdidos." }
    this.modalRef = this.modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.eventoForm.reset()
        this.router.navigate(['/admin/eventos'])
      }
    })
  }

  showToastrSuccess() {
    this.toastr.success('O evento foi atualizado com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this.toastr.error('Houve um erro ao atualizar o evento. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  /**Getters */
  get titulo() { return this.eventoForm.get('titulo') }
  get descricao() { return this.eventoForm.get('descricao') }
  get date() { return this.eventoForm.get('date') }

}
