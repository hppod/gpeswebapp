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
import { DragulaModule } from 'ng2-dragula';

import { FaqAdmninComponent } from "./todos-faq/faq-admnin.component"
import { CreateFaqComponent } from "./create-faq/create-faq.component"
import { DetalheFaqComponent } from "./detalhe-faq/detalhe-faq.component"
import { AtualizarFaqComponent } from "./atualizar-faq/atualizar-faq.component"
import { PendingChangesGuard } from "src/app/shared/guards/pending-changes.guard"

const ROUTES: Routes = [
    { path: '', component: FaqAdmninComponent },
    { path: 'detalhes/:question', component: DetalheFaqComponent },
    { path: 'novo', component: CreateFaqComponent, canDeactivate: [PendingChangesGuard] },
    { path: 'atualizar/:question', component: AtualizarFaqComponent, canDeactivate: [PendingChangesGuard] }
]

@NgModule({
    declarations: [
        FaqAdmninComponent,
        CreateFaqComponent,
        DetalheFaqComponent,
        AtualizarFaqComponent
    ],
    exports: [
        FaqAdmninComponent,
        CreateFaqComponent,
        DetalheFaqComponent,
        AtualizarFaqComponent
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
export class FaqModule { }