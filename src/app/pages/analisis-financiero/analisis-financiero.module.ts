import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AnalisisFinancieroRoutingModule} from './analisis-financiero-routing.module';
import {GrupoCorreoComponent} from './grupo-correo/grupo-correo.component';
import {AlarmaComponent} from './alarma/alarma.component';
import { IntegrantesComponent } from './integrantes/integrantes.component';
import {DxDataGridModule, DxTagBoxModule} from 'devextreme-angular';
import {FlexModule} from '@angular/flex-layout';
import { ReglasComponent } from './reglas/reglas.component';

@NgModule({
  imports: [
    CommonModule,
    AnalisisFinancieroRoutingModule,
    DxDataGridModule,
    FlexModule,
    DxTagBoxModule
  ],
  declarations: [
    GrupoCorreoComponent,
    AlarmaComponent,
    IntegrantesComponent,
    ReglasComponent
  ],
  entryComponents: [
  ]
})
export class AnalisisFinancieroModule { }
