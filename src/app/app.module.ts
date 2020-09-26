//Import Modules
import { NgModule } from '@angular/core'
import { HttpModule } from "@angular/http"
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
import { LocationStrategy, HashLocationStrategy } from "@angular/common"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"

//Import Extra Modules 
import { WebAppModule } from "./web-app/web-app.module"
import { AdminPanelModule } from "./admin-panel/admin-panel.module"
import { SharedModule } from "./shared/shared.module"

//Import Helpers
import { JwtInterceptor } from "./shared/helpers/jwt.interceptor"
import { ErrorInterceptor } from "./shared/helpers/error.interceptor"

//Import Components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    WebAppModule,
    AdminPanelModule,
    HttpModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule.forRoot()
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }