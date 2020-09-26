import { Component, OnInit, ViewChild, ElementRef } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Subscription } from "rxjs"
import { ToastrService } from "ngx-toastr"
import * as moment from "moment"
import { Data } from "../../shared/models/analytics/data.model"
import { AnalyticsService } from "./../../shared/services/analytics.service"
import {
  metricsFixedCards,
  metricsGraphUsers,
  dimensionsLineChartComparative,
  dimensionsPieChartState,
  metricsPieChartsUsers,
  dimensionsPieChartCity,
  dimensionsPieChartUserType,
  metricPagePath,
  dimensionPagePath,
  filtersPagePath,
  sortPagePath,
  filtersNoticiaPagePath,
  metricEventDonation,
  dimensionEventDonation,
  filtersEventDonation
} from "../../shared/helpers/analytics.metrics"
import { Router } from "@angular/router"
import { setLastUrl } from "src/app/shared/functions/last-pagination"

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  @ViewChild('closeModal') private closeModal: ElementRef

  httpRequest: Subscription
  isLoading: boolean
  showPagination: boolean = false
  dateBetweenFilterForm: FormGroup
  filterDate: boolean = false
  startDate: string
  endDate: string
  p: number = 1
  pN: number = 1

  /**Datasets Charts */
  dataAnalytics: Data[]
  dataAnalyticsLineChartComparative: Data[]
  dataAnalyticsPieChartState: any[]
  dataAnalyticsPieChartCity: any[]
  dataAnalyticsPieChartUserType: any[]
  dataAnalyticsPagePaths: any[]
  dataAnalyticsNoticiaPaths: any[]
  dataAnalyticsEventsDonation: any[]

  /**Size Charts */
  viewLineChartComparativeSize: any[] = [1080, 300]
  viewPieChartSize: any[] = [356, 300]

  /**Options Charts */
  legend: boolean = true
  legendPosition: string = 'below'
  showLabels: boolean = true
  animations: boolean = true
  xAxis: boolean = false
  yAxis: boolean = true
  showYAxisLabel: boolean = false
  showXAxisLabel: boolean = false
  xAxisLabel: string = ''
  yAxisLabel: string = ''
  timeline: boolean = false
  autoScale: boolean = true
  gradient: boolean = false
  isDoughnut: boolean = true

  /**Colors Charts */
  colorScheme = {
    domain: ['#EF5455', '#2B3252']
  }

  constructor(
    private _service: AnalyticsService,
    private _toastr: ToastrService,
    private _builder: FormBuilder,
    private _router: Router
  ) { }

  ngOnInit() {
    this.setDateToday()
    this.initForm()
    this.getAnalytics()
    setLastUrl(this._router.url)
  }

  ngOnDestroy() {
    if (this.httpRequest) {
      this.httpRequest.unsubscribe()
    }
  }

  /**Methods Charts */
  onSelect(data): void {
  }

  onActivate(data): void {
  }

  onDeactivate(data): void {
  }

  /**Função que inicializa os formulários reativos do componente. */
  initForm() {
    this.dateBetweenFilterForm = this._builder.group({
      dateStart: this._builder.control(null, [Validators.required]),
      dateFinish: this._builder.control(null)
    })
  }

  /**Função que adiciona o filtro por data de 30 dias atrás até o dia anterior ao atual. É o estado inicial do componente. */
  setDateToday() {
    this._service.setParams('startDate', '30daysAgo')
    this.startDate = moment().subtract(30, 'days').format('YYYY-MM-DD')
    this._service.setParams('endDate', 'yesterday')
    this.endDate = moment().subtract(1, 'days').format('YYYY-MM-DD')
  }

  /**Função que executa todas as funções responsáveis por buscar os dados no Google Analytics.  */
  getAnalytics() {
    this.getDataFixedCards()
    this.getDataLineChartComparative()
    this.getDataPieChartState()
    this.getDataPieChartCity()
    this.getDataPieChartUserType()
    this.getDataPagePaths()
    this.getDataNoticiaPagePaths()
    this.getDataEventsDonation()
  }

  /**Função que limpa os inputs do filtro por data. */
  onClickCleanInputFieldsDateSearch() {
    this.dateBetweenFilterForm.reset()
  }

  /**Função que limpa as condições de busca e retorna o componente ao seu estado original. */
  clearConditions() {
    this.filterDate = false
    this.showPagination = false
    this.setDateToday()
    this.getAnalytics()
  }

  /**Função para exibir um toastr de erro caso aconteça algum erro ao processar uma operação. */
  showToastrError(error: string) {
    this._toastr.error(`Houve um erro ao processar sua requisição => ${error}`, null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })

  }

  /**Função para identificar o título do dado que está sendo exibido e mostrá-lo de forma reconhecível ao usuário. */
  showTitle(Metric: String, values) {
    if (Metric == 'noticias') {
      if (values[0]['name'] != 'Não há dados para serem exibidos') {
        this.showPagination = true
        for (let i = 0; i < values.length; i++) {
          let value = values[i]['name']
          value = value.substring(9)
          values[i]['name'] = value
        }
      } else {
        values[0]['name'] = 'Não há dados para serem exibidos'
      }
    } else {
      if (values.length > 1) {
        for (let i = 0; i < values.length; i++) {
          let value = values[i]['name']
          value = value.substring(15)
          value = value.charAt(0).toUpperCase() + value.slice(1)
          values[i]['name'] = value
        }
      } else {
        values[0]['name'] = 'Não há dados para serem exibidos'
      }
    }

    return values
  }

  /**Função que adiciona as condições de filtro por data. */
  onClickFilterDate() {

    let dateStart = this.dateBetweenFilterForm.value.dateStart
    let dateFinish = this.dateBetweenFilterForm.value.dateFinish

    this.startDate = dateStart

    if (dateFinish == null || dateFinish == undefined) {
      this.endDate = moment().format('YYYY-MM-DD')
    } else {
      this.endDate = dateFinish
    }

    this.filterDate = true
    this._service.params = this._service.params.set('startDate', dateStart)

    if (dateFinish) {
      this._service.params = this._service.params.set('endDate', dateFinish)
    }

    this.closeModal.nativeElement.click()
    this.dateBetweenFilterForm.reset()

    this.getAnalytics()
  }

  /**Função que retorna as propriedades e tooltips das métricas exibidas nos cards do componente. */
  setProperty(response): Data[] {
    const keys = metricsFixedCards.split(',')
    let data: Data[] = new Array()

    if (response != undefined) {
      for (let responseItem = 0; responseItem < response.length; responseItem++) {
        data.push({
          'title': response[responseItem][`ga:${keys[responseItem]}`]['title'],
          'type': response[responseItem][`ga:${keys[responseItem]}`]['type'],
          'tooltip': response[responseItem][`ga:${keys[responseItem]}`]['tooltip'],
          'metric': keys[responseItem],
          'value': response[responseItem][`ga:${keys[responseItem]}`]['value']
        })
      }
    }

    return data
  }

  /**Função que busca os dados dos cards fixos no Google Analytics. */
  getDataFixedCards() {
    this.isLoading = true
    this._service.setParams('metrics', metricsFixedCards)
    this.httpRequest = this._service.getDataFromAnalytics().subscribe(response => {
      this.dataAnalytics = this.setProperty(response.body['data'])
      this._service.deleteAllParams()
      this.isLoading = false
    }, err => {
      this.showToastrError(err)
      this._service.deleteAllParams()
      this.isLoading = false
    })
  }

  /**Função que retorna as propriedades das métricas, dimensões e filtros exibidos nos gráficos do componente. */
  setPropertyChart(dimension, response): Data[] {
    const keys = metricsFixedCards.split(',')
    let data: Data[] = new Array()

    if (response != undefined) {
      for (let responseItem = 0; responseItem < response.length; responseItem++) {
        data.push({
          'title': response[responseItem][`ga:${dimension} & ga:${keys[responseItem]}`]['title'],
          'type': response[responseItem][`ga:${dimension} & ga:${keys[responseItem]}`]['type'],
          'tooltip': response[responseItem][`ga:${dimension} & ga:${keys[responseItem]}`]['tooltip'],
          'metric': keys[responseItem],
          'value': response[responseItem][`ga:${dimension} & ga:${keys[responseItem]}`]['value'],
          'series': response[responseItem][`ga:${dimension} & ga:${keys[responseItem]}`]['series'],
          'name': response[responseItem][`ga:${dimension} & ga:${keys[responseItem]}`]['name']
        })
      }
    }

    return data
  }

  /**Função que busca os dados “Usuários x Novos Usuários” no Google Analytics e exibe no gráfico de linha comparativo. */
  getDataLineChartComparative() {
    this._service.setParams('metrics', metricsGraphUsers)
    this._service.setParams('dimensions', dimensionsLineChartComparative)
    this.httpRequest = this._service.getDataFromAnalytics().subscribe(response => {
      this.dataAnalyticsLineChartComparative = this.setPropertyChart(dimensionsLineChartComparative, response.body['data'])
      this._service.deleteAllParams()
    }, err => {
      this.showToastrError(err)
      this._service.deleteAllParams()
    })
  }

  /**Função que busca os dados de acesso por estado no Google Analytics e exibe no gráfico de pizza. */
  getDataPieChartState() {
    this._service.setParams('metrics', metricsPieChartsUsers)
    this._service.setParams('dimensions', dimensionsPieChartState)
    this.httpRequest = this._service.getDataFromAnalytics().subscribe(response => {
      this.dataAnalyticsPieChartState = this.setPropertyChart(dimensionsPieChartState, response.body['data'])
      this.dataAnalyticsPieChartState = this.dataAnalyticsPieChartState[0]['series']
      this._service.deleteAllParams()
    }, err => {
      this.showToastrError(err)
      this._service.deleteAllParams()
    })
  }

  /**Função que busca os dados de acesso por cidade no Google Analytics e exibe no gráfico de pizza. */
  getDataPieChartCity() {
    this._service.setParams('metrics', metricsPieChartsUsers)
    this._service.setParams('dimensions', dimensionsPieChartCity)
    this.httpRequest = this._service.getDataFromAnalytics().subscribe(response => {
      this.dataAnalyticsPieChartCity = this.setPropertyChart(dimensionsPieChartCity, response.body['data'])
      this.dataAnalyticsPieChartCity = this.dataAnalyticsPieChartCity[0]['series']
      this._service.deleteAllParams()
    }, err => {
      this.showToastrError(err)
      this._service.deleteAllParams()
    })
  }

  /**Função que busca os dados “Novos Visitantes e Visitantes que retornaram” no Google Analytics e exibe no gráfico de pizza. */
  getDataPieChartUserType() {
    this._service.setParams('metrics', metricsPieChartsUsers)
    this._service.setParams('dimensions', dimensionsPieChartUserType)
    this.httpRequest = this._service.getDataFromAnalytics().subscribe(response => {
      this.dataAnalyticsPieChartUserType = this.setPropertyChart(dimensionsPieChartUserType, response.body['data'])
      this.dataAnalyticsPieChartUserType = this.dataAnalyticsPieChartUserType[0]['series']
      this._service.deleteAllParams()
    }, err => {
      this.showToastrError(err)
      this._service.deleteAllParams()
    })
  }

  /**Função que busca o número de visitas a determinado caminho do site no Google Analytics e exibe em uma tabela. */
  getDataPagePaths() {
    this._service.setParams('metrics', metricPagePath)
    this._service.setParams('dimensions', dimensionPagePath)
    this._service.setParams('filters', filtersPagePath)
    this._service.setParams('sort', sortPagePath)
    this.httpRequest = this._service.getDataFromAnalytics().subscribe(response => {
      this.dataAnalyticsPagePaths = response.body['data']
      this.dataAnalyticsPagePaths = this.dataAnalyticsPagePaths[0][`ga:${dimensionPagePath} & ga:${metricPagePath} & ${filtersPagePath}`]['series']
      this.dataAnalyticsPagePaths = this.showTitle('urls', this.dataAnalyticsPagePaths)
      this._service.deleteAllParams()
    }, err => {
      this.showToastrError(err)
      this._service.deleteAllParams()
    })
  }

  /**Função que busca o número de visitas a determinada notícia do site no Google Analytics e exibe em uma tabela. */
  getDataNoticiaPagePaths() {
    this._service.setParams('metrics', metricPagePath)
    this._service.setParams('dimensions', dimensionPagePath)
    this._service.setParams('filters', filtersNoticiaPagePath)
    this._service.setParams('sort', sortPagePath)
    this.httpRequest = this._service.getDataFromAnalytics().subscribe(response => {
      this.dataAnalyticsNoticiaPaths = response.body['data']
      this.dataAnalyticsNoticiaPaths = this.dataAnalyticsNoticiaPaths[0][`ga:${dimensionPagePath} & ga:${metricPagePath} & ${filtersNoticiaPagePath}`]['series']
      this.dataAnalyticsNoticiaPaths = this.showTitle('noticias', this.dataAnalyticsNoticiaPaths)
      this._service.deleteAllParams()
    }, err => {
      this.showToastrError(err)
      this._service.deleteAllParams()
    })
  }

  /**Função que busca o total de eventos de acessos que aconteceram na página de doações e o total de eventos de pessoas que clicaram no botão de efetivar a doação no Google Analytics e exibe no gráfico de pizza. */
  getDataEventsDonation() {
    this._service.setParams('metrics', metricEventDonation)
    this._service.setParams('dimensions', dimensionEventDonation)
    this._service.setParams('filters', filtersEventDonation)
    this._service.params = this._service.params.delete('sort')
    this.httpRequest = this._service.getDataFromAnalytics().subscribe(response => {
      this.dataAnalyticsEventsDonation = response.body['data']
      this.dataAnalyticsEventsDonation = this.dataAnalyticsEventsDonation[0][`ga:${dimensionEventDonation} & ga:${metricEventDonation} & ${filtersEventDonation}`]['series']
      this._service.deleteAllParams()
    }, err => {
      this.showToastrError(err)
      this._service.deleteAllParams()
    })
  }

}
