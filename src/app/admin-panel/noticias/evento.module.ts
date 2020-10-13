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
import { AdminPanelModule } from "../admin-panel.module"
import { SharedModule } from "../../shared/shared.module"

import { EventosComponent } from "./todos-evento/eventos.component"
import { CreateNoticiaComponent } from "./create-noticia/create-noticia.component"
import { VisualizarNoticiaComponent } from "./visualizar-noticia/visualizar-noticia.component"
import { EditNoticiaComponent } from "./edit-noticia/edit-noticia.component"
import { PendingChangesGuard } from "src/app/shared/guards/pending-changes.guard"

const ROUTES: Routes = [
    { path: '', component: EventosComponent },
    { path: 'detalhes/:title', component: VisualizarNoticiaComponent },
    { path: 'create', component: CreateNoticiaComponent, canDeactivate: [PendingChangesGuard] },
    { path: 'atualizar/:title', component: EditNoticiaComponent, canDeactivate: [PendingChangesGuard] }
]

@NgModule({
    declarations: [
        EventosComponent,
        CreateNoticiaComponent,
        VisualizarNoticiaComponent,
        EditNoticiaComponent
    ],
    exports: [
        EventosComponent,
        CreateNoticiaComponent,
        VisualizarNoticiaComponent,
        EditNoticiaComponent
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
        AngularEditorModule
    ]
})
export class EventoModule { }