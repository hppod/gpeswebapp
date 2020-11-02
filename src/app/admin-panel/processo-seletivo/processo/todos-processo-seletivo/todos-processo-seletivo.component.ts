import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DragulaService } from 'ng2-dragula';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ProcessoSeletivo } from "../../../../shared/models/processo-seletivo.model";
import { ProcessoSeletivoService } from '../../../../shared/services/processo-seletivo.service';
import { AuthenticationService } from "../../../../shared/services/authentication.service"
import { ModalDialogComponent } from "./../../../../web-components/common/modals/modal-dialog/modal-dialog.component"
import { ModalLoadingComponent } from "./../../../../web-components/common/modals/modal-loading/modal-loading.component"
import { scrollPageToTop } from "./../../../../shared/functions/scroll-top"
import { checkUrlAndSetFirstPage, setLastUrl, getLastPage, setLastPage } from 'src/app/shared/functions/last-pagination';

@Component({
  selector: 'app-todos-processo-seletivo',
  templateUrl: './todos-processo-seletivo.component.html',
  styleUrls: ['./todos-processo-seletivo.component.css']
})
export class TodosProcessoSeletivoComponent implements OnInit, OnDestroy {

  private httpReq: Subscription

  processoSeletivo: ProcessoSeletivo[]

  page: number = 1
  total: number
  limit: number
  isLoading: boolean
  messageApi: string
  statusResponse: number
  modalRef: BsModalRef
  modalOrder: BsModalRef

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

  MANY_ITEMS = "PROCESSOSELETIVO";
  subs = new Subscription();

  constructor(
    private _router: Router,
    private _service: ProcessoSeletivoService,
    private _auth: AuthenticationService,
    private _modal: BsModalService,
    private _toastr: ToastrService,
    private _dragula: DragulaService
  ) {
    this.subs.add(this._dragula.dropModel(this.MANY_ITEMS)
      .subscribe(({ targetModel }) => {
        this.processoSeletivo = targetModel
        for (let index = 0; index < this.processoSeletivo.length; index++) {
          this.processoSeletivo[index].ordenacao = index + 1
        }
      })
    );
    checkUrlAndSetFirstPage(this._router.url)
  }

  ngOnInit() {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false
    setLastUrl(this._router.url)

    this._service.params = this._service.params.set('columnSort', 'ordenacao')
    this._service.params = this._service.params.set('valueSort', 'ascending')
    this._service.params = this._service.params.set('page', getLastPage())

    this.getProcessoSeletivoWithParams()
  }

  ngOnDestroy() {
    setLastPage(this.page)
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
    this.subs.unsubscribe();
  }

  get isAdmin() {
    return this._auth.isAdmin
  }

  getProcessoSeletivoWithParams() {
    this._service.params = this._service.params.set('limit', '10')
    this.isLoading = true
    this.httpReq = this._service.getProcessoSeletivoWithParams('authenticated').subscribe(response => {
      this.statusResponse = response.status

      if (response.status == 200) {
        this.messageApi = response.body['message']
        this.processoSeletivo = response.body['data']
        this.page = response.body['page']
        this.total = response.body['count']
        this.limit = response.body['limit']
      }

      this.isLoading = false
    }, err => {
      this.messageApi = err
      this.isLoading = false
    })
  }

  getPage(page: number) {
    this.processoSeletivo = null
    scrollPageToTop(page)
    this._service.params = this._service.params.set('page', page.toString())
    this.getProcessoSeletivoWithParams()
  }

  showEllipsisInTheText(text: string, limit: number): boolean {
    return text.length > limit;
  }

  getProcessoSeletivo() {
    this._service.params = this._service.params.set('limit', 'null')
    this.isLoading = true
    this.httpReq = this._service.getProcessoSeletivoWithParams('authenticated').subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.processoSeletivo = response.body['data']
      this.isLoading = false
    }, err => {
      this.statusResponse = err.status
      this.messageApi = err.body['message']
      this.isLoading = false
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalOrder = this._modal.show(template, this.configOrderModal);
    this.getProcessoSeletivo()
  }

  closeModal(modalId?: number){
    this._modal.hide(modalId);
  }

  cancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a ordenação? Todas as alterações serão perdidas." }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState, id: 1 })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.modalRef.hide()
        this.modalOrder.hide()
        this.getProcessoSeletivoWithParams()
      } else {
        this.closeModal(1)
      }
    })
  }

  saveNewOrder() {
    this.processoSeletivo.forEach(element => {
      this.httpReq = this._service.updateOrder(element.titulo, element).subscribe(response => {
        this.modalOrder.hide()
        this.getProcessoSeletivoWithParams()
        this.showToastrSuccessEditar()
      }, err => {
        this.modalOrder.hide()
        this.getProcessoSeletivoWithParams()
        this.showToastrErrorEditar()
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
    for (let position = 0; position < this.processoSeletivo.length; position++) {
      if (this.processoSeletivo[position]._id == _id) {
        posicao = position
      }
    }

    const initialState = { message: `Deseja excluir o "${title}" ?` }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
          this.modalRef = this._modal.show(ModalLoadingComponent, this.configLoadingModal)
          this._service.delete(_id).subscribe(response => {
            this._service.params = this._service.params.set('columnSort', 'ordenacao')
            this._service.params = this._service.params.set('valueSort', 'ascending')
            this._service.params = this._service.params.set('page', '1')
            this.reorderAfterDelete(this.processoSeletivo[posicao].ordenacao)
            this.getProcessoSeletivoWithParams()
            this.modalRef.hide()
            this.showToastrSuccess()
          }, err => {
            this.getProcessoSeletivoWithParams()
            this.modalRef.hide()
            this.showToastrError()
          })
      }
    })
  }

  showToastrSuccess() {
    this._toastr.success('O processo seletivo foi excluído com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this._toastr.error('Houve um erro ao excluir o processo seletivo. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  reorderAfterDelete(posicao) {

    for (posicao; posicao < this.processoSeletivo.length; posicao++) {
      this.processoSeletivo[posicao].ordenacao = posicao
    }

    this.processoSeletivo.forEach(element => {
      this.httpReq = this._service.updateOrder(element.titulo, element).subscribe(response => {
        this.statusResponse = response.status
        this.messageApi = response.body['message']
      }, err => {
        this.statusResponse = err.status
        this.messageApi = err.body['message']
      })
    })

    this.getProcessoSeletivoWithParams()
  }

}
