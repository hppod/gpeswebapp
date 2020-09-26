import { Component, OnInit, Renderer2, ViewChild, ElementRef } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { HttpParams } from "@angular/common/http"
import { Router } from "@angular/router"
import { Subscription } from "rxjs"
import { Transparencia } from "../../../shared/models/transparencia.model"
import { TransparenciaService } from "../../../shared/services/transparencia.service"
import { GoogleAnalyticsService } from "../../../shared/services/google-analytics.service"
import { TransparenciaHelperService } from "./../transparencia-helper.service"
import { scrollPageToTop } from "./../../../shared/functions/scroll-top"
import * as moment from "moment"
import { __event_transparencia, __category_institucional, __action_transparencia } from "../../../shared/helpers/analytics.consts"
import { setLastUrl } from "src/app/shared/functions/last-pagination"
import { Category } from "src/app/shared/models/category.model"
import { CategoryService } from "src/app/shared/services/categories.service"

@Component({
  selector: 'app-portal-transparencia',
  templateUrl: './portal-transparencia.component.html',
  styleUrls: ['./portal-transparencia.component.css']
})
export class PortalTransparenciaComponent implements OnInit {

  @ViewChild('closeModal') private closeModal: ElementRef

  private httpReq: Subscription

  //Dataset
  documents: Transparencia[]

  //Forms Set
  dateBetweenFilterForm: FormGroup

  //Control Variables
  filterDate: boolean = false
  filterCategory: boolean = false
  filterOrder: boolean = false
  p: number
  total: number
  limit: number
  messageApi: string
  statusResponse: number
  isLoading: boolean
  dateStartText: any
  dateFinishText: any

  //Selected Items
  dropdownOrderSelectedItem: any
  categorySelectedItem: any
  categorySelectedTitle: string

  //Menu Items Set
  dropdownOrderMenuItems: any[] = [
    { option: 'Data - mais novo primeiro', param: 'descending' },
    { option: 'Data - mais antigo primeiro', param: 'ascending' }
  ]

  categoryMenuItems: Category[] = new Array()

  constructor(
    private _service: TransparenciaService,
    private _helperService: TransparenciaHelperService,
    private _router: Router,
    private _render: Renderer2,
    private _formBuilder: FormBuilder,
    private _analytics: GoogleAnalyticsService,
    private categoryService: CategoryService
  ) {
    this._service.params = new HttpParams()
    this.categorySelectedTitle = this._helperService.categorySelectedTitle
    this.categorySelectedItem = this._helperService.categorySelectedItem
  }

  ngOnInit() {

    if (this.categorySelectedItem != null || this.categorySelectedItem != undefined) {
      this.sendAnalytics()
      this._router.routeReuseStrategy.shouldReuseRoute = () => false
      setLastUrl(this._router.url)

      this._helperService.setParamToCategory()

      this._service.params = this._service.params.set('columnSort', 'date')
      this._service.params = this._service.params.set('valueSort', 'descending')
      this._service.params = this._service.params.set('page', '1')

      //Init Form
      this.dateBetweenFilterForm = this._formBuilder.group({
        dateStart: this._formBuilder.control(null, [Validators.required]),
        dateFinish: this._formBuilder.control(null)
      })

      this.getDocumentsWithParams()
      this.getCategories()
    } else {
      this._router.navigate(['/institucional/transparencia'])
    }

  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  /**Função que emite um evento de acesso a página portal da transparência para o Google Analytics. */
  sendAnalytics() {
    this._analytics.eventEmitter(__event_transparencia, __category_institucional, __action_transparencia)
  }

  /**Função que busca os documentos do portal da transparência no banco de dados de acordo com os parâmetros informados. */
  getDocumentsWithParams() {
    this.isLoading = true
    this.httpReq = this._service.getDocumentsWithParams('public').subscribe(response => {
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
    this.httpReq = this.categoryService.getExistingCategories(false).subscribe(response => {
      this.categoryMenuItems = response.body['data']
    }, err => {
      console.log(err)
    })
  }

  /**Função atribui ao menu o item que está ativo. */
  setActiveMenuItem(event: any) {
    let oldClasses = event.target.getAttribute('class')

    this._render.setAttribute(event.target, "class", `${oldClasses} active`)
  }

  /**Função que busca os documentos do portal da transparência no banco de dados de acordo com os parâmetros informados e a página informada. */
  getPage(page: number) {
    this.documents = null
    scrollPageToTop(page)
    this._service.params = this._service.params.set('page', page.toString())
    this.getDocumentsWithParams()
  }

  /**Função que limpa os campos de filtro de data. */
  onClickCleanInputFieldsDateSearch() {
    this.dateBetweenFilterForm.reset()
  }

  /**Função que define a ordem de exibição dos documentos. */
  onSelectOrderDropdownMenu(item: any) {
    this.dropdownOrderSelectedItem = item
    this.documents = null
    this.filterOrder = true
    this._service.params = this._service.params.set('columnSort', 'date')
    this._service.params = this._service.params.set('valueSort', item['param'])
    this.getDocumentsWithParams()
  }

  /**Função que define qual categoria de documentos será exibida. */
  onSelectCategoryMenu(item: any) {
    this.categorySelectedItem = item
    this.categorySelectedTitle = item['nome']
    this.documents = null
    this.filterCategory = true
    this.filterOrder = false
    this.dropdownOrderSelectedItem = null
    this._service.params = this._service.params.set('columnSort', 'date')
    this._service.params = this._service.params.set('valueSort', 'descending')
    this._service.params = this._service.params.set('category', item['nome'])
    this.getDocumentsWithParams()
  }

  /**Função que filtra os documentos por data. */
  onClickFilterDate() {

    let dateStart = this.dateBetweenFilterForm.value.dateStart
    let dateFinish = this.dateBetweenFilterForm.value.dateFinish

    this.documents = null
    this.filterDate = true
    this._service.params = this._service.params.set('dateStart', dateStart)

    if (dateFinish) {
      this._service.params = this._service.params.set('dateFinish', dateFinish)
    } else {
      dateFinish = moment().format('YYYY-MM-DD')
    }

    this.dateStartText = dateStart
    this.dateFinishText = dateFinish

    this.closeModal.nativeElement.click()
    this.dateBetweenFilterForm.reset()

    this.getDocumentsWithParams()
  }

  /**Função que limpa todas as condições modificadas e retorna o componente ao estado original. */
  clearConditions() {
    this.documents = null

    this._service.params = this._service.params.set('page', '1')

    this.filterDate = false
    this._service.params = this._service.params.delete('dateStart')
    this._service.params = this._service.params.delete('dateFinish')

    this.filterOrder = false
    this.dropdownOrderSelectedItem = null
    this._service.params = this._service.params.set('columnSort', 'date')
    this._service.params = this._service.params.set('valueSort', 'descending')

    this.getDocumentsWithParams()
  }

}
