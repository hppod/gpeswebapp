import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { Observable, Subscription } from "rxjs"
import { ToastrService } from "ngx-toastr"
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal"
import { ContatoService } from './../../../shared/services/contato.service';
import { ContatoValidator } from "./../../../shared/validations/contato.validator"
import { ModalDialogComponent } from "./../../../web-components/common/modals/modal-dialog/modal-dialog.component"
import { ComponentCanDeactivate } from 'src/app/shared/guards/pending-changes.guard';
import { setLastUrl } from 'src/app/shared/functions/last-pagination';

@Component({
  selector: 'app-create-contato',
  templateUrl: './create-contato.component.html',
  styleUrls: ['./create-contato.component.css']
})
export class CreateContatoComponent implements OnInit, OnDestroy, ComponentCanDeactivate {

  modalRef: BsModalRef
  _formContato: FormGroup
  progress = 0
  success = false
  httpReq: Subscription

  selectOptionCategory: any[] = [
    { value: 'Endereço' },
    { value: 'Telefone' },
    { value: 'Email' },
    { value: 'Rede Social' }
  ]

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

  tipoSelecionado: any
  messagePlaceholder: string = ""

  constructor(
    private _builder: FormBuilder,
    private _modal: BsModalService,
    private contatoService: ContatoService,
    private _router: Router,
    private _toastr: ToastrService,
    private _unique: ContatoValidator
  ) { }

  ngOnInit() {
    this.verificarTipoSelecionado(null)
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

  verificarTipoSelecionado(tipo) {
    this.tipoSelecionado = tipo
    if (this.tipoSelecionado == "Endereço") {
      this.buildFormEndereco()
      this.messagePlaceholder = "Nome do Contato"
    } else if (this.tipoSelecionado == "Telefone") {
      this.buildFormTelefone()
      this.messagePlaceholder = "Nome do Contato"
    } else if (this.tipoSelecionado == "Email") {
      this.buildFormEmail()
      this.messagePlaceholder = "Nome do Contato"
    } else if (this.tipoSelecionado == "Rede Social") {
      this.buildFormRedeSocial()
      this.messagePlaceholder = "Será mostrado no site institucional"
    } else {
      this.buildFormClean()
    }
  }

  canCancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a inserção do registro atual? Todos os dados serão perdidos." }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this._formContato.reset()
        this._router.navigate(['/admin/contato'])
      }
    })
  }

  onSubmit() {
    this.success = false
    this.contatoService.postContato(this._formContato.value).subscribe(res => {
      this.progress = 0
      this.success = true
      this._formContato.reset()
      this.showToastrSuccess()
      this._router.navigate(['/admin/contato'])
    }, err => {
      this._formContato.reset()
      this.showToastrError()
      this._router.navigate(['/admin/contato'])
    })
  }

  showToastrSuccess() {
    this._toastr.success('O contato foi adicionado com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this._toastr.error('Houve um erro ao adicionar o contato. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  buildFormClean() {
    this._formContato = this._builder.group({
      tipo: [null, Validators.required]
    })
  }

  buildFormEndereco() {
    this._formContato = this._builder.group({
      descricao: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)], this._unique.checkUniqueNome()],
      tipo: ["Endereço", [Validators.required]],
      endereco: this._builder.group({
        cep: [null, [Validators.required, Validators.maxLength(8)]],
        rua: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
        numero: [null, [Validators.required, Validators.maxLength(4)]],
        bairro: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
        cidade: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(75)]],
        estado: [null, [Validators.required, Validators.maxLength(2)]],
        complemento: [null, [Validators.maxLength(75)]]
      })
    })
  }

  buildFormTelefone() {
    this._formContato = this._builder.group({
      descricao: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)], this._unique.checkUniqueNome()],
      tipo: ["Telefone", [Validators.required]],
      telefone: this._builder.group({
        ddi: [null, [Validators.maxLength(4)]],
        prefixo: [null, [Validators.required, Validators.maxLength(2)]],
        numero: [null, [Validators.required]]
      })
    })
  }

  buildFormEmail() {
    this._formContato = this._builder.group({
      descricao: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)], this._unique.checkUniqueNome()],
      tipo: ["Email", [Validators.required]],
      email: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(75), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]]
    })
  }

  buildFormRedeSocial() {
    this._formContato = this._builder.group({
      descricao: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)], this._unique.checkUniqueNome()],
      tipo: ["Rede Social", [Validators.required]],
      redesocial: this._builder.group({
        tipo: [null, [Validators.required]],
        link: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(100)]]
      })
    })
  }

  /*Getters */
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

