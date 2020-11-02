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

import { TodosEventosComponent } from "./todos-evento/todos-eventos.component"
import { CreateEventoComponent } from "./create-evento/create-evento.component"
import { DetalhesEventoComponent } from "./detalhes-evento/detalhes-evento.component"
import { AtualizarEventoComponent } from "./atualizar-evento/atualizar-evento.component"
import { PendingChangesGuard } from "../../../../src/app/shared/guards/pending-changes.guard"

const ROUTES: Routes = [
    { path: '', component: TodosEventosComponent },
    { path: 'detalhes/:title', component: DetalhesEventoComponent },
    { path: 'criar', component: CreateEventoComponent, canDeactivate: [PendingChangesGuard] },
    { path: 'atualizar/:title', component: AtualizarEventoComponent, canDeactivate: [PendingChangesGuard] }
]

@NgModule({
    declarations: [
        TodosEventosComponent,
        CreateEventoComponent,
        DetalhesEventoComponent,
        AtualizarEventoComponent
    ],
    exports: [
        TodosEventosComponent,
        CreateEventoComponent,
        DetalhesEventoComponent,
        AtualizarEventoComponent
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