import { NgModule, ModuleWithProviders } from "@angular/core"
import { CommonModule } from "@angular/common"
import { LottieAnimationViewModule } from "ng-lottie"
import { PdfViewerModule } from "ng2-pdf-viewer"
import { TooltipModule } from "ngx-bootstrap/tooltip"
import { Ng2ImgMaxModule } from "ng2-img-max"
import { ReactiveFormsModule } from "@angular/forms"

import { LoadingComponent } from "./../web-components/common/loading/loading.component"
import { NoDataComponent } from "./../web-components/common/no-data/no-data.component"
import { ErrorComponent } from '../web-components/common/error/error.component'
import { ModalDialogComponent } from '../web-components/common/modals/modal-dialog/modal-dialog.component';
import { ModalLoadingComponent } from '../web-components/common/modals/modal-loading/modal-loading.component';
import { ModalErrorComponent } from '../web-components/common/modals/modal-error/modal-error.component';
import { ModalDocumentComponent } from '../web-components/common/modals/modal-document/modal-document.component';
import { ModalSuccessComponent } from "../web-components/common/modals/modal-success/modal-success.component";

import { NoSanitizeHtmlPipe } from "./pipes/no-sanitize-html.pipe"
import { DateAgoPipe } from "./pipes/date-ago.pipe"
import { StatusPipe } from "./pipes/status.pipe"

import { PasswordToggleDirective } from "./../shared/directives/password-toggle.directive"
import { PasswordEqualsDirective } from "./../shared/directives/password-equals.directive"
import { DragDropDirective } from "./directives/drag-drop.directive"

import { HomeService } from "./services/home.service"
import { SobreService } from "./services/sobre.service"
import { FAQService } from "./services/faq.service"
import { NoticiasService } from "./services/noticias.service"
import { ContatoService } from "./services/contato.service"
import { TransparenciaService } from "./services/transparencia.service"
import { UsuarioService } from "./services/usuario.service"
import { DoacaoService } from "./services/doacao.service";
import { ModalBoletoComponent } from "../web-components/common/modals/modal-boleto/modal-boleto.component";
import { CardStatsComponent } from '../web-components/common/card-stats/card-stats.component'
import { ModalUploadImagemComponent } from "../web-components/common/modals/modal-upload-imagem/modal-upload-imagem.component";
import { FileUploaderComponent } from '../web-components/common/file-uploader/file-uploader.component';
import { ModalFileUploadComponent } from '../web-components/common/modals/modal-file-upload/modal-file-upload.component';
import { ModalCreateCategoryComponent } from '../web-components/common/modals/modal-create-category/modal-create-category.component'

@NgModule({
    imports: [
        CommonModule,
        LottieAnimationViewModule,
        PdfViewerModule,
        TooltipModule.forRoot(),
        Ng2ImgMaxModule,
        ReactiveFormsModule
    ],
    declarations: [
        LoadingComponent,
        NoDataComponent,
        ErrorComponent,
        ModalDialogComponent,
        ModalLoadingComponent,
        ModalErrorComponent,
        ModalDocumentComponent,
        ModalSuccessComponent,
        ModalBoletoComponent,
        ModalUploadImagemComponent,
        CardStatsComponent,
        NoSanitizeHtmlPipe,
        StatusPipe,
        DateAgoPipe,
        PasswordEqualsDirective,
        PasswordToggleDirective,
        DragDropDirective,
        FileUploaderComponent,
        ModalFileUploadComponent,
        ModalCreateCategoryComponent
    ],
    exports: [
        LoadingComponent,
        NoDataComponent,
        ErrorComponent,
        ModalDialogComponent,
        ModalLoadingComponent,
        ModalUploadImagemComponent,
        ModalErrorComponent,
        ModalDocumentComponent,
        ModalSuccessComponent,
        ModalBoletoComponent,
        CardStatsComponent,
        NoSanitizeHtmlPipe,
        StatusPipe,
        DateAgoPipe,
        PasswordEqualsDirective,
        PasswordToggleDirective,
        FileUploaderComponent
    ],
    entryComponents: [
        ModalDialogComponent,
        ModalLoadingComponent,
        ModalUploadImagemComponent,
        ModalErrorComponent,
        ModalDocumentComponent,
        ModalSuccessComponent,
        ModalBoletoComponent,
        ModalFileUploadComponent,
        ModalCreateCategoryComponent
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                HomeService,
                SobreService,
                FAQService,
                NoticiasService,
                ContatoService,
                TransparenciaService,
                UsuarioService,
                DoacaoService
            ]
        }
    }

}