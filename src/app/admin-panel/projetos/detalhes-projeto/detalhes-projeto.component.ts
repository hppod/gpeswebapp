import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Projetos } from 'src/app/shared/models/projetos.model';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ProjetosService } from 'src/app/shared/services/projetos.service';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-detalhes-projeto',
  templateUrl: './detalhes-projeto.component.html',
  styleUrls: ['./detalhes-projeto.component.css']
})
export class DetalhesProjetoComponent implements OnInit, OnDestroy {

  private httpReq: Subscription

  projeto: Projetos

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
    private service: ProjetosService,
    private r: Router,
    private auth: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private modal: BsModalService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    const titulo = this.activatedRoute.snapshot.params['titulo']

    this.getProjetoByName(titulo)
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  get isAdmin() {
    return this.auth.isAdmin
  }

  getProjetoByName(titulo: string){
    this.isLoading = true
    this.httpReq = this.service.getProjetoByName(titulo).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.projeto = response.body['data']
      this.isLoading = false
    }, err => {
      this.messageApi = err.error['message']
      this.isLoading = false
    })
  }

  delete(id, titulo){
    const initialState = { message: `Deseja excluir o "${titulo}" ?` }
    this.modalRef = this.modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
          this.modalRef = this.modal.show(ModalDialogComponent, this.configLoadingModal)
          this.service.deleteProjeto(id).subscribe(response => {
            this.service.params = this.service.params.set('columnSort', 'nome')
            this.service.params = this.service.params.set('valueSort', 'ascending')
            this.service.params = this.service.params.set('page', '1')
            this.r.navigate(['/admin/projetos'])
            this.modalRef.hide()
            this.showToastrSuccessExcluir()
          }, err => {
            this.r.navigate(['/admin/projetos'])
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
    this.toastr.success('Projeto foi excluído com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrErrorExcluir() {
    this.toastr.error('Houve um erro ao excluir o projeto. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

}
