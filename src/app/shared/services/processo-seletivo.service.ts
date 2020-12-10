import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GPESWebApi } from '../../app.api';
import { ProcessoSeletivo } from '../models/processo-seletivo.model';
import { Inscricao } from '../models/inscricao.model';
import { Selecao } from '../models/selecao.model';

@Injectable()
export class ProcessoSeletivoService {

  constructor(private http: HttpClient) { }

  params = new HttpParams()

  getProcessoSeletivoWithParams(modifier: string): Observable<HttpResponse<ProcessoSeletivo[]>> {
    return this.http.get<ProcessoSeletivo[]>(`${GPESWebApi}/${modifier}/processo-seletivo/listar-todos`, { params: this.params, observe: 'response' });
  }

  postProcessoSeletivo(form: ProcessoSeletivo) {
    return this.http.post<any>(`${GPESWebApi}/authenticated/processo-seletivo/criar`, form, { reportProgress: true, observe: 'events' })
  }

  getProcessoSeletivoByTile(title: string): Observable<HttpResponse<ProcessoSeletivo>> {
    return this.http.get<ProcessoSeletivo>(`${GPESWebApi}/authenticated/processo-seletivo/listar-um/${title}`, { observe: 'response' })
  }

  update(title: string, formData) {
    return this.http.put<any>(`${GPESWebApi}/authenticated/processo-seletivo/atualizar/${title}`, formData, { observe: 'response' })
  }

  updateOrder(title: string, formData) {
    return this.http.put<any>(`${GPESWebApi}/authenticated/processo-seletivo/atualizar-ordenacao/${title}`, formData, { observe: 'response' })
  }

  delete(id: string): Observable<{}> {
    return this.http.delete(`${GPESWebApi}/authenticated/processo-seletivo/apagar/${id}`, { observe: 'response' })
  }

  // REQUISIÇÕES DA SELEÇÃO

  getSelecaoAberta(): Observable<HttpResponse<Selecao[]>> {
    return this.http.get<Selecao[]>(`${GPESWebApi}/public/processo-seletivo/selecao-aberta`, { params: this.params, observe: 'response' });
  }

  getSelecaoWithParams(): Observable<HttpResponse<Selecao[]>> {
    return this.http.get<Selecao[]>(`${GPESWebApi}/authenticated/selecao/listar-todos`, { params: this.params, observe: 'response' });
  }

  getInscritoSelecaoByTitle(title: string): Observable<HttpResponse<Selecao>> {
    return this.http.get<Selecao>(`${GPESWebApi}/authenticated/selecao/listar-um/${title}`, { observe: 'response' })
  }

  postSelecao(form: Selecao) {
    return this.http.post<any>(`${GPESWebApi}/authenticated/selecao/criar`, form, { reportProgress: true, observe: 'events' })
  }

  updateSelecao(title: string, formData) {
    return this.http.put<any>(`${GPESWebApi}/authenticated/selecao/atualizar/${title}`, formData, { observe: 'response' })
  }

  deleteSelecao(id: string): Observable<{}> {
    return this.http.delete(`${GPESWebApi}/authenticated/selecao/apagar/${id}`, { observe: 'response' })
  }


  // REQUISIÇÕES DE INSCRIÇÃO

  getInscritoByName(name: string): Observable<HttpResponse<Selecao>> {
    return this.http.get<Selecao>(`${GPESWebApi}/authenticated/selecao/listar-um-inscrito/${name}`, { observe: 'response' })
  }

  postInscricao(form: Inscricao) {
    return this.http.post<any>(`${GPESWebApi}/public/processo-seletivo/criar`, form, { observe: 'response' })
  }
}
