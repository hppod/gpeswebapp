import { Component } from "@angular/core"
import { Router, NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Event as RouterEvent } from "@angular/router"
import { User } from "./shared/models/auth/user"
import { AuthenticationService } from "./shared/services/authentication.service"

declare let gtag: Function

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = "app"
  router: string;
  currentUser: User
  public isShowingRouteLoadIndicator: boolean

  /**No constructor do componente há duas funções sem nome definido. A primeira adiciona a todos os eventos de rotas da aplicação o ID de identificação de aplicação do Google Analytics. A segunda define se a rota acessada é uma rota do site institucional ou do painel administrativo, e exibe o HTML de acordo com o modificador da rota. */
  constructor(
    public _router: Router,
    private _service: AuthenticationService
  ) {
    let asyncLoadCount = 0

    this._service.currentUser.subscribe(x => this.currentUser = x)

    /**Analytics */
    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'UA-162804430-1', {
          'page_path': event.urlAfterRedirects
        })
      }
    })

    this.isShowingRouteLoadIndicator = false

    /**Micro front-ends */
    _router.events.subscribe((event: RouterEvent): void => {

      if (event instanceof RouteConfigLoadStart) {
        asyncLoadCount++
      } else if (event instanceof RouteConfigLoadEnd) {
        asyncLoadCount--
      }

      this.isShowingRouteLoadIndicator = !!asyncLoadCount
    })

  }

  /**Função que rola a página da aplicação para o início sempre que uma rota é ativada. */
  onActivate($event) {
    window.scroll(0, 0)
  }
}
