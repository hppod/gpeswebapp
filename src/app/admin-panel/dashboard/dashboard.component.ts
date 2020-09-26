import { Component, OnInit } from '@angular/core';
import { DoacaoService } from 'src/app/shared/services/doacao.service';
import { Doacao } from 'src/app/shared/models/doacao.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { setLastUrl } from 'src/app/shared/functions/last-pagination';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private httpReq: Subscription

  // options ngx charts
  view: any[] = [undefined, 300];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  data: any = [];

  numberDoacao: Number = 0;
  numberDoadores: Number = 0;
  valueDoacaoAllTime = 0;
  valueDoacaoByDate = 0;
  doacaoRangeByDays: any = [];

  doacoes: Doacao[]

  isLoading: boolean = false
  statusResponse: number
  p: number
  total: number = 0;
  limit: number
  statusList = [];


  constructor(
    private _service: DoacaoService,
    private _router: Router
  ) { }

  ngOnInit() {
    this._service.params = this._service.params.set('columnSort', 'data')
    this._service.params = this._service.params.set('valueSort', 'descending')
    this._service.params = this._service.params.set('page', '1')
    this._service.params = this._service.params.set('limit', '5')

    setLastUrl(this._router.url)

    this.getDoacoesWithParams()

    this.getNumberDoacao();
    this.getNumberDoadoresByCpf();
    this.getValueByRangeDays();
    this.getValueDonationStatusPagaAllTime();
    this.getValueDonationStatusPagaByDate();

    console.log("doacaoRangeByDays: ", this.doacaoRangeByDays);

  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  getValueByRangeDays() {
    this._service.getValueByRangeDays().subscribe(res => {
      this.doacaoRangeByDays = res.body['data']
    });
  }

  getNumberDoacao() {
    this._service.getNumberDoacao().subscribe(res => {
      this.numberDoacao = res.body['data']
    });
  }

  getNumberDoadoresByCpf() {
    this._service.getNumberDoadoresByCpf().subscribe(res => {
      this.numberDoadores = res.body['data']
    });
  }

  getValueDonationStatusPagaByDate() {
    this._service.getValueDonationStatusPagaByDate().subscribe(res => {
      this.valueDoacaoByDate = res.body['data'][0].total
    });
  }

  getValueDonationStatusPagaAllTime() {
    this._service.getValueDonationStatusPagaAllTime().subscribe(res => {
      this.valueDoacaoAllTime = res.body['data'][0].total
    });
  }

  getDoacoesWithParams() {
    this.statusList = [];
    this.isLoading = true
    this.httpReq = this._service.getDoacoesWithParams().subscribe(response => {
      this.statusResponse = response.status
      this.doacoes = response.body['data']
      response.body['data'].forEach(async (donate, index) => {
        this.getStatusTransaction(await donate.code_reference, index)
      });

      this.p = response.body['page']
      this.total = response.body['count']
      this.limit = response.body['limit']

      this.isLoading = false
    }, err => {
      this.statusResponse = err.status
      this.isLoading = false
    })
  }

  getStatusTransaction(code_reference: any, index) {
    this._service.getTransacionStatus(code_reference).subscribe(async res => {
      this.statusList[index] = (res.body['data'].status);
    })
  }

}
