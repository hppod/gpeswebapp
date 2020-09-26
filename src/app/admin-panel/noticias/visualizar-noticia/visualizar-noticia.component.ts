import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Noticia } from 'src/app/shared/models/noticia.model';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { NoticiasService } from 'src/app/shared/services/noticias.service';
import { AuthenticationService } from "./../../../shared/services/authentication.service"
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';
import { ModalLoadingComponent } from 'src/app/web-components/common/modals/modal-loading/modal-loading.component';
import { AsiloWebApi } from 'src/app/app.api';

@Component({
  selector: 'app-visualizar-noticia',
  templateUrl: './visualizar-noticia.component.html',
  styleUrls: ['./visualizar-noticia.component.css']
})
export class VisualizarNoticiaComponent implements OnInit {

  private httpReq: Subscription

  noticia: Noticia
  imagens: any
  modalRef: BsModalRef
  statusResponse: number
  messageApi: string

  isLoading: boolean
  hasImages: boolean = false

  constructor(
    private _service: NoticiasService,
    private _activatedRoute: ActivatedRoute,
    private _auth: AuthenticationService,
    private modal: BsModalService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  configLoadingModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    initialState: {
      message: "Excluindo notícia...",
      withFooter: false
    }
  }

  ngOnInit() {
    const titulo = this._activatedRoute.snapshot.params['title']

    this.getNoticiaWithTitle(titulo)
    if (this.hasImages) {
      this.bringUrlImage()
    }
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  get isAdmin() {
    return this._auth.isAdmin
  }

  getNoticiaWithTitle(title: string) {
    this.isLoading = true
    this.httpReq = this._service.getNoticiaByTitle(title, 'authenticated').subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.noticia = response.body['data']
      this.isLoading = false
      this.imagens = this.noticia.file
      if (this.noticia.file.length > 0) {
        this.hasImages = true
      }
      this.bringUrlImage()
    }, err => {
      this.messageApi = err.error['message']
      this.isLoading = false
    })
  }

  bringUrlImage() {
    for (let index = 0; index < this.imagens.length; index++) {
      let imagem = this.imagens[index]
      this.imagens[index].src = `${AsiloWebApi}/public/download/thumbnail_gallery/${imagem['filename']}`
    }
  }

  canDelete(title: string, id: string) {
    const initialState = { message: `Deseja excluir a noticia "${title}" ?` }
    this.modalRef = this.modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.modalRef = this.modal.show(ModalLoadingComponent, this.configLoadingModal)
        this._service.deleteNoticia(id).subscribe(response => {
          this.router.navigate(['/admin/noticias/'])
          this.modalRef.hide()
          this.showToastrSuccess()
        }, err => {
          this.router.navigate(['/admin/noticias/'])
          this.modalRef.hide()
          this.showToastrError()
        })
      }
    })
  }

  showToastrSuccess() {
    this.toastr.success('A notícia foi excluida com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this.toastr.error('Houve um erro ao excluir a notícia. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }
}
