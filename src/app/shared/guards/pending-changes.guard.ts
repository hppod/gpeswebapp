import { Injectable } from "@angular/core"
import { CanDeactivate } from "@angular/router"
import { Observable } from "rxjs"

export interface ComponentCanDeactivate {
    canDeactivate: () => boolean | Observable<boolean>
}

@Injectable()
export class PendingChangesGuard implements CanDeactivate<ComponentCanDeactivate>{

    /**Função que valida se algum formulário foi sujo e não permite o usuário sair da página caso ele não confirma a ação, evitando que ele perca dados digitados sem querer. */
    canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
        if (component) {
            return component.canDeactivate() ?
                true : confirm('ATENÇÃO: Você tem alterações pendentes que não serão salvas caso saia da página. Clique em "Cancelar" caso não queira sair da página.')
        }
    }
}