import { Component, OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { Subscription } from "rxjs"
import { UsuarioService } from "./../../../shared/services/usuario.service"
import { Usuario } from "./../../../shared/models/usuario.model"
import { HttpParams } from "@angular/common/http"
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal"
import { ToastrService } from "ngx-toastr"
import { ModalDialogComponent } from "./../../../web-components/common/modals/modal-dialog/modal-dialog.component"
import { ModalLoadingComponent } from "./../../../web-components/common/modals/modal-loading/modal-loading.component"
import { scrollPageToTop } from "./../../../shared/functions/scroll-top"
import { checkUrlAndSetFirstPage, setLastUrl, getLastPage, setLastPage } from "src/app/shared/functions/last-pagination"

@Component({
  selector: 'app-todos-usuario',
  templateUrl: './todos-usuario.component.html',
  styleUrls: ['./todos-usuario.component.css']
})
export class TodosUsuarioComponent implements OnInit {

  //Request
  private httpReq: Subscription

  //Dataset
  users: Usuario[]

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
  dropdownFilterMenuItems: any[] = [
    {
      option: "Administrador",
      param: "Administrador"
    },
    {
      option: "Editor",
      param: "Editor"
    }
  ]

  headTableItems: any[] = [
    {
      option: 'Nome',
      param: 'nome'
    },
    {
      option: 'E-mail',
      param: 'email'
    },
    {
      option: 'Nível de Acesso',
      param: 'role'
    }
  ]

  configLoadingModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    initialState: {
      message: "Excluindo usuário...",
      withFooter: false
    }
  }

  constructor(
    private _service: UsuarioService,
    private _router: Router,
    private _modal: BsModalService,
    private _toastr: ToastrService
  ) {
    this._service.params = new HttpParams()
    checkUrlAndSetFirstPage(this._router.url)
  }

  ngOnInit() {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false
    setLastUrl(this._router.url)

    this.sortSelectedItem = this.headTableItems[0]

    this.initParams()
    this.getUsersWithParams()
  }

  ngOnDestroy() {
    setLastPage(this.p)
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  initParams() {
    this._service.params = this._service.params.set('columnSort', 'nome')
    this._service.params = this._service.params.set('valueSort', 'ascending')
    this._service.params = this._service.params.set('page', getLastPage())
  }

  getUsersWithParams() {
    this.isLoading = true
    this.httpReq = this._service.getUsersWithParams().subscribe(response => {
      this.statusResponse = response.status

      if (response.status == 200) {
        this.messageApi = response.body['message']
        this.users = response.body['data']
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
    this.users = null
    scrollPageToTop(page)
    this._service.params = this._service.params.set('page', page.toString())
    this.getUsersWithParams()
  }

  onSelectFilterDropdownMenu(item: any) {
    this.users = null
    this.dropdownFilterSelectedItem = item
    this.filterCategory = true
    this._service.params = this._service.params.set('role', item['param'])
    this.getUsersWithParams()
  }

  onClickSortTable(item: any) {
    this.users = null
    this.sortSelectedItem = item
    this._service.params = this._service.params.set('columnSort', item['param'])
    if (this._service.params.get('valueSort') == 'descending') {
      this._service.params = this._service.params.set('valueSort', 'ascending')
    } else {
      this._service.params = this._service.params.set('valueSort', 'descending')
    }
    this.getUsersWithParams()
  }

  clearConditions() {
    this.users = null
    this.dropdownFilterSelectedItem = null
    this.filterCategory = false
    this._service.params = this._service.params.delete('role')
    this.getUsersWithParams()
  }

  canDelete(user: string) {
    const initialState = { message: `Deseja excluir o usuário "${user}" ?` }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.modalRef = this._modal.show(ModalLoadingComponent, this.configLoadingModal)
        this.httpReq = this._service.deleteUserByUser(user).subscribe(response => {
          this.users = null
          this.getUsersWithParams()
          this.modalRef.hide()
          this.showToastrSuccess()
        }, err => {
          this.users = null
          this.getUsersWithParams()
          this.modalRef.hide()
          this.showToastrError()
        })
      }
    })
  }

  showToastrSuccess() {
    this._toastr.success("O usuário foi excluído com sucesso", null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this._toastr.error("Houve um erro ao excluir o usuário. Tente novamente.", null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

}
