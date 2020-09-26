import { Injectable } from "@angular/core"
import { HttpClient, HttpResponse, HttpParams } from "@angular/common/http"
import { Observable } from "rxjs"
import { AsiloWebApi } from "../../app.api"
import { Noticia } from "../models/noticia.model"
import { FileSnippet } from "src/app/web-components/common/file-uploader/FileSnippet.class"

@Injectable()
export class NoticiasService {

    constructor(private http: HttpClient) { }

    params = new HttpParams()

    getNoticiasWithParams(modifier: string, size: string): Observable<HttpResponse<Noticia[]>> {
        return this.http.get<Noticia[]>(`${AsiloWebApi}/${modifier}/noticia/listar-todos/${size}`, { params: this.params, observe: 'response' })
    }

    getNoticiaByTitle(title: string, modifier: string): Observable<HttpResponse<Noticia>> {
        return this.http.get<Noticia>(`${AsiloWebApi}/${modifier}/noticia/listar-um/${title}`, { observe: 'response' })
    }

    deleteNoticia(id): Observable<HttpResponse<Noticia>> {
        return this.http.delete<Noticia>(`${AsiloWebApi}/authenticated/noticia/apagar/${id}`, { params: id, observe: 'response' })
    }

    getDataByTitle(title: string): Observable<HttpResponse<Noticia>> {
        return this.http.get<Noticia>(`${AsiloWebApi}/authenticated/noticia/getdata/${title}`, { observe: 'response' })
    }

    getFilesByTitle(size: string, title: string): Observable<HttpResponse<FileSnippet>> {
        return this.http.get<FileSnippet>(`${AsiloWebApi}/authenticated/noticia/getfiles/${size}/${title}`, { observe: 'response' })
    }

    postNoticia(formData: FormData) {
        return this.http.post<FormData>(`${AsiloWebApi}/authenticated/noticia/criar`, formData, { reportProgress: true, observe: 'events' })
    }

    updateNoticia(title: string, formData: FormData) {
        return this.http.put<FormData>(`${AsiloWebApi}/authenticated/noticia/atualizar/${title}`, formData, { observe: 'response' })
    }
}