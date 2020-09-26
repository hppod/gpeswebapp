import { Injectable } from "@angular/core"
import { Router } from "@angular/router"
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http"
import { Observable, throwError } from "rxjs"
import { catchError } from "rxjs/operators"
import { ToastrService } from "ngx-toastr"
import { AuthenticationService } from "./../services/authentication.service"

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        private _service: AuthenticationService,
        private _router: Router,
        private _toastr: ToastrService
    ) { }

    /**Função que intercepta todas as respostas com status 401 e 403 vindas da API e exibe o toastr de erro. */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403].indexOf(err.status) !== -1) {
                if (err.error.authorization) {
                    this._router.navigate(['/admin/auth/login'])
                    this.showToastrError()
                    this._service.logout()
                }
            }
            const error = err.error.message || err.statusText
            return throwError(error)
        }))
    }

    /**Função para exibir um toastr de erro. */
    showToastrError() {
        this._toastr.error("Sua sessão expirou. Faça o login novamente.", null, {
            progressBar: true,
            positionClass: 'toast-bottom-center'
        })
    }
}