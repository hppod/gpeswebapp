import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GPESWebApi } from 'src/app/app.api';
import { Integrantes } from '../models/integrantes.model';

@Injectable({
  providedIn: 'root'
})
export class IntegrantesService {

  constructor(private http: HttpClient) { }

  params = new HttpParams()

  getAllIntegrantesWithParams(modifier: string): Observable<HttpResponse<Integrantes[]>> {
    return this.http.get<Integrantes[]>(`${GPESWebApi}/${modifier}/integrantes/listar-todos`, { params: this.params, observe: 'response' })
  }

  postIntegrantes(form: Integrantes) {
    return this.http.post<Integrantes>(`${GPESWebApi}/authenticated/integrantes/criar`, form, { observe: 'response' })
  }

  getIntegranteByName(nome: string): Observable<HttpResponse<Integrantes>> {
    return this.http.get<Integrantes>(`${GPESWebApi}/authenticated/integrantes/listar-um/${nome}`, { observe: 'response' })
  }

  getIntegranteByNamePublic(nome: string): Observable<HttpResponse<Integrantes>> {
    return this.http.get<Integrantes>(`${GPESWebApi}/public/integrantes/listar-um/${nome}`, { observe: 'response' })
  }

  getAtuaisIntegrantes():Observable<HttpResponse<Integrantes[]>> {
    return this.http.get<Integrantes[]>(`${GPESWebApi}/public/integrantes/listar-atuais`, { params: this.params, observe: 'response' })
  }

  getExIntegrantes():Observable<HttpResponse<Integrantes[]>> {
    return this.http.get<Integrantes[]>(`${GPESWebApi}/public/integrantes/listar-ex`, { params: this.params, observe: 'response' })
  }

  update(nome: string, formData) {
    return this.http.put<any>(`${GPESWebApi}/authenticated/integrantes/atualizar/${nome}`, formData, { observe: 'response' })
  }

}
