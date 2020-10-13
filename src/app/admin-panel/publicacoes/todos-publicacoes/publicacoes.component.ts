import { Component, OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { HttpParams } from '@angular/common/http'
import { Subscription } from "rxjs"
import { ToastrService } from "ngx-toastr"
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal"
import { Publicacoes } from "../../../shared/models/publicacoes.model"
import { PublicacoesService } from "../../../shared/services/publicacoes.service"
import { AuthenticationService } from "./../../../shared/services/authentication.service"
import { ModalDialogComponent } from "./../../../web-components/common/modals/modal-dialog/modal-dialog.component"
import { ModalLoadingComponent } from "./../../../web-components/common/modals/modal-loading/modal-loading.component"
import { scrollPageToTop } from "./../../../shared/functions/scroll-top"
import { checkUrlAndSetFirstPage, setLastUrl, getLastPage, setLastPage } from "src/app/shared/functions/last-pagination"
import { Category } from "src/app/shared/models/category.model"
import { CategoryService } from "src/app/shared/services/categories.service"

@Component({
  selector: 'app-publicacoes',
  templateUrl: './publicacoes.component.html',
  styleUrls: ['./publicacoes.component.css']
})
export class PublicacoesComponent implements OnInit {

  //Request
  private httpReq: Subscription

  //Dataset
  documents: Publicacoes[]

  //Control Variables
  p: number = 1
  total: number
  limit: number
  messageApi: string
  statusResponse: number
  isLoading: boolean
  filterCategory: boolean = false
  modalRef: BsModalRef

  //Selected Items
  dropdownFilterSelectedItem: any
  sortSelectedItem: any

  //Items Set
  dropdownFilterMenuItems: Category[] = new Array()

  headTableItems: any[] = [
    {
      option: 'Título',
      param: 'titulo'
    },
    {
      option: 'Categoria',
      param: 'categoria'
    },
    {
      option: 'Postado em',
      param: 'date'
    }
  ]

  configLoadingModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    initialState: {
      message: "Excluindo documento...",
      withFooter: false
    }
  }

  constructor(
    private r: Router,
    private _service: PublicacoesService,
    private _auth: AuthenticationService,
    private _modal: BsModalService,
    private _toastr: ToastrService,
    private categoryService: CategoryService
  ) {
    this._service.params = new HttpParams()
    checkUrlAndSetFirstPage(this.r.url)
  }

  ngOnInit() {
    this.r.routeReuseStrategy.shouldReuseRoute = () => false
    setLastUrl(this.r.url)

    this.sortSelectedItem = this.headTableItems[2]

    this._service.params = this._service.params.set('columnSort', 'date')
    this._service.params = this._service.params.set('valueSort', 'descending')
    this._service.params = this._service.params.set('page', getLastPage())

    this.getDocumentsWithParams()
    this.getCategories()
  }

  ngOnDestroy() {
    setLastPage(this.p)
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  /**Função que retorna se o usuário logado tem permissão de administrador. */
  get isAdmin() {
    return this._auth.isAdmin
  }

  /**Função que busca os documentos do portal da transparência no banco de dados de acordo com os parâmetros informados. */
  getDocumentsWithParams() {
    this.isLoading = true
    this.httpReq = this._service.getDocumentsWithParams('authenticated').subscribe(response => {
      this.statusResponse = response.status

      if (response.status == 200) {
        this.documents = response.body['data']
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

  getCategories() {
    this.httpReq = this.categoryService.getExistingCategories(true).subscribe(response => {
      this.dropdownFilterMenuItems = response.body['data']
    }, err => {
      console.log(err)
    })
  }

  /**Função que busca os documentos do portal da transparência no banco de dados de acordo com os parâmetros informados e a página informada. */
  getPage(page: number) {
    this.documents = null
    scrollPageToTop(page)
    this._service.params = this._service.params.set('page', page.toString())
    this.getDocumentsWithParams()
  }

  /**Função que define qual categoria de documentos será exibida. */
  onSelectFilterDropdownMenu(item: any) {
    this.documents = null
    this.dropdownFilterSelectedItem = item
    this.filterCategory = true
    this._service.params = this._service.params.set('category', item['nome'])
    this.getDocumentsWithParams()
  }

  /**Função que define qual será a ordenação dos documentos exibidos. */
  onClickSortTable(item: any) {
    this.documents = null
    this.sortSelectedItem = item
    this._service.params = this._service.params.set('columnSort', item['param'])
    if (this._service.params.get('valueSort') == 'descending') {
      this._service.params = this._service.params.set('valueSort', 'ascending')
    } else {
      this._service.params = this._service.params.set('valueSort', 'descending')
    }
    this.getDocumentsWithParams()
  }

  /**Função que limpa todas as condições modificadas e retorna o componente ao estado original. */
  clearConditions() {
    this.documents = null

    this.dropdownFilterSelectedItem = null
    this.filterCategory = false
    this._service.params = this._service.params.delete('category')

    this.getDocumentsWithParams()
  }

  /**Função para exibir um toastr de sucesso. */
  showToastrSuccess(message: string) {
    this._toastr.success(message, null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  /**Função para exibir um toastr de erro. */
  showToastrError(message: string) {
    this._toastr.error(message, null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  /**Função que exibe um modal de pergunta ao usuário se ele permite que o documento seja excluído do banco de dados. */
  canDelete(titleDocument: string, _id: string, filename: string) {
    const initialState = { message: `Deseja excluir o documento "${titleDocument}" ?` }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.modalRef = this._modal.show(ModalLoadingComponent, this.configLoadingModal)
        this._service.deleteParams = this._service.deleteParams.set('filename', filename)
        this._service.deleteParams = this._service.deleteParams.set('_id', _id)
        this.httpReq = this._service.deleteDocument().subscribe(response => {
          this.documents = null
          this.getDocumentsWithParams()
          this._service.deleteParams = new HttpParams()
          this.modalRef.hide()
          this.showToastrSuccess('O documento foi excluido com sucesso')
        }, err => {
          this.documents = null
          this._service.deleteParams = new HttpParams()
          this.getDocumentsWithParams()
          this.modalRef.hide()
          this.showToastrError('Houve um erro ao excluir o documento. Tente novamente.')
        })
      }
    })
  }

}
