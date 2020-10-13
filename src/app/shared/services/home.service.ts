import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GPESWebApi } from 'src/app/app.api';
import { Noticia } from '../models/noticia.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  params = new HttpParams()

  getNoticiasThreeResults(modifier: string, size: string): Observable<HttpResponse<Noticia[]>> {
    return this.http.get<Noticia[]>(`${GPESWebApi}/${modifier}/noticia/listar-todos/${size}`, { params: this.params, observe: 'response' })
  }
}
