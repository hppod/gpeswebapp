import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DragulaService } from 'ng2-dragula';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Sobre } from "../../../shared/models/sobre.model"
import { SobreService } from '../../../shared/services/sobre.service';
import { AuthenticationService } from "../../../shared/services/authentication.service"
import { ModalDialogComponent } from "../../../web-components/common/modals/modal-dialog/modal-dialog.component"
import { ModalLoadingComponent } from "../../../web-components/common/modals/modal-loading/modal-loading.component"
import { scrollPageToTop } from "../../../shared/functions/scroll-top"
import { checkUrlAndSetFirstPage, setLastUrl, getLastPage, setLastPage } from 'src/app/shared/functions/last-pagination';

@Component({
  selector: 'app-sobre',
  templateUrl: './todos-sobre.component.html',
  styleUrls: ['./todos-sobre.component.css']
})
export class SobreComponent implements OnInit, OnDestroy {

  private httpReq: Subscription

  sobre: Sobre[]

  principalModel: any;
  p: number = 1
  total: number
  limit: number
  isLoading: boolean
  messageApi: string
  statusResponse: number
  modalRef: BsModalRef
  modalOrder: BsModalRef
  sobreForm: FormGroup

  selectOptionPrincipal: Sobre[] = new Array()

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

  MANY_ITEMS = "SOBRE";
  subs = new Subscription();

  constructor(
    private _router: Router,
    private _builder: FormBuilder,
    private _service: SobreService,
    private _auth: AuthenticationService,
    private _modal: BsModalService,
    private _toastr: ToastrService,
    private _dragula: DragulaService
  ) {
    this.subs.add(this._dragula.dropModel(this.MANY_ITEMS)
      .subscribe(({ targetModel }) => {
        this.sobre = targetModel
        for (let index = 0; index < this.sobre.length; index++) {
          this.sobre[index].ordenacao = index + 1
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

    this.getSobreWithParams()
  }

  ngOnDestroy() {
    setLastPage(this.p)
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
    this.subs.unsubscribe();
  }

  get isAdmin() {
    return this._auth.isAdmin
  }

  getSobreWithParams() {
    this._service.params = this._service.params.set('limit', '10')
    this.isLoading = true
    this.httpReq = this._service.getSobreWithParams('authenticated').subscribe(response => {
      this.statusResponse = response.status

      if (response.status == 200) {
        this.messageApi = response.body['message']
        this.sobre = response.body['data']
        this.p = response.body['page']
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
    this.sobre = null
    scrollPageToTop(page)
    this._service.params = this._service.params.set('page', page.toString())
    this.getSobreWithParams()
  }

  showToastrSuccess() {
    this._toastr.success('O sobre foi excluído com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this._toastr.error('Houve um erro ao excluir o sobre. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showEllipsisInTheText(text: string, limit: number): boolean {
    return text.length > limit;
  }

  canDelete(title: string, _id: string) {
    let posicao
    for (let position = 0; position < this.sobre.length; position++) {
      if (this.sobre[position]._id == _id) {
        posicao = position
      }
    }

    const initialState = { message: `Deseja excluir o "${title}" ?` }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        if (this.sobre[posicao]['file'] != null) {
          let filename = this.sobre[posicao]['file']['filename']
          this.modalRef = this._modal.show(ModalLoadingComponent, this.configLoadingModal)
          this._service.deleteParams = this._service.deleteParams.set('filename', filename)
          this._service.deleteParams = this._service.deleteParams.set('_id', _id)
          this.httpReq = this._service.deleteSobre(_id).subscribe(response => {
            this._service.params = this._service.params.set('columnSort', 'ordenacao')
            this._service.params = this._service.params.set('valueSort', 'ascending')
            this._service.params = this._service.params.set('page', '1')
            this.reorderAfterDelete(this.sobre[posicao].ordenacao)
            this._service.deleteParams = new HttpParams()
            this.modalRef.hide()
            this.showToastrSuccess()
          }, err => {
            this._service.deleteParams = new HttpParams()
            this.getSobreWithParams()
            this.modalRef.hide()
            this.showToastrError()
          })
        } else {
          this.modalRef = this._modal.show(ModalLoadingComponent, this.configLoadingModal)
          this._service.deleteSobre(_id).subscribe(response => {
            this._service.params = this._service.params.set('columnSort', 'ordenacao')
            this._service.params = this._service.params.set('valueSort', 'ascending')
            this._service.params = this._service.params.set('page', '1')
            this.reorderAfterDelete(this.sobre[posicao].ordenacao)
            this.modalRef.hide()
            this.showToastrSuccess()
          }, err => {
            this.getSobreWithParams()
            this.modalRef.hide()
            this.showToastrError()
          })
        }
      }
    })
  }

  reorderAfterDelete(posicao) {

    for (posicao; posicao < this.sobre.length; posicao++) {
      this.sobre[posicao].ordenacao = posicao
    }

    this.sobre.forEach(element => {
      this.httpReq = this._service.updateOrder(element.titulo, element).subscribe(response => {
        this.statusResponse = response.status
        this.messageApi = response.body['message']
      }, err => {
        this.statusResponse = err.status
        this.messageApi = err.body['message']
      })
    })

    this.getSobreWithParams()
  }

  getSobre() {
    this._service.params = this._service.params.set('limit', 'null')
    this.isLoading = true
    this.httpReq = this._service.getSobreWithParams('authenticated').subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.sobre = response.body['data']
      this.isLoading = false
    }, err => {
      this.statusResponse = err.status
      this.messageApi = err.body['message']
      this.isLoading = false
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalOrder = this._modal.show(template, this.configOrderModal);
    this.getSobre()
  }

  Cancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a ordenação? Todas as alterações serão perdidas." }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.modalRef.hide()
        this.modalOrder.hide()
        this.getSobreWithParams()
      }
    })
  }

  saveNewOrder() {
    this.sobre.forEach(element => {
      this.httpReq = this._service.updateOrder(element.titulo, element).subscribe(response => {
        this.modalOrder.hide()
        this.showToastrSuccessEditar('A ordenação foi alterada com sucesso')
      }, err => {
        this.modalOrder.hide()
        this.showToastrErrorEditar('Houve um erro ao alterar a ordenação. Tente novamente.')
      })
    })
  }

  initForm() {
    this.sobreForm = this._builder.group({
      principal: this._builder.control(null)
      // file: this._builder.control(null, validatorFileType())
    })
  }

  saveNewPrincipal() {    
    this.httpReq = this._service.updatePrincipal(this.principalModel).subscribe(response => {
      this.modalOrder.hide()
      this.showToastrSuccessEditar('O principal foi alterado com sucesso')
    }, err => {
      this.modalOrder.hide()
      this.showToastrErrorEditar('Houve um erro ao alterar o principal. Tente novamente.')
    })
    
  }

  showToastrSuccessEditar(mensagem: string) {
    this._toastr.success(mensagem, null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrErrorEditar(mensagem: string) {
    this._toastr.error(mensagem, null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

}
