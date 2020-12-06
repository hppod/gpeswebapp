import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProcessoSeletivoService } from "./../../../../shared/services/processo-seletivo.service"
import { AuthenticationService } from "./../../../../shared/services/authentication.service"
import { Subscription } from "rxjs"
import { ActivatedRoute, Router } from "@angular/router"
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal"
import { ModalDialogComponent } from "./../../../../web-components/common/modals/modal-dialog/modal-dialog.component"
import { ModalLoadingComponent } from "./../../../../web-components/common/modals/modal-loading/modal-loading.component"
import { ToastrService } from "ngx-toastr"
import { Inscricao } from 'src/app/shared/models/inscricao.model';

@Component({
  selector: 'app-detalhes-inscrito',
  templateUrl: './detalhes-inscrito.component.html',
  styleUrls: ['./detalhes-inscrito.component.css']
})
export class DetalhesInscritoComponent implements OnInit, OnDestroy {

  private httpReq: Subscription

  inscrito: Inscricao

  statusResponse: number
  messageApi: string
  isLoading: boolean

  constructor(
    private _service: ProcessoSeletivoService,
    private _activatedRoute: ActivatedRoute,
    private _auth: AuthenticationService,
  ) { }

  ngOnInit() {
    const nome = this._activatedRoute.snapshot.params['name']

    this.getInscritoByName(nome)
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  get isAdmin() {
    return this._auth.isAdmin
  }

  getInscritoByName(name: string) {
    this.isLoading = true
    this.httpReq = this._service.getInscritoByName(name).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.inscrito = response.body['data']
      this.isLoading = false
    }, err => {
      this.messageApi = err.error['message']
      this.isLoading = false
    })
  }

}
