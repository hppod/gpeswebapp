import { Injectable } from "@angular/core"
import { TransparenciaService } from "./../../shared/services/transparencia.service"
import { Category } from "src/app/shared/models/category.model"

@Injectable({
    providedIn: 'root'
})
export class TransparenciaHelperService {

    constructor(
        private _service: TransparenciaService
    ) { }

    categorySelectedItem: Category
    categorySelectedTitle: string

    setParamToCategory() {
        this._service.params = this._service.params.set('category', this.categorySelectedItem['nome'])
    }

    deleteParamToCategory() {
        this._service.params = this._service.params.delete('category')
    }

}