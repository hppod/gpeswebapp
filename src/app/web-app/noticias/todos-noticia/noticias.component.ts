import { Component, OnInit, Renderer2, ViewChild, ElementRef } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { Subscription } from "rxjs"
import { NoticiasService } from "../../../shared/services/noticias.service"
import { Noticia } from "../../../shared/models/noticia.model"
import { GoogleAnalyticsService } from "../../../shared/services/google-analytics.service"
import { scrollPageToTop } from "./../../../shared/functions/scroll-top"
import { __event_noticias, __category_institucional, __action_noticias } from "../../../shared/helpers/analytics.consts"
import { setLastUrl, checkUrlAndSetFirstPage, setLastPage, getLastPage } from "src/app/shared/functions/last-pagination"

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css']
})
export class NoticiasComponent implements OnInit {

  @ViewChild('closeModal') private closeModal: ElementRef

  private httpReq: Subscription

  //Dataset
  noticias: Noticia[]

  //Forms Set
  keywordFilterForm: FormGroup

  //Control Variables
  isLoading: boolean = false
  messageApi: string
  statusResponse: number
  p: number
  total: number
  limit: number
  keyword: string
  filterKeyword: boolean = false
  filterOrder: boolean = false

  //Selected Items
  dropdownOrderSelectedItem: any

  //Menu Items Set
  dropdownOrderMenuItems: any[] = [
    { option: 'Data - mais novo primeiro', param: 'descending' },
    { option: 'Data - mais antigo primeiro', param: 'ascending' }
  ]

  constructor(
    private _service: NoticiasService,
    private r: Router,
    private render: Renderer2,
    private fb: FormBuilder,
    private _analytics: GoogleAnalyticsService
  ) {
    checkUrlAndSetFirstPage(this.r.url)
  }

  ngOnInit() {
    this.sendAnalytics()
    this.r.routeReuseStrategy.shouldReuseRoute = () => false
    setLastUrl(this.r.url)

    this._service.params = this._service.params.set('valueSort', 'descending')
    this._service.params = this._service.params.set('columnSort', 'date')
    this._service.params = this._service.params.set('page', getLastPage())
    this._service.params = this._service.params.set('limit', '6')

    this.getNoticiasWithParams()

    //Init Form
    this.keywordFilterForm = this.fb.group({
      keyword: this.fb.control(null, [Validators.required]),
    })
  }

  ngOnDestroy() {
    setLastPage(this.p)
    this.httpReq.unsubscribe()
  }

  sendAnalytics() {
    this._analytics.eventEmitter(__event_noticias, __category_institucional, __action_noticias)
  }

  getNoticiasWithParams() {
    this.isLoading = true
    this.httpReq = this._service.getNoticiasWithParams('public', 'tmb_cd').subscribe(response => {
      this.statusResponse = response.status

      if (response.status == 200) {
        this.messageApi = response.body['message']
        this.noticias = response.body['data']
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
    this.noticias = null
    scrollPageToTop(page)
    this._service.params = this._service.params.set('page', page.toString())
    this.getNoticiasWithParams()
  }

  setActiveMenuItem(event: any) {
    let oldClasses = event.target.getAttribute('class')
    this.render.setAttribute(event.target, "class", `${oldClasses} active`)
  }

  onClickCleanInputFieldsDateSearch() {
    this.keywordFilterForm.reset()
  }

  onSelectOrderDropdownMenu(item: any) {
    this.filterOrder = true
    this.noticias = null
    this.dropdownOrderSelectedItem = item
    this._service.params = this._service.params.set('valueSort', item['param'])
    this._service.params = this._service.params.set('columnSort', 'date')
    this.getNoticiasWithParams()
  }

  onClickFilterKeyword() {

    let keyword = this.keywordFilterForm.value.keyword
    this.keyword = keyword

    this.noticias = null
    this.filterKeyword = true
    this._service.params = this._service.params.set('keyword', keyword)

    this.closeModal.nativeElement.click()
    this.keywordFilterForm.reset()

    this.getNoticiasWithParams()
  }

  clearConditions() {
    this.noticias = null

    this._service.params = this._service.params.set('page', '1')

    this.filterOrder = false
    this.dropdownOrderSelectedItem = null
    this._service.params = this._service.params.set('valueSort', 'descending')

    this.filterKeyword = false
    this._service.params = this._service.params.delete('keyword')

    this.getNoticiasWithParams()
  }

}
