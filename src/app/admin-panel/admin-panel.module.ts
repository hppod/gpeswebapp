import { NgModule } from "@angular/core"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { NgxPaginationModule } from "ngx-pagination"
import { BsDropdownModule } from "ngx-bootstrap/dropdown"
import { ModalModule } from "ngx-bootstrap/modal"
import { TooltipModule } from "ngx-bootstrap/tooltip"
import { OrderModule } from 'ngx-order-pipe'
import { ToastrModule } from "ngx-toastr"
import { NgxEditorModule } from "ngx-editor"
import { NgxChartsModule } from "@swimlane/ngx-charts"
import { SharedModule } from "./../shared/shared.module"
import { DragulaModule } from 'ng2-dragula'
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

import { HeaderComponent } from "./../web-components/admin-panel/header/header.component"
import { SidenavComponent } from "./../web-components/admin-panel/sidenav/sidenav.component"
import { DashboardComponent } from "./dashboard/dashboard.component"

import { AdminPanelRoutingModule } from "./admin-panel.routing"

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
        NgxEditorModule,
        SharedModule,
        NgxChartsModule,
        DragulaModule.forRoot()
    ],
    declarations: [
        HeaderComponent,
        SidenavComponent,
        DashboardComponent
    ],
    exports: [
        HeaderComponent,
        SidenavComponent,
        DashboardComponent
    ]
})
export class AdminPanelModule { }