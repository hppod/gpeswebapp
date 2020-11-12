import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GPESWebApi } from '../../app.api';
import { Inscricao } from './../models/inscricao.model'

@Injectable()
export class InscricaoService {

    constructor(private http: HttpClient) { }

    postInscricao(form: Inscricao) {
        return this.http.post<any>(`${GPESWebApi}/public/processo-seletivo/criar`, form, { observe: 'response' })
    }

}