import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DragulaService } from 'ng2-dragula';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Home } from "../../../shared/models/home.model"
import { HomeService } from '../../../shared/services/home.service';
import { AuthenticationService } from "../../../shared/services/authentication.service"
import { ModalDialogComponent } from "../../../web-components/common/modals/modal-dialog/modal-dialog.component"
import { ModalLoadingComponent } from "../../../web-components/common/modals/modal-loading/modal-loading.component"
import { scrollPageToTop } from "../../../shared/functions/scroll-top"
import { checkUrlAndSetFirstPage, setLastUrl, getLastPage, setLastPage } from 'src/app/shared/functions/last-pagination';

@Component({
  selector: 'app-todos-home',
  templateUrl: './todos-home.component.html',
  styleUrls: ['./todos-home.component.css']
})
export class TodosHomeComponent implements OnInit, OnDestroy {

  private httpReq: Subscription;

  home: Home[];

  p: number = 1
  total: number
  limit: number
  isLoading: boolean
  messageApi: string
  statusResponse: number
  modalRef: BsModalRef
  modalOrder: BsModalRef
  homeForm: FormGroup

  configLoadingModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    initialState: {
      message: "Excluindo registro...",
      withFooter: false
    }
  }

  configOrderModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false
  }

  MANY_ITEMS = "HOME";
  subs = new Subscription();

  constructor(
    private _router: Router,
    private _service: HomeService,
    private _auth: AuthenticationService,
    private _modal: BsModalService,
    private _toastr: ToastrService,
    private _dragula: DragulaService
  ) {
    this.subs.add(this._dragula.dropModel(this.MANY_ITEMS)
      .subscribe(({ targetModel }) => {
        this.home = targetModel;
        for (let index = 0; index < this.home.length; index++) {
          this.home[index].ordenacao = index + 1;
        }
      })
    );
    checkUrlAndSetFirstPage(this._router.url);
  }

  ngOnInit(): void {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    setLastUrl(this._router.url);

    this._service.params = this._service.params.set('columnSort', 'ordenacao');
    this._service.params = this._service.params.set('valueSort', 'ascending');
    this._service.params = this._service.params.set('page', getLastPage());

    this.getHomeWithParams();
  }

  ngOnDestroy() {
    setLastPage(this.p);
    if (this.httpReq) {
      this.httpReq.unsubscribe();
    }
    this.subs.unsubscribe();
  }

  get isAdmin() {
    return this._auth.isAdmin;
  }

  getHomeWithParams() {
    this._service.params = this._service.params.set('limit', '10');
    this.isLoading = true;
    this.httpReq = this._service.getHomeWithParams('authenticated').subscribe(response => {
      this.statusResponse = response.status;
      if (this.statusResponse == 200) {
        this.messageApi = response.body['message'];
        this.home = response.body['data'];
        this.p = response.body['page'];
        this.total = response.body['count'];
        this.limit = response.body['limit'];
      }
      this.isLoading = false;
    }, err => {
      this.messageApi = err;
      this.isLoading = false;
    })
  }

  getPage(page: number) {
    this.home = null;
    scrollPageToTop(page);
    this._service.params = this._service.params.set('page', page.toString());
    this.getHomeWithParams();
  }

  showEllipsisInTheText(text: string, limit: number): boolean {
    return text.length > limit;
  }

  getHome() {
    this._service.params = this._service.params.set('limit', 'null')
    this.isLoading = true;
    this.httpReq = this._service.getHomeWithParams('authenticated').subscribe(response => {
      this.statusResponse = response.status;
      this.messageApi = response.body['message'];
      this.home = response.body['data'];
      this.isLoading = false;
    }, err => {
      this.statusResponse = err.status;
      this.messageApi = err.body['message'];
      this.isLoading = false;
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalOrder = this._modal.show(template, this.configOrderModal);
    this.getHome();
  }

  closeModal(modalId?: number){
    this._modal.hide(modalId);
  }

  canCancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a ordenação? Todas as alterações serão perdidas." }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState, id: 1 })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.modalRef.hide();
        this.modalOrder.hide();
        this.getHomeWithParams();
      } else {
        this.closeModal(1);
      }
    })
  }

  saveNewOrder() {
    this.home.forEach(element => {
      this.httpReq = this._service.updateHome(element.titulo, element).subscribe(response => {
        this.modalOrder.hide();
        this.getHomeWithParams();
        this.showToastrSuccessEditar();
      }, err => {
        this.modalOrder.hide();
        this.getHomeWithParams();
        this.showToastrErrorEditar();
      })
    })
  }

  showToastrSuccessEditar() {
    this._toastr.success('A ordenação foi alterada com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrErrorEditar() {
    this._toastr.error('Houve um erro ao alterar a ordenação. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  canDelete(title: string, _id: string) {
    let posicao
    for (let position = 0; position < this.home.length; position++) {
      if (this.home[position]._id == _id) {
        posicao = position;
      }
    }

    const initialState = { message: `Deseja excluir o "${title}" ?` }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState });
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.modalRef = this._modal.show(ModalLoadingComponent, this.configLoadingModal);
        this._service.deleteHome(_id).subscribe(response => {
          this._service.params = this._service.params.set('columnSort', 'ordenacao');
          this._service.params = this._service.params.set('valueSort', 'ascending');
          this._service.params = this._service.params.set('page', '1');
          this.reorderAfterDelete(this.home[posicao].ordenacao);
          this.modalRef.hide();
          this.showToastrSuccess();
        }, err => {
          this.getHomeWithParams();
          this.modalRef.hide();
          this.showToastrError();
        })
      }
    })
  }

  reorderAfterDelete(posicao) {

    for (posicao; posicao < this.home.length; posicao++) {
      this.home[posicao].ordenacao = posicao;
    }

    this.home.forEach(element => {
      this.httpReq = this._service.updateHome(element.titulo, element).subscribe(response => {
        this.statusResponse = response.status;
        this.messageApi = response.body['message'];
      }, err => {
        this.statusResponse = err.status;
        this.messageApi = err.body['message'];
      })
    })
    this.getHomeWithParams();
  }

  showToastrSuccess() {
    this._toastr.success('Informação da Home foi excluída com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this._toastr.error('Houve um erro ao excluir informação da Home. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

}
