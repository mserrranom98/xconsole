import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';

import {FooterComponent} from './footer/footer.component';
import {NavbarComponent} from './navbar/navbar.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {ToggleFullscreenDirective} from './directives/toggle-fullscreen.directive';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FilterComponent } from './filter/filter.component';
import { FilterOperacionesComponent } from './filter/filter-operaciones/filter-operaciones.component';
import {FlexModule} from '@angular/flex-layout';
import {DataService} from '../services/data.service';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown';
import {DxDataGridModule, DxDropDownBoxModule, DxTagBoxModule} from 'devextreme-angular';
import {TurnosService} from '../pages/pages-services/serv-general/turnos.service';
import {SucursalesService} from '../pages/pages-services/serv-emp-rec/sucursales.service';
import {TerminalesService} from '../pages/pages-services/serv-emp-rec/terminales.service';
import {EmpRexsService} from '../pages/pages-services/serv-emp-rec/emp-rexs.service';
import {OperacionesService} from '../pages/pages-services/serv-general/operaciones.service';
import { FilterAlarmasComponent } from './filter/filter-alarmas/filter-alarmas.component';
import {FilterJournalComponent} from './filter/filter-journal/filter-journal.component';
import { FilterInstrumentosComponent } from './filter/filter-instrumentos/filter-instrumentos.component';
import {InstrumentosService} from './services/instrumentos/instrumentos.service';
import {UtilsService} from './services/utils/utils.service';
import {ListasService} from './services/listas/listas.service';
import { FilterTurnosComponent } from './filter/filter-turnos/filter-turnos.component';
import { FilterArqueoComponent } from './filter/filter-arqueo/filter-arqueo.component';

@NgModule({
  exports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    ToggleFullscreenDirective,
    NgbModule,
    TranslateModule,
    HttpClientModule,
    FilterComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    NgbModule,
    TranslateModule,
    FormsModule,
    FlexModule,
    AngularMultiSelectModule,
    ReactiveFormsModule,
    DxDropDownBoxModule,
    DxDataGridModule,
    DxTagBoxModule
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    ToggleFullscreenDirective,
    FilterComponent,
    FilterOperacionesComponent,
    FilterJournalComponent,
    FilterAlarmasComponent,
    FilterInstrumentosComponent,
    FilterTurnosComponent,
    FilterArqueoComponent
  ],
  providers: [
    DataService,
    TurnosService,
    SucursalesService,
    TerminalesService,
    EmpRexsService,
    OperacionesService,
    UtilsService,
    ListasService,
    InstrumentosService
  ]
})
export class SharedModule {
}
