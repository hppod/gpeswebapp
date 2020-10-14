import { Component, OnInit, OnDestroy } from "@angular/core"
import { Router } from "@angular/router"
import { Subscription } from "rxjs"
import { Sobre } from "../../shared/models/sobre.model"
import { SobreService } from "../../shared/services/sobre.service"
import { GoogleAnalyticsService } from "./../../shared/services/google-analytics.service"
import { __event_sobre, __category_institucional, __action_sobre } from "./../../shared/helpers/analytics.consts"
import { GPESWebApi } from "src/app/app.api"
import { BsModalRef } from "ngx-bootstrap/modal"
import { setLastUrl } from "src/app/shared/functions/last-pagination"

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.component.html',
  styleUrls: ['./sobre.component.css']
})
export class SobreComponent implements OnInit, OnDestroy {

  sobre: Sobre[]

  private httpReq: Subscription

  isLoading: boolean
  messageApi: string
  statusResponse: number

  modalRef: BsModalRef

  constructor(
    private _router: Router,
    private _service: SobreService,
    private _analytics: GoogleAnalyticsService
  ) { }

  ngOnInit() {
    this.sendAnalytics()
    this._router.routeReuseStrategy.shouldReuseRoute = () => false
    setLastUrl(this._router.url)

    this._service.params = this._service.params.set('columnSort', 'ordenacao')
    this._service.params = this._service.params.set('valueSort', 'ascending')

    this.getSobreWithParams()
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  sendAnalytics() {
    this._analytics.eventEmitter(__event_sobre, __category_institucional, __action_sobre)
  }

  getSobreWithParams() {
    this.isLoading = true
    this.httpReq = this._service.getSobreWithParams('public').subscribe(response => {
      this.statusResponse = response.status
      if (response.status == 200) {
        this.messageApi = response.body['message']
        this.sobre = response.body['data']
        for (let position = 0; position < this.sobre.length; position++) {
          if (this.sobre[position]['file']) {
            this.sobre[position]['imagem'] = `${GPESWebApi}/public/download/thumbnail_mainpost/${this.sobre[position]['file']['filename']}`
          } else {
            this.sobre[position]['imagem'] = null
          }
        }
      }
      this.isLoading = false
    }, err => {
      this.messageApi = err
      this.isLoading = false
    })
  }

}