import { NgModule } from "@angular/core"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { NgxPaginationModule } from "ngx-pagination"
import { BsDropdownModule } from "ngx-bootstrap/dropdown"
import { ModalModule } from "ngx-bootstrap/modal"
import { TooltipModule } from "ngx-bootstrap/tooltip"
import { OrderModule } from 'ngx-order-pipe'
import { ToastrModule } from "ngx-toastr"
import { AngularEditorModule } from '@kolkov/angular-editor'
import { NgxChartsModule } from "@swimlane/ngx-charts"
import { SharedModule } from "./../shared/shared.module"
import { DragulaModule } from 'ng2-dragula'
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';


import { HeaderComponent } from "./../web-components/admin-panel/header/header.component"
import { SidenavComponent } from "./../web-components/admin-panel/sidenav/sidenav.component"

import { AdminPanelRoutingModule } from "./admin-panel.routing";
import { AnalyticsComponent } from "./analytics/analytics.component";
import { ListarTodosComponent } from './projetos/listar-todos/listar-todos.component';

@NgModule({
    imports: [
        AdminPanelRoutingModule,
        NgxPaginationModule,
        CommonModule,
        FormsModule,
        NgbCollapseModule,
        ReactiveFormsModule,
        BsDropdownModule.forRoot(),
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        OrderModule,
        ToastrModule.forRoot({
            preventDuplicates: true
        }),
        AngularEditorModule,
        SharedModule,
        NgxChartsModule,
        DragulaModule.forRoot()
    ],
    declarations: [
        HeaderComponent,
        SidenavComponent,
        AnalyticsComponent
    ],
    exports: [
        HeaderComponent,
        SidenavComponent,
        AnalyticsComponent
    ]
})
export class AdminPanelModule { }