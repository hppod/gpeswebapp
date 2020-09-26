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

import { TodosUsuarioComponent } from "./todos-usuario/todos-usuario.component"
import { NovoUsuarioComponent } from "./novo-usuario/novo-usuario.component"
import { DetalhesUsuarioComponent } from "./detalhes-usuario/detalhes-usuario.component"
import { AtualizarUsuarioComponent } from "./atualizar-usuario/atualizar-usuario.component"
import { PendingChangesGuard } from "src/app/shared/guards/pending-changes.guard"

const ROUTES: Routes = [
    { path: '', component: TodosUsuarioComponent },
    { path: 'detalhes/:user', component: DetalhesUsuarioComponent },
    { path: 'novo', component: NovoUsuarioComponent, canDeactivate: [PendingChangesGuard] },
    { path: 'atualizar/:user', component: AtualizarUsuarioComponent, canDeactivate: [PendingChangesGuard] }
]

@NgModule({
    declarations: [
        TodosUsuarioComponent,
        NovoUsuarioComponent,
        DetalhesUsuarioComponent,
        AtualizarUsuarioComponent
    ],
    exports: [
        TodosUsuarioComponent,
        NovoUsuarioComponent,
        DetalhesUsuarioComponent,
        AtualizarUsuarioComponent
    ],
    providers: [
        PendingChangesGuard
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
export class UsuarioModule { }