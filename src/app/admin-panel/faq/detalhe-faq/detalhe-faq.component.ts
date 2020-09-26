import { Component, OnInit } from '@angular/core';
import { FAQService } from '../../../shared/services/faq.service'
import { AuthenticationService } from "./../../../shared/services/authentication.service"
import { FAQ } from "../../../shared/models/faq.model"
import { Router } from '@angular/router'
import { Subscription } from "rxjs"
import { ActivatedRoute } from "@angular/router"
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal"
import { ModalDialogComponent } from "./../../../web-components/common/modals/modal-dialog/modal-dialog.component"
import { ModalLoadingComponent } from "./../../../web-components/common/modals/modal-loading/modal-loading.component"
import { HttpParams } from '@angular/common/http';
import { ToastrService } from "ngx-toastr"

@Component({
  selector: 'app-detalhe-faq',
  templateUrl: './detalhe-faq.component.html',
  styleUrls: ['./detalhe-faq.component.css']
})
export class DetalheFaqComponent implements OnInit {

  faq: FAQ

  httpReq: Subscription
  isLoading: boolean
  messageApi: string
  statusResponse: number
  modalRef: BsModalRef

  configLoadingModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    initialState: {
      message: "Excluindo Dúvida Frequente...",
      withFooter: false
    }
  }

  constructor(
    private faqService: FAQService,    
    private r: Router,
    private faqModal: BsModalService,
    private faqToastr: ToastrService,
    public activeRotes: ActivatedRoute,
    private _auth: AuthenticationService
  ) {}

  ngOnInit() {
    const pergunta = this.activeRotes.snapshot.params['question']

    this.getByQuestion(pergunta)
  }

  get isAdmin() {
    return this._auth.isAdmin
  }

  getByQuestion(question: string) {
    this.isLoading = true
    this.httpReq = this.faqService.getByQuestion(question).subscribe(response => {
      console.log(response)
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.faq = response.body['data']
      this.isLoading = false

    }, err => {
      this.statusResponse = err.status
      this.isLoading = false
    })
  }

  // ngOnDestroy() {
  //   this.httpReq.unsubscribe()
  // }

  delete(id: string, pergunta: string){
    const initialState = {message: `Deseja excluir a dúvida "${pergunta}"`}
    this.modalRef = this.faqModal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) =>{
      if (answer){
        this.modalRef = this.faqModal.show(ModalLoadingComponent, this.configLoadingModal)
        this.faqService.deleteParams = this.faqService.deleteParams.set('_id', id)
        this.httpReq = this.faqService.delete(id).subscribe(response => {
          this.faq = null
          this.faqService.deleteParams = new HttpParams()
          this.modalRef.hide()
          this.r.navigate(['/admin/faq'])
          this.showToastrSuccess()
        }, err => {
          this.faq = null
          this.faqService.deleteParams = new HttpParams()
          this.modalRef.hide()
          this.showToastrError()
        })
      }
    })
  }

  showToastrSuccess() {
    this.faqToastr.success('A Dúvida Frequente foi excluída com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrError() {
    this.faqToastr.error('Houve um erro ao excluir a Dúvida Frequente. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }
}
