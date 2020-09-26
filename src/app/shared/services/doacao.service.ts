import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AsiloWebApi } from "./../../app.api"
import { Doacao } from '../models/doacao.model';

@Injectable({
  providedIn: 'root'
})
export class DoacaoService {
  constructor(private http: HttpClient) { }

  URL_CEP = "https://viacep.com.br/ws"

  params = new HttpParams()

  getCep(cep: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL_CEP}/${cep}/json`)
  }

  getValueByRangeDays(): Observable<HttpResponse<any[]>> {
    return this.http.get<any[]>(`${AsiloWebApi}/authenticated/doacao/getValueByRangeDays`, { observe: 'response' })
  }

  getValueDonationStatusPagaByDate(): Observable<HttpResponse<Number>> {
    return this.http.get<Number>(`${AsiloWebApi}/authenticated/doacao/getValueDonationStatusPagaByDate`, { observe: 'response' })
  }

  getValueDonationStatusPagaAllTime(): Observable<HttpResponse<Number>> {
    return this.http.get<Number>(`${AsiloWebApi}/authenticated/doacao/getValueDonationStatusPagaAllTime`, { observe: 'response' })
  }

  getNumberDoacao(): Observable<HttpResponse<Number>> {
    return this.http.get<Number>(`${AsiloWebApi}/authenticated/doacao/getNumberDoacao`, { observe: 'response' })
  }

  getNumberDoadoresByCpf(): Observable<HttpResponse<Number>> {
    return this.http.get<Number>(`${AsiloWebApi}/authenticated/doacao/getNumberDoadoresByCpf`, { observe: 'response' })
  }

  getDoacoesWithParams(): Observable<HttpResponse<Doacao[]>> {
    return this.http.get<Doacao[]>(`${AsiloWebApi}/authenticated/doacao/listar-todos`, { params: this.params, observe: 'response' })
  }

  getDoacaoById(id: string): Observable<HttpResponse<Doacao>> {
    return this.http.get<Doacao>(`${AsiloWebApi}/authenticated/doacao/listar-um/${id}`, { observe: 'response' })
  }

  getTransacionStatus(reference: any): Observable<any> {
    return this.http.get<any>(`${AsiloWebApi}/public/pagseguro/getTransactionStatus?reference=${reference}`, { observe: 'response' })
  }

  getGenerateSession(): Observable<any> {
    return this.http.get<any>(`${AsiloWebApi}/public/pagseguro/generateSession`, { observe: 'response' })
  }

  postTransaction(data: any): Observable<HttpResponse<any>> {
    return this.http.post(`${AsiloWebApi}/public/pagseguro/transaction`, data, { observe: 'response' });
  }

}