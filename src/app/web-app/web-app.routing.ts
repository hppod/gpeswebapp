import { NgModule } from "@angular/core"
import { Routes, RouterModule } from "@angular/router"

import { HomeComponent } from "./home/home.component"

export const WebAppRoutes: Routes = [
    {
        path: 'institucional', children: [
            { path: 'home', component: HomeComponent },
            { path: 'duvidas-frequentes', loadChildren: './faq/faq-web.module#FaqWebModule' },
            { path: 'gpes', loadChildren: './gpes/gpes-web.module#GpesWebModule' },
            { path: 'noticias', loadChildren: './noticias/noticias-web.module#NoticiaWebModule' },
            { path: 'sobre', loadChildren: './sobre/sobre-web.module#SobreWebModule' },
            { path: 'publicacoes', loadChildren: './publicacoes/publicacoes-web.module#PublicacoesWebModule' },
            { path: '', redirectTo: '/institucional/home', pathMatch: 'full' },
            { path: '**', redirectTo: '/institucional/home', pathMatch: 'full' }
        ]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(WebAppRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class WebAppRoutingModule { }