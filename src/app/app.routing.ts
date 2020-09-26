import { NgModule } from "@angular/core"
import { Routes, RouterModule } from "@angular/router"

const ROUTES: Routes = [
    { path: 'institucional', loadChildren: './web-app/web-app.module#WebAppModule' },
    { path: 'admin', loadChildren: './admin-panel/admin-panel.module#AdminPanelModule' },
    { path: '', redirectTo: '/institucional/home', pathMatch: 'full' }
]
@NgModule({
    imports: [
        RouterModule.forRoot(ROUTES)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }