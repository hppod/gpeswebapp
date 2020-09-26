import { Directive, Input } from "@angular/core"
import { Validator, NG_VALIDATORS, AbstractControl, ValidationErrors } from "@angular/forms"
import { Subscription } from "rxjs"

@Directive({
    selector: '[compare]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: PasswordEqualsDirective,
        multi: true
    }]
})
export class PasswordEqualsDirective implements Validator {

    @Input('compare') controlNameToCompare: any

    /**Função que valida se as senhas digitadas são iguais. */
    validate(c: AbstractControl): ValidationErrors | null {
        if (c.value != null) {
            if (c.value.length < 6 || c.value === null) {
                return null
            }

            const controlToCompare = c.root.get(this.controlNameToCompare)

            if (controlToCompare) {
                const subscription: Subscription = controlToCompare.valueChanges.subscribe(() => {
                    c.updateValueAndValidity()
                    subscription.unsubscribe()
                })
            }

            return controlToCompare && controlToCompare.value !== c.value ? { 'compare': true } : null
        }
    }
}