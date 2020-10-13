import { Injectable } from "@angular/core"
import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http"
import { Observable } from "rxjs"
import { GPESWebApi } from "./../../app.api"

@Injectable({
    providedIn: 'root'
})
export class AnalyticsService {

    constructor(private http: HttpClient) { }

    params = new HttpParams()

    /**Função para adicionar parâmetros a requisição. */
    setParams(key: string, value: string) {
        this.params = this.params.set(key, value)
    }

    /**Função para apagar todos os parâmetros que foram adicionados a requisição. */
    deleteAllParams() {
        this.params = new HttpParams()
    }

    /**Função que realiza a requisição do tipo GET ao endpoint “/authenticated/analytics/data”. A requisição pode receber parâmetros. */
    getDataFromAnalytics(): Observable<HttpResponse<any>> {
        return this.http.get<any>(`${GPESWebApi}/authenticated/analytics/data`, { params: this.params, observe: 'response' })
    }

}