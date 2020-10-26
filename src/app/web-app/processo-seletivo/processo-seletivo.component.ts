import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ProcessoSeletivo } from "../../shared/models/processo-seletivo.model";
import { ProcessoSeletivoService } from "../../shared/services/processo-seletivo.service";
import { GoogleAnalyticsService } from "./../../shared/services/google-analytics.service";
import { __event_processoSeletivo, __category_institucional, __action_processoSeletivo } from "./../../shared/helpers/analytics.consts";
import { BsModalRef } from "ngx-bootstrap/modal";
import { setLastUrl } from "src/app/shared/functions/last-pagination";

@Component({
  selector: 'app-processo-seletivo',
  templateUrl: './processo-seletivo.component.html',
  styleUrls: ['./processo-seletivo.component.css']
})
export class ProcessoSeletivoComponent implements OnInit, OnDestroy {

  processoSeletivo: ProcessoSeletivo[]

  private httpReq: Subscription

  isLoading: boolean
  messageApi: string
  statusResponse: number

  modalRef: BsModalRef

  constructor(
    private _router: Router,
    private _service: ProcessoSeletivoService,
    private _analytics: GoogleAnalyticsService
  ) { }

  ngOnInit() {
    this.sendAnalytics()
    this._router.routeReuseStrategy.shouldReuseRoute = () => false
    setLastUrl(this._router.url)

    this._service.params = this._service.params.set('columnSort', 'ordenacao')
    this._service.params = this._service.params.set('valueSort', 'ascending')

    this.getProcessoSeletivoWithParams()
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  sendAnalytics() {
    this._analytics.eventEmitter(__event_processoSeletivo, __category_institucional, __action_processoSeletivo)
  }

  getProcessoSeletivoWithParams() {
    this.isLoading = true
    this.httpReq = this._service.getProcessoSeletivoWithParams('public').subscribe(response => {
      this.statusResponse = response.status
      if (response.status == 200) {
        this.messageApi = response.body['message']
        this.processoSeletivo = response.body['data']
      }
      this.isLoading = false
    }, err => {
      this.messageApi = err
      this.isLoading = false
    })
  }

}
