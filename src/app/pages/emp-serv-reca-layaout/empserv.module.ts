import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { EmpServRecaRoutingModule } from './empserv-routing.module';
import { ListasComponent } from './configuracion/listas/listas.component';
import { ListasDetalleComponent } from './configuracion/listas/listas-detalle.component';
import { ListasService } from '../pages-services/serv-emp-serv-rec/listas.services';
import { MetaListasComponent } from './configuracion/meta-listas/meta-listas.component';
import { MetaListasService } from '../pages-services/serv-emp-serv-rec/meta-listas.services';
import { MetaListasItemsComponent } from './configuracion/meta-listas/meta-listas-items.component';
import { InstrumentosComponent } from './configuracion/instrumentos/instrumentos.components';
import { EmpRexsService } from '../pages-services/serv-emp-rec/emp-rexs.service';
import { UtilsService } from '../pages-services/serv-utils/utils.service';
import {DxDataGridModule} from 'devextreme-angular';



@NgModule({
  imports: [
    CommonModule,
    EmpServRecaRoutingModule,
    FormsModule,
    NgbModule,
    NgxDatatableModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    DxDataGridModule
  ],
  declarations: [
    ListasComponent,
    ListasDetalleComponent,
    MetaListasComponent,
    MetaListasItemsComponent,
    InstrumentosComponent
  ],
  providers: [
    ListasService,
    MetaListasService,
    EmpRexsService,
    UtilsService
  ]
})
export class EmpServRecaModule { }
