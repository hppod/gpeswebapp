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

import { ListarTodosComponent } from "./listar-todos/listar-todos.component";
import { DetalhesProjetoComponent } from './detalhes-projeto/detalhes-projeto.component';
import { CreateProjetoComponent } from './create-projeto/create-projeto.component'
import { PendingChangesGuard } from "src/app/shared/guards/pending-changes.guard"
import { NgxSelectModule } from "ngx-select-ex";
import { AtualizarProjetosComponent } from './atualizar-projetos/atualizar-projetos.component'

const ROUTES: Routes = [
  { path: '', component: ListarTodosComponent },
  { path: 'detalhes/:titulo', component: DetalhesProjetoComponent },
  { path: 'create', component: CreateProjetoComponent },
  { path: 'atualizar/:titulo', component: AtualizarProjetosComponent }
]

@NgModule({
  declarations: [
    ListarTodosComponent,
    DetalhesProjetoComponent,
    CreateProjetoComponent,
    AtualizarProjetosComponent
  ],
  exports: [
    ListarTodosComponent,
    DetalhesProjetoComponent,
    CreateProjetoComponent,
    AtualizarProjetosComponent
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
    NgxSelectModule
  ]
})
export class ProjetosModule { }
