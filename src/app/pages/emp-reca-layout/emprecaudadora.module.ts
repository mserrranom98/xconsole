import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JournalService } from '../pages-services/serv-general/journal.service';
import { TurnosService } from '../pages-services/serv-general/turnos.service';
import { SucursalesService } from '../pages-services/serv-emp-rec/sucursales.service';
import { TerminalesService } from '../pages-services/serv-emp-rec/terminales.service';
import { EmpRexsService } from '../pages-services/serv-emp-rec/emp-rexs.service';

import { SucursalesComponent } from './configuracion/sucursales/sucursales.component';
import { SucursalesPropertiesComponent } from './configuracion/sucursales/sucursales-properties.component';
import { TerminalesComponent } from './configuracion/terminales/terminales.component';
import { TerminalesPropertiesComponent } from './configuracion/terminales/terminales-properties.component';
import { EmpresasrexComponent } from './configuracion/empresasrex/empresasrex.component';
import { UtilsService } from '../pages-services/serv-utils/utils.service';
import { EmpRecaRoutingModule } from './empreca-routing.module';


@NgModule({
  imports: [
    CommonModule,
    EmpRecaRoutingModule,
    FormsModule,
    NgbModule,
    NgxDatatableModule,
    Ng2SmartTableModule
  ],
  declarations: [
    EmpresasrexComponent,
    SucursalesComponent,
    SucursalesPropertiesComponent,
    TerminalesComponent,
    TerminalesPropertiesComponent
  ],
  providers: [
    JournalService,
    TurnosService,
    SucursalesService,
    TerminalesService,
    EmpRexsService,
    UtilsService
  ]
})
export class EmpRecaudadoraModule { }
