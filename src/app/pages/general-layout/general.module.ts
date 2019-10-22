import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GeneralRoutingModule} from './general-routing.module';
import {TurnosComponent} from './operaciones/consultas/turnos/turnos.component';
import {JournalComponent} from './operaciones/consultas/journal/journal.component';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JournalService} from '../pages-services/serv-general/journal.service';
import {TurnosService} from '../pages-services/serv-general/turnos.service';
import {SucursalesService} from '../pages-services/serv-emp-rec/sucursales.service';
import {TerminalesService} from '../pages-services/serv-emp-rec/terminales.service';
import {EmpRexsService} from '../pages-services/serv-emp-rec/emp-rexs.service';
import {OperacionesService} from '../pages-services/serv-general/operaciones.service';
import {OperacionesComponent} from './operaciones/consultas/operaciones/operaciones.component';
import {UtilsService} from '../pages-services/serv-utils/utils.service';
import {ListasService} from '../pages-services/serv-emp-serv-rec/listas.services';
import {CierreTurnoService} from '../pages-services/serv-reca/cierre-turno.service';
import {CarnidalidadmpComponent} from './ticket-recaudaciones/configuracion/carnidalidadmp/carnidalidadmp.component';
import {CarnidalidadmpPropertiesComponent} from './ticket-recaudaciones/configuracion/carnidalidadmp/carnidalidadmp-properties.component';
import {CardinalidadmpService} from '../pages-services/serv-general/cardinalidadmp.service';
import {ReglasPagoComponent} from './ticket-recaudaciones/configuracion/reglas-pago/reglas-pago.component';
import {ReglasPagoService} from '../pages-services/serv-general/reglas-pago.service';
import {RestriccionesComponent} from './restricciones/restricciones/restricciones.component';
import {RestriccionesService} from '../pages-services/serv-general/restricciones.service';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown';
import {CompareJson} from '../../pipes/compare-json.pipe';
import {NgbDateCustomParserFormatter} from 'app/pipes/date-format.pipe';
import {TipoCambioComponent} from './operaciones/consultas/tipocambio/tipocambio.component';
import {TipoCambioService} from './operaciones/consultas/tipocambio/tipocambio.service';
import {DxDataGridModule, DxDropDownBoxModule} from 'devextreme-angular';
import {DataService} from '../../services/data.service';
import {FolioOperacionesComponent} from './operaciones/consultas/operaciones/folio-operaciones/folio-operaciones.component';
import {DetalleOperacionesComponent} from './operaciones/consultas/operaciones/detalle-operaciones/detalle-operaciones.component';
import {MaterialModule} from '../../shared/material/material.module';
import {FlexModule} from '@angular/flex-layout';
import { TurnoOpeComponent } from './operaciones/consultas/turnos/turno-ope/turno-ope.component';
import { UsuarioSucursalComponent } from './restricciones/usuario-sucursal/usuario-sucursal.component';
import {ArqueoComponent} from './operaciones/consultas/arqueo/arqueo.component';
import {ArqueoService} from './operaciones/consultas/arqueo/arqueo.service';
import {CargaComponent} from './operaciones/consultas/tipocambio/carga/carga.component';


@NgModule({
  imports: [
    CommonModule,
    GeneralRoutingModule,
    FormsModule,
    NgbModule,
    NgxDatatableModule,
    Ng2SmartTableModule,
    AngularMultiSelectModule,
    ReactiveFormsModule,
    DxDropDownBoxModule,
    DxDataGridModule,
    MaterialModule,
    FlexModule
  ],
  declarations: [
    JournalComponent,
    TurnosComponent,
    OperacionesComponent,
    CarnidalidadmpComponent,
    CarnidalidadmpPropertiesComponent,
    ReglasPagoComponent,
    RestriccionesComponent,
    TipoCambioComponent,
    FolioOperacionesComponent,
    DetalleOperacionesComponent,
    TurnoOpeComponent,
    UsuarioSucursalComponent,
    ArqueoComponent,
    CargaComponent
  ],
  entryComponents: [
    FolioOperacionesComponent,
    DetalleOperacionesComponent,
    CargaComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
    TipoCambioService,
    DataService,
    ArqueoService
  ]
})
export class GeneralModule {
}
