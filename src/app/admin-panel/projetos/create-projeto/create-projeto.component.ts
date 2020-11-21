import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { INgxSelectOption } from 'ngx-select-ex';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { setLastUrl } from 'src/app/shared/functions/last-pagination';
import { Integrantes } from 'src/app/shared/models/integrantes.model';
import { Projetos } from 'src/app/shared/models/projetos.model';
import { IntegrantesService } from 'src/app/shared/services/integrantes.service';
import { ProjetosService } from 'src/app/shared/services/projetos.service';
import { ProjetosValidator } from 'src/app/shared/validations/projetos.validator';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-create-projeto',
  templateUrl: './create-projeto.component.html',
  styleUrls: ['./create-projeto.component.css']
})
export class CreateProjetoComponent implements OnInit {


  private httpReq: Subscription
  integranteReq: boolean = false
  selectedIntegrantes: string[] = []
  integrantesList: Integrantes[]
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
    private serviceIntegrante: IntegrantesService,
    private builder: FormBuilder,
    private toastr: ToastrService,
    private modal: BsModalService,
    private _unique: ProjetosValidator
  ) { }


  ngOnInit(): void {
    setLastUrl(this.router.url)
    this.getIntegrantes()
    this.projetoForm = this.builder.group({
      titulo: this.builder.control('', [Validators.required, Validators.maxLength(150)], this._unique.checkUniqueTitulo()),
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

  getIntegrantes() {
    this.httpReq = this.serviceIntegrante.getAll('authenticated').subscribe(response =>{
      this.selectedIntegrantes = ['initialize']
      if(response.body['count'] > 0){
        this.integrantesList = response.body['data']
        response.body['data'].forEach(element => {
          this.selectedIntegrantes.push(element.nome)
        });
        this.selectedIntegrantes.splice(0, 1)
      }else{
        this.selectedIntegrantes.push("Não há integrantes!")
        this.selectedIntegrantes.splice(0, 1)
      }
    }, err => {
      this.showToastrErrorIntegrante('Houve um erro ao listar os integrantes. Serviço indisponível')
    })
  }

  postProjetos(form: Projetos) {
    this.substituirId()
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

  substituirId(){
    let idIntegrantes: string[] = []
    this.projetoForm.value.integrantes.forEach(element => {
      this.integrantesList.forEach(elemento =>{
        if(elemento.nome == element){
          idIntegrantes.push(elemento._id)
        }
      })
    });
    this.projetoForm.value.integrantes = idIntegrantes
  }

  canCancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a inserção do registro atual? Todos os dados serão perdidos." }
    this.modalRef = this.modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.router.navigate(['/admin/projetos'])
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

  showToastrErrorIntegrante(message: string) {
    this.toastr.error(message, null, {
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
