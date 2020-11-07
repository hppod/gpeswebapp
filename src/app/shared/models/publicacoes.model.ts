export interface Publicacoes {
    _id: string,
    titulo: string,
    descricao: string,
    categoria: string,
    autores: string[],
    plataforma: String,
    cidade: String,
    dataPublicacao: Date
}