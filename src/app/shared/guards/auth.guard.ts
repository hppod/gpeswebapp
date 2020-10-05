import { Injectable } from "@angular/core"
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router"
import { AuthenticationService } from "./../services/authentication.service"

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(
        private _router: Router,
        private _service: AuthenticationService
    ) { }

    /**Função que valida se existe algum usuário logado na aplicação. Caso tenha permite que seja navegado para as rotas do painel administrativo. Caso não tenha, redireciona o usuário para a página de login do painel administrativo. */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this._service.currentUserValue
        if (currentUser) {
            if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
                this._router.navigate(['/admin/analytics'])
                return false
            }
            return true
        }
        this._router.navigate(['/admin/auth/login'], { queryParams: { returnUrl: state.url } })
        return false
    }
}