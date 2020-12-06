import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Selecao } from 'src/app/shared/models/selecao.model';
import { ProcessoSeletivoService } from '../../../../shared/services/processo-seletivo.service';
import { AuthenticationService } from "../../../../shared/services/authentication.service"
import { ModalDialogComponent } from "./../../../../web-components/common/modals/modal-dialog/modal-dialog.component"
import { ModalLoadingComponent } from "./../../../../web-components/common/modals/modal-loading/modal-loading.component"
import { checkUrlAndSetFirstPage, setLastUrl, getLastPage, setLastPage } from 'src/app/shared/functions/last-pagination';


@Component({
  selector: 'app-detalhes-selecao',
  templateUrl: './detalhes-selecao.component.html',
  styleUrls: ['./detalhes-selecao.component.css']
})
export class DetalhesSelecaoComponent implements OnInit, OnDestroy {

  private httpReq: Subscription

  selecao: Selecao;

  page: number = 1;
  total: number;
  limit: number;
  isLoading: boolean;
  messageApi: string;
  statusResponse: number;
  modalRef: BsModalRef;

  subs = new Subscription();

  constructor(
    private _router: Router,
    private _service: ProcessoSeletivoService,
    private _auth: AuthenticationService,
    private _modal: BsModalService,
    private _toastr: ToastrService,
    private _activatedRoute: ActivatedRoute,
  ) {
    checkUrlAndSetFirstPage(this._router.url)
  }

  ngOnInit() {
    const titulo = this._activatedRoute.snapshot.params['title']
    this.getInscritoSelecaoByTitle(titulo)
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
      this.isLoading = false
    }, err => {
      this.messageApi = err.error['message']
      this.isLoading = false
    })
  }

  showEllipsisInTheText(text: string, limit: number): boolean {
    return text.length > limit;
  }
}

