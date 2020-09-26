import { Role } from "./role"

export class User {
    id: number;
    nome: string;
    user: string;
    email: string;
    senha: string;
    role: Role;
    token?: string;
}