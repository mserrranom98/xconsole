import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SucursalesService } from '../pages-services/serv-emp-rec/sucursales.service';
import { EmpRexsService } from '../pages-services/serv-emp-rec/emp-rexs.service';
import { InformesRoutingModule } from './informes-routing.module';
import { ArqueoComponent} from './caja/arqueo/arqueo.component';
import { ArqueoService } from './caja/arqueo/arqueo.service';
import {MatTreeModule, MatIconModule, MatButtonModule, MatDialogModule} from '@angular/material';
import { CuentasContablesComponent } from './cuentas-contables/cuentas-contables.component';
import { CuentaContableService } from './cuentas-contables/cuentas-contables.service';
import { NgbDateCustomParserFormatter } from 'app/pipes/date-format.pipe';
import {
  MatFormFieldModule,
  MatInputModule
} from '@angular/material';
import {DxDataGridModule, DxTreeListModule} from 'devextreme-angular';
import {FlexModule} from '@angular/flex-layout';
import { AdminCuentasContablesComponent } from './cuentas-contables/admin-cuentas-contables/admin-cuentas-contables.component';
import {AsignacionCuentasContablesComponent} from './cuentas-contables/asignacion-cuentas-contables/asignacion-cuentas-contables.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    NgxDatatableModule,
    Ng2SmartTableModule,
    InformesRoutingModule,
    // NestedTreeControl,
    //  BrowserModule,
    //  BrowserAnimationsModule
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    DxTreeListModule,
    ReactiveFormsModule,
    FlexModule,
    DxDataGridModule
  ],
  declarations: [
    ArqueoComponent,
    CuentasContablesComponent,
    AsignacionCuentasContablesComponent,
    AdminCuentasContablesComponent
  ],
  entryComponents: [
    AsignacionCuentasContablesComponent,
    AdminCuentasContablesComponent
  ],
  providers: [
    SucursalesService,
    EmpRexsService,
    ArqueoService,
    DatePipe,
    CuentaContableService,
    NgbDateCustomParserFormatter
  ]
})
export class InformesModule { }
