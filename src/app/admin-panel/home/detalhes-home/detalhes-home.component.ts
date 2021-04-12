import { Component, OnDestroy, OnInit } from '@angular/core';
import { Home } from "./../../../shared/models/home.model"
import { HomeService } from "./../../../shared/services/home.service";
import { AuthenticationService } from "./../../../shared/services/authentication.service"
import { Subscription } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal"
import { ModalDialogComponent } from "./../../../web-components/common/modals/modal-dialog/modal-dialog.component"
import { ModalLoadingComponent } from "./../../../web-components/common/modals/modal-loading/modal-loading.component"
import { ToastrService } from "ngx-toastr"

@Component({
  selector: 'app-detalhes-home',
  templateUrl: './detalhes-home.component.html',
  styleUrls: ['./detalhes-home.component.css']
})
export class DetalhesHomeComponent implements OnInit, OnDestroy {

  private httpReq: Subscription;

  home: Home;

  modalRef: BsModalRef;
  statusResponse: number;
  messageApi: string;
  isLoading: boolean;
  homeForReorder: Home[];
  total: number;

  configLoadingModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    initialState: {
      message: "Excluindo registro...",
      withFooter: false
    }
  }

  constructor(
    private _service: HomeService,
    private _activatedRoute: ActivatedRoute,
    private _auth: AuthenticationService,
    private _router: Router,
    private _modal: BsModalService,
    private _toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const titulo = this._activatedRoute.snapshot.params['title']

    this.getHomeWithTitle(titulo)
    this.getHomeWithParams()
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  get isAdmin() {
    return this._auth.isAdmin
  }

  getHomeWithTitle(title: string) {
    this.isLoading = true
    this.httpReq = this._service.getHomeByTitle(title).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.home = response.body['data']
      this.isLoading = false
    }, err => {
      this.messageApi = err.error['message']
      this.isLoading = false
    })
  }

  canDelete(title: string, _id: string) {
    const initialState = { message: `Deseja excluir o "${title}" ?` }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.modalRef = this._modal.show(ModalLoadingComponent, this.configLoadingModal)
        this._service.deleteHome(_id).subscribe(response => {
          this.reorderAfterDelete(this.home.ordenacao)
          this._router.navigate(['/admin/home'])
          this.modalRef.hide()
          this.showToastrSuccess()
        }, err => {
          this._router.navigate(['/admin/home'])
          this.modalRef.hide()
          this.showToastrError()
        })
      }
    })
  }

  showToastrSuccess() {
    this._toastr.success('A informação da Home foi excluída com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this._toastr.error('Houve um erro ao excluir a informação da Home. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  reorderAfterDelete(posicao) {

    for (posicao; posicao < this.homeForReorder.length; posicao++) {
      this.homeForReorder[posicao].ordenacao = posicao
    }

    this.homeForReorder.forEach(element => {
      this.httpReq = this._service.updateHome(element.titulo, element).subscribe(response => {
        this.statusResponse = response.status
        this.messageApi = response.body['message']
      }, err => {
        this.statusResponse = err.status
        this.messageApi = err.body['message']
      })
    })
  }

  getHomeWithParams() {
    this.httpReq = this._service.getHomeWithParams('authenticated').subscribe(response => {
      this.statusResponse = response.status

      if (response.status == 200) {
        this.messageApi = response.body['message']
        this.homeForReorder = response.body['data']
        this.total = response.body['count']
      }
    }, err => {
      this.messageApi = err
    })
  }

}
