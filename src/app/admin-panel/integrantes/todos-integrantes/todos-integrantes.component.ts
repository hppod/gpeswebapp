import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { IntegrantesService } from 'src/app/shared/services/integrantes.service';
import { checkUrlAndSetFirstPage, setLastUrl, getLastPage, setLastPage } from 'src/app/shared/functions/last-pagination';
import { Subscription } from 'rxjs';
import { Integrantes } from 'src/app/shared/models/integrantes.model';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { scrollPageToTop } from 'src/app/shared/functions/scroll-top';
import { ToastrService } from 'ngx-toastr';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';
import { ModalLoadingComponent } from 'src/app/web-components/common/modals/modal-loading/modal-loading.component';


@Component({
  selector: 'app-todos-integrantes',
  templateUrl: './todos-integrantes.component.html',
  styleUrls: ['./todos-integrantes.component.css']
})
export class TodosIntegrantesComponent implements OnInit {
  private httpReq: Subscription

  p: number = 1
  integrantes: Integrantes[]
  isLoading: boolean = false
  messageApi: string
  statusResponse: number
  total: number
  limit: number
  sortedCollection: any[];
  sortSelectedItem: any
  modalRef: BsModalRef

  headTableItems: any[] = [
    {
      option: 'Nome',
      param: 'nome'
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

  constructor(
    private service: IntegrantesService,
    private r: Router,
    private auth: AuthenticationService,
    private modal: BsModalService,
    private toastr: ToastrService
  ) { 
    checkUrlAndSetFirstPage(this.r.url)
  }

  ngOnInit(): void {
    this.r.routeReuseStrategy.shouldReuseRoute = () => false
    setLastUrl(this.r.url)

    this.sortSelectedItem = this.headTableItems[1]

    this.service.params = this.service.params.set('columnSort', 'nome')
    this.service.params = this.service.params.set('valueSort', 'ascending')
    this.service.params = this.service.params.set('page', getLastPage())
    this.service.params = this.service.params.set('limit', '10')
    
    this.getAllIntegrantes()
  }

  ngOnDestroy() {
    setLastPage(this.p)
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  get isAdmin() {
    return this.auth.isAdmin
  }

  getAllIntegrantes(){
    this.isLoading = true
    this.httpReq = this.service.getAllIntegrantesWithParams('authenticated').subscribe(response => {
      this.statusResponse = response.status
      if (response.status == 200) {
        this.messageApi = response.body['message']
        this.integrantes = response.body['data']
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

  delete(id, nome){

    const initialState = { message: `Deseja excluir o "${nome}" ?` }
    this.modalRef = this.modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
          this.modalRef = this.modal.show(ModalLoadingComponent, this.configLoadingModal)
          this.service.deleteIntegrante(id).subscribe(response => {
            this.service.params = this.service.params.set('columnSort', 'nome')
            this.service.params = this.service.params.set('valueSort', 'ascending')
            this.service.params = this.service.params.set('page', '1')
            this.getAllIntegrantes()
            this.modalRef.hide()
            this.showToastrSuccess()
          }, err => {
            this.getAllIntegrantes()
            this.modalRef.hide()
            this.showToastrError()
          })
      }
    })
  }

  getPage(page: number) {
    this.integrantes = null
    scrollPageToTop(page)
    this.service.params = this.service.params.set('page', page.toString())
    this.getAllIntegrantes()
  }

  onClickSortTable(item: any) {
    this.integrantes = null
    this.sortSelectedItem = item
    this.service.params = this.service.params.set('columnSort', item['param'])
    if (this.service.params.get('valueSort') == 'descending') {
      this.service.params = this.service.params.set('valueSort', 'ascending')
    } else {
      this.service.params = this.service.params.set('valueSort', 'descending')
    }
    this.getAllIntegrantes()
  }

  showEllipsisInTheText(text: string, limit: number): boolean {
    return text.length > limit;
  }

  showToastrSuccess() {
    this.toastr.success('Integrante foi excluído com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this.toastr.error('Houve um erro ao excluir o integrante. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

}
