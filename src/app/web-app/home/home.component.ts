import { Component, OnInit, OnDestroy } from "@angular/core";
import { HomeService } from "../../shared/services/home.service";
import { Sobre } from "../../shared/models/sobre.model";
import { Subscription } from "rxjs";
import { GoogleAnalyticsService } from "./../../shared/services/google-analytics.service";
import { __event_home, __category_institucional, __action_home } from "./../../shared/helpers/analytics.consts";
import { Router } from "@angular/router";
import { setLastUrl } from "src/app/shared/functions/last-pagination";
import { Home } from "src/app/shared/models/home.model";
import { scrollPageToTop } from "../../shared/functions/scroll-top";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  private components: Subscription

  public sobre: Sobre;
  public home: Home[];

  p: number = 1
  total: number
  limit: number
  messageApi: string
  statusResponse: number

  constructor(
    private _service: HomeService,
    private _analytics: GoogleAnalyticsService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.sendAnalytics();
    this.getInfoToCardsHome();
    this.getSobrePrincipal();
    setLastUrl(this._router.url)
    this._router.routeReuseStrategy.shouldReuseRoute = () => false
  }

  ngOnDestroy() {
    if (this.components) {
      this.components.unsubscribe();
    }
  }

  sendAnalytics() {
    this._analytics.eventEmitter(__event_home, __category_institucional, __action_home)
  }

  getSobrePrincipal() {
    this.components = this._service.getPrincipalSobre().subscribe(result => {
      this.sobre = result.body['data']
    },
      error => console.log("Erro ao carregar o sobre principal", error)
    )
  }

  getInfoToCardsHome() {
    console.log('entrou')
    this._service.params = this._service.params.set('limit', '2');
    this.components = this._service.getHomeWithParams('public').subscribe(response => {
      this.statusResponse = response.status;
      if(response.status == 200) {
        this.messageApi = response.body['message'];
        this.home = response.body['data'];
        this.p = response.body['page'];
        this.total = response.body['count'];
        this.limit = response.body['limit'];
      }
    }, err => {
      this.messageApi = err;
    })
  }

  getPage(page: number) {
    this.home = null;
    scrollPageToTop(page);
    this._service.params = this._service.params.set('page', page.toString());
    this.getInfoToCardsHome();
  }

  // insertUrlImageNoticia() {
  //   this.noticias.forEach(element => {
  //     if (element['sources'].length > 0) {
  //       let index = element['mainfile_index']
  //       element.imagemPrincipal = element['sources'][index]['src']
  //     } else {
  //       element.imagemPrincipal = 'assets/img/noticias-card/square_red.png'
  //     }
  //   })
  // }

  showEllipsisInTheText(text: string, limit: number): boolean {
    return text.length > limit;
  }

}