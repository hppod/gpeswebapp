/**Função que transforma a requisição em uma requisição do tipo FormData */
export function toFormData<T>(formValue: T) {
    const formData = new FormData()

    for (const key of Object.keys(formValue)) {
        const value = formValue[key]
        formData.append(key, value)
    }

    return formData
}