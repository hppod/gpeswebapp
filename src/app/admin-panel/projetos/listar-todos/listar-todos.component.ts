import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { checkUrlAndSetFirstPage, getLastPage, setLastPage, setLastUrl } from 'src/app/shared/functions/last-pagination';
import { scrollPageToTop } from 'src/app/shared/functions/scroll-top';
import { Projetos } from 'src/app/shared/models/projetos.model';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ProjetosService } from 'src/app/shared/services/projetos.service';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';
import { ModalLoadingComponent } from 'src/app/web-components/common/modals/modal-loading/modal-loading.component';

@Component({
  selector: 'app-listar-todos',
  templateUrl: './listar-todos.component.html',
  styleUrls: ['./listar-todos.component.css']
})
export class ListarTodosComponent implements OnInit {

  private httpReq: Subscription

  p: number = 1
  projetos: Projetos[]
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

  constructor(
    private service: ProjetosService,
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

    this.service.params = this.service.params.set('columnSort', 'dataInicio')
    this.service.params = this.service.params.set('valueSort', 'descending')
    this.service.params = this.service.params.set('page', getLastPage())
    this.service.params = this.service.params.set('limit', '10')

    this.getAllProjetos()
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

  getAllProjetos() {
    this.isLoading = true
    this.httpReq = this.service.getProjetosWithParams('authenticated').subscribe(response => {
      this.statusResponse = response.status
      if (response.status == 200) {
        this.messageApi = response.body['message']
        this.projetos = response.body['data']
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

  delete(id, titulo){
    const initialState = { message: `Deseja excluir o "${titulo}" ?` }
    this.modalRef = this.modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
          this.modalRef = this.modal.show(ModalLoadingComponent, this.configLoadingModal)
          this.service.deleteProjeto(id).subscribe(response => {
            this.service.params = this.service.params.set('columnSort', 'nome')
            this.service.params = this.service.params.set('valueSort', 'ascending')
            this.service.params = this.service.params.set('page', '1')
            this.getAllProjetos()
            this.modalRef.hide()
            this.showToastrSuccess()
          }, err => {
            this.getAllProjetos()
            this.modalRef.hide()
            this.showToastrError()
          })
      }
    })
  }

  getPage(page: number) {
    this.projetos = null
    scrollPageToTop(page)
    this.service.params = this.service.params.set('page', page.toString())
    this.getAllProjetos()
  }

  onClickSortTable(item: any) {
    this.projetos = null
    this.sortSelectedItem = item
    this.service.params = this.service.params.set('columnSort', item['param'])
    if (this.service.params.get('valueSort') == 'descending') {
      this.service.params = this.service.params.set('valueSort', 'ascending')
    } else {
      this.service.params = this.service.params.set('valueSort', 'descending')
    }
    this.getAllProjetos()
  }

  showEllipsisInTheText(text: string, limit: number): boolean {
    return text.length > limit;
  }

  showToastrSuccess() {
    this.toastr.success('Projeto foi excluído com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this.toastr.error('Houve um erro ao excluir o projeto. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }
}
