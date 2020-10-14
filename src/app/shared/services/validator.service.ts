import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import { GPESWebApi } from "./../../app.api"

@Injectable({
    providedIn: 'root'
})
export class ValidatorService {

    constructor(
        private http: HttpClient
    ) { }

    /**Função que realiza a requisição do tipo POST ao endpoint “/authenticated/validators/unique/sobre/titulo”. A requisição possui um parâmetro obrigatório (title). */
    checkUniqueSobreTitulo(titulo: string) {
        let params = new HttpParams()
        params = params.append('title', titulo)
        return this.http.get<any>(`${GPESWebApi}/authenticated/validators/unique/sobre/titulo`, { params: params })
    }

    /**Função que realiza a requisição do tipo POST ao endpoint “/authenticated/validators/unique/faq/pergunta”. A requisição possui um parâmetro obrigatório (question). */
    checkUniqueFAQPergunta(pergunta: string) {
        let params = new HttpParams()
        params = params.append('question', pergunta)
        return this.http.get<any>(`${GPESWebApi}/authenticated/validators/unique/faq/pergunta`, { params: params })
    }

    /**Função que realiza a requisição do tipo POST ao endpoint “/authenticated/validators/unique/noticia/titulo”. A requisição possui um parâmetro obrigatório (title). */
    checkUniqueNoticiaTitulo(titulo: string) {
        let params = new HttpParams()
        params = params.append('title', titulo)
        return this.http.get<any>(`${GPESWebApi}/authenticated/validators/unique/noticia/titulo`, { params: params })
    }

    /**Função que realiza a requisição do tipo POST ao endpoint “/authenticated/validators/unique/contato/nome”. A requisição possui um parâmetro obrigatório (name). */
    checkUniqueContatoNome(nome: string) {
        let params = new HttpParams()
        params = params.append('name', nome)
        return this.http.get<any>(`${GPESWebApi}/authenticated/validators/unique/contato/nome`, { params: params })
    }

    /**Função que realiza a requisição do tipo POST ao endpoint “/authenticated/validators/unique/publicacoes/titulo”. A requisição possui um parâmetro obrigatório (title). */
    checkUniquePublicacaoTitulo(titulo: string) {
        let params = new HttpParams()
        params = params.append('title', titulo)
        return this.http.get<any>(`${GPESWebApi}/authenticated/validators/unique/publicacoes/titulo`, { params: params })
    }

    /**Função que realiza a requisição do tipo POST ao endpoint “/authenticated/validators/unique/categoria/nome". A requisição possui um parâmetro obrigatório (name). */
    checkUniqueCategoriaNome(name: string) {
        let params = new HttpParams()
        params = params.append('name', name)
        return this.http.get<any>(`${GPESWebApi}/authenticated/validators/unique/categoria/nome`, { params: params })
    }

    /**Função que realiza a requisição do tipo POST ao endpoint “/authenticated/validators/unique/usuario/nome”. A requisição possui um parâmetro obrigatório (name). */
    checkUniqueUsuarioNome(nome: string) {
        let params = new HttpParams()
        params = params.append('name', nome)
        return this.http.get<any>(`${GPESWebApi}/authenticated/validators/unique/usuario/nome`, { params: params })
    }

    /**Função que realiza a requisição do tipo POST ao endpoint “/authenticated/validators/unique/usuario/usuario”. A requisição possui um parâmetro obrigatório (username). */
    checkUniqueUsuarioUsuario(usuario: string) {
        let params = new HttpParams()
        params = params.append('username', usuario)
        return this.http.get<any>(`${GPESWebApi}/authenticated/validators/unique/usuario/usuario`, { params: params })
    }

    /**Função que realiza a requisição do tipo POST ao endpoint “/authenticated/validators/unique/usuario/email”. A requisição possui um parâmetro obrigatório (email). */
    checkUniqueUsuarioEmail(email: string) {
        let params = new HttpParams()
        params = params.append('email', email)
        return this.http.get<any>(`${GPESWebApi}/authenticated/validators/unique/usuario/email`, { params: params })
    }

    /**Função que realiza a requisição do tipo POST ao endpoint “/authenticated/validators/unique/processo-seletivo/titulo”. A requisição possui um parâmetro obrigatório (title). */
    checkUniqueProcessoSeletivoTitulo(titulo: string) {
        let params = new HttpParams()
        params = params.append('title', titulo)
        return this.http.get<any>(`${GPESWebApi}/authenticated/validators/unique/processo-seletivo/titulo`, { params: params })
    }
}