import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { FAQService } from '../../../shared/services/faq.service'
import { AuthenticationService } from "../../../shared/services/authentication.service"
import { FAQ } from "../../../shared/models/faq.model"
import { Subscription } from "rxjs"
import { Router } from "@angular/router"
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal"
import { ModalDialogComponent } from "../../../web-components/common/modals/modal-dialog/modal-dialog.component"
import { ModalLoadingComponent } from "../../../web-components/common/modals/modal-loading/modal-loading.component"
import { HttpParams } from '@angular/common/http';
import { ToastrService } from "ngx-toastr"
import { DragulaService } from 'ng2-dragula';
import { scrollPageToTop } from 'src/app/shared/functions/scroll-top';
import { checkUrlAndSetFirstPage, setLastUrl, getLastPage, setLastPage } from 'src/app/shared/functions/last-pagination';


@Component({
  selector: 'app-faq-admnin',
  templateUrl: './faq-admnin.component.html',
  styleUrls: ['./faq-admnin.component.css']
})
export class FaqAdmninComponent implements OnInit, OnDestroy {

  private httpReq: Subscription

  faqs: FAQ[]

  ordenationPerItem: any

  isLoading: boolean = false
  order: boolean = false
  messageApi: string
  statusResponse: number
  p: number = 1
  total: number
  limit: number
  modalRef: BsModalRef
  modalOrden: BsModalRef

  configLoadingModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    initialState: {
      message: "Excluindo Dúvida Frequente...",
      withFooter: false
    }
  }

  configOrderModal: ModalOptions = {
    backdrop: 'static',
    keyboard: false
  }

  headTableItems: any[] = [
    {
      option: 'Postado em',
      param: 'createdAt'
    }
  ]

  MANY_ITEMS = 'FAQ';
  subs = new Subscription();

  constructor(
    private faqService: FAQService,
    private faqModal: BsModalService,
    private faqToastr: ToastrService,
    private r: Router,
    private _auth: AuthenticationService,
    private _dragula: DragulaService
  ) {
    this.subs.add(this._dragula.dropModel(this.MANY_ITEMS)
      .subscribe(({ targetModel }) => {
        this.faqs = targetModel
        for (let index = 0; index < this.faqs.length; index++) {
          this.faqs[index].ordena = index + 1
        }
      })
    );
    checkUrlAndSetFirstPage(this.r.url)
  }
  ngOnInit() {
    this.r.routeReuseStrategy.shouldReuseRoute = () => false
    setLastUrl(this.r.url)

    this.ordenationPerItem = this.headTableItems[2]

    this.faqService.params = this.faqService.params.set('columnSort', 'createdAt')
    this.faqService.params = this.faqService.params.set('valueSort', 'ascending')
    this.faqService.params = this.faqService.params.set('page', getLastPage())

    this.getFAQWithParams()
  }

  ngOnDestroy() {
    setLastPage(this.p)
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
    this.subs.unsubscribe();
  }

  get isAdmin() {
    return this._auth.isAdmin
  }

  getFAQWithParams() {
    this.faqService.params = this.faqService.params.set('limit', '10')
    this.faqService.params = this.faqService.params.set('columnSort', 'ordena')
    this.faqService.params = this.faqService.params.set('valueSort', 'ascending')
    this.isLoading = true
    this.httpReq = this.faqService.getFAQWithParams('authenticated').subscribe(response => {
      this.statusResponse = response.status

      if (response.status == 200) {
        this.messageApi = response.body['message']
        this.faqs = response.body['data']
        this.p = response.body['page']
        this.total = response.body['count']
        this.limit = response.body['limit']
      }

      this.isLoading = false
    }, err => {
      this.messageApi = err
      this.isLoading = false
    })
  }

  getPage(page: number) {
    this.faqs = null
    scrollPageToTop(page)
    this.faqService.params = this.faqService.params.set('page', page.toString())
    this.getFAQWithParams()
  }

  onDelete(id: string, pergunta: string) {
    const initialState = { message: `Deseja excluir a dúvida "${pergunta}"` }
    this.modalRef = this.faqModal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.modalRef = this.faqModal.show(ModalLoadingComponent, this.configLoadingModal)
        this.faqService.deleteParams = this.faqService.deleteParams.set('_id', id)
        this.httpReq = this.faqService.delete(id).subscribe(response => {
          this.faqs = null
          this.getFAQWithParams()
          this.faqService.deleteParams = new HttpParams()
          this.modalRef.hide()
          this.showToastrSuccess()
        }, err => {
          this.faqs = null
          this.faqService.deleteParams = new HttpParams()
          this.getFAQWithParams()
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

  getALL() {
    this.faqService.params = this.faqService.params.set('limit', 'null')
    this.faqService.params = this.faqService.params.set('columnSort', 'ordena')
    this.faqService.params = this.faqService.params.set('valueSort', 'ascending')
    this.isLoading = true
    this.httpReq = this.faqService.getFAQWithParams('authenticated').subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.faqs = response.body['data']
      this.total = response.body['count']
      this.isLoading = false
    }, err => {
      this.statusResponse = err.status
      this.messageApi = err.error['message']
      this.isLoading = false
    })
  }

  openModal(template: TemplateRef<any>) {
    this.modalOrden = this.faqModal.show(template, this.configOrderModal);
    this.getALL()
  }

  Cancel() {
    const initialState = { message: "Tem certeza que deseja cancelar a ordenação? Todas as alterações serão perdidas." }
    this.modalRef = this.faqModal.show(ModalDialogComponent, { initialState })
    this.modalRef.content.action.subscribe((answer) => {
      if (answer) {
        this.modalRef.hide()
        this.modalOrden.hide()
        this.getFAQWithParams()
      }
    })
  }

  Salvar() {
    this.faqs.forEach(element => {
      this.httpReq = this.faqService.update(element.pergunta, element).subscribe(response => {
        this.modalOrden.hide()
        this.showToastrSuccessEditar()
      }, err => {
        this.modalOrden.hide()
        this.showToastrErrorEditar()
      })
    })
  }

  showToastrSuccessEditar() {
    this.faqToastr.success('A ordenação foi alterada com sucesso', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

  showToastrErrorEditar() {
    this.faqToastr.error('Houve um erro ao alterar a ordenação. Tente novamente.', null, {
      progressBar: true,
      positionClass: 'toast-bottom-center'
    })
  }

}