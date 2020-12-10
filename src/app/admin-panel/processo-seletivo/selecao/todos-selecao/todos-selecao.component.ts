import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Selecao } from 'src/app/shared/models/selecao.model';
import { ProcessoSeletivoService } from '../../../../shared/services/processo-seletivo.service';
import { AuthenticationService } from "../../../../shared/services/authentication.service"
import { ModalDialogComponent } from "./../../../../web-components/common/modals/modal-dialog/modal-dialog.component"
import { ModalLoadingComponent } from "./../../../../web-components/common/modals/modal-loading/modal-loading.component"
import { scrollPageToTop } from "./../../../../shared/functions/scroll-top"
import { checkUrlAndSetFirstPage, setLastUrl, getLastPage, setLastPage } from 'src/app/shared/functions/last-pagination';



@Component({
  selector: 'app-todos-selecao',
  templateUrl: './todos-selecao.component.html',
  styleUrls: ['./todos-selecao.component.css']
})
export class TodosSelecaoComponent implements OnInit, OnDestroy {

  private httpReq: Subscription

  selecao: Selecao[];

  page: number = 1;
  total: number;
  limit: number;
  isLoading: boolean;
  messageApi: string;
  statusResponse: number;
  sortedCollection: any[];
  sortSelectedItem: any;
  modalRef: BsModalRef;

  headTableItems: any[] = [
    {
      option: 'Titulo',
      param: 'titulo'
    },
    {
      option: 'Data Início',
      param: 'dataInicio'
    },
    {
      option: 'Data Fim',
      param: 'dataFim'
    }
  ]

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

  subs = new Subscription();

  constructor(
    private _router: Router,
    private _service: ProcessoSeletivoService,
    private _auth: AuthenticationService,
    private _modal: BsModalService,
    private _toastr: ToastrService,
  ) {
    checkUrlAndSetFirstPage(this._router.url)
  }

  ngOnInit() {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false
    setLastUrl(this._router.url)

    this.sortSelectedItem = this.headTableItems[1]

    this._service.params = this._service.params.set('columnSort', 'dataInicio')
    this._service.params = this._service.params.set('valueSort', 'descending')
    this._service.params = this._service.params.set('page', getLastPage())
    this._service.params = this._service.params.set('limit', '10')

    this.getSelecaoWithParams()
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

  getSelecaoWithParams() {
    this.isLoading = true
    this.httpReq = this._service.getSelecaoWithParams().subscribe(response => {
      this.statusResponse = response.status
      if (response.status == 200) {
        this.messageApi = response.body['message']
        this.selecao = response.body['data']
        this.page = response.body['page']
        this.total = response.body['count']
        this.limit = response.body['limit']
        this.selecao.forEach(element => {
          let dataFim = this.formatDate(element.dataFim);
          let dataAtual = this.formatDate(new Date());
          if (element.status == true && dataFim < dataAtual) {
            element.status = false
            this.httpReq = this._service.updateSelecao(element.titulo, element).subscribe(response => {
              this.messageApi = response.body['message'];
            }, err => {
              this.messageApi = err;
            })

          }
        })
      }
      this.isLoading = false
    }, err => {
      this.messageApi = err
      this.isLoading = false
    })
  }

  formatDate(date) {
    if (date != null) {
      let MesString
      let DiaString
      let data = new Date(date)
      let dia = data.getUTCDate()
      let mes = data.getUTCMonth() + 1
      let ano = data.getUTCFullYear()

      if (mes < 10) {
        MesString = '0' + mes.toString()
      } else {
        MesString = mes.toString()
      }
      if (dia < 10) {
        DiaString = '0' + dia.toString()
      } else {
        DiaString = dia.toString()
      }
      return [ano, MesString, DiaString].join('-');
    }
    return null
  }

  getPage(page: number) {
    this.selecao = null
    scrollPageToTop(page)
    this._service.params = this._service.params.set('page', page.toString())
    this.getSelecaoWithParams()
  }

  onClickSortTable(item: any) {
    this.selecao = null
    this.sortSelectedItem = item
    this._service.params = this._service.params.set('columnSort', item['param'])
    if (this._service.params.get('valueSort') == 'descending') {
      this._service.params = this._service.params.set('valueSort', 'ascending')
    } else {
      this._service.params = this._service.params.set('valueSort', 'descending')
    }
    this.getSelecaoWithParams()
  }


  showEllipsisInTheText(text: string, limit: number): boolean {
    return text.length > limit;
  }

  canDelete(title: string, _id: string) {
    const initialState = { message: `Deseja excluir o "${title}" ?` }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.modalRef = this._modal.show(ModalLoadingComponent, this.configLoadingModal)
        this._service.deleteSelecao(_id).subscribe(response => {
          this._service.params = this._service.params.set('columnSort', 'dataInicio')
          this._service.params = this._service.params.set('valueSort', 'descending')
          this._service.params = this._service.params.set('page', '1')
          this.getSelecaoWithParams()
          this.modalRef.hide()
          this.showToastrSuccess()
        }, err => {
          this.getSelecaoWithParams()
          this.modalRef.hide()
          this.showToastrError()
        })
      }
    })
  }

  showToastrSuccess() {
    this._toastr.success('A seleção foi excluída com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this._toastr.error('Houve um erro exluir a Seleção. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

}
