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

import { PublicacoesComponent } from "./todos-publicacoes/publicacoes.component"
import { NovoPublicacoesComponent } from "./novo-publicacoes/novo-publicacoes.component"
import { DetalhesTransparenciaComponent } from "./detalhes-transparencia/detalhes-transparencia.component"
import { AtualizarTransparenciaComponent } from "./atualizar-transparencia/atualizar-transparencia.component"
import { PendingChangesGuard } from "src/app/shared/guards/pending-changes.guard"

const ROUTES: Routes = [
    { path: '', component: PublicacoesComponent },
    { path: 'detalhes/:title', component: DetalhesTransparenciaComponent },
    { path: 'novo', component: NovoPublicacoesComponent, canDeactivate: [PendingChangesGuard] },
    { path: 'atualizar/:title', component: AtualizarTransparenciaComponent, canDeactivate: [PendingChangesGuard] }
]

@NgModule({
    declarations: [
        PublicacoesComponent,
        NovoPublicacoesComponent,
        DetalhesTransparenciaComponent,
        AtualizarTransparenciaComponent
    ],
    exports: [
        PublicacoesComponent,
        NovoPublicacoesComponent,
        DetalhesTransparenciaComponent,
        AtualizarTransparenciaComponent
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
export class PublicacoesModule { }