import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Selecao } from 'src/app/shared/models/selecao.model';
import { ProcessoSeletivoService } from '../../../../shared/services/processo-seletivo.service';
import { AuthenticationService } from "../../../../shared/services/authentication.service"
import { checkUrlAndSetFirstPage } from 'src/app/shared/functions/last-pagination';
import { ExportExcelService } from 'src/app/shared/services/export-excel.service';
import { formatDate } from '@angular/common';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detalhes-selecao',
  templateUrl: './detalhes-selecao.component.html',
  styleUrls: ['./detalhes-selecao.component.css']
})
export class DetalhesSelecaoComponent implements OnInit, OnDestroy {

  private httpReq: Subscription

  selecao: Selecao[];
  inscritos = []

  dataForExcel = []

  page: number = 1;
  total: number;
  limit: number;
  isLoading: boolean;
  messageApi: string;
  statusResponse: number;
  modalRef: BsModalRef;
  modalEmail: BsModalRef
  emailForm: FormGroup
  botaoAtivo: boolean = true;
  totalItem: number;
  
  valInicial = 10;
  valAtualiza = 10;
  valAtual = this.valInicial;
  limiteValor: number = this.valAtual;

  configLoadingModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    initialState: {
      message: "Excluindo registro...",
      withFooter: false
    }
  }

  configOrderModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false
  }

  subs = new Subscription();

  cursoData = [];
  periodoData = [];
  semestreData = [];  

  constructor(
    private _router: Router,
    private _service: ProcessoSeletivoService,
    private _auth: AuthenticationService,
    private _activatedRoute: ActivatedRoute,
    private _modal: BsModalService,
    private _builder: FormBuilder,
    public _serviceExcel: ExportExcelService,
    private _toastr: ToastrService
  ) {
    checkUrlAndSetFirstPage(this._router.url)
  }

  ngOnInit() {
    const titulo = this._activatedRoute.snapshot.params['title']
    this.getInscritoSelecaoByTitle(titulo)
    this.initForm()
    this.getDataForChart(titulo)
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  get isAdmin() {
    return this._auth.isAdmin
  }

  getInscritoSelecaoByTitle(title: string) {
    this.isLoading = true
    this.httpReq = this._service.getInscritoSelecaoByTitle(title).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.selecao = response.body['data']
      this.inscritos = response.body['data']['inscritos']
      this.totalItem = this.inscritos.length
      this.isLoading = false
    }, err => {
      this.messageApi = err.error['message']
      this.isLoading = false
    })
  }

  getDataForChart(title: string) {
    this.isLoading = true
    this.httpReq = this._service.getInscritosForChart(title).subscribe(response => {
      this.statusResponse = response.status
      this.cursoData = response.body['data']['cursoData']
      this.periodoData = response.body['data']['periodoData']
      this.semestreData = response.body['data']['semestreData']

      console.log(response.body['data'])
    }, err => {
      this.messageApi = err.error['message']
      this.isLoading = false
    })
  }

  showEllipsisInTheText(text: string, limit: number): boolean {
    return text.length > limit;
  }

  openModal(template: TemplateRef<any>) {
    this.modalEmail = this._modal.show(template, this.configOrderModal);
  }
  closeModal(modalId?: number){
    this._modal.hide(modalId)
  }
  
  Cancel() {
    const initialState = { message: "Tem certeza que deseja cancelar o envio de e-mail para os inscritos?" }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState, id: 1 })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.modalEmail.hide()
        this.emailForm.reset()
      }else {
        this.closeModal(1)
      }
    })
  }

  initForm() {
    this.emailForm = this._builder.group({
      assunto:  this._builder.control(null, [Validators.required]),
      mensagem: this._builder.control(null, [Validators.required])
      // file: this._builder.control(null, validatorFileType())
    })
  }

  exportExcel() {
    this.inscritos.forEach((row: any) => {
      this.inscritos['_id'] = 0
      this.dataForExcel.push(Object.values(row))
    })

    let dataInicio = formatDate(this.selecao['dataInicio'], 'dd/MM/yyyy', 'en-US', 'UTC');
    let dataFim = formatDate(this.selecao['dataFim'], 'dd/MM/yyyy', 'en-US', 'UTC');

    let reportData = {
      title: 'Inscritos' + ' - ' + this.selecao['titulo'] + ' - ' + dataInicio + ' - ' + dataFim,
      data: this.dataForExcel,
      headers: Object.keys(this.inscritos[0]),
      description: this.selecao['descricao']
    }
    this._serviceExcel.exportExcel(reportData)
  }

  sendEmail(){
    const titulo = this._activatedRoute.snapshot.params['title']
    let message = {
      assunto:  this.emailForm.value["assunto"],
      conteudo: this.emailForm.value["mensagem"]
    }
    console.log(message);
    this.httpReq = this._service.postEmailInscritos(titulo, message).subscribe(response => {
      this.emailForm.reset()
      this.modalEmail.hide()
      this.showToastrSuccess()
    }, err => {
      this.messageApi = err.error['message']
      this.showToastrError(this.messageApi)
    })
  }

  carregarMais() {
    this.valAtual += this.valAtualiza;
    this.limiteValor = this.valAtual;
    if (this.valAtual >= this.totalItem) {
      this.botaoAtivo = false;
      return;
    }
  }

  /**Função para exibir um toastr de sucesso. */
  showToastrSuccess() {
    this._toastr.success('E-mail enviado com sucesso.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }
  /**Função para exibir um toastr de error. */
  showToastrError(mensagem: string) {
    this._toastr.error(mensagem, null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }
}

