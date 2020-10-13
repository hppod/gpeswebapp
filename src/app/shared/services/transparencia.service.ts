import { Injectable } from "@angular/core"
import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http"
import { Observable } from "rxjs"
import { GPESWebApi } from "../../app.api"
import { Transparencia } from "../models/transparencia.model"
import { FileSnippet } from "src/app/web-components/common/file-uploader/FileSnippet.class"

@Injectable()
export class TransparenciaService {

    constructor(private http: HttpClient) { }

    params = new HttpParams()
    deleteParams = new HttpParams()

    /**Função que realiza a requisição do tipo GET ao endpoint “/modificador/transparencia/listar-todos”. O endpoint serve para o modificador público e privado. Ao chamar a função deve ser explicitado qual modificador será utilizado. A requisição pode receber parâmetros. */
    getDocumentsWithParams(modifier: string): Observable<HttpResponse<Transparencia[]>> {
        return this.http.get<Transparencia[]>(`${GPESWebApi}/${modifier}/transparencia/listar-todos`, { params: this.params, observe: 'response' })
    }

    /**Função que realiza a requisição do tipo GET ao endpoint “/authenticated/transparencia/listar-um/title”. A requisição possui um parâmetro obrigatório (title). */
    getDocumentByTile(title: string): Observable<HttpResponse<Transparencia>> {
        return this.http.get<Transparencia>(`${GPESWebApi}/authenticated/transparencia/listar-um/${title}`, { observe: 'response' })
    }

    /**Função que realiza a requisição do tipo POST ao endpoint “/authenticated/transparencia/criar”. A requisição não pode receber parâmetros e deve ser do tipo Form Data. */
    postDocuments(formData) {
        return this.http.post<any>(`${GPESWebApi}/authenticated/transparencia/criar/`, formData, { reportProgress: true, observe: 'events' })
    }

    /**Função que realiza a requisição do tipo GET ao endpoint “/public/transparencia/download/filename”. A requisição não pode receber parâmetros e sua resposta é do tipo Blob. */
    downloadDocument(filename: string): Observable<Blob> {
        return this.http.get(`${GPESWebApi}/public/transparencia/download/${filename}`, { responseType: 'blob' })
    }

    /**Função que realiza a requisição do tipo DELETE ao endpoint “/authenticated/transparencia/apagar”. A requisição pode receber parâmetros. */
    deleteDocument(): Observable<HttpResponse<Transparencia>> {
        return this.http.delete<Transparencia>(`${GPESWebApi}/authenticated/transparencia/apagar`, { params: this.deleteParams, observe: 'response' })
    }

    /**Função que realiza a requisição do tipo PUT ao endpoint “/authenticated/transparencia/atualizar/title”. A requisição possui um parâmetro obrigatório (title) e deve ser do tipo Form Data. */
    updateDocument(title: string, formData: FormData) {
        return this.http.put<FormData>(`${GPESWebApi}/authenticated/transparencia/atualizar/${title}`, formData, { observe: 'response' })
    }

    getDataByTitle(title: string): Observable<HttpResponse<Transparencia>> {
        return this.http.get<Transparencia>(`${GPESWebApi}/authenticated/transparencia/getdata/${title}`, { observe: 'response' })
    }

    getFilesByTitle(title: string): Observable<HttpResponse<FileSnippet>> {
        return this.http.get<FileSnippet>(`${GPESWebApi}/authenticated/transparencia/getfiles/${title}`, { observe: 'response' })
    }
}