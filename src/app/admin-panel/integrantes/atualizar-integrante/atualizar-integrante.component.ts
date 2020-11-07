import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-atualizar-integrante',
  templateUrl: './atualizar-integrante.component.html',
  styleUrls: ['./atualizar-integrante.component.css']
})
export class AtualizarIntegranteComponent implements OnInit, OnDestroy {


  private httpReq: Subscription

  integrante: Integrantes
  integranteForm: FormGroup
  modalRef: BsModalRef
  total: number = 0
  isLoading: boolean
  success = false
  progress = 0
  statusResponse: number
  messageApi: string

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
    private unique: IntegrantesValidator,
    private activatedRoute: ActivatedRoute
  ) {
    this.initForm()
  }

  ngOnInit(): void {
    const nome = this.activatedRoute.snapshot.params['nome']
    this.getIntegranteByName(nome)
    setLastUrl(this.router.url)
  }

  getIntegranteByName(nome: string) {
    this.isLoading = true
    this.httpReq = this.service.getIntegranteByName(nome).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.integrante = response.body['data']
      this.isLoading = false
      this.preencherForm(this.integrante)
    }, err => {
      this.messageApi = err.error['message']
      this.isLoading = false
    })
  }

  preencherForm(integrante: Integrantes) {
    this.integranteForm.patchValue({
      nome: integrante['nome'],
      email: integrante['email'],
      contato: integrante['contato'],
      lattes: integrante['lattes'],
      situacao: integrante['situacao'],
      dataInicio: this.formatDate(integrante['dataInicio']),
      dataFim: this.formatDate(integrante['dataFim']),
      projetos: integrante['projetos']
    })
  }

  formatDate(date) {
    if (date != null) {
      let MesString
      let DiaString
      let data = new Date(date)
      let dia = data.getUTCDate()
      let mes = data.getUTCMonth() + 1
      let ano = data.getUTCFullYear()

      if (mes < 10) {
        MesString = '0' + mes.toString()
      } else {
        MesString = mes.toString()
      }
      if (dia < 10) {
        DiaString = '0' + dia.toString()
      } else {
        DiaString = dia.toString()
      }
      return [ano, MesString, DiaString].join('-');
    }
    return null
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  initForm() {
    this.integranteForm = this.builder.group({
      nome: this.builder.control('', [Validators.required, Validators.maxLength(150)]),
      contato: this.builder.control(''),
      lattes: this.builder.control(''),
      email: this.builder.control(''),
      dataInicio: this.builder.control(null, [Validators.required]),
      dataFim: this.builder.control(null),
      projetos: this.builder.control(''),
      situacao: this.builder.control(false)
    });
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.integranteForm.dirty) {
      return false
    }
    return true
  }

  putIntegrante() {
    this.httpReq = this.service.update(this.integrante['nome'], this.integranteForm.value).subscribe(response => {
      this.integranteForm.reset()
      this.success = true
      this.router.navigate(['/admin/integrantes'])
      this.showToastrSuccess()
    }, err => {
      this.integranteForm.reset()
      this.router.navigate(['/admin/integrantes'])
      this.showToastrError()
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
    this.toastr.success('Integrante foi atualizado com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this.toastr.error('Houve um erro ao atualizar. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  get nome() { return this.integranteForm.get('nome') }
  get contato() { return this.integranteForm.get('contato') }
  get dataInicio() { return this.integranteForm.get('dataInicio') }
  get dataFim() { return this.integranteForm.get('dataFim') }
  get lattes() { return this.integranteForm.get('lattes') }
  get email() { return this.integranteForm.get('email') }


}
