import {NgModule} from '@angular/core';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppRoutingModule} from './app-routing.module';
import {SharedModule} from './shared/shared.module';
import {ToastrModule} from 'ngx-toastr';
import {AgmCoreModule} from '@agm/core';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {StoreModule} from '@ngrx/store';
import {DragulaModule} from 'ng2-dragula';

import {AppComponent} from './app.component';
import {ContentLayoutComponent} from './layouts/content/content-layout.component';
import {FullLayoutComponent} from './layouts/full/full-layout.component';

import {AuthService} from './shared/auth/auth.service';
import {AuthGuard} from './shared/auth/auth-guard.service';

import * as $ from 'jquery';

// Desde XCONSOLE
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
// Servicios FALTA PONER ESTAS VAINASSSSSSSSSSSS
import {LoginPassService} from './services/login-pass.service';
import {MenuService} from './services/menu.service';
import {GetActionService} from './services/getAction.service';
import {LoginPassComponent} from './login-pass/login-pass.component';
import {DataFilterPipe} from './pipes/data-filter.pipe';
import {DxTreeListModule} from 'devextreme-angular';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';

// import { ForgotService } from './pages/content-layout-page/services/forgot.service';


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginPassComponent,
    FullLayoutComponent,
    ContentLayoutComponent,
    DataFilterPipe
  ],
  imports: [
    // NoopAnimationsModule,
    BrowserAnimationsModule,
    FormsModule,
    StoreModule.forRoot({}),
    AppRoutingModule,
    SharedModule,
    DxTreeListModule,
    DragulaModule.forRoot(),
    HttpClientModule,
    FlexLayoutModule,
    ToastrModule.forRoot(),
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBr5_picK8YJK7fFR2CPzTVMj6GG1TtRGo'
    })
  ],
  providers: [
    AuthService,
    AuthGuard,
    LoginPassService,
    MenuService,
    GetActionService,
    LoginPassComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
