import { Subscription, Observable } from "rxjs"
import { ToastrService } from "ngx-toastr"
import { Component, OnInit, HostListener } from '@angular/core'
import { Router, ActivatedRoute } from "@angular/router"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Publicacoes } from "./../../../shared/models/publicacoes.model"
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal"
import { toFormData } from "./../../../shared/functions/to-form-data.function"
import { toResponseBody } from "./../../../shared/functions/to-response-body.function"
import { PublicacoesService } from "./../../../shared/services/publicacoes.service"
import { ModalDialogComponent } from "./../../../web-components/common/modals/modal-dialog/modal-dialog.component"
import { ComponentCanDeactivate } from "src/app/shared/guards/pending-changes.guard"
import { setLastUrl } from "src/app/shared/functions/last-pagination"
import { FileSnippet } from "src/app/web-components/common/file-uploader/FileSnippet.class"
import { FileUploaderService } from "src/app/web-components/common/file-uploader/file-uploader.service"
import { ModalFileUploadComponent } from "src/app/web-components/common/modals/modal-file-upload/modal-file-upload.component"
import { ModalCreateCategoryComponent } from "src/app/web-components/common/modals/modal-create-category/modal-create-category.component"
import { Category } from "src/app/shared/models/category.model"
import { CategoryService } from "src/app/shared/services/categories.service"
import { AutoresService } from "./../../../shared/services/autores.service"
import { ModalCreateAutoresComponent } from "./../../../web-components/common/modals/modal-create-autores/modal-create-autores.component"
import { INgxSelectOption } from "ngx-select-ex"

@Component({
  selector: 'app-atualizar-publicacoes',
  templateUrl: './atualizar-publicacoes.component.html',
  styleUrls: ['./atualizar-publicacoes.component.css']
})
export class AtualizarPublicacoesComponent implements OnInit, ComponentCanDeactivate {

  role = ''
  chars = 0
  maxChars = 500
  messageApi: string
  modalRef: BsModalRef
  httpReq: Subscription
  statusResponse: number
  _formPublicacoes: FormGroup
  success: boolean = false
  fileChanged: boolean = false
  selectedCategory: string = null
  selectedAutores: string[] = null
  olderSelectedCategory: string = null
  olderSelectedAutores: string[] = null
  Publicacoes: Publicacoes
  selectOptionCategory: Category[] = new Array()
  selectOptionAutores: string[]
  FileSnippet: FileSnippet[] = new Array()
  File: File

  configLoadingModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    initialState: {
      message: "Atualizando arquivo...",
      withFooter: false
    }
  }

  configModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false
  }

  constructor(
    private _router: Router,
    private _builder: FormBuilder,
    private _modal: BsModalService,
    private _toastr: ToastrService,
    private _service: PublicacoesService,
    private _activatedRoute: ActivatedRoute,
    private uploaderService: FileUploaderService,
    private categoryService: CategoryService,
    private autoresService: AutoresService
  ) {
    this.initForm()
  }

  ngOnInit() {
    const title = this._activatedRoute.snapshot.params['title']
    this.initForm()
    this.getData(title)
    //this.getFiles(title)
    this.getCategories()
    this.getAutores()
    setLastUrl(this._router.url)
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

  /**Função que inicializa os formulários reativos do componente. */
  initForm() {
    this._formPublicacoes = this._builder.group({
      titulo: this._builder.control(null, [Validators.required]),
      descricao: this._builder.control(null, [Validators.required]),
      categoria: this._builder.control("Selecione", [Validators.required]),
      autores: this._builder.control(null, [Validators.required]),
      plataforma: this._builder.control(null, [Validators.required]),
      cidade: this._builder.control(null, [Validators.required]),
      dataPublicacao: this._builder.control(null, [Validators.required])
      //arquivo: this._builder.control(undefined)
    })
  }

  getData(title: string) {
    this.httpReq = this._service.getDataByTitle(title).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.Publicacoes = response.body['data']
      this.populateFormWithValuesToUpdate(this.Publicacoes)
    }, err => {
      this.statusResponse = err.status
      this.messageApi = err.error['message']
    })
  }

  getFiles(title: string) {
    this.httpReq = this._service.getFilesByTitle(title).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.FileSnippet = response.body['data']
      this.uploaderService.updateSelectedFiles(this.FileSnippet)
    }, err => {
      this.statusResponse = err.status
      this.messageApi = err.error['message']
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

  getAutores() {
    this.httpReq = this.autoresService.getExistingAutores().subscribe(response => {
      this.selectOptionAutores = ['initialize']
      response.body['data'].forEach(element => {
        this.selectOptionAutores.push(element.nome)
      });
      this.selectOptionAutores.push("Não encontrou o autor desejado? Cadastre um aqui")
      this.selectOptionAutores.splice(0, 1)
    }, err => {
      this.showToastrError('Houve um erro ao listar os autores. Serviço indisponível')
    })
  }

  onChangeAutor(options: INgxSelectOption[]) {
    for (var index in options) {
      if (options[index].value == "Não encontrou o autor desejado? Cadastre um aqui") {
        this.modalRef = this._modal.show(ModalCreateAutoresComponent, this.configModal)
      }
    }

    this.modalRef.content.action.subscribe((data: string) => {
      this.getAutores()
      this.selectedAutores = this._formPublicacoes.controls['autores'].value
      this.selectedAutores.pop()

      if (data != null) {
        this.selectedAutores.push(data)
      }

      this._formPublicacoes.value.autores = this.selectedAutores
    })
  }

  onChange($event) {
    if ($event == "Não encontrou a categoria desejada? Cadastre uma aqui") {
      this.modalRef = this._modal.show(ModalCreateCategoryComponent, this.configModal)
    }
    this.modalRef.content.action.subscribe((data: string) => {
      if (data != null) {
        this.getCategories()
        this.selectedCategory = data
        this._formPublicacoes.controls['categoria'].setValue(this.selectedCategory)
      } else {
        this.selectedCategory = this.olderSelectedCategory
        this._formPublicacoes.controls['categoria'].setValue(this.selectedCategory)
      }
    })
  }

  /**Função que popula os inputs com os dados a serem atualizados. */
  populateFormWithValuesToUpdate(document: Publicacoes) {
    this._formPublicacoes.patchValue({
      titulo: document['titulo'],
      descricao: document['descricao'],
      categoria: document['categoria'],
      autores: document['autores'],
      plataforma: document['plataforma'],
      cidade: document['cidade'],
      dataPublicacao: this.formatDate(document['dataPublicacao'])
    })
    this.olderSelectedCategory = document['categoria']
    this.olderSelectedAutores = document['autores']
  }

  formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + (d.getDate() + 1);
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  setFiles() {
    this.fileChanged = true
    this.FileSnippet = this.uploaderService.selectedFiles
    this.setDocumentOnForm()
  }

  setDocumentOnForm() {
    this.File = this.FileSnippet[0].file
    this._formPublicacoes.controls['arquivo'].setValue(this.File)
    this._formPublicacoes.updateValueAndValidity()
  }

  updateDocument() {

    /* if (!this.fileChanged) {
       this.setDocumentOnForm()
     }*/

    this.success = false
    //this.modalRef = this._modal.show(ModalFileUploadComponent)
    this._service.updateDocument(this.Publicacoes['titulo'], this._formPublicacoes.value).pipe(
      toResponseBody()
    ).subscribe(res => {
      this.success = true
      this._formPublicacoes.reset()
      //this.modalRef.hide()
      this.showToastrSuccess('O documento foi atualizado com sucesso')
      this._router.navigate(['/admin/publicacoes'])
    }, err => {
      this._formPublicacoes.reset()
      this.modalRef.hide()
      this.showToastrError('Houve um erro ao atualizar o documento. Tente novamente.')
      this._router.navigate(['/admin/publicacoes'])
    })
  }

  /**Função que exibe um modal de pergunta ao usuário se ele permite que a inserção do documento seja cancelada. */
  canCancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a atualização do registro atual? Todos os dados serão perdidos." }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this._formPublicacoes.reset()
        this._router.navigate(['/admin/publicacoes'])
      }
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
  get dataPublicacao() { return this._formPublicacoes.get('dataPublicacao') }

}
