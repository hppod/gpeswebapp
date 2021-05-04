import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GPESWebApi } from 'src/app/app.api';
import { Home } from "./../models/home.model";
import { Sobre } from "../../shared/models/sobre.model"
import { Projetos } from '../models/projetos.model';
import { Integrantes } from '../models/integrantes.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  params = new HttpParams()
  deleteParams = new HttpParams()

  // REQUISIÇÕES DAS INFORMAÇÕES DOS CARDS DA HOME 

  getHomeWithParams(modifier: string): Observable<HttpResponse<Home[]>> {
    return this.http.get<Home[]>(`${GPESWebApi}/${modifier}/home/listar-todos`, { params: this.params, observe: 'response' });
  }

  getHomeByTitle(title: string): Observable<HttpResponse<Home>> {
    return this.http.get<Home>(`${GPESWebApi}/authenticated/home/listar-um/${title}`, { observe: 'response' })
  }

  createHome(form: Home) {
    return this.http.post<any>(`${GPESWebApi}/authenticated/home/criar`, form, { reportProgress: true, observe: 'events' })
  }

  updateHome(title: string, formData) {
    return this.http.put<FormData>(`${GPESWebApi}/authenticated/home/atualizar/${title}`, formData, { observe: 'response' })
  }

  deleteHome(id): Observable<{}> {
    return this.http.delete(`${GPESWebApi}/authenticated/home/apagar/${id}`, { observe: 'response' })
  }

  // REQUISIÇÕES DAS DEMAIS INFORMAÇÕES QUE SÃO EXIBIDAS NA HOME

  getPrincipalSobre(): Observable<HttpResponse<Sobre>> {
    return this.http.get<Sobre>(`${GPESWebApi}/public/sobre/listar-principal`, { observe: 'response' })
  }

  getProjetosAtuais(): Observable<HttpResponse<Projetos[]>> {
    return this.http.get<Projetos[]>(`${GPESWebApi}/public/projetos/listar-atuais`, { params: this.params, observe: 'response' });
  }

  getAtuaisIntegrantes():Observable<HttpResponse<Integrantes[]>> {
    return this.http.get<Integrantes[]>(`${GPESWebApi}/public/integrantes/listar-atuais`, { params: this.params, observe: 'response' })
  }

}
