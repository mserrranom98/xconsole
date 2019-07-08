import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullPagesRoutingModule } from './full-pages-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { BitacoraComponent } from './bitacora/bitacora.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { ImageCropperModule } from 'ng2-img-cropper';
import { UiSwitchModule } from 'ngx-ui-switch';
//import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BitacoraService } from '../pages-services/serv-reca/bitacora.service';
import { NotificacionService } from '../pages-services/serv-reca/notificacion.service';
import { TurnosAbiertosComponent } from './cierre-turno/turnos-abiertos.component';
import { EmpRexsService } from '../pages-services/serv-emp-rec/emp-rexs.service';
import { SucursalesService } from '../pages-services/serv-emp-rec/sucursales.service';
import { TerminalesService } from '../pages-services/serv-emp-rec/terminales.service';
import { CierreTurnoService } from '../pages-services/serv-reca/cierre-turno.service';
import { UtilsService } from '../pages-services/serv-utils/utils.service';
import { RendicionComponent } from './otros/rendicion/rendicion.component';
import { ListasService } from '../pages-services/serv-emp-serv-rec/listas.services';
import { RendicionService } from '../pages-services/serv-reca/rendicion.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';


@NgModule({
    imports: [
        CommonModule,
        FullPagesRoutingModule,
        FormsModule,
        NgbModule,
        ImageCropperModule,
        UiSwitchModule,
        NgxDatatableModule,
        AngularMultiSelectModule
    ],
    declarations: [
    BitacoraComponent,
    NotificacionesComponent,
    //PdfViewerComponent,
    TurnosAbiertosComponent,
    RendicionComponent
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        BitacoraService,
        NotificacionService,
        EmpRexsService,
        SucursalesService,
        TerminalesService,
        CierreTurnoService,
        UtilsService,
        RendicionService,
        ListasService
    ]
})
export class FullPagesModule { }
