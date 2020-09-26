import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, Routes } from "@angular/router"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { ToastrModule } from "ngx-toastr"
import { NgxPaginationModule } from "ngx-pagination"
import { ModalModule } from "ngx-bootstrap/modal"
import { TooltipModule } from "ngx-bootstrap/tooltip"
import { BsDropdownModule } from "ngx-bootstrap/dropdown"
import { SharedModule } from "./../../shared/shared.module"
import { WebAppModule } from "./../web-app.module"

import { NoticiasComponent } from "./todos-noticia/noticias.component"
import { NoticiaCardComponent } from "./todos-noticia/noticia-card/noticia-card.component"
import { NoticiaComponent } from "./detalhes-noticia/noticia.component"
import { GalleryComponent } from "./detalhes-noticia/gallery/gallery.component"

const ROUTES: Routes = [
    { path: '', component: NoticiasComponent },
    { path: 'noticia/:title', component: NoticiaComponent }
]

@NgModule({
    declarations: [
        NoticiasComponent,
        NoticiaCardComponent,
        NoticiaComponent,
        GalleryComponent
    ],
    exports: [
        NoticiasComponent,
        NoticiaCardComponent,
        NoticiaComponent,
        GalleryComponent
    ],
    imports: [
        WebAppModule,
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
export class NoticiaWebModule { }