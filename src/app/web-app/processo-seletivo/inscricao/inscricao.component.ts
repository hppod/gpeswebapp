import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { InscricaoValidator } from 'src/app/shared/validations/inscricao.validator';
import { ModalDialogComponent } from 'src/app/web-components/common/modals/modal-dialog/modal-dialog.component';
import { ProcessoSeletivoService } from "../../../shared/services/processo-seletivo.service";
import { Inscricao } from 'src/app/shared/models/inscricao.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inscricao',
  templateUrl: './inscricao.component.html',
  styleUrls: ['./inscricao.component.css']
})
export class InscricaoComponent implements OnInit {

  formInscricao: FormGroup
  modalRef: BsModalRef
  success = false

  constructor(
    private _builder: FormBuilder,
    private _service: ProcessoSeletivoService,
    private _toastr: ToastrService,
    private _unique: InscricaoValidator,
    private _modal: BsModalService
  ) { }

  ngOnInit(): void {
    this.initForm()
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
      descricao: this._builder.control(null, [Validators.required])
    });
  }

  postInscricao(form: Inscricao) {
    this.success = false
    this._service.postInscricao(form)
      .subscribe(res => {
        this.success = true
        this.formInscricao.reset()
        this.showToastrSuccess('A inscrição foi realizada com sucesso')
      }, err => {
        this.formInscricao.reset()
        this.showToastrError('Houve um erro ao realizar a inscrição. Tente novamente.')
      })
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
