import { Injectable } from "@angular/core"
import { HttpClient, HttpResponse, HttpParams } from "@angular/common/http"
import { Observable } from "rxjs"
<<<<<<< HEAD
import { GPESWebApi } from "../../app.api"
=======
import { AsiloWebApi } from "../../app.api"
>>>>>>> 597ccddab98af9ea0f7456d0fa98c84107e80867
import { Evento } from "../models/evento.model"
import { FileSnippet } from "src/app/web-components/common/file-uploader/FileSnippet.class"

@Injectable()
export class EventosService {

    constructor(private http: HttpClient) { }

    params = new HttpParams()

    getEventoWithParams(modifier: string): Observable<HttpResponse<Evento[]>> {
        //return this.http.get<Evento[]>(`${AsiloWebApi}/${modifier}/noticia/listar-todos/${size}`, { params: this.params, observe: 'response' })
<<<<<<< HEAD
        return this.http.get<Evento[]>(`${GPESWebApi}/${modifier}/eventos/listar-todos`, { params: this.params, observe: 'response' })
    }

    getNoticiaByTitle(title: string, modifier: string): Observable<HttpResponse<Evento>> {
        return this.http.get<Evento>(`${GPESWebApi}/${modifier}/noticia/listar-um/${title}`, { observe: 'response' })
    }

    deleteNoticia(id): Observable<HttpResponse<Evento>> {
        return this.http.delete<Evento>(`${GPESWebApi}/authenticated/noticia/apagar/${id}`, { params: id, observe: 'response' })
    }

    getDataByTitle(title: string): Observable<HttpResponse<Evento>> {
        return this.http.get<Evento>(`${GPESWebApi}/authenticated/noticia/getdata/${title}`, { observe: 'response' })
    }

    getFilesByTitle(size: string, title: string): Observable<HttpResponse<FileSnippet>> {
        return this.http.get<FileSnippet>(`${GPESWebApi}/authenticated/noticia/getfiles/${size}/${title}`, { observe: 'response' })
    }

    createNewEvento(body: Evento): Observable<HttpResponse<Evento>> {
        return this.http.post<Evento>(`${GPESWebApi}/authenticated/eventos/criar`, body, { observe: 'response' })
    }

    postEvento(formData: FormData) {
        return this.http.post<FormData>(`${GPESWebApi}/authenticated/eventos/criar`, formData, { reportProgress: true, observe: 'events' })
    }

    updateNoticia(title: string, formData: FormData) {
        return this.http.put<FormData>(`${GPESWebApi}/authenticated/noticia/atualizar/${title}`, formData, { observe: 'response' })
=======
        return this.http.get<Evento[]>(`${AsiloWebApi}/${modifier}/eventos/listar-todos`, { params: this.params, observe: 'response' })
    }

    getNoticiaByTitle(title: string, modifier: string): Observable<HttpResponse<Evento>> {
        return this.http.get<Evento>(`${AsiloWebApi}/${modifier}/noticia/listar-um/${title}`, { observe: 'response' })
    }

    deleteNoticia(id): Observable<HttpResponse<Evento>> {
        return this.http.delete<Evento>(`${AsiloWebApi}/authenticated/noticia/apagar/${id}`, { params: id, observe: 'response' })
    }

    getDataByTitle(title: string): Observable<HttpResponse<Evento>> {
        return this.http.get<Evento>(`${AsiloWebApi}/authenticated/noticia/getdata/${title}`, { observe: 'response' })
    }

    getFilesByTitle(size: string, title: string): Observable<HttpResponse<FileSnippet>> {
        return this.http.get<FileSnippet>(`${AsiloWebApi}/authenticated/noticia/getfiles/${size}/${title}`, { observe: 'response' })
    }

    createNewEvento(body: Evento): Observable<HttpResponse<Evento>> {
        return this.http.post<Evento>(`${AsiloWebApi}/authenticated/eventos/criar`, body, { observe: 'response' })
    }

    postEvento(formData: FormData) {
        return this.http.post<FormData>(`${AsiloWebApi}/authenticated/eventos/criar`, formData, { reportProgress: true, observe: 'events' })
    }

    updateNoticia(title: string, formData: FormData) {
        return this.http.put<FormData>(`${AsiloWebApi}/authenticated/noticia/atualizar/${title}`, formData, { observe: 'response' })
>>>>>>> 597ccddab98af9ea0f7456d0fa98c84107e80867
    }
}