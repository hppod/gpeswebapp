import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, Routes } from "@angular/router"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { ToastrModule } from "ngx-toastr"
import { NgxMaskModule } from 'ngx-mask';
import { NgxPaginationModule } from "ngx-pagination"
import { ModalModule } from "ngx-bootstrap/modal"
import { TooltipModule } from "ngx-bootstrap/tooltip"
import { BsDropdownModule } from "ngx-bootstrap/dropdown"
import { AdminPanelModule } from "./../admin-panel.module"
import { SharedModule } from "./../../shared/shared.module"

import { ContatoAdminComponent } from "./todos-contato/contato.component"
import { CreateContatoComponent } from "./create-contato/create-contato.component"
import { DetalhesContatoComponent } from "./see-details-contato/see-details-contato.component"
import { AtualizarContatoComponent } from "./atualizar-contato/atualizar-contato.component"
import { PendingChangesGuard } from "src/app/shared/guards/pending-changes.guard"

const ROUTES: Routes = [
    { path: '', component: ContatoAdminComponent },
    { path: 'detalhes/:descricao', component: DetalhesContatoComponent },
    { path: 'novo', component: CreateContatoComponent, canDeactivate: [PendingChangesGuard] },
    { path: 'atualizar/:descricao', component: AtualizarContatoComponent, canDeactivate: [PendingChangesGuard] }
]

@NgModule({
    declarations: [
        ContatoAdminComponent,
        CreateContatoComponent,
        DetalhesContatoComponent,
        AtualizarContatoComponent
    ],
    exports: [
        ContatoAdminComponent,
        CreateContatoComponent,
        DetalhesContatoComponent,
        AtualizarContatoComponent
    ],
    providers: [
        PendingChangesGuard
    ],
    imports: [
        AdminPanelModule,
        CommonModule,
        SharedModule,
        NgxMaskModule,
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
export class ContatoModule { }