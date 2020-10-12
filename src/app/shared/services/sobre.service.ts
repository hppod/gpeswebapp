import { Injectable } from '@angular/core'
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http'
import { Observable } from 'rxjs'
import { GPESWebApi } from '../../app.api'
import { Sobre } from '../models/sobre.model'
import { FileSnippet } from 'src/app/web-components/common/file-uploader/FileSnippet.class'

@Injectable()
export class SobreService {

  constructor(private http: HttpClient) { }

  params = new HttpParams()
  deleteParams = new HttpParams()

  getSobreWithParams(modifier: string): Observable<HttpResponse<Sobre[]>> {
    return this.http.get<Sobre[]>(`${GPESWebApi}/${modifier}/sobre/listar-todos`, { params: this.params, observe: 'response' });
  }

  getSobreByTitle(title: string): Observable<HttpResponse<Sobre>> {
    return this.http.get<Sobre>(`${GPESWebApi}/authenticated/sobre/listar-um/${title}`, { observe: 'response' })
  }

  postSobre(formData) {
    return this.http.post<any>(`${GPESWebApi}/authenticated/sobre/criar/`, formData, { reportProgress: true, observe: 'events' })
  }

  deleteSobre(id): Observable<HttpResponse<Sobre>> {
    return this.http.delete<Sobre>(`${GPESWebApi}/authenticated/sobre/apagar/${id}`, { params: id, observe: 'response' })
  }

  updateOrder(title: string, formData) {
    return this.http.put<any>(`${GPESWebApi}/authenticated/sobre/atualizar-ordenacao/${title}`, formData, { observe: 'response' })
  }

  updateSobre(title: string, formData: FormData) {
    return this.http.put<FormData>(`${GPESWebApi}/authenticated/sobre/atualizar/${title}`, formData, { observe: 'response' })
  }

  getDataByTitle(title: string): Observable<HttpResponse<Sobre>> {
    return this.http.get<Sobre>(`${GPESWebApi}/authenticated/sobre/getdata/${title}`, { observe: 'response' })
  }

  getFilesByTitle(size: string, title: string): Observable<HttpResponse<FileSnippet>> {
    return this.http.get<FileSnippet>(`${GPESWebApi}/authenticated/sobre/getfiles/${size}/${title}`, { observe: 'response' })
  }

}
