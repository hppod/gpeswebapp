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

import { PendingChangesGuard } from "src/app/shared/guards/pending-changes.guard";
import { TodosIntegrantesComponent } from './todos-integrantes/todos-integrantes.component';
import { NovoIntegranteComponent } from './novo-integrante/novo-integrante.component';
import { DetalhesIntegranteComponent } from './detalhes-integrante/detalhes-integrante.component'

const ROUTES: Routes = [
  { path: '', component: TodosIntegrantesComponent },
  { path: 'novo', component: NovoIntegranteComponent, canDeactivate: [PendingChangesGuard]},
  { path: 'detalhes/:nome', component: DetalhesIntegranteComponent},
]

@NgModule({
  declarations: [
    TodosIntegrantesComponent,
    NovoIntegranteComponent,
    DetalhesIntegranteComponent
  ],
  exports: [

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
export class IntegrantesModule { }
