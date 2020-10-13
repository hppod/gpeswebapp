import { Injectable } from "@angular/core"
import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http"
import { Observable } from "rxjs"
import { GPESWebApi } from "./../../app.api"
import { Category } from "./../models/category.model"

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    constructor(
        private http: HttpClient
    ) { }

    getExistingCategories(isForm: boolean): Observable<HttpResponse<Category[]>> {
        let params = new HttpParams()
        params = params.append('fields', (isForm ? 'form' : 'search'))
        return this.http.get<Category[]>(`${GPESWebApi}/authenticated/categories/listar`, { params: params, observe: 'response' })
    }

    createNewCategory(body: Category): Observable<HttpResponse<Category>> {
        return this.http.post<Category>(`${GPESWebApi}/authenticated/categories/criar`, body, { observe: 'response' })
    }
}