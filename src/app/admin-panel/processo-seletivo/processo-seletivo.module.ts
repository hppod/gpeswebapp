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

import { TodosProcessoSeletivoComponent } from './todos-processo-seletivo/todos-processo-seletivo.component';
import { CreateProcessoSeletivoComponent } from './create-processo-seletivo/create-processo-seletivo.component';
import { PendingChangesGuard } from "src/app/shared/guards/pending-changes.guard";
import { DetalhesProcessoSeletivoComponent } from './detalhes-processo-seletivo/detalhes-processo-seletivo.component';
import { AtualizarProcessoSeletivoComponent } from './atualizar-processo-seletivo/atualizar-processo-seletivo.component'

const ROUTES: Routes = [
  { path: '', component: TodosProcessoSeletivoComponent },
  { path: 'create', component: CreateProcessoSeletivoComponent, canDeactivate: [PendingChangesGuard] },
  { path: 'detalhes/:title', component: DetalhesProcessoSeletivoComponent }
]

@NgModule({
  declarations: [
    TodosProcessoSeletivoComponent,
    CreateProcessoSeletivoComponent,
    DetalhesProcessoSeletivoComponent,
    AtualizarProcessoSeletivoComponent
  ],
  exports: [
    TodosProcessoSeletivoComponent,
    CreateProcessoSeletivoComponent
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
export class ProcessoSeletivoModule { }
