import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GPESWebApi } from '../../app.api';
import { ProcessoSeletivo } from '../models/processo-seletivo.model';

@Injectable()
export class ProcessoSeletivoService {

  constructor(private http: HttpClient) { }

  params = new HttpParams()

  getProcessoSeletivoWithParams(modifier: string): Observable<HttpResponse<ProcessoSeletivo[]>> {
    return this.http.get<ProcessoSeletivo[]>(`${GPESWebApi}/${modifier}/processoSeletivo/listar-todos`, { params: this.params, observe: 'response' });
  }

  postProcessoSeletivo(formData) {
    return this.http.post<any>(`${GPESWebApi}/authenticated/processoSeletivo/criar/`, formData, { reportProgress: true, observe: 'events' })
  }

}
