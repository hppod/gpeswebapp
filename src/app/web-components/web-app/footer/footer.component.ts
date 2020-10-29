import { Component, OnInit, OnDestroy } from '@angular/core';
import { environment } from "../../../../environments/environment"
import { Subscription } from 'rxjs';
import { Contato } from 'src/app/shared/models/contato.model';
import { ContatoService } from 'src/app/shared/services/contato.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {

  prod: boolean
  url: string

  private httpReq: Subscription

  contatos: Contato[]
  enderecos: Contato[] = new Array()
  telefones: Contato[] = new Array()
  emails: Contato[] = new Array()
  redessociais: Contato[] = new Array()

  isLoading: boolean
  messageApi: string
  statusResponse: number

  divContato = {} // objeto de controle de classes das divs de contato
  divCopy = {} // objeto de controle de classes da div de copyright

  showColumn: boolean = false

  constructor(private contatoService: ContatoService, private r: Router) {}

  ngOnInit() {
    this.prod = environment.production
    this.url = environment.apiUrl
    this.r.routeReuseStrategy.shouldReuseRoute = () => false
    this.getContatos()
    this.divCopy = {
      'container': true,
      'text-center': true
    }
  }

  ngOnDestroy() {
    if (this.httpReq) {
      this.httpReq.unsubscribe()
    }
  }

  getContatos() {
    this.isLoading = true
    this.httpReq = this.contatoService.getContatos().subscribe(response => {
      this.statusResponse = response.status
      this.contatos = response.body['data']
      this.messageApi = response.body['message']
      this.isLoading = false
      this.eatArrays(this.contatos)
      this.verifySecondColumn()
      this.buildClassObject()
    }, err => {
      this.statusResponse = err.status
      this.messageApi = err.error['message']
      this.isLoading = false
    })
  }

  eatArrays(contatos) {
    for (let index = 0; index < contatos.length; index++) {
      if (contatos[index].tipo == "Endereço") {
        this.enderecos.push(contatos[index])
      } else if (contatos[index].tipo == "Telefone") {
        this.telefones.push(contatos[index])
      } else if (contatos[index].tipo == "Email") {
        this.emails.push(contatos[index])
      } else {
        this.redessociais.push(contatos[index])
      }
    }
  }

  verifySecondColumn(){
    if (this.telefones.length != 0){
      this.showColumn = true
    }
    if (this.emails.length != 0){
      this.showColumn = true
    }
  }

  buildClassObject() {

    // Uma coluna
    if (
      (this.enderecos.length > 0 && (this.telefones.length == 0 && this.emails.length == 0) && this.redessociais.length == 0) // Somente endereço existe
      || (this.enderecos.length == 0 && (this.telefones.length > 0 || this.emails.length > 0) && this.redessociais.length == 0) // Somente telefone e/ou email existe
      || (this.enderecos.length == 0 && (this.telefones.length == 0 && this.emails.length == 0) && this.redessociais.length > 0) // Somente rede social existe
    ) {
      this.divCopy = {'container': true, 'text-center': true, 'copyright': true}
      this.divContato = {'col-md-12': true, 'text-center': true, 'marginBottom': true}
    }

    // Duas colunas
    else if (
      (this.enderecos.length > 0 && (this.telefones.length > 0 || this.emails.length > 0) && this.redessociais.length == 0) // endereço + telefone e/ou email
      || (this.enderecos.length > 0 && (this.telefones.length == 0 && this.emails.length == 0) && this.redessociais.length > 0) // endereço + rede social
      || (this.enderecos.length == 0 && (this.telefones.length > 0 || this.emails.length > 0) && this.redessociais.length > 0) // telefone e/ou email + rede social
    ) {
      this.divCopy = {'container': true, 'text-center': true, 'copyright': true}
      this.divContato = {'col-md-6': true, 'text-center': true, 'marginBottom': true}
    }

    // Três colunas
    else if (
      (this.enderecos.length > 0 && (this.telefones.length > 0 || this.emails.length > 0) && this.redessociais.length > 0)
    ) {
      this.divCopy = {'container': true, 'text-center': true, 'copyright': true}
      this.divContato = {'col-md-4': true, 'text-center': true, 'marginBottom': true}
    }

    // Nenhuma coluna
    else if (
      this.enderecos.length == 0 && this.telefones.length == 0 && this.emails.length == 0 && this.redessociais.length == 0
    ) {
      this.divCopy = { 'container': true, 'text-center': true }
      this.divContato = {}
    }

  }

}
