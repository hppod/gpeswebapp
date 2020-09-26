import { Pipe, PipeTransform } from "@angular/core"

@Pipe({
    name: 'status'
})
export class StatusPipe implements PipeTransform {

    transform(value: any): any {
        let status = value
        if (status) {
            return 'Sim'
        } else {
            return 'Não'
        }
    }
}