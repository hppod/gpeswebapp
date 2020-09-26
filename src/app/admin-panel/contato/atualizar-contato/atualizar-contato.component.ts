import { Subscription, Observable } from "rxjs"
import { ToastrService } from "ngx-toastr"
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core'
import { Router, ActivatedRoute } from "@angular/router"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ContatoService } from './../../../shared/services/contato.service';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal"
import { ModalDialogComponent } from "./../../../web-components/common/modals/modal-dialog/modal-dialog.component"
import { Contato } from "src/app/shared/models/contato.model"
import { ContatoValidator } from "src/app/shared/validations/contato.validator"
import { ComponentCanDeactivate } from "src/app/shared/guards/pending-changes.guard"
import { setLastUrl } from "src/app/shared/functions/last-pagination"

@Component({
  selector: 'app-atualizar-contato',
  templateUrl: './atualizar-contato.component.html',
  styleUrls: ['./atualizar-contato.component.css']
})
export class AtualizarContatoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {

  contato: Contato
  messageApi: string
  modalRef: BsModalRef
  httpReq: Subscription
  statusResponse: number
  _formContato: FormGroup

  configLoadingModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    initialState: {
      message: "Atualizando contato...",
      withFooter: false
    }
  }

  estados: any[] = [
    { value: 'AC' },
    { value: 'AL' },
    { value: 'AP' },
    { value: 'AM' },
    { value: 'BA' },
    { value: 'CE' },
    { value: 'DF' },
    { value: 'ES' },
    { value: 'GO' },
    { value: 'MA' },
    { value: 'MT' },
    { value: 'MS' },
    { value: 'MG' },
    { value: 'PA' },
    { value: 'PB' },
    { value: 'PR' },
    { value: 'PE' },
    { value: 'PI' },
    { value: 'RJ' },
    { value: 'RN' },
    { value: 'RS' },
    { value: 'RO' },
    { value: 'RR' },
    { value: 'SC' },
    { value: 'SP' },
    { value: 'SE' },
    { value: 'TO' }
  ]

  redessociais: any[] = [
    { value: 'Facebook' },
    { value: 'Instagram' },
    { value: 'LinkedIn' },
    { value: 'Twitter' },
    { value: 'Outro' }
  ]

  estadoSelecionado: any
  messagePlaceholder: any

  constructor(
    private _router: Router,
    private _builder: FormBuilder,
    private _modal: BsModalService,
    private _toastr: ToastrService,
    private contatoService: ContatoService,
    private _activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getContatoByDescricao()
    setLastUrl(this._router.url)
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this._formContato.dirty) {
      return false
    }
    return true
  }

  getContatoByDescricao() {
    this.httpReq = this.contatoService.getContatoByDescricao(this._activatedRoute.snapshot.params['descricao']).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.contato = response.body['data']
      this.buildForm(this.contato)
    }, err => {
      this.statusResponse = err.status
      this.messageApi = err.error['message']
    })
  }

  buildForm(contato) {
    if (contato.tipo == "Endereço") {
      this.buildFormEndereco()
      this.messagePlaceholder = "Nome do Contato"
    } else if (contato.tipo == "Telefone") {
      this.buildFormTelefone()
      this.messagePlaceholder = "Nome do Contato"
    } else if (contato.tipo == "Email") {
      this.buildFormEmail()
      this.messagePlaceholder = "Nome do Contato"
    } else if (contato.tipo == "Rede Social") {
      this.buildFormRedeSocial()
      this.messagePlaceholder = "Será mostrado no site institucional"
    } else {
      this._formContato = null
    }
  }

  canCancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a atualização do registro atual? Todos os dados serão perdidos." }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this._formContato.reset()
        this._router.navigate(['/admin/contato'])
      }
    })
  }

  onSubmit() {
    this.httpReq = this.contatoService.putContato(this._formContato.value, this.contato._id).subscribe(response => {
      this._formContato.reset()
      this._router.navigate(['/admin/contato'])
      this.showToastrSuccess()
    }, err => {
      this._formContato.reset()
      this._router.navigate(['/admin/contato'])
      this.showToastrError()
    })
  }

  buildFormEndereco() {
    this._formContato = this._builder.group({
      descricao: [this.contato.descricao, [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      tipo: ["Endereço", [Validators.required]],
      endereco: this._builder.group({
        cep: [this.contato.endereco.cep, [Validators.required, Validators.maxLength(8)]],
        rua: [this.contato.endereco.rua, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
        numero: [this.contato.endereco.numero, [Validators.required, Validators.maxLength(4)]],
        bairro: [this.contato.endereco.bairro, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
        cidade: [this.contato.endereco.cidade, [Validators.required, Validators.minLength(1), Validators.maxLength(75)]],
        estado: [this.contato.endereco.estado, [Validators.required, Validators.maxLength(2)]],
        complemento: [this.contato.endereco.complemento, [Validators.maxLength(75)]]
      })
    })
  }

  buildFormTelefone() {
    this._formContato = this._builder.group({
      descricao: [this.contato.descricao, [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      tipo: ["Telefone", [Validators.required]],
      telefone: this._builder.group({
        ddi: [this.contato.telefone.ddi, [Validators.maxLength(4)]],
        prefixo: [this.contato.telefone.prefixo, [Validators.required, Validators.maxLength(2)]],
        numero: [this.contato.telefone.numero, [Validators.required]]
      })
    })
  }

  buildFormEmail() {
    this._formContato = this._builder.group({
      descricao: [this.contato.descricao, [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      tipo: ["Email", [Validators.required]],
      email: [this.contato.email, [Validators.required, Validators.minLength(1), Validators.maxLength(75), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]]
    })
  }

  buildFormRedeSocial() {
    this._formContato = this._builder.group({
      descricao: [this.contato.descricao, [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      tipo: ["Rede Social", [Validators.required]],
      redesocial: this._builder.group({
        tipo: [this.contato.redesocial.tipo, [Validators.required]],
        link: [this.contato.redesocial.link, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]]
      })
    })
  }

  showToastrSuccess() {
    this._toastr.success('O contato foi atualizado com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this._toastr.error('Houve um erro ao atualizar o contato. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  /**Getters */
  get rua() { return this._formContato.get('rua') }
  get cep() { return this._formContato.get('cep') }
  get ddi() { return this._formContato.get('ddi') }
  get tipo() { return this._formContato.get('tipo') }
  get link() { return this._formContato.get('link') }
  get email() { return this._formContato.get('email') }
  get bairro() { return this._formContato.get('bairro') }
  get cidade() { return this._formContato.get('cidade') }
  get estado() { return this._formContato.get('estado') }
  get numero() { return this._formContato.get('numero') }
  get prefixo() { return this._formContato.get('prefixo') }
  get descricao() { return this._formContato.get('descricao') }

}
