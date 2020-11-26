import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { InscricaoValidator } from 'src/app/shared/validations/inscricao.validator';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';
import { ProcessoSeletivoService } from "../../../shared/services/processo-seletivo.service";
import { Inscricao } from 'src/app/shared/models/inscricao.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-inscricao',
  templateUrl: './inscricao.component.html',
  styleUrls: ['./inscricao.component.css']
})
export class InscricaoComponent implements OnInit {

  private httpReq: Subscription;

  formInscricao: FormGroup;
  modalRef: BsModalRef;
  success = false;
  isLoading: boolean;
  messageApi: string;
  statusResponse: number;
  idSelecao: any;

  constructor(
    private _builder: FormBuilder,
    private _service: ProcessoSeletivoService,
    private _toastr: ToastrService,
    private _unique: InscricaoValidator,
    private _modal: BsModalService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getSelecaoAberta();
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.formInscricao.dirty) {
      return false
    }
    return true
  }

  initForm() {
    this.formInscricao = this._builder.group({
      nome: this._builder.control(null, [Validators.required], this._unique.checkUniqueNome()),
      email: this._builder.control(null, [Validators.required], this._unique.checkUniqueEmail()),
      telefone: this._builder.control(null),
      cidade: this._builder.control(null, [Validators.required]),
      ra: this._builder.control(null, [Validators.required], this._unique.checkUniqueRa()),
      curso: this._builder.control(null, [Validators.required]),
      periodo: this._builder.control(null, [Validators.required]),
      semestre: this._builder.control(null, [Validators.required]),
      descricao: this._builder.control(null, [Validators.required]),
      selecao: this._builder.control(null),
    });
  }

  postInscricao(form: Inscricao): void {
    this.success = false
    this.isLoading = true
    form.selecao = this.idSelecao;
    this.httpReq = this._service.postInscricao(form).subscribe(response => {
      this.success = true
      this.isLoading = false
      this.formInscricao.reset()
      this.showToastrSuccess('A inscrição foi realizada com sucesso')
    }, err => {
      this.formInscricao.reset()
      this.showToastrError('Houve um erro ao realizar a inscrição. Tente novamente.')
    })
    
  }

  getSelecaoAberta() {
    this.httpReq = this._service.getSelecaoAberta().subscribe(response => {
      this.statusResponse = response.status;
      if (response.status == 200 && response.body['data'].length == 1) {
        if (response.body['data'][0].status == true) {
          let dataInicio = this.formatDate(response.body['data'][0].dataInicio);
          let dataFim = this.formatDate(response.body['data'][0].dataFim);
          let dataAtual = this.formatDate(new Date());
          if (dataInicio <= dataAtual && dataFim >= dataAtual) {
            this.messageApi = response.body['message'];
            this.idSelecao = response.body['data'][0]._id;
          }
        }
      }
    }, err => {
      this.messageApi = err
    })
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

  /**Função para exibir um toastr de sucesso. */
  showToastrSuccess(message: string) {
    this._toastr.success(message, null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  /**Função para exibir um toastr de erro. */
  showToastrError(message: string) {
    this._toastr.error(message, null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }


  canCancel() {
    const initialState = { message: "Tem certeza que deseja cancelar sua inscrição? Todos os dados serão perdidos." }
    this.modalRef = this._modal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.formInscricao.reset()
      }
    })
  }

    /**Getters */
    get nome() { return this.formInscricao.get('nome') };
    get email() { return this.formInscricao.get('email') };
    get telefone() { return this.formInscricao.get('telefone') };
    get cidade() { return this.formInscricao.get('cidade') };
    get ra() { return this.formInscricao.get('ra') };
    get curso() { return this.formInscricao.get('curso') };
    get periodo() { return this.formInscricao.get('periodo') };
    get semestre() { return this.formInscricao.get('semestre') };
    get descricao() { return this.formInscricao.get('descricao') };
}
