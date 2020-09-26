import { Component, OnInit, OnDestroy } from "@angular/core"
import { FAQService } from "../../shared/services/faq.service"
import { FAQ } from "../../shared/models/faq.model"
import { Subscription } from "rxjs"
import { Router } from "@angular/router"
import { FormGroup } from "@angular/forms"
import { GoogleAnalyticsService } from "./../../shared/services/google-analytics.service"
import { __event_duvidas, __category_institucional, __action_duvidas } from "./../../shared/helpers/analytics.consts"
import { setLastUrl } from "src/app/shared/functions/last-pagination"

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FAQComponent implements OnInit, OnDestroy {

  private httpReq: Subscription

  faqs: FAQ[]

  keywordFilterForm: FormGroup

  isLoading: boolean = false
  messageApi: string
  statusResponse: number
  p: number
  total: number
  limit: number
  order: boolean = false

  constructor(
    private faqService: FAQService,
    private r: Router,
    private _analytics: GoogleAnalyticsService
  ) { }

  ngOnInit() {
    this.sendAnalytics()
    this.r.routeReuseStrategy.shouldReuseRoute = () => false
    setLastUrl(this.r.url)
    this.faqService.params = this.faqService.params.set('columnSort', 'ordena')
    this.faqService.params = this.faqService.params.set('valueSort', 'ascending')
    this.faqService.params = this.faqService.params.set('page', '1')
    this.faqService.params = this.faqService.params.set('limit', '10')

    this.getFAQWithParams()
  }

  ngOnDestroy() {
    this.httpReq.unsubscribe()
  }

  sendAnalytics() {
    this._analytics.eventEmitter(__event_duvidas, __category_institucional, __action_duvidas)
  }

  getFAQWithParams() {
    this.isLoading = true
    this.httpReq = this.faqService.getFAQWithParams('public').subscribe(response => {
      this.statusResponse = response.status

      if (response.status == 200) {
        this.messageApi = response.body['message']
        this.faqs = response.body['data']
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
    this.faqs = null
    this.faqService.params = this.faqService.params.set('page', page.toString())
    this.getFAQWithParams()
  }

  clearConditions() {
    this.faqs = null

    this.faqService.params = this.faqService.params.set('page', '1')

    this.order = false
    this.faqService.params = this.faqService.params.set('order', 'descending')

    this.getFAQWithParams()
  }

}
