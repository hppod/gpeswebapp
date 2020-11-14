import { Injectable } from "@angular/core"
import { AsyncValidatorFn } from "@angular/forms"
import { map, debounceTime, distinctUntilChanged, switchMap, first } from "rxjs/operators"
import { ValidatorService } from "./../services/validator.service"

@Injectable({
    providedIn: 'root'
})
export class InscricaoValidator {

    constructor(
        private _service: ValidatorService
    ) { }

    /**Função que valida se o nome do candidato do seletivo digitado será único no banco de dados. */
    checkUniqueNome(): AsyncValidatorFn {
        return control => control.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(value => this._service.checkUniqueInscricaoNome(value)),
                map((response) => {
                    if (response['result'] == 0 && control.value != null && control.value != '') {
                        return null
                    } else {
                        return { 'inscricaoNomeAlreadyExists': true }
                    }
                }),
                first())
    }

    checkUniqueEmail(): AsyncValidatorFn {
        return control => control.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(value => this._service.checkUniqueInscricaoEmail(value)),
                map((response) => {
                    if (response['result'] == 0 && control.value != null && control.value != '') {
                        return null
                    } else {
                        return { 'inscricaoEmailAlreadyExists': true }
                    }
                }),
                first())
    }

    checkUniqueRa(): AsyncValidatorFn {
        return control => control.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(value => this._service.checkUniqueInscricaoRa(value)),
                map((response) => {
                    if (response['result'] == 0 && control.value != null && control.value != '') {
                        return null
                    } else {
                        return { 'inscricaoRaAlreadyExists': true }
                    }
                }),
                first())
    }
}