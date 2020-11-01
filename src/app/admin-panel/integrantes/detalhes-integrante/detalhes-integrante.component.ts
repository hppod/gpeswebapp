import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Integrantes } from 'src/app/shared/models/integrantes.model';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { IntegrantesService } from 'src/app/shared/services/integrantes.service';

@Component({
  selector: 'app-detalhes-integrante',
  templateUrl: './detalhes-integrante.component.html',
  styleUrls: ['./detalhes-integrante.component.css']
})
export class DetalhesIntegranteComponent implements OnInit, OnDestroy {

  private httpReq: Subscription

  integrante: Integrantes

  modalRef: BsModalRef
  statusResponse: number
  messageApi: string
  isLoading: boolean

  constructor(
    private service: IntegrantesService,
    private r: Router,
    private auth: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private modal: BsModalService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const nome = this.activatedRoute.snapshot.params['nome']

    this.getIntegranteByName(nome)
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  get isAdmin() {
    return this.auth.isAdmin
  }

  getIntegranteByName(nome: string) {
    this.isLoading = true
    this.httpReq = this.service.getIntegranteByName(nome).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.integrante = response.body['data']
      console.log(response.body['data'])
      this.isLoading = false
    }, err => {
      this.messageApi = err.error['message']
      this.isLoading = false
    })
  }

  showToastrSuccess(message: string) {
    this.toastr.success(message, null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError(message: string) {
    this.toastr.error(message, null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

}
