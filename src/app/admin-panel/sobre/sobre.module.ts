import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, Routes } from "@angular/router"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { ToastrModule } from "ngx-toastr"
import { NgxPaginationModule } from "ngx-pagination"
import { AngularEditorModule } from '@kolkov/angular-editor'
import { ModalModule } from "ngx-bootstrap/modal"
import { TooltipModule } from "ngx-bootstrap/tooltip"
import { BsDropdownModule } from "ngx-bootstrap/dropdown"
import { AdminPanelModule } from "./../admin-panel.module"
import { SharedModule } from "./../../shared/shared.module"
import { DragulaModule } from 'ng2-dragula'

import { SobreComponent } from "./todos-sobre/todos-sobre.component"
import { CreateSobreComponent } from "./create-sobre/create-sobre.component"
import { DetalhesSobreComponent } from "./detalhes-sobre/detalhes-sobre.component"
import { AtualizarSobreComponent } from "./atualizar-sobre/atualizar-sobre.component"
import { PendingChangesGuard } from "src/app/shared/guards/pending-changes.guard"

const ROUTES: Routes = [
    { path: '', component: SobreComponent },
    { path: 'detalhes/:title', component: DetalhesSobreComponent },
    { path: 'create', component: CreateSobreComponent, canDeactivate: [PendingChangesGuard] },
    { path: 'atualizar/:title', component: AtualizarSobreComponent, canDeactivate: [PendingChangesGuard] }
]

@NgModule({
    declarations: [
        SobreComponent,
        CreateSobreComponent,
        DetalhesSobreComponent,
        AtualizarSobreComponent,
    ],
    exports: [
        SobreComponent,
        CreateSobreComponent,
        DetalhesSobreComponent,
        AtualizarSobreComponent
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
        }),
        AngularEditorModule,
        DragulaModule.forRoot()
    ]
})
export class SobreModule { }