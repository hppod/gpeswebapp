import { Component, OnInit, OnDestroy } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { Subscription } from "rxjs"
import { EventosService } from "../../../shared/services/eventos.service"
import { Evento } from "../../../shared/models/evento.model"
import { GoogleAnalyticsService } from "../../../shared/services/google-analytics.service"
import { __event_noticia, __category_institucional, __action_noticia } from "../../../shared/helpers/analytics.consts"
import { AsiloWebApi } from "src/app/app.api"

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.css']
})
export class NoticiaComponent implements OnInit, OnDestroy {

  //Dataset
  noticia: Evento

  //Control Variables
  private httpReq: Subscription
  isLoading: boolean
  messageApi: string
  statusResponse: number
  hasImage: boolean = false
  hasMultipleImages: boolean = false
  source: string

  url: string
  urlNoticia: string

  constructor(
    private _service: EventosService,
    private router: Router,
    private ar: ActivatedRoute,
    private _analytics: GoogleAnalyticsService
  ) { }

  ngOnInit() {
    const titulo: string = this.ar.snapshot.params['title']

    this.sendAnalytics(titulo)
    this.getNoticiaByTitle(titulo)
  }

  ngOnDestroy() {
    this.httpReq.unsubscribe()
  }

  sendAnalytics(titulo: string) {
    this._analytics.eventEmitter(`${__event_noticia}${titulo}`, __category_institucional, `${__action_noticia}${titulo}`)
  }

  getNoticiaByTitle(title: string) {
    this.isLoading = true
    this.httpReq = this._service.getNoticiaByTitle(title, 'public').subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.noticia = response.body['data']
      this.isLoading = false
      // this.setarUrlImagemPrincipal()
    }, err => {
      this.statusResponse = err.status
      this.messageApi = err.body['message']
      this.isLoading = false
    })
  }

  // setarUrlImagemPrincipal() {
  //   let index = this.noticia['mainfile_index']
  //   this.hasImage = this.noticia['file'].length > 0
  //   this.hasMultipleImages = this.noticia['file'].length > 1
  //   this.source = `${AsiloWebApi}/public/download/thumbnail_mainpost/${this.noticia['file'][index].filename}`

  //   for (let index = 0; index < this.noticia.file.length; index++) {
  //     this.noticia.file[index].src = `${AsiloWebApi}/public/download/full_size/${this.noticia['file'][index].filename}`
  //   }
  // }

}
