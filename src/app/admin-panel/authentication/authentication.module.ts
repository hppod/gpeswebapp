import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, Routes } from "@angular/router"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { ToastrModule } from "ngx-toastr"
import { NgxPaginationModule } from "ngx-pagination"
import { ModalModule } from "ngx-bootstrap/modal"
import { TooltipModule } from "ngx-bootstrap/tooltip"
import { BsDropdownModule } from "ngx-bootstrap/dropdown"
import { AdminPanelModule } from "./../admin-panel.module"
import { SharedModule } from "./../../shared/shared.module"

import { LoginComponent } from "./login/login.component"
import { EnviarEmailComponent } from "./forget-password/enviar-email/enviar-email.component"
import { RedefinirSenhaComponent } from "./forget-password/redefinir-senha/redefinir-senha.component"
import { CriarSenhaComponent } from "./create-password/criar-senha/criar-senha.component"

const ROUTES: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'esqueci-a-senha', component: EnviarEmailComponent },
    { path: 'esqueci-a-senha/:token', component: RedefinirSenhaComponent },
    { path: 'convite/:token', component: CriarSenhaComponent },
]

@NgModule({
    declarations: [
        LoginComponent,
        EnviarEmailComponent,
        RedefinirSenhaComponent,
        CriarSenhaComponent
    ],
    exports: [
        LoginComponent,
        EnviarEmailComponent,
        RedefinirSenhaComponent,
        CriarSenhaComponent
    ],
    imports: [
        AdminPanelModule,
        CommonModule,
        SharedModule,
        RouterModule.forChild(ROUTES),
        NgxPaginationModule,
        BsDropdownModule.forRoot(),
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot({
            preventDuplicates: true
        })
    ]
})
export class AuthModule { }