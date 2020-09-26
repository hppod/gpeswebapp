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

import { PortalTransparenciaComponent } from "./todos-transparencia/portal-transparencia.component"
import { NovoTransparenciaComponent } from "./novo-transparencia/novo-transparencia.component"
import { DetalhesTransparenciaComponent } from "./detalhes-transparencia/detalhes-transparencia.component"
import { AtualizarTransparenciaComponent } from "./atualizar-transparencia/atualizar-transparencia.component"
import { PendingChangesGuard } from "src/app/shared/guards/pending-changes.guard"

const ROUTES: Routes = [
    { path: '', component: PortalTransparenciaComponent },
    { path: 'detalhes/:title', component: DetalhesTransparenciaComponent },
    { path: 'novo', component: NovoTransparenciaComponent, canDeactivate: [PendingChangesGuard] },
    { path: 'atualizar/:title', component: AtualizarTransparenciaComponent, canDeactivate: [PendingChangesGuard] }
]

@NgModule({
    declarations: [
        PortalTransparenciaComponent,
        NovoTransparenciaComponent,
        DetalhesTransparenciaComponent,
        AtualizarTransparenciaComponent
    ],
    exports: [
        PortalTransparenciaComponent,
        NovoTransparenciaComponent,
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
export class TransparenciaModule { }