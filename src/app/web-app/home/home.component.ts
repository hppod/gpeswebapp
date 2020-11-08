import { Component, OnInit, OnDestroy } from "@angular/core"
import { HomeService } from "../../shared/services/home.service"
import { Evento } from "../../shared/models/evento.model"
import { Subscription } from "rxjs"
import { GoogleAnalyticsService } from "./../../shared/services/google-analytics.service"
import { __event_home, __category_institucional, __action_home } from "./../../shared/helpers/analytics.consts"
import { Router } from "@angular/router"
import { setLastUrl } from "src/app/shared/functions/last-pagination"

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  public noticias: Evento[];

  private components: Subscription

  constructor(
    private _service: HomeService,
    private _analytics: GoogleAnalyticsService,
    private _router: Router
  ) { }

  ngOnInit() {
    // this.getNoticias()
    // this.sendAnalytics()
    // setLastUrl(this._router.url)
    // this._router.routeReuseStrategy.shouldReuseRoute = () => false
  }

  ngOnDestroy() {
    if (this.components) {
      this.components.unsubscribe();
    }
  }

  // sendAnalytics() {
  //   this._analytics.eventEmitter(__event_home, __category_institucional, __action_home)
  // }

  // getNoticias() {
  //   this._service.params = this._service.params.set('columnSort', 'date')
  //   this._service.params = this._service.params.set('valueSort', 'descending')
  //   this._service.params = this._service.params.set('page', '1')
  //   this._service.params = this._service.params.set('limit', '3')

  //   this.components = this._service.getNoticiasThreeResults('public', 'tmb_ch').subscribe(result => {
  //     this.noticias = result.body['data'];
  //     // this.insertUrlImageNoticia()
  //   },
  //     error => console.log("Erro ao carregar as notícias: ", error)
  //   )
  // }

  // // insertUrlImageNoticia() {
  // //   this.noticias.forEach(element => {
  // //     if (element['sources'].length > 0) {
  // //       let index = element['mainfile_index']
  // //       element.imagemPrincipal = element['sources'][index]['src']
  // //     } else {
  // //       element.imagemPrincipal = 'assets/img/noticias-card/square_red.png'
  // //     }
  // //   })
  // // }

  // showEllipsisInTheText(text: string, limit: number): boolean {
  //   return text.length > limit;
  // }

}