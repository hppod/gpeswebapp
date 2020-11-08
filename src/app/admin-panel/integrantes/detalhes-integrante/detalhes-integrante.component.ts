import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Integrantes } from 'src/app/shared/models/integrantes.model';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { IntegrantesService } from 'src/app/shared/services/integrantes.service';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';
import { ModalLoadingComponent } from 'src/app/web-components/common/modals/modal-loading/modal-loading.component';

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

  configLoadingModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    initialState: {
      message: "Excluindo registro...",
      withFooter: false
    }
  }

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
      this.isLoading = false
    }, err => {
      this.messageApi = err.error['message']
      this.isLoading = false
    })
  }

  delete(id, nome){

    const initialState = { message: `Deseja excluir o "${nome}" ?` }
    this.modalRef = this.modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
          this.modalRef = this.modal.show(ModalLoadingComponent, this.configLoadingModal)
          this.service.deleteIntegrante(id).subscribe(response => {
            this.service.params = this.service.params.set('columnSort', 'nome')
            this.service.params = this.service.params.set('valueSort', 'ascending')
            this.service.params = this.service.params.set('page', '1')
            this.r.navigate(['/admin/integrantes'])
            this.modalRef.hide()
            this.showToastrSuccessExcluir()
          }, err => {
            this.r.navigate(['/admin/integrantes'])
            this.modalRef.hide()
            this.showToastrErrorExcluir()
          })
      }
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

  showToastrSuccessExcluir() {
    this.toastr.success('Integrante foi excluído com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrErrorExcluir() {
    this.toastr.error('Houve um erro ao excluir o integrante. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

}
