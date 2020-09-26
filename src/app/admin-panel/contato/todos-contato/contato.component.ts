import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContatoService } from './../../../shared/services/contato.service';
import { AuthenticationService } from "./../../../shared/services/authentication.service"
import { Contato } from './../../../shared/models/contato.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';
import { ModalLoadingComponent } from 'src/app/web-components/common/modals/modal-loading/modal-loading.component';
import { HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { scrollPageToTop } from 'src/app/shared/functions/scroll-top';
import { checkUrlAndSetFirstPage, setLastUrl, getLastPage, setLastPage } from 'src/app/shared/functions/last-pagination';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoAdminComponent implements OnInit, OnDestroy {

  private httpReq: Subscription

  // Array principal
  contatos: Contato[]

  // Page Control
  isLoading: boolean
  messageApi: string
  statusResponse: number

  // Pagination Control
  dropdownFilterSelectedItem: any
  filterCategory: boolean = false
  sortSelectedItem: any
  p: number = 1
  total: number
  limit: number

  //Others
  modalRef: BsModalRef

  configLoadingModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    initialState: {
      message: "Excluindo contato...",
      withFooter: false
    }
  }

  dropdownFilterMenuItems: any[] = [
    {
      option: 'Endereço',
      param: 'Endereço',
    },
    {
      option: 'Telefone',
      param: 'Telefone',
    },
    {
      option: 'Email',
      param: 'Email',
    },
    {
      option: 'Rede Social',
      param: 'Rede Social',
    }
  ]

  headTableItems: any[] = [
    {
      option: 'Nome do contato',
      param: 'descricao'
    },
    {
      option: 'Tipo',
      param: 'tipo'
    }
  ]

  constructor(
    private contatoService: ContatoService,
    private r: Router,
    private _auth: AuthenticationService,
    private _modal: BsModalService,
    private _toastr: ToastrService
  ) {
    this.contatoService.params = new HttpParams()
    checkUrlAndSetFirstPage(this.r.url)
  }

  ngOnInit() {
    this.r.routeReuseStrategy.shouldReuseRoute = () => false
    setLastUrl(this.r.url)

    this.sortSelectedItem = this.headTableItems[0]

    this.contatoService.params = this.contatoService.params.set('columnSort', 'descricao')
    this.contatoService.params = this.contatoService.params.set('valueSort', 'ascending')
    this.contatoService.params = this.contatoService.params.set('limit', '10')
    this.contatoService.params = this.contatoService.params.set('page', getLastPage())

    this.getContatosWithParams()
  }

  ngOnDestroy() {
    setLastPage(this.p)
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  get isAdmin() {
    return this._auth.isAdmin
  }

  getContatosWithParams() {
    this.isLoading = true;
    this.httpReq = this.contatoService.getContatosWithParams().subscribe(response => {
      this.statusResponse = response.status

      if (response.status == 200) {
        this.contatos = response.body['data']
        this.messageApi = response.body['message']
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
    this.contatos = null
    scrollPageToTop(page)
    this.contatoService.params = this.contatoService.params.set('page', page.toString())
    this.getContatosWithParams()
  }

  onSelectFilterDropdownMenu(item: any) {
    this.contatos = null
    this.dropdownFilterSelectedItem = item
    this.filterCategory = true
    this.contatoService.params = this.contatoService.params.set('category', item['param'])
    this.getContatosWithParams()
  }

  onClickSortTable(item: any) {
    this.contatos = null
    this.sortSelectedItem = item
    this.contatoService.params = this.contatoService.params.set('columnSort', item['param'])
    if (this.contatoService.params.get('valueSort') == 'descending') {
      this.contatoService.params = this.contatoService.params.set('valueSort', 'ascending')
    } else {
      this.contatoService.params = this.contatoService.params.set('valueSort', 'descending')
    }
    this.getContatosWithParams()
  }

  clearConditions() {
    this.contatos = null

    this.dropdownFilterSelectedItem = null
    this.filterCategory = false
    this.contatoService.params = this.contatoService.params.delete('category')

    this.getContatosWithParams()
  }

  showToastrSuccess() {
    this._toastr.success('O contato foi excluído com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this._toastr.error('Houve um erro ao excluir o contato. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  canDelete(_id: string, descricao: string) {
    const initialState = { message: `Deseja excluir o contato "${descricao}" ?` }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.modalRef = this._modal.show(ModalLoadingComponent, this.configLoadingModal)
        this.contatoService.deleteParams = this.contatoService.deleteParams.set('_id', _id)
        this.httpReq = this.contatoService.deleteContato(_id).subscribe(response => {
          this.contatos, length = 0
          this.getContatosWithParams()
          this.contatoService.deleteParams = new HttpParams()
          this.modalRef.hide()
          this.showToastrSuccess()
        }, err => {
          this.contatos = null
          this.contatoService.deleteParams = new HttpParams()
          this.getContatosWithParams()
          this.modalRef.hide()
          this.showToastrError()
        })
      }
    })
  }
}
