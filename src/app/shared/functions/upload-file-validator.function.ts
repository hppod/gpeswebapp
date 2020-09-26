import { FormControl } from "@angular/forms"

/**Função que valida se o tipo de arquivo adicionado ao portal da transparência é do tipo PDF. */
export function requiredFileType(type: string) {
    return function (control: FormControl) {
        const file = control.value
        if (file) {
            const extension = file.name.split('.')[1].toLowerCase()
            if (type.toLowerCase() !== extension.toLowerCase()) {
                return {
                    requiredFileType: true
                }
            }
            return null
        }
        return null
    }
}