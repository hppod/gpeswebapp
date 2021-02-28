
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ProcessoSeletivoService } from 'src/app/shared/services/processo-seletivo.service';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';
import { ComponentCanDeactivate } from 'src/app/shared/guards/pending-changes.guard';
import { setLastUrl } from 'src/app/shared/functions/last-pagination';
import { Selecao } from 'src/app/shared/models/selecao.model';

@Component({
  selector: 'app-atualizar-selecao',
  templateUrl: './atualizar-selecao.component.html',
  styleUrls: ['./atualizar-selecao.component.css']
})
export class AtualizarSelecaoComponent implements OnInit, ComponentCanDeactivate {

  messageApi: string
  httpReq: Subscription
  statusResponse: number
  selecaoForm: FormGroup
  modalRef: BsModalRef
  success = false
  selecao: Selecao
  atualizarDataInicio: boolean = false

  configLoadingModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    initialState: {
      message: "Atualizando arquivo...",
      withFooter: false
    }
  }

  constructor(
    private _router: Router,
    private _builder: FormBuilder,
    private _modal: BsModalService,
    private _toastr: ToastrService,
    private _service: ProcessoSeletivoService,
    private _activatedRoute: ActivatedRoute
  ) {
    this.initForm()
  }

  ngOnInit() {
    const title = this._activatedRoute.snapshot.params['title']
    this.getData(title)
    setLastUrl(this._router.url)
  }

  ngOnDestoy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.selecaoForm.dirty) {
      return false
    }
    return true
  }

  
  initForm() {
    this.selecaoForm = this._builder.group({
      titulo: this._builder.control('', [Validators.required]),
      descricao: this._builder.control(null, [Validators.required]),
      dataInicio: this._builder.control(null, [Validators.required]),
      dataFim: this._builder.control(null, [Validators.required]),
      status: this._builder.control(true)
    })
  }

  getData(title: string) {
    this.httpReq = this._service.getInscritoSelecaoByTitle(title).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.selecao = response.body['data']
      let dataInicio = this.formatDate(this.selecao.dataInicio);
      let dataAtual = this.formatDate(new Date());
      if (dataInicio > dataAtual) {
        this.atualizarDataInicio = true;
      }
      this.preencheForm(this.selecao)
    }, err => {
      this.statusResponse = err.status
      this.messageApi = err.error['message']
    })
  }

  preencheForm(selecao: Selecao) {
    this.selecaoForm.patchValue({
      titulo: selecao['titulo'],
      descricao: selecao['descricao'],
      dataInicio: this.formatDate(selecao['dataInicio']),
      dataFim: this.formatDate(selecao['dataFim']),
      status: selecao['status'],
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


  updateSelecao() {
      this.httpReq = this._service.updateSelecao(this.selecao['titulo'], this.selecaoForm.value).subscribe(response => {
        this.selecaoForm.reset()
        this.success = true
        this._router.navigate(['/admin/processo-seletivo/selecao'])
        this.showToastrSuccess()
      }, err => {
        this.selecaoForm.reset()
        this._router.navigate(['/admin/processo-seletivo/selecao'])
        this.showToastrError()
      })
  }

  canCancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a atualização do registro atual? Todos os dados serão perdidos." }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.selecaoForm.reset()
        this._router.navigate(['/admin/processo-seletivo/selecao'])
      }
    })
  }

  showToastrSuccess() {
    this._toastr.success('A seleção foi atualizada com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this._toastr.error('Houve um erro ao atualizar a seleção. Tente novamente', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  /**Getters */
  get titulo() { return this.selecaoForm.get('titulo') }
  get descricao() { return this.selecaoForm.get('descricao') }
  get dataInicio() { return this.selecaoForm.get('dataInicio') }
  get dataFim() { return this.selecaoForm.get('dataFim') }
  get status() { return this.selecaoForm.get('status') }

}
