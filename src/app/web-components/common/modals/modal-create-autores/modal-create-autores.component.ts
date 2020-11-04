import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Subscription } from "rxjs"
import { BsModalRef } from "ngx-bootstrap/modal"
import { ToastrService } from "ngx-toastr"
import { AutoresService } from "./../../../../shared/services/autores.service"
import { AutoresValidator } from "./../../../../shared/validations/autores.validator"

@Component({
  selector: 'app-modal-create-autores',
  templateUrl: './modal-create-autores.component.html',
  styleUrls: ['./modal-create-autores.component.css']
})
export class ModalCreateAutoresComponent implements OnInit {

  private httpReq: Subscription

  @Output() action = new EventEmitter
  _formAutores: FormGroup
  maxChars = 250
  role = ''
  chars = 0

  constructor(
    private _bsModalRef: BsModalRef,
    private _builder: FormBuilder,
    private _unique: AutoresValidator,
    private autoresService: AutoresService,
    private _toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.initForm()
  }

  /**Função para inicializar o formulário */
  initForm() {
    this._formAutores = this._builder.group({
      nome: this._builder.control(null, [Validators.required], this._unique.checkUniqueAutorNome())
    })
  }

  addAutores() {
    this.httpReq = this.autoresService.postAutores(this._formAutores.value).subscribe(response => {
      this.showToastrSuccess(`O autor ${response.body['data']['nome']} foi adicionado com sucesso!`)
      this.httpReq = this.autoresService.getExistingAutores().subscribe(response => {
        this.close(this._formAutores.controls['nome'].value)
      })
    }, err => {
      this.close(null)
      this.showToastrError('Houve um erro ao adicionar a autor. Tente novamente')
    })
  }

  canCancel() {
    this.close(null)
  }

  close(emitter: string) {
    this.action.emit(emitter)
    this._bsModalRef.hide()
  }

  /**Função para exibir um toastr de sucesso. */
  showToastrSuccess(message: string) {
    this._toastr.success(message, null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  /**Função para exibir um toastr de erro. */
  showToastrError(message: string) {
    this._toastr.error(message, null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  /**Getters */
  /**Função que retorna o valor do input “nome”. */
  get nome() { return this._formAutores.get('nome') }
}
