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
  selecaoAberta: boolean = false

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
    this.getSelecaoAberta()
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

  getSelecaoAberta() {
    this.httpReq = this._service.getSelecaoAberta().subscribe(response => {
      this.statusResponse = response.status;
      if (response.status == 200 && response.body['data'].length == 1) {
        if (response.body['data'][0].status == true) {
          let dataInicio = this.formatDate(response.body['data'][0].dataInicio);
          let dataFim = this.formatDate(response.body['data'][0].dataFim);
          let dataAtual = this.formatDate(new Date());
          if (dataInicio <= dataAtual && dataFim >= dataAtual) {
            this.messageApi = response.body['message'];
            this.selecaoAberta = true;
          }
        }
      }
    }, err => {
      this.messageApi = err
    })
  }

  formatDate(date) {
    if (date != null) {
      let MesString
      let DiaString
      let data = new Date(date)
      let dia = data.getUTCDate()
      let mes = data.getUTCMonth() + 1
      let ano = data.getUTCFullYear()

      if (mes < 10) {
        MesString = '0' + mes.toString()
      } else {
        MesString = mes.toString()
      }
      if (dia < 10) {
        DiaString = '0' + dia.toString()
      } else {
        DiaString = dia.toString()
      }
      return [ano, MesString, DiaString].join('-');
    }
    return null
  }

}
