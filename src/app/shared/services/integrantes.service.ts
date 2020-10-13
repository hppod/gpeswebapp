import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AsiloWebApi } from 'src/app/app.api';
import { Integrantes } from '../models/integrantes.model';

@Injectable({
  providedIn: 'root'
})
export class IntegrantesService {

  constructor(private http: HttpClient) { }

  params = new HttpParams()

  getAllIntegrantesWithParams(modifier: string): Observable<HttpResponse<Integrantes[]>> {
    return this.http.get<Integrantes[]>(`${AsiloWebApi}/${modifier}/integrantes/listar-todos`, { params: this.params, observe: 'response' })
  }

  postIntegrantes(integrante: Integrantes) {
    return this.http.post<Integrantes>(`${AsiloWebApi}/authenticated/integrantes/criar`, integrante, { observe: 'response' })
  }
}
