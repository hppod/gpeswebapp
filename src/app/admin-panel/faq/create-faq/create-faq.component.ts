import { Component, OnInit, OnDestroy, HostListener } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { Subscription, Observable } from "rxjs"
import { ToastrService } from "ngx-toastr"
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal"
import { FAQService } from '../../../shared/services/faq.service'
import { FAQ } from "../../../shared/models/faq.model"
import { FaqValidator } from "./../../../shared/validations/faq.validator"
import { ModalDialogComponent } from "./../../../web-components/common/modals/modal-dialog/modal-dialog.component"
import { ComponentCanDeactivate } from 'src/app/shared/guards/pending-changes.guard'
import { setLastUrl } from 'src/app/shared/functions/last-pagination'

@Component({
  selector: 'app-create-faq',
  templateUrl: './create-faq.component.html',
  styleUrls: ['./create-faq.component.css']
})
export class CreateFaqComponent implements OnInit, OnDestroy, ComponentCanDeactivate {

  private httpReq: Subscription

  rolePergunta = ''
  maxCharsPergunta = 300
  roleResposta = ''
  maxCharsResposta = 500

  total: any
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
    private _unique: FaqValidator
  ) { }

  ngOnInit() {
    this.getFaqWithParams()
    setLastUrl(this.r.url)
    this.faqForm = this.formBuilder.group({
      pergunta: this.formBuilder.control('', [Validators.required], this._unique.checkUniquePergunta()),
      resposta: this.formBuilder.control('', [Validators.required]),
      status: this.formBuilder.control(true)
    });
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.faqForm.dirty) {
      return false
    }
    return true
  }

  getFaqWithParams() {
    this.httpReq = this.faqService.getFAQWithParams('authenticated').subscribe(response => {
      this.total = response.body['count']
    })
  }

  post(form: FAQ) {

    form.ordena = this.total + 1
    this.httpReq = this.faqService.post(form).subscribe(response => {
      this.faqForm.reset()
      this.r.navigate(['/admin/faq'])
      this.showToastrSuccess()
    })

  }

  showToastrSuccess() {
    this.faqtoastr.success('A Dúvida Frequente foi adicionado com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  cancelar() {
    const initialState = { message: "Tem certeza que deseja cancelar a inserção do registro atual? Todos os dados serão perdidos." }
    this.modalRef = this.faqmodal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.faqForm.reset()
        this.r.navigate(['/admin/faq'])
      }
    })
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  /**Getters */
  get pergunta() { return this.faqForm.get('pergunta') }
  get resposta() { return this.faqForm.get('resposta') }

}
