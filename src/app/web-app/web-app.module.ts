//Import Modules
import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { LightboxModule } from "ngx-lightbox"
import { NgxPaginationModule } from "ngx-pagination"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { BsDropdownModule } from "ngx-bootstrap/dropdown"
import { TooltipModule } from "ngx-bootstrap/tooltip"
import { ModalModule } from "ngx-bootstrap/modal"
import { CarouselModule } from "ngx-bootstrap/carousel"
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { SharedModule } from "./../shared/shared.module"
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

//Import Principal Components
import { HeaderComponent } from "./../web-components/web-app/header/header.component"
import { FooterComponent } from "./../web-components/web-app/footer/footer.component"

//Import Components
import { HomeComponent } from "./../web-app/home/home.component"
import { CarouselComponent } from "./../web-app/home/carousel/carousel.component"

//Import Routes
import { WebAppRoutingModule } from "./web-app.routing";

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
@NgModule({
    imports: [
        WebAppRoutingModule,
        FormsModule,
        CommonModule,
        LightboxModule,
        NgbCollapseModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        CarouselModule.forRoot(),
        BsDropdownModule.forRoot(),
        NgxMaskModule.forRoot(options),
        SharedModule
    ],
    declarations: [
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        CarouselComponent
    ],
    exports: [
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        CarouselComponent
    ]
})
export class WebAppModule { }