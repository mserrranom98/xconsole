import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SucursalesService } from '../pages-services/serv-emp-rec/sucursales.service';
import { EmpRexsService } from '../pages-services/serv-emp-rec/emp-rexs.service';
import { InformesRoutingModule } from './informes-routing.module';
import { ArqueoComponent} from './caja/arqueo/arqueo.component';
import { ArqueoService } from './caja/arqueo/arqueo.service';
//import { NestedTreeControl } from '@angular/cdk/tree';
//import { BrowserModule } from '@angular/platform-browser';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTreeModule, MatIconModule, MatButtonModule } from '@angular/material';
import { CuentasContablesComponent } from './cuentas-contables/cuentas-contables.component'; 
import { CuentaContableService } from './cuentas-contables/cuentas-contables.service';
import { NgbDateCustomParserFormatter } from 'app/pipes/date-format.pipe';
import {
  MatFormFieldModule,
  MatInputModule
} from '@angular/material';

 

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
   MatFormFieldModule,
   MatInputModule
  ],
  declarations: [ 
      ArqueoComponent, CuentasContablesComponent  
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
