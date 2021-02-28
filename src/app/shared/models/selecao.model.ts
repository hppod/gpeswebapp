import { Inscricao } from './inscricao.model';

export interface Selecao {
    _id: string,
    titulo: string,
    descricao: string,
    dataInicio: Date,
    dataFim: Date,
    status: boolean,
    inscritos?: Inscricao
}