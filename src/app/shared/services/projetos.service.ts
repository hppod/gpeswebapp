import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GPESWebApi } from 'src/app/app.api';
import { Projetos } from '../models/projetos.model';

@Injectable({
  providedIn: 'root'
})
export class ProjetosService {

  constructor(private http: HttpClient) { }

  params = new HttpParams()

  getProjetosWithParams(modifier: string): Observable<HttpResponse<Projetos[]>> {
    return this.http.get<Projetos[]>(`${GPESWebApi}/${modifier}/projetos/listar-todos`, { params: this.params, observe: 'response' });
  }

  getProjetoByName(titulo: string): Observable<HttpResponse<Projetos>> {
    return this.http.get<Projetos>(`${GPESWebApi}/authenticated/projetos/listar-um/${titulo}`, { observe: 'response' })
  }
  
  deleteProjeto(id):Observable<HttpResponse<Projetos>>{
    return this.http.delete<Projetos>(`${GPESWebApi}/authenticated/projetos/apagar/${id}`, { observe: 'response' })
  }

  postProjeto(form: Projetos) {
    return this.http.post<Projetos>(`${GPESWebApi}/authenticated/projetos/criar`, form, { observe: 'response' })
  }
}
