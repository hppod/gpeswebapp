import { Component, OnInit, OnDestroy, HostListener } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { Observable, Subscription } from "rxjs"
import { ToastrService } from "ngx-toastr"
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal"
import { PublicacoesService } from "./../../../shared/services/publicacoes.service"
import { PublicacoesValidator } from "./../../../shared/validations/publicacoes.validator"
import { ModalDialogComponent } from "./../../../web-components/common/modals/modal-dialog/modal-dialog.component"
import { ModalFileUploadComponent } from "./../../../web-components/common/modals/modal-file-upload/modal-file-upload.component"
import { requiredFileType } from "./../../../shared/functions/upload-file-validator.function"
import { toResponseBody } from "./../../../shared/functions/to-response-body.function"
import { toFormData } from "./../../../shared/functions/to-form-data.function"
import { ComponentCanDeactivate } from "./../../../shared/guards/pending-changes.guard"
import { setLastUrl } from "./../../../shared/functions/last-pagination"
import { FileSnippet } from "./../../../web-components/common/file-uploader/FileSnippet.class"
import { FileUploaderService } from "./../../../web-components/common/file-uploader/file-uploader.service"
import { Category } from "./../../../shared/models/category.model"
import { CategoryService } from "./../../../shared/services/categories.service"
import { ModalCreateCategoryComponent } from "./../../../web-components/common/modals/modal-create-category/modal-create-category.component"

@Component({
  selector: 'app-create-publicacoes',
  templateUrl: './create-publicacoes.component.html',
  styleUrls: ['./create-publicacoes.component.css']
})
export class CreatePublicacoesComponent implements OnInit, OnDestroy, ComponentCanDeactivate {

  private httpReq: Subscription

  modalRef: BsModalRef
  _formPublicacoes: FormGroup
  progress = 0
  success = false
  maxChars = 500
  role = ''
  chars = 0
  Files: FileSnippet[] = new Array()
  File: File
  selectOptionCategory: Category[] = new Array()
  option: string
  selectedCategory: string = null
  total: Number = 0

  configModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false
  }

  constructor(
    private _builder: FormBuilder,
    private _modal: BsModalService,
    private _service: PublicacoesService,
    private _router: Router,
    private _toastr: ToastrService,
    private _unique: PublicacoesValidator,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    setLastUrl(this._router.url)
    this.initForm()
    this.getCategories()
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  /**Função ativada quando o usuário suja algum formulário e tenta sair da página sem ter salvo ele. Para sair da página ele deve confirmar a ação, evitando que ele perca dados digitados sem querer. */
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this._formPublicacoes.dirty) {
      return false
    }
    return true
  }

  getPublicacoesWithParams() {
    this.httpReq = this._service.getPublicacoesWithParams('authenticated').subscribe(response => {
      if (response.status == 200)
        this.total = response.body['count']
    })
  }

  /**Função para inicializar o formulário */
  initForm() {
    this._formPublicacoes = this._builder.group({
      titulo: this._builder.control(null, [Validators.required], this._unique.checkUniqueTitulo()),
      descricao: this._builder.control(null, [Validators.required]),
      categoria: this._builder.control("Selecione", [Validators.required]),
      autores: this._builder.control(null, [Validators.required]),
      plataforma: this._builder.control(null, [Validators.required]),
      cidade: this._builder.control(null, [Validators.required]),
      ano: this._builder.control(null, [Validators.required])
    })
  }

  getCategories() {
    this.httpReq = this.categoryService.getExistingCategories(true).subscribe(response => {
      this.selectOptionCategory = response.body['data']
      this.selectOptionCategory.push({ nome: "Não encontrou a categoria desejada? Cadastre uma aqui" })
    }, err => {
      this.showToastrError('Houve um erro ao listar as categorias. Serviço indisponível')
    })
  }

  onChange($event) {
    if ($event == "Não encontrou a categoria desejada? Cadastre uma aqui") {
      this.modalRef = this._modal.show(ModalCreateCategoryComponent, this.configModal)
    }
    this.modalRef.content.action.subscribe((data: string) => {
      this.getCategories()
      this.selectedCategory = data
      this._formPublicacoes.controls['categoria'].setValue(this.selectedCategory)
    })
  }

  /**Função que exibe um modal de pergunta ao usuário se ele permite que a inserção do documento seja cancelada. */
  canCancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a inserção do registro atual? Todos os dados serão perdidos." }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this._router.navigate(['/admin/publicacoes'])
        this._formPublicacoes.reset()
      }
    })
  }

  /**Função que define o arquivo no FormData da requisição */
  setDocumentOnForm() {
    this.File = this.Files[0].file
    this._formPublicacoes.controls['arquivo'].setValue(this.File)
    this._formPublicacoes.updateValueAndValidity()
  }

  /**Função que adiciona novos documentos ao banco de dados. */
  addNewDocuments() {
    this.success = false
    this._service.postPublicacoes(this._formPublicacoes.value)
      .subscribe(res => {
        this.success = true
        this._formPublicacoes.reset()
        this.showToastrSuccess('A publicação foi adicionada com sucesso')
        this._router.navigate(['/admin/publicacoes'])
      }, err => {
        this._formPublicacoes.reset()
        this.showToastrError('Houve um erro ao adicionar a publicação. Tente novamente.')
        this._router.navigate(['/admin/publicacoes'])
      })
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
  get titulo() { return this._formPublicacoes.get('titulo') }
  /**Função que retorna o valor do input “descricao”. */
  get descricao() { return this._formPublicacoes.get('descricao') }
  /**Função que retorna o valor do input “categoria”. */
  get categoria() { return this._formPublicacoes.get('categoria') }
  /**Função que retorna o valor do input autores. */
  get autores() { return this._formPublicacoes.get('autores') }
  /**Função que retorna o valor do input plataforma. */
  get plataforma() { return this._formPublicacoes.get('plataforma') }
  /**Função que retorna o valor do input cidade. */
  get cidade() { return this._formPublicacoes.get('cidade') }
  /**Função que retorna o valor do input ano. */
  get ano() { return this._formPublicacoes.get('ano') }

  

}