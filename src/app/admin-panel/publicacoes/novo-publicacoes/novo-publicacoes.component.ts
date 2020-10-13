import { Component, OnInit, HostListener } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { Observable, Subscription } from "rxjs"
import { ToastrService } from "ngx-toastr"
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal"
import { TransparenciaService } from "./../../../shared/services/transparencia.service"
import { TransparenciaValidator } from "./../../../shared/validations/transparencia.validator"
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
  selector: 'app-novo-transparencia',
  templateUrl: './novo-publicacoes.component.html',
  styleUrls: ['./novo-publicacoes.component.css']
})
export class NovoPublicacoesComponent implements OnInit, ComponentCanDeactivate {

  private httpReq: Subscription

  modalRef: BsModalRef
  _formTransparencia: FormGroup
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

  configModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false
  }

  constructor(
    private _builder: FormBuilder,
    private _modal: BsModalService,
    private transparenciaService: TransparenciaService,
    private _router: Router,
    private _toastr: ToastrService,
    private _unique: TransparenciaValidator,
    private uploaderService: FileUploaderService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    setLastUrl(this._router.url)
    this.initForm()
    this.getCategories()
  }

  /**Função ativada quando o usuário suja algum formulário e tenta sair da página sem ter salvo ele. Para sair da página ele deve confirmar a ação, evitando que ele perca dados digitados sem querer. */
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this._formTransparencia.dirty) {
      return false
    }
    return true
  }

  /**Função para inicializar o formulário */
  initForm() {
    this._formTransparencia = this._builder.group({
      titulo: this._builder.control(null, [Validators.required], this._unique.checkUniqueTitulo()),
      descricao: this._builder.control(null, [Validators.required]),
      categoria: this._builder.control("Selecione", [Validators.required]),
      arquivo: this._builder.control(null, [Validators.required, requiredFileType('pdf')])
    })
  }

  getCategories() {
    this.httpReq = this.categoryService.getExistingCategories(true).subscribe(response => {
      this.selectOptionCategory = response.body['data']
      this.selectOptionCategory.push({ nome: "Não encontrou a categoria desejada? Cadastre uma aqui" })
    }, err => {
      console.log(err)
    })
  }

  onChange($event) {
    if ($event == "Não encontrou a categoria desejada? Cadastre uma aqui") {
      this.modalRef = this._modal.show(ModalCreateCategoryComponent, this.configModal)
    }
    this.modalRef.content.action.subscribe((data: string) => {
      this.getCategories()
      this.selectedCategory = data
      this._formTransparencia.controls['categoria'].setValue(this.selectedCategory)
    })
  }

  /**Função que exibe um modal de pergunta ao usuário se ele permite que a inserção do documento seja cancelada. */
  canCancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a inserção do registro atual? Todos os dados serão perdidos." }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this._router.navigate(['/admin/transparencia'])
        this._formTransparencia.reset()
      }
    })
  }

  /**Função que define os arquivos do serviço no componente */
  setFiles() {
    this.Files = this.uploaderService.selectedFiles
    this.setDocumentOnForm()
  }

  /**Função que define o arquivo no FormData da requisição */
  setDocumentOnForm() {
    this.File = this.Files[0].file
    this._formTransparencia.controls['arquivo'].setValue(this.File)
    this._formTransparencia.updateValueAndValidity()
  }

  /**Função que adiciona novos documentos ao banco de dados. */
  addNewDocuments() {
    this.success = false
    this.modalRef = this._modal.show(ModalFileUploadComponent)
    this.transparenciaService.postDocuments(toFormData(this._formTransparencia.value)).pipe(
      toResponseBody()
    ).subscribe(res => {
      this.success = true
      this._formTransparencia.reset()
      this.modalRef.hide()
      this.showToastrSuccess('O documento foi adicionado com sucesso')
      this._router.navigate(['/admin/transparencia'])
    }, err => {
      this._formTransparencia.reset()
      this.modalRef.hide()
      this.showToastrError('Houve um erro ao adicionar o documento. Tente novamente.')
      this._router.navigate(['/admin/transparencia'])
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
  get titulo() { return this._formTransparencia.get('titulo') }
  /**Função que retorna o valor do input “descricao”. */
  get descricao() { return this._formTransparencia.get('descricao') }
  /**Função que retorna o valor do input “categoria”. */
  get categoria() { return this._formTransparencia.get('categoria') }

}
