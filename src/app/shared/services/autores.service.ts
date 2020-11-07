import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from "@angular/common/http"
import { Observable } from "rxjs"
import { GPESWebApi } from "./../../app.api"
import { Autores } from "./../models/autores.model"

@Injectable({
  providedIn: 'root'
})
export class AutoresService {

  constructor(
    private http: HttpClient
  ) { }

  getExistingAutores(): Observable<HttpResponse<Autores[]>> {
    return this.http.get<Autores[]>(`${GPESWebApi}/authenticated/autores/listar`, { observe: 'response' })
  }

  postAutores(body: Autores): Observable<HttpResponse<Autores>> {
    return this.http.post<Autores>(`${GPESWebApi}/authenticated/autores/criar`, body, { observe: 'response' })
  }
}
