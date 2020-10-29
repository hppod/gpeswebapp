import { NgModule } from "@angular/core"
import { Routes, RouterModule } from "@angular/router"

import { HomeComponent } from "./home/home.component"

export const WebAppRoutes: Routes = [
    {
        path: 'institucional', children: [
            { path: 'home', component: HomeComponent },
            { path: 'noticias', loadChildren: './noticias/noticias-web.module#NoticiaWebModule' },
            { path: 'sobre', loadChildren: './sobre/sobre-web.module#SobreWebModule' },
            { path: 'publicacoes', loadChildren: './publicacoes/publicacoes-web.module#PublicacoesWebModule' },
            { path: 'processo-seletivo', loadChildren: './processo-seletivo/processo-seletivo-web.module#ProcessoSeletivoWebModule' },
            { path: 'integrantes', loadChildren: './integrantes/integrantes-web.module#IntegrantesWebModule' },
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