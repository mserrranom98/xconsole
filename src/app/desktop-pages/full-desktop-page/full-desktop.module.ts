import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullDesktopPagesRoutingModule } from './full-desktop-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import {SelectModule} from 'angular2-select';  //CAMBIÉ ESTA A LA SIGUENTE POR QUE ESTÁ "DEPRECATED"
import {SelectModule} from 'ng-select';
//import {DataTableModule} from 'angular2-datatable';  //no dice estar "deprecated", pero tiene una actualización
import {DataTableModule} from 'angular-6-datatable';
import { SectionsComponent } from './sections/sections.component';
import { SectionmanagementComponent } from './sections/sectionmanagement.component';
import { FeaturesComponent } from './features/features.component';
import { FeaturemanagementComponent } from './features/featuremanagement.component';
import { UsersComponent } from './users/users.component';
import { UsersmanagementComponent } from './users/usersmanagement.component';
import { PagesComponent } from './page/pages.component';
import { PagemanagementComponent } from './page/pagemanagement.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfilemanagementComponent } from './profile/profilemanagement.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { DirectoriesComponent } from './directories/directories.component';
import { DirmanagementComponent } from './directories/dirmanagement.component';
import { ConfigPageComponent } from './config-page/config-page.component';
//import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ImageCropperModule } from 'ng2-img-cropper';
import { InstitutionComponent } from './institution/institution.component';
import { InstitutionmanagementComponent } from './institution/institutionmanagement.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { UserProfilePageComponent } from './user-profile-page/user-profile-page.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { from } from 'rxjs';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }

@NgModule({
    imports: [
        CommonModule,
        FullDesktopPagesRoutingModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule,
        SelectModule,
        DataTableModule,
        UiSwitchModule,
        AngularMultiSelectModule,
        NgxDatatableModule,
        ImageCropperModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
              }
        })
    ],
    declarations: [
        FeaturesComponent,
        FeaturemanagementComponent,
        SectionsComponent,
        SectionmanagementComponent,
        UsersComponent,
        UsersmanagementComponent,
        PagesComponent,
        PagemanagementComponent,
        ProfileComponent,
        ProfilemanagementComponent,
        DirectoriesComponent,
        DirmanagementComponent,
        ConfigPageComponent,
        InstitutionComponent,
        InstitutionmanagementComponent,
        UserProfilePageComponent
    ],
    providers: [
    ]
})
export class FullDesktopPagesModule { }
