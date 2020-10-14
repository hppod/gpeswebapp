import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
<<<<<<< HEAD
import { GPESWebApi } from 'src/app/app.api';
=======
import { AsiloWebApi } from 'src/app/app.api';
>>>>>>> 597ccddab98af9ea0f7456d0fa98c84107e80867
import { Evento } from '../models/evento.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  params = new HttpParams()

  getNoticiasThreeResults(modifier: string, size: string): Observable<HttpResponse<Evento[]>> {
<<<<<<< HEAD
    return this.http.get<Evento[]>(`${GPESWebApi}/${modifier}/noticia/listar-todos/${size}`, { params: this.params, observe: 'response' })
=======
    return this.http.get<Evento[]>(`${AsiloWebApi}/${modifier}/noticia/listar-todos/${size}`, { params: this.params, observe: 'response' })
>>>>>>> 597ccddab98af9ea0f7456d0fa98c84107e80867
  }
}
