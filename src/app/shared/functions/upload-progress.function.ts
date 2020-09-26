import { HttpEvent, HttpEventType } from "@angular/common/http"
import { tap } from "rxjs/operators"


/**Função que retorna o progresso de upload dos arquivos. */
export function uploadProgress<T>(cb: (progress: number) => void) {
    return tap((event: HttpEvent<T>) => {
        if (event.type === HttpEventType.UploadProgress) {
            cb(Math.round((100 * event.loaded) / event.total))
        }
    })
}