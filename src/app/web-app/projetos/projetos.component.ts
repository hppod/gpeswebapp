import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from "rxjs";
import { getLastPage, setLastUrl } from "src/app/shared/functions/last-pagination";
import { scrollPageToTop } from 'src/app/shared/functions/scroll-top';
import { Projetos } from 'src/app/shared/models/projetos.model';
import { ProjetosService } from 'src/app/shared/services/projetos.service';

@Component({
  selector: 'app-projetos',
  templateUrl: './projetos.component.html',
  styleUrls: ['./projetos.component.css']
})
export class ProjetosComponent implements OnInit, OnDestroy {

  private httpReq: Subscription

  p: number = 1
  projetos: Projetos[]
  projeto: Projetos
  ProjetoVisualizar: Projetos = null
  isLoading: boolean = false
  isLoadingModal: boolean = false
  messageApi: string
  statusResponse: number
  total: number
  limit: number
  modalRef: BsModalRef
  modalVisualizar: BsModalRef
  atuais: boolean = true

  constructor(
    private router: Router,
    private service: ProjetosService
  ) { }

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false
    setLastUrl(this.router.url)

    this.service.params = this.service.params.set('columnSort', 'nome')
    this.service.params = this.service.params.set('valueSort', 'descending')
    this.service.params = this.service.params.set('page', getLastPage())
    this.service.params = this.service.params.set('limit', '4')

    this.getAtuaisProjetos()
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  getAtuaisProjetosButtom(){
    this.service.params = this.service.params.set('columnSort', 'dataInicio')
    this.service.params = this.service.params.set('valueSort', 'descending')
    this.service.params = this.service.params.set('page', getLastPage())
    this.service.params = this.service.params.set('limit', '4')

    this.getAtuaisProjetos()
  }

  getProjetosConcluidosButtom(){
    this.service.params = this.service.params.set('columnSort', 'dataFim')
    this.service.params = this.service.params.set('valueSort', 'descending')
    this.service.params = this.service.params.set('page', getLastPage())
    this.service.params = this.service.params.set('limit', '4')

    this.getProjetosConcluidos()
  }

  getProjeto(titulo: string){
    this.httpReq = this.service.getProjetoByName(titulo).subscribe(response =>{
      this.statusResponse = response.status
      if (response.status == 200) {
        this.messageApi = response.body['message']
        this.ProjetoVisualizar = response.body['data']
      }
      this.isLoading = false
    }, err =>{
      this.messageApi = err
      this.isLoading = false
    })
  }

  getAtuaisProjetos(){
    this.atuais = true
    this.isLoading = true
    this.httpReq = this.service.getProjetosAtuais().subscribe(response => {
      this.statusResponse = response.status
      if (response.status == 200) {
        this.messageApi = response.body['message']
        this.projetos = response.body['data']
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

  getProjetosConcluidos(){
    this.atuais = false
    this.isLoading = true
    this.httpReq = this.service.getProjetosConcluidos().subscribe(response => {
      this.statusResponse = response.status
      if (response.status == 200) {
        this.messageApi = response.body['message']
        this.projetos = response.body['data']
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
    this.projetos = null
    this.atuais = true
    scrollPageToTop(page)
    this.service.params = this.service.params.set('page', page.toString())
    this.getAtuaisProjetos()
  }

  getPageEx(page: number) {
    this.projetos = null
    this.atuais = false
    scrollPageToTop(page)
    this.service.params = this.service.params.set('page', page.toString())
    this.getProjetosConcluidos()
  }

}
