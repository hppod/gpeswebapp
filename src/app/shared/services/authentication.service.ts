import { Injectable } from "@angular/core"
import { HttpClient, HttpResponse } from "@angular/common/http"
import { BehaviorSubject, Observable } from "rxjs"
import { map } from "rxjs/operators"
import { GPESWebApi } from "./../../app.api"
import { User } from "./../models/auth/user"
import { Role } from "./../models/auth/role"

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private currentUserSubject: BehaviorSubject<User>
    public currentUser: Observable<User>

    constructor(
        private http: HttpClient
    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')))
        this.currentUser = this.currentUserSubject.asObservable()
    }

    /**Função que retorna o valor armazenado no armazenamento de sessão do navegador com o usuário logado atualmente na plataforma. */
    public get currentUserValue(): User {
        return this.currentUserSubject.value
    }

    /**Função que retorna se o usuário atual do sistema possui permissão de acesso de administrador. */
    public get isAdmin() {
        return this.currentUserSubject.value && this.currentUserSubject.value['usuario']['role'] === Role.Administrador
    }

    /**Função que realiza a requisição do tipo POST ao endpoint “login”. A requisição não pode receber parâmetros. */
    login(email: string, senha: string) {
        return this.http.post<any>(`${GPESWebApi}/login`, { email, senha })
            .pipe(map(user => {
                if (user && user.token) {
                    sessionStorage.setItem('currentUser', JSON.stringify(user))
                    sessionStorage.setItem('currentUsername', user['usuario']['user'])
                    this.currentUserSubject.next(user)
                }
                return user
            }))
    }

    /**Função que limpa todos os valores armazenados no armazenamento de sessão, fazendo com que o usuário seja deslogado da aplicação. */
    logout() {
        sessionStorage.removeItem('currentUser')
        sessionStorage.removeItem('currentUsername')
        this.currentUserSubject.next(null)
    }

    /**Função que realiza a requisição do tipo POST ao endpoint “/public/authentication/esqueci-a-senha”. A requisição não pode receber parâmetros. */
    sendMailForgetPassword(email: string): Observable<HttpResponse<any>> {
        return this.http.post(`${GPESWebApi}/public/authentication/esqueci-a-senha`, { email }, { observe: 'response' })
    }

    /**Função que realiza a requisição do tipo POST ao endpoint “/public/authentication/esqueci-a-senha/token”. A requisição possui um parâmetro obrigatório (token). */
    setNewPassword(token: string, senha: string, confirmaSenha: string): Observable<HttpResponse<any>> {
        return this.http.post(`${GPESWebApi}/public/authentication/esqueci-a-senha/${token}`, { senha, confirmaSenha }, { observe: 'response' })
    }
}