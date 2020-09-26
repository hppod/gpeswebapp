export interface Contato {
    _id: string,
    descricao: string,
    tipo: string,
    endereco: {
        rua: string,
        numero: number,
        bairro: string,
        complemento: string,
        cidade: string,
        estado: string,
        cep: string
    },
    telefone: {
        ddi: any,
        prefixo: any,
        numero: any
    }
    email: string,
    redesocial: {
        tipo: string,
        link: string
    }
}