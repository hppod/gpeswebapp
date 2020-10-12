import { Contato } from '../models/contato.model';
import { Injectable } from "@angular/core"
import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http"
import { Observable } from "rxjs"
import { GPESWebApi } from "../../app.api"

@Injectable()
export class ContatoService {

    constructor(private http: HttpClient) { }

    params = new HttpParams()
    deleteParams = new HttpParams()

    getContatos(): Observable<HttpResponse<Contato[]>> {
        return this.http.get<Contato[]>(`${GPESWebApi}/public/contato/listar-todos`, { observe: 'response' })
    }

    getContatosWithParams(): Observable<HttpResponse<Contato[]>> {
        return this.http.get<Contato[]>(`${GPESWebApi}/authenticated/contato/listar-todos`, { params: this.params, observe: 'response' })
    }

    getContatoByDescricao(descricao: string): Observable<HttpResponse<Contato>> {
        return this.http.get<Contato>(`${GPESWebApi}/authenticated/contato/listar-um/${descricao}`, { observe: 'response' })
    }

    postContato(formData) {
        return this.http.post<any>(`${GPESWebApi}/authenticated/contato/criar/`, formData, { reportProgress: true, observe: 'events' })
    }

    putContato(contato, id): Observable<any> {
        return this.http.put<Contato>(`${GPESWebApi}/authenticated/contato/atualizar/${id}`, contato)
    }

    deleteContato(id): Observable<HttpResponse<Contato>> {
        return this.http.delete<Contato>(`${GPESWebApi}/authenticated/contato/apagar/${id}`, { params: this.deleteParams, observe: 'response' })
    }

}