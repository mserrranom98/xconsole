import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AlarmaComponent} from './alarma/alarma.component';
import {IntegrantesComponent} from './integrantes/integrantes.component';
import {GrupoCorreoComponent} from './grupo-correo/grupo-correo.component';
import {ReglasComponent} from './reglas/reglas.component';

const routes: Routes = [
  {
    path: 'alarmas',
    component: AlarmaComponent,
    data: { title: 'Alarmas' }
  },
  {
    path: 'alarmas/:fi',
    component: AlarmaComponent,
    data: { title: 'Alarmas' }
  },
  {
    path: 'reglas',
    component: ReglasComponent,
    data: { title: 'Reglas' }
  },
  {
    path: 'grupos',
    component: GrupoCorreoComponent,
    data: { title: 'Grupos de Correo' }
  },
  {
    path: 'integrantes',
    component: IntegrantesComponent,
    data: { title: 'Integrantes' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalisisFinancieroRoutingModule { }
