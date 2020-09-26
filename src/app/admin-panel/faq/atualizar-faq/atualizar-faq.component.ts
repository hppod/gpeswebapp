import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'
import { Subscription, Observable } from "rxjs"
import { ToastrService } from "ngx-toastr"
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal"
import { FAQService } from '../../../shared/services/faq.service'
import { AuthenticationService } from "./../../../shared/services/authentication.service"
import { FAQ } from "../../../shared/models/faq.model"
import { ModalDialogComponent } from "./../../../web-components/common/modals/modal-dialog/modal-dialog.component"
import { ComponentCanDeactivate } from 'src/app/shared/guards/pending-changes.guard';
import { setLastUrl } from 'src/app/shared/functions/last-pagination';

@Component({
  selector: 'app-atualizar-faq',
  templateUrl: './atualizar-faq.component.html',
  styleUrls: ['./atualizar-faq.component.css']
})
export class AtualizarFaqComponent implements OnInit, ComponentCanDeactivate {

  faq: FAQ

  rolePergunta = ''
  maxCharsPergunta = 300
  roleResposta = ''
  maxCharsResposta = 500

  httpReq: Subscription
  messageApi: string
  statusResponse: number

  isLoading: boolean
  faqForm: FormGroup
  modalRef: BsModalRef
  success = false

  constructor(
    private formBuilder: FormBuilder,
    public faqService: FAQService,
    private r: Router,
    private faqmodal: BsModalService,
    private faqtoastr: ToastrService,
    public activeRotes: ActivatedRoute,
    private _auth: AuthenticationService
  ) {
    this.initForm()
  }

  ngOnInit() {
    this.getByQuestion()
    setLastUrl(this.r.url)
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.faqForm.dirty) {
      return false
    }
    return true
  }

  get isAdmin() {
    return this._auth.isAdmin
  }

  initForm() {
    this.faqForm = this.formBuilder.group({
      pergunta: this.formBuilder.control(null, [Validators.required]),
      resposta: this.formBuilder.control(null, [Validators.required]),
      ordena: this.formBuilder.control(null),
    })
  }

  getByQuestion() {
    this.isLoading = true
    this.httpReq = this.faqService.getByQuestion(this.activeRotes.snapshot.params['question']).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.faq = response.body['data']
      this.populateFormWithValuesToUpdate(this.faq)
      this.isLoading = false

    }, err => {
      this.statusResponse = err.status
      this.messageApi = err.error['message']
      this.isLoading = false
    })
  }

  populateFormWithValuesToUpdate(faq: FAQ) {
    this.faqForm.patchValue({
      pergunta: faq['pergunta'],
      resposta: faq['resposta'],
      ordena: faq.ordena
    })
  }

  update() {
    this.httpReq = this.faqService.update(this.faq['pergunta'], this.faqForm.value).subscribe(response => {
      this.faqForm.reset()
      this.success = true
      this.r.navigate(['/admin/faq'])
      this.showToastrSuccess()
    }, err => {
      this.faqForm.reset()
      this.r.navigate(['/admin/faq'])
      this.showToastrError()
    })
  }

  showToastrSuccess() {
    this.faqtoastr.success('A Dúvida Frequente foi atualizado com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this.faqtoastr.error('Houve um erro ao atualizar a Dúvida Frequente. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  cancelar() {
    const initialState = { message: "Tem certeza que deseja cancelar a atualização do registro atual? Todos os dados serão perdidos." }
    this.modalRef = this.faqmodal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.faqForm.reset()
        this.r.navigate(['/admin/faq'])
      }
    })
  }

  /**Getters */
  get pergunta() { return this.faqForm.get('pergunta') }
  get resposta() { return this.faqForm.get('resposta') }

}
