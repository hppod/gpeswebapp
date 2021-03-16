import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Selecao } from 'src/app/shared/models/selecao.model';
import { ProcessoSeletivoService } from '../../../../shared/services/processo-seletivo.service';
import { AuthenticationService } from "../../../../shared/services/authentication.service"
import { checkUrlAndSetFirstPage } from 'src/app/shared/functions/last-pagination';
import { ExportExcelService } from 'src/app/shared/services/export-excel.service';
import { formatDate } from '@angular/common';

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

  subs = new Subscription();

  cursoData = [];
  periodoData = [];
  semestreData = [];  

  constructor(
    private _router: Router,
    private _service: ProcessoSeletivoService,
    private _auth: AuthenticationService,
    private _activatedRoute: ActivatedRoute,
    public _serviceExcel: ExportExcelService
  ) {
    checkUrlAndSetFirstPage(this._router.url)
  }

  ngOnInit() {
    const titulo = this._activatedRoute.snapshot.params['title']
    this.getInscritoSelecaoByTitle(titulo)
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
}

