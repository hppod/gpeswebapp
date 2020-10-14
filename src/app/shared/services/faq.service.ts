import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from "@angular/common/http"
import { Observable } from "rxjs"
import { GPESWebApi } from "../../app.api"
import { FAQ } from "../models/faq.model"


@Injectable({
  providedIn: 'root'
})
export class FAQService {

  constructor(private http: HttpClient) { }

  params = new HttpParams()
  deleteParams = new HttpParams()

  getFAQWithParams(modifier: String): Observable<HttpResponse<FAQ[]>> {
    return this.http.get<FAQ[]>(`${GPESWebApi}/${modifier}/faq/listar-todos`, { params: this.params, observe: 'response' })
  }

  getByQuestion(question: string): Observable<HttpResponse<FAQ>> {
    return this.http.get<FAQ>(`${GPESWebApi}/authenticated/faq/listar-um/${question}`, { observe: 'response' })
  }

  post(faq: FAQ): Observable<HttpResponse<any>> {
    return this.http.post(`${GPESWebApi}/authenticated/faq/criar`, faq, { observe: 'response' })
  }

  delete(id: string): Observable<{}> {
    return this.http.delete(`${GPESWebApi}/authenticated/faq/apagar/${id}`, { params: this.deleteParams, observe: 'response' })
  }

  update(pergunta: string, formData) {
    return this.http.put<any>(`${GPESWebApi}/authenticated/faq/atualizar/${pergunta}`, formData, { observe: 'response' })
  }
}
