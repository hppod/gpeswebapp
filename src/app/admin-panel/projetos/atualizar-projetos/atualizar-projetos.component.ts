import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { setLastUrl } from 'src/app/shared/functions/last-pagination';
import { Integrantes } from 'src/app/shared/models/integrantes.model';
import { Projetos } from 'src/app/shared/models/projetos.model';
import { IntegrantesService } from 'src/app/shared/services/integrantes.service';
import { ProjetosService } from 'src/app/shared/services/projetos.service';
import { ProjetosValidator } from 'src/app/shared/validations/projetos.validator';

@Component({
  selector: 'app-atualizar-projetos',
  templateUrl: './atualizar-projetos.component.html',
  styleUrls: ['./atualizar-projetos.component.css']
})
export class AtualizarProjetosComponent implements OnInit {

  private httpReq: Subscription
  projeto: Projetos
  integranteReq: boolean = false
  selectedIntegrantes: string[] = []
  projetoIntegrantesSelecionados: string[] = []
  integrantesList: Integrantes[]
  projetoForm: FormGroup
  modalRef: BsModalRef
  messageApi: string
  statusResponse: number
  titulo: string

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
    private activatedRoute: ActivatedRoute,
    private _unique: ProjetosValidator
  ) {
    this.initForm()
  }

  ngOnInit(): void {
    this.initForm()
    this.titulo = this.activatedRoute.snapshot.params['titulo']
    this.getData(this.titulo)
    this.getIntegrantes()
    setLastUrl(this.router.url)
  }

  initForm() {
    this.projetoForm = this.builder.group({
      _id: this.builder.control(null),
      titulo: this.builder.control('', [Validators.required, Validators.maxLength(150)]),
      descricao: this.builder.control('', [Validators.required, Validators.maxLength(150)]),
      dataInicio: this.builder.control(null, [Validators.required]),
      dataFim: this.builder.control(null),
      integrantes: this.builder.control(null),
      situacao: this.builder.control(false)
    });
  }

  getData(titulo: string) {
    this.httpReq = this.service.getProjetoByName(titulo).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.projeto = response.body['data']
      if(response.body['data']['integrantes'] != null){
        response.body['data']['integrantes'].forEach(element => {
          this.projetoIntegrantesSelecionados.push(element.nome)
        });
      }
      this.preencheForm(this.projeto)
    }, err => {
      this.statusResponse = err.status
      this.messageApi = err.error['message']
    })
  }

  preencheForm(projeto: Projetos) {
    if(Boolean(this.projetoForm.value.dataFim) == false){
      this.projetoForm.value.situacao = false
      this.projetoForm.value.dataFim = null
    }else if (this.projetoForm.value.dataFim != null) {
      this.projetoForm.value.situacao = true
    }else{
      this.projetoForm.value.situacao = false
    }
    this.projetoForm.patchValue({
      _id: projeto['_id'],
      titulo: projeto['titulo'],
      descricao: projeto['descricao'],
      situacao: projeto['situacao'],
      integrantes: this.projetoIntegrantesSelecionados,
      dataInicio: this.formatDate(projeto['dataInicio']),
      dataFim: this.formatDate(projeto['dataFim'])
    })
  }

  putProjeto() {
    this.substituirId()
    if (this.projetoForm.value.dataFim != null) {
      this.projetoForm.value.situacao = true
    }else{
      this.projetoForm.value.situacao = false
    }
    this.httpReq = this.service.putProjeto(this.projetoForm.value, this.titulo).subscribe(response => {
      this.projetoForm.reset()
      this.showToastrSuccess()
      this.router.navigate(['/admin/projetos'])
    }, err => {
      this.projetoForm.reset()
      this.showToastrError()
      this.router.navigate(['/admin/projetos'])
    })
  }

  substituirId() {
    let idIntegrantes: string[] = []
    this.projetoForm.value.integrantes.forEach(element => {
      this.integrantesList.forEach(elemento => {
        if (elemento.nome == element) {
          idIntegrantes.push(elemento._id)
        }
      })
    });
    this.projetoForm.value.integrantes = idIntegrantes
  }

  formatDate(date) {
    if (date != null) {
      let MesString
      let DiaString
      let data = new Date(date)
      let dia = data.getUTCDate()
      let mes = data.getUTCMonth() + 1
      let ano = data.getUTCFullYear()

      if (mes < 10) {
        MesString = '0' + mes.toString()
      } else {
        MesString = mes.toString()
      }
      if (dia < 10) {
        DiaString = '0' + dia.toString()
      } else {
        DiaString = dia.toString()
      }
      return [ano, MesString, DiaString].join('-');
    }
    return null
  }

  getIntegrantes() {
    this.httpReq = this.serviceIntegrante.getAll('authenticated').subscribe(response => {
      this.selectedIntegrantes = ['initialize']
      if (response.body['count'] > 0) {
        this.integrantesList = response.body['data']
        response.body['data'].forEach(element => {
          this.selectedIntegrantes.push(element.nome)
        });
        this.selectedIntegrantes.splice(0, 1)
      } else {
        this.selectedIntegrantes.push("Não há integrantes!")
        this.selectedIntegrantes.splice(0, 1)
      }
    }, err => {
      this.showToastrErrorIntegrante('Houve um erro ao listar os integrantes. Serviço indisponível')
    })
  }

  showToastrErrorIntegrante(message: string) {
    this.toastr.error(message, null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrSuccess() {
    this.toastr.success('Projeto foi atualizado com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this.toastr.error('Houve um erro ao atualizar. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }
}
