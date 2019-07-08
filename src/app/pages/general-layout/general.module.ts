import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralRoutingModule } from './general-routing.module';
import { TurnosMontosComponent } from './operaciones/consultas/turnos/turnos-montos.component';
import { TurnosComponent } from './operaciones/consultas/turnos/turnos.component';
import { JournalComponent } from './operaciones/consultas/journal/journal.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JournalService } from '../pages-services/serv-general/journal.service';
import { TurnosService } from '../pages-services/serv-general/turnos.service';
import { SucursalesService } from '../pages-services/serv-emp-rec/sucursales.service';
import { TerminalesService } from '../pages-services/serv-emp-rec/terminales.service';
import { EmpRexsService } from '../pages-services/serv-emp-rec/emp-rexs.service';
import { TurnosDetalleComponent } from './operaciones/consultas/turnos/turnos-detalle.component';
import { OperacionesDetalleComponent } from './operaciones/consultas/operaciones/operaciones-detalle.component';
import { OperacionesService } from '../pages-services/serv-general/operaciones.service';
import { OperacionesComponent } from './operaciones/consultas/operaciones/operaciones.component';
import { UtilsService } from '../pages-services/serv-utils/utils.service';
import { ListasService } from '../pages-services/serv-emp-serv-rec/listas.services';
import { CierreTurnoService } from '../pages-services/serv-reca/cierre-turno.service';
import { DetalleTicketComponent } from './operaciones/consultas/operaciones/detalle-ticket.component';
import { CarnidalidadmpComponent } from './ticket-recaudaciones/configuracion/carnidalidadmp/carnidalidadmp.component';
import { CarnidalidadmpPropertiesComponent } from './ticket-recaudaciones/configuracion/carnidalidadmp/carnidalidadmp-properties.component';
import { CardinalidadmpService } from '../pages-services/serv-general/cardinalidadmp.service';
import { ReglasPagoComponent } from './ticket-recaudaciones/configuracion/reglas-pago/reglas-pago.component';
import { ReglasPagoService } from '../pages-services/serv-general/reglas-pago.service';
import { RestriccionesComponent } from './restricciones/restricciones/restricciones.component';
import { RestriccionesService } from '../pages-services/serv-general/restricciones.service';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { CompareJson } from '../../pipes/compare-json.pipe';
import { NgbDateCustomParserFormatter } from 'app/pipes/date-format.pipe';
import { TipoCambiocomponent } from './operaciones/consultas/tipocambio/tipocambio.component';
import { TipoCambioService } from './operaciones/consultas/tipocambio/tipocambio.service';


@NgModule({
  imports: [
    CommonModule,
    GeneralRoutingModule,
    FormsModule,
    NgbModule,
    NgxDatatableModule,
    Ng2SmartTableModule,
    AngularMultiSelectModule 
  ],
  declarations: [    
    JournalComponent,
    TurnosComponent,
    TurnosMontosComponent,
    TurnosDetalleComponent,
    OperacionesComponent,
    OperacionesDetalleComponent,
    DetalleTicketComponent,
    CarnidalidadmpComponent,
    CarnidalidadmpPropertiesComponent,
    ReglasPagoComponent,
    RestriccionesComponent,
   TipoCambiocomponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    TurnosMontosComponent,      
    OperacionesDetalleComponent],
  providers: [
    JournalService,
    TurnosService,
    SucursalesService,
    TerminalesService,
    EmpRexsService,
    OperacionesService,
    UtilsService,
    ListasService,
    CardinalidadmpService,
    CierreTurnoService,
    ReglasPagoService,
    CompareJson,
    RestriccionesService,   
    NgbDateCustomParserFormatter,
    TipoCambioService   
  ]
})
export class GeneralModule { }
