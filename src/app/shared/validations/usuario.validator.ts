import { Injectable } from "@angular/core"
import { AsyncValidatorFn } from "@angular/forms"
import { map, debounceTime, distinctUntilChanged, switchMap, first } from "rxjs/operators"
import { ValidatorService } from "./../services/validator.service"

@Injectable({
    providedIn: 'root'
})
export class UsuarioValidator {

    constructor(
        private _service: ValidatorService
    ) { }

    /**Função que valida se o nome do usuário digitado será único no banco de dados. */
    checkUniqueNome(): AsyncValidatorFn {
        return control => control.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(value => this._service.checkUniqueUsuarioNome(value)),
                map((response) => {
                    if (response['result'] == 0 && control.value != null && control.value != '') {
                        return null
                    } else {
                        return { 'usuarioNomeAlreadyExists': true }
                    }
                }),
                first())
    }

    /**Função que valida se o usuário do usuário digitado será único no banco de dados. */
    checkUniqueUsuario(): AsyncValidatorFn {
        return control => control.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(value => this._service.checkUniqueUsuarioUsuario(value)),
                map((response) => {
                    if (response['result'] == 0 && control.value != null && control.value != '') {
                        return null
                    } else {
                        return { 'usuarioUsuarioAlreadyExists': true }
                    }
                }),
                first())
    }

    /**Função que valida se o e-mail do usuário digitado será único no banco de dados. */
    checkUniqueEmail(): AsyncValidatorFn {
        return control => control.valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                switchMap(value => this._service.checkUniqueUsuarioEmail(value)),
                map((response) => {
                    if (response['result'] == 0 && control.value != null && control.value != '') {
                        return null
                    } else {
                        return { 'usuarioEmailAlreadyExists': true }
                    }
                }),
                first())
    }

}