import { Injectable } from "@angular/core"
import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http"
import { Observable } from "rxjs"
import { AsiloWebApi } from "./../../app.api"
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
        return this.http.get<Category[]>(`${AsiloWebApi}/authenticated/categories/listar`, { params: params, observe: 'response' })
    }

    createNewCategory(body: Category): Observable<HttpResponse<Category>> {
        return this.http.post<Category>(`${AsiloWebApi}/authenticated/categories/criar`, body, { observe: 'response' })
    }
}