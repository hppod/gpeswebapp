import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelModule } from '../admin-panel.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { DragulaModule } from 'ng2-dragula';

import { PendingChangesGuard } from "src/app/shared/guards/pending-changes.guard";
import { TodosHomeComponent } from './todos-home/todos-home.component';
import { NovoHomeComponent } from './novo-home/novo-home.component';
import { AtualizarHomeComponent } from './atualizar-home/atualizar-home.component';
import { DetalhesHomeComponent } from './detalhes-home/detalhes-home.component';


const ROUTES: Routes = [
  { path: '', component: TodosHomeComponent },
  { path: 'novo', component: NovoHomeComponent, canDeactivate: [PendingChangesGuard] },
  { path: 'detalhes/:title', component: DetalhesHomeComponent },
  { path: 'atualizar/:title', component: AtualizarHomeComponent, canDeactivate: [PendingChangesGuard] }
]

@NgModule({
  declarations: [
    TodosHomeComponent,
    NovoHomeComponent,
    AtualizarHomeComponent,
    DetalhesHomeComponent
  ],
  exports: [
    TodosHomeComponent,
    NovoHomeComponent,
    AtualizarHomeComponent,
    DetalhesHomeComponent
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
    DragulaModule.forRoot()
  ]
})
export class HomeModule { }
