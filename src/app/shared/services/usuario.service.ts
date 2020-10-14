import { Injectable } from "@angular/core"
import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http"
import { Observable } from "rxjs"
import { GPESWebApi } from "./../../app.api"
import { Usuario } from "./../models/usuario.model"

@Injectable()
export class UsuarioService {

    constructor(private http: HttpClient) { }

    params = new HttpParams()

    getUsersWithParams(): Observable<HttpResponse<Usuario[]>> {
        return this.http.get<Usuario[]>(`${GPESWebApi}/authenticated/usuario/listar-todos`, { params: this.params, observe: 'response' })
    }

    getUserByUser(user: string): Observable<HttpResponse<Usuario>> {
        return this.http.get<Usuario>(`${GPESWebApi}/authenticated/usuario/listar-um/${user}`, { observe: 'response' })
    }

    createNewUser(body: Usuario): Observable<HttpResponse<Usuario>> {
        return this.http.post<Usuario>(`${GPESWebApi}/authenticated/usuario/convite`, body, { observe: 'response' })
    }

    updateUser(user: string, body: Usuario) {
        return this.http.put<Usuario>(`${GPESWebApi}/authenticated/usuario/atualizar/${user}`, body, { observe: 'response' })
    }

    deleteUserByUser(user: string): Observable<HttpResponse<Usuario>> {
        return this.http.delete<Usuario>(`${GPESWebApi}/authenticated/usuario/apagar/${user}`, { observe: 'response' })
    }

    definePasswordNewUser(token: string, senha: string, confirmaSenha: string): Observable<HttpResponse<any>> {
        return this.http.post(`${GPESWebApi}/public/authentication/convite/${token}`, { senha, confirmaSenha }, { observe: 'response' })
    }

    resendMailToUser(user: string): Observable<HttpResponse<any>> {
        return this.http.get(`${GPESWebApi}/authenticated/usuario/reenviar-convite/${user}`, { observe: 'response' })
    }
}