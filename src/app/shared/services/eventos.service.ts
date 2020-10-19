import { Injectable } from "@angular/core"
import { HttpClient, HttpResponse, HttpParams } from "@angular/common/http"
import { Observable } from "rxjs"
import { GPESWebApi } from "../../app.api"
import { Evento } from "../models/evento.model"
import { FileSnippet } from "src/app/web-components/common/file-uploader/FileSnippet.class"

@Injectable()
export class EventosService {

    constructor(private http: HttpClient) { }

    params = new HttpParams()

    getEventoWithParams(modifier: string): Observable<HttpResponse<Evento[]>> {
        //return this.http.get<Evento[]>(`${AsiloWebApi}/${modifier}/eventos/listar-todos/${size}`, { params: this.params, observe: 'response' })
        return this.http.get<Evento[]>(`${GPESWebApi}/${modifier}/eventos/listar-todos`, { params: this.params, observe: 'response' })
    }

    getEventoByTitle(title: string, modifier: string): Observable<HttpResponse<Evento>> {
        return this.http.get<Evento>(`${GPESWebApi}/${modifier}/eventos/listar-um/${title}`, { observe: 'response' })
    }

    deleteEvento(id): Observable<HttpResponse<Evento>> {
        return this.http.delete<Evento>(`${GPESWebApi}/authenticated/eventos/apagar/${id}`, { params: id, observe: 'response' })
    }

    getDataByTitle(title: string): Observable<HttpResponse<Evento>> {
        return this.http.get<Evento>(`${GPESWebApi}/authenticated/eventos/getdata/${title}`, { observe: 'response' })
    }

    getFilesByTitle(size: string, title: string): Observable<HttpResponse<FileSnippet>> {
        return this.http.get<FileSnippet>(`${GPESWebApi}/authenticated/eventos/getfiles/${size}/${title}`, { observe: 'response' })
    }

    createNewEvento(body: Evento): Observable<HttpResponse<Evento>> {
        return this.http.post<Evento>(`${GPESWebApi}/authenticated/eventos/criar`, body, { observe: 'response' })
    }

    postEvento(formData: FormData) {
        return this.http.post<FormData>(`${GPESWebApi}/authenticated/eventos/criar`, formData, { reportProgress: true, observe: 'events' })
    }

    updateEvento(title: string, formData: FormData) {
        return this.http.put<FormData>(`${GPESWebApi}/authenticated/eventos/atualizar/${title}`, formData, { observe: 'response' })
    }
}