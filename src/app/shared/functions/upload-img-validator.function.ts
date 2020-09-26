import { FormControl } from "@angular/forms"

export function validatorFileType() {
    return function (control: FormControl) {
        const file = control.value
        const type = ['jpg', 'jpeg', 'jfif', 'png']
        var extension 
        let valid: boolean
        if (file) {
            
            if(file.name)
                extension = file.name.split('.')[1].toLowerCase()
            else
                extension = file.filename.split('.')[1].toLowerCase()
                
            for (let index = 0; type.length > index; index++) {
                if (type[index].toLowerCase() !== extension.toLowerCase()) {
                    valid = true
                } else {
                    valid = null
                    break
                }
            }
            if (valid !== null) {
                return {
                    validatorFileType: true
                }
            }
            return null
        }
        return null
    }
}