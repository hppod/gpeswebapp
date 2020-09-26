import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, Routes } from "@angular/router"
import { AdminPanelModule } from "./../admin-panel.module"
import { SharedModule } from "./../../shared/shared.module"

import { GpesComponent } from "./gpes.component"

const ROUTES: Routes = [
    { path: '', component: GpesComponent }
]

@NgModule({
    declarations: [
        GpesComponent
    ],
    exports: [
        GpesComponent
    ],
    imports: [
        AdminPanelModule,
        CommonModule,
        SharedModule,
        RouterModule.forChild(ROUTES),
    ]
})
export class GpesModule { }