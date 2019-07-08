import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ToggleFullscreenDirective } from './directives/toggle-fullscreen.directive';
import { HttpClientModule } from '@angular/common/http';
//import { NotificacionService } from '../pages/pages-services/serv-reca/notificacion.service';


@NgModule({
    exports: [
        CommonModule,
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        ToggleFullscreenDirective,
        NgbModule,
        TranslateModule,
        HttpClientModule
    ],
    imports: [
        RouterModule,
        CommonModule,
        NgbModule,
        TranslateModule
    ],
    declarations: [
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        ToggleFullscreenDirective
        ],
    providers: [
     //   NotificacionService
    ]
})
export class SharedModule { }
