import { Component, OnInit, EventEmitter, Output } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Subscription } from "rxjs"
import { BsModalRef } from "ngx-bootstrap/modal"
import { ToastrService } from "ngx-toastr"
import { CategoryService } from "./../../../../shared/services/categories.service"
import { CategoriaValidator } from "./../../../../shared/validations/categoria.validator"

@Component({
  selector: 'app-modal-create-category',
  templateUrl: './modal-create-category.component.html',
  styleUrls: ['./modal-create-category.component.css']
})
export class ModalCreateCategoryComponent implements OnInit {

  private httpReq: Subscription

  @Output() action = new EventEmitter
  _formCategoria: FormGroup
  maxChars = 250
  role = ''
  chars = 0

  constructor(
    private _bsModalRef: BsModalRef,
    private _builder: FormBuilder,
    private _unique: CategoriaValidator,
    private categoryService: CategoryService,
    private _toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.initForm()
  }

  /**Função para inicializar o formulário */
  initForm() {
    this._formCategoria = this._builder.group({
      nome: this._builder.control(null, [Validators.required], this._unique.checkUniqueCategoriaNome()),
      descricao: this._builder.control(null, [Validators.required])
    })
  }

  addCategory() {
    this.httpReq = this.categoryService.createNewCategory(this._formCategoria.value).subscribe(response => {
      this.showToastrSuccess(`A categoria ${response.body['data']['nome']} foi adicionada com sucesso!`)
      this.httpReq = this.categoryService.getExistingCategories(true).subscribe(response => {
        this.close(this._formCategoria.controls['nome'].value)
      })
    }, err => {
      this.close(null)
      this.showToastrError('Houve um erro ao adicionar a categoria. Tente novamente')
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
  /**Função que retorna o valor do input “titulo”. */
  get nome() { return this._formCategoria.get('nome') }
  /**Função que retorna o valor do input “descricao”. */
  get descricao() { return this._formCategoria.get('descricao') }

}
