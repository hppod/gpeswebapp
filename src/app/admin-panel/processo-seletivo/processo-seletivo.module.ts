import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastrModule } from "ngx-toastr";
import { NgxPaginationModule } from "ngx-pagination";
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ModalModule } from "ngx-bootstrap/modal";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { AdminPanelModule } from "./../admin-panel.module";
import { SharedModule } from "./../../shared/shared.module";
import { DragulaModule } from 'ng2-dragula';

import { TodosProcessoSeletivoComponent } from './processo/todos-processo-seletivo/todos-processo-seletivo.component';
import { CreateProcessoSeletivoComponent } from './processo/create-processo-seletivo/create-processo-seletivo.component';
import { PendingChangesGuard } from "src/app/shared/guards/pending-changes.guard";
import { DetalhesProcessoSeletivoComponent } from './processo/detalhes-processo-seletivo/detalhes-processo-seletivo.component';
import { AtualizarProcessoSeletivoComponent } from './processo/atualizar-processo-seletivo/atualizar-processo-seletivo.component';

import { TodosSelecaoComponent } from './selecao/todos-selecao/todos-selecao.component';
import { CreateSelecaoComponent } from './selecao/create-selecao/create-selecao.component';
import { DetalhesSelecaoComponent } from './selecao/detalhes-selecao/detalhes-selecao.component';
import { DetalhesInscritoComponent } from './selecao/detalhes-inscrito/detalhes-inscrito.component';
import { AtualizarSelecaoComponent } from './selecao/atualizar-selecao/atualizar-selecao.component';

const ROUTES: Routes = [
  {
    path: 'processo', children: [
      { path: '', component: TodosProcessoSeletivoComponent },
      { path: 'create', component: CreateProcessoSeletivoComponent, canDeactivate: [PendingChangesGuard] },
      { path: 'detalhes/:title', component: DetalhesProcessoSeletivoComponent },
      { path: 'atualizar/:title', component: AtualizarProcessoSeletivoComponent, canDeactivate: [PendingChangesGuard] }
    ]
  },
  {
    path: 'selecao', children: [
      { path: '', component: TodosSelecaoComponent },
      { path: 'create', component: CreateSelecaoComponent, canDeactivate: [PendingChangesGuard] },
      { path: 'detalhes/:title', component: DetalhesSelecaoComponent },
      { path: 'detalhes-inscrito/:name', component: DetalhesInscritoComponent },
      { path: 'atualizar/:title', component: AtualizarSelecaoComponent, canDeactivate: [PendingChangesGuard] }
    ]
  }

]

@NgModule({
  declarations: [
    TodosProcessoSeletivoComponent,
    CreateProcessoSeletivoComponent,
    DetalhesProcessoSeletivoComponent,
    AtualizarProcessoSeletivoComponent,
    TodosSelecaoComponent,
    DetalhesSelecaoComponent,
    DetalhesInscritoComponent,
    CreateSelecaoComponent,
    AtualizarSelecaoComponent
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
