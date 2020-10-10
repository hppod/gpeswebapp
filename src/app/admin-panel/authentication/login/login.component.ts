import { Component, OnInit, ViewEncapsulation } from "@angular/core"
import { Router, ActivatedRoute } from "@angular/router"
import { Subscription } from "rxjs"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ToastrService } from "ngx-toastr"
import { first } from "rxjs/operators"
import { AuthenticationService } from "./../../../shared/services/authentication.service"
import { setLastUrl } from "src/app/shared/functions/last-pagination"
import { environment } from "src/environments/environment"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private httpReq: Subscription

  _formLogin: FormGroup
  isLoading: boolean
  submitted: boolean = false
  returnUrl: string
  error: string = ''
  urlToHome: string

  constructor(
    private _builder: FormBuilder,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _service: AuthenticationService,
    private _toastr: ToastrService
  ) {
    if (this._service.currentUserValue && !this.isAdmin) {
      this._router.navigate(['/admin/sobre'])
    } else {
      this._router.navigate(['/admin/analytics'])
    }
  }

  ngOnInit() {
    this.urlToHome = environment.appUrl
    this.initForm()
    setLastUrl(this._router.url)

    if (!this.isAdmin) {
      this.returnUrl = this._activatedRoute.snapshot.queryParams['returnUrl'] || '/admin/analytics'
    } else {
      this.returnUrl = this._activatedRoute.snapshot.queryParams['returnUrl'] || '/admin/sobre'
    }
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  /**Função que inicializa os formulários reativos do componente. */
  initForm() {
    this._formLogin = this._builder.group({
      email: this._builder.control(null, [Validators.required]),
      senha: this._builder.control(null, [Validators.required])
    })
  }

  /**Função que retorna os controles do formulário. */
  get f() {
    return this._formLogin.controls
  }

  /**Função que retorna se o usuário logado tem permissão de administrador. */
  get isAdmin() {
    return this._service.isAdmin
  }

  /**Função que realiza o login do usuário a aplicação. */
  login() {
    if (this._formLogin.invalid) {
      this.showToastrWarning('Para realizar o login, é necessário inserir seus dados de autenticação.')
    } else {
      this.isLoading = true
      this.httpReq = this._service.login(this.f.email.value, this.f.senha.value)
        .pipe(first())
        .subscribe(response => {
          this.submitted = true
          this._router.navigate([this.returnUrl])
          this.isLoading = false
        }, err => {
          this.error = err
          this.isLoading = false
          this.showToastrError(err)
        })
    }
  }

  /**Função para exibir um toastr de erro. */
  showToastrError(message: string) {
    this._toastr.error(message, null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  /**Função para exibir um toastr de advertência. */
  showToastrWarning(message: string) {
    this._toastr.warning(message, null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

}
