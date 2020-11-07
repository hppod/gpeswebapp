import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { setLastUrl } from 'src/app/shared/functions/last-pagination';
import { ComponentCanDeactivate } from 'src/app/shared/guards/pending-changes.guard';
import { Integrantes } from 'src/app/shared/models/integrantes.model';
import { IntegrantesService } from 'src/app/shared/services/integrantes.service';
import { IntegrantesValidator } from 'src/app/shared/validations/integrantes.validator';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-novo-integrante',
  templateUrl: './novo-integrante.component.html',
  styleUrls: ['./novo-integrante.component.css']
})
export class NovoIntegranteComponent implements OnInit, OnDestroy, ComponentCanDeactivate {

  private httpReq: Subscription

  integranteForm: FormGroup
  modalRef: BsModalRef

  total: number = 0
  isLoading: boolean

  success = false
  progress = 0

  configModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false
  }

  constructor(
    private router: Router,
    private service: IntegrantesService,
    private builder: FormBuilder,
    private toastr: ToastrService,
    private modal: BsModalService,
    private _unique: IntegrantesValidator
  ) { }

  ngOnInit(): void {
    setLastUrl(this.router.url)
    this.integranteForm = this.builder.group({
      nome: this.builder.control('', [Validators.required, Validators.maxLength(150)], this._unique.checkUniqueTitulo()),
      contato: this.builder.control(''),
      lattes: this.builder.control(''),
      email: this.builder.control(''),
      dataInicio: this.builder.control(null, [Validators.required]),
      dataFim: this.builder.control(null),
      projetos: this.builder.control(''),
      situacao: this.builder.control(false)
    });
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.integranteForm.dirty) {
      return false
    }
    return true
  }

  postIntegrante(form: Integrantes) {
    if (this.integranteForm.value.dataFim != null) {
      this.integranteForm.value.situacao = true
    }
    this.success = false
    this.httpReq = this.service.postIntegrantes(form)
      .subscribe(response => {
        this.integranteForm.reset()
        this.showToastrSuccess()
        this.router.navigate(['/admin/integrantes'])
      }, err => {
        this.integranteForm.reset()
        this.showToastrError()
        this.router.navigate(['/admin/integrantes'])
      })
  }

  canCancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a inserção do registro atual? Todos os dados serão perdidos." }
    this.modalRef = this.modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.router.navigate(['/admin/integrantes'])
        this.integranteForm.reset()
      }
    })
  }

  showToastrSuccess() {
    this.toastr.success('Integrante foi adicionado com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this.toastr.error('Houve um erro ao adicionar. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  get nome() { return this.integranteForm.get('nome') }
  get contato() { return this.integranteForm.get('contato') }
  get dataInicio() { return this.integranteForm.get('dataInicio') }
  get dataFim() { return this.integranteForm.get('dataFim') }
  get lattes() { return this.integranteForm.get('lattes')}
  get email() {return this.integranteForm.get('email')}

}
