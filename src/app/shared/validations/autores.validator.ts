import { Injectable } from "@angular/core"
import { AsyncValidatorFn } from "@angular/forms"
import { map, debounceTime, distinctUntilChanged, switchMap, first } from "rxjs/operators"
import { ValidatorService } from "./../services/validator.service"

@Injectable({
  providedIn: 'root'
})
export class AutoresValidator {

  constructor(
    private _service: ValidatorService
  ) { }

  /**Função que valida se o nome do autor digitado será único no banco de dados. */
  checkUniqueAutorNome(): AsyncValidatorFn {
    return control => control.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(value => this._service.checkUniqueAutorNome(value)),
        map((response) => {
          if (response['result'] == 0 && control.value != null && control.value != '') {
            return null
          } else {
            return { 'autorNomeAlreadyExists': true }
          }
        }),
        first())
  }
}