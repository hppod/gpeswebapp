import { Directive, ElementRef } from "@angular/core"

@Directive({
    selector: '[togglePassword]'
})
export class PasswordToggleDirective {

    private _show: boolean = false

    constructor(
        private _element: ElementRef
    ) {
        this.setup();
    }

    /**Função que inicializa as propriedades para exibir a senha caso o usuário solicite. */
    setup() {
        const parent = this._element.nativeElement.parentNode
        const span = document.createElement('span')
        span.className = 'togglePassword'
        span.innerHTML = 'Exibir senha'
        span.addEventListener('click', () => {
            this.toggle(span)
        })
        parent.appendChild(span)
    }

    /**Função que exibe a senha caso o usuário solicite. Caso já esteja sendo exibida, esconde-a. */
    toggle(span: HTMLElement) {
        this._show = !this._show

        if (this._show) {
            this._element.nativeElement.setAttribute('type', 'text')
            span.innerHTML = 'Esconder senha'
        } else {
            this._element.nativeElement.setAttribute('type', 'password')
            span.innerHTML = 'Exibir senha'
        }
    }
}