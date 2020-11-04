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
import { NgSelect2Module } from 'ng-select2';

import { PublicacoesComponent } from "./todos-publicacoes/publicacoes.component"
import { CreatePublicacoesComponent } from "./create-publicacoes/create-publicacoes.component"
import { DetalhesPublicacoesComponent } from "./detalhes-publicacoes/detalhes-publicacoes.component"
import { AtualizarPublicacoesComponent } from "./atualizar-publicacoes/atualizar-publicacoes.component"
import { PendingChangesGuard } from "src/app/shared/guards/pending-changes.guard"

const ROUTES: Routes = [
    { path: '', component: PublicacoesComponent },
    { path: 'detalhes/:title', component: DetalhesPublicacoesComponent },
    { path: 'create', component: CreatePublicacoesComponent, canDeactivate: [PendingChangesGuard] },
    { path: 'atualizar/:title', component: AtualizarPublicacoesComponent, canDeactivate: [PendingChangesGuard] }
]

@NgModule({
    declarations: [
        PublicacoesComponent,
        CreatePublicacoesComponent,
        DetalhesPublicacoesComponent,
        AtualizarPublicacoesComponent
    ],
    exports: [
        PublicacoesComponent,
        CreatePublicacoesComponent,
        DetalhesPublicacoesComponent,
        AtualizarPublicacoesComponent
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
        NgSelect2Module
    ]
})
export class PublicacoesModule { }