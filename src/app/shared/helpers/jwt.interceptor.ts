import { Injectable } from "@angular/core"
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http"
import { Observable } from "rxjs"
import { GPESWebApi } from "./../../app.api"
import { AuthenticationService } from "./../services/authentication.service"

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(
        private _service: AuthenticationService
    ) { }

    /**Função que intercepta todas as requisições feitas para a API para os endpoints privados e adiciona nos Headers  o token de autorização, caso o usuário tenha um. */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const currentUser = this._service.currentUserValue
        const isLoggedIn = currentUser && currentUser.token
        const isApiUrl = request.url.startsWith(GPESWebApi)

        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            })
        }
        return next.handle(request)
    }
}