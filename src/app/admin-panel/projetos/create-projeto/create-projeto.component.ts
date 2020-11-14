import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { setLastUrl } from 'src/app/shared/functions/last-pagination';
import { Projetos } from 'src/app/shared/models/projetos.model';
import { ProjetosService } from 'src/app/shared/services/projetos.service';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-create-projeto',
  templateUrl: './create-projeto.component.html',
  styleUrls: ['./create-projeto.component.css']
})
export class CreateProjetoComponent implements OnInit {


  private httpReq: Subscription

  projetoForm: FormGroup
  modalRef: BsModalRef

  total: number = 0
  isLoading: boolean

  success = false
  progress = 0

  configModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false
  }

  constructor(
    private router: Router,
    private service: ProjetosService,
    private builder: FormBuilder,
    private toastr: ToastrService,
    private modal: BsModalService,
    // private _unique: ProjetosValidator
  ) { }


  ngOnInit(): void {
    setLastUrl(this.router.url)
    this.projetoForm = this.builder.group({
      titulo: this.builder.control('', [Validators.required, Validators.maxLength(150)]),
      descricao: this.builder.control('', [Validators.required, Validators.maxLength(150)]),
      dataInicio: this.builder.control(null, [Validators.required]),
      dataFim: this.builder.control(null),
      integrantes: this.builder.control(null),
      situacao: this.builder.control(false)
    });
  }
  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.projetoForm.dirty) {
      return false
    }
    return true
  }

  postIntegrante(form: Projetos) {
    if (this.projetoForm.value.dataFim != null) {
      this.projetoForm.value.situacao = true
    }
    this.success = false
    this.httpReq = this.service.postProjeto(form)
      .subscribe(response => {
        this.projetoForm.reset()
        this.showToastrSuccess()
        this.router.navigate(['/admin/projetos'])
      }, err => {
        this.projetoForm.reset()
        this.showToastrError()
        this.router.navigate(['/admin/projetos'])
      })
  }

  canCancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a inserção do registro atual? Todos os dados serão perdidos." }
    this.modalRef = this.modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.router.navigate(['/admin/integrantes'])
        this.projetoForm.reset()
      }
    })
  }

  showToastrSuccess() {
    this.toastr.success('Projeto foi adicionado com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this.toastr.error('Houve um erro ao adicionar. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  get titulo() { return this.projetoForm.get('titulo') }
  get descricao() { return this.projetoForm.get('descricao') }
  get dataInicio() { return this.projetoForm.get('dataInicio') }
  get dataFim() { return this.projetoForm.get('dataFim') }
  get integrantes() { return this.projetoForm.get('integrantes') }

}
