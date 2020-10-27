import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { checkUrlAndSetFirstPage, getLastPage, setLastPage, setLastUrl } from 'src/app/shared/functions/last-pagination';
import { scrollPageToTop } from 'src/app/shared/functions/scroll-top';
import { Integrantes } from 'src/app/shared/models/integrantes.model';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { IntegrantesService } from 'src/app/shared/services/integrantes.service';

@Component({
  selector: 'app-todos-integrantes',
  templateUrl: './todos-integrantes.component.html',
  styleUrls: ['./todos-integrantes.component.css']
})
export class TodosIntegrantesComponent implements OnInit, OnDestroy {

  private httpReq: Subscription

  p: number = 1
  integrantes: Integrantes[]
  integrante: Integrantes
  isLoading: boolean = false
  messageApi: string
  statusResponse: number
  total: number
  limit: number
  modalRef: BsModalRef
  modalVisuaizar: BsModalRef
  atuais: boolean = true

  configOrderModal: ModalOptions = {

  }

  constructor(
    private service: IntegrantesService,
    private r: Router,
    private modal: BsModalService,
    private toastr: ToastrService
  ) {
    checkUrlAndSetFirstPage(this.r.url) 
  }

  ngOnInit(): void {
    this.r.routeReuseStrategy.shouldReuseRoute = () => false
    setLastUrl(this.r.url)

    this.service.params = this.service.params.set('columnSort', 'nome')
    this.service.params = this.service.params.set('valueSort', 'descending')
    this.service.params = this.service.params.set('page', getLastPage())
    this.service.params = this.service.params.set('limit', '6')
    
    this.getAtuaisIntegrantes()
  }

  ngOnDestroy() {
    setLastPage(this.p)
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  getAtuaisIntegrantesButtom(){
    this.service.params = this.service.params.set('columnSort', 'nome')
    this.service.params = this.service.params.set('valueSort', 'descending')
    this.service.params = this.service.params.set('page', getLastPage())
    this.service.params = this.service.params.set('limit', '6')

    this.getAtuaisIntegrantes()
  }

  getExIntegrantesButtom(){
    this.service.params = this.service.params.set('columnSort', 'nome')
    this.service.params = this.service.params.set('valueSort', 'descending')
    this.service.params = this.service.params.set('page', getLastPage())
    this.service.params = this.service.params.set('limit', '6')

    this.getExIntegrantes()
  }

  getAtuaisIntegrantes(){
    this.atuais = true
    this.isLoading = true
    this.httpReq = this.service.getAtuaisIntegrantes().subscribe(response => {
      this.statusResponse = response.status
      if (response.status == 200) {
        this.messageApi = response.body['message']
        this.integrantes = response.body['data']
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

  getExIntegrantes(){
    this.atuais = false
    this.isLoading = true
    this.httpReq = this.service.getExIntegrantes().subscribe(response => {
      this.statusResponse = response.status
      if (response.status == 200) {
        this.messageApi = response.body['message']
        this.integrantes = response.body['data']
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
    this.integrantes = null
    this.atuais = true
    scrollPageToTop(page)
    this.service.params = this.service.params.set('page', page.toString())
    this.getAtuaisIntegrantes()
  }

  getPageEx(page: number) {
    this.integrantes = null
    this.atuais = false
    scrollPageToTop(page)
    this.service.params = this.service.params.set('page', page.toString())
    this.getExIntegrantes()
  }

  openModal(template: TemplateRef<any>, nome:string) {
    this.getIntegranteByName(nome)
    this.modalVisuaizar = this.modal.show(template, this.configOrderModal);
  }

  getIntegranteByName(nome: string) {
    this.isLoading = true
    this.httpReq = this.service.getIntegranteByNamePublic(nome).subscribe(response => {
      this.statusResponse = response.status
      this.messageApi = response.body['message']
      this.integrante = response.body['data']
      this.isLoading = false
    }, err => {
      this.messageApi = err.error['message']
      this.isLoading = false
    })
  }

}
