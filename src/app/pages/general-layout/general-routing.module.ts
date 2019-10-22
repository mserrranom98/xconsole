import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JournalComponent } from './operaciones/consultas/journal/journal.component';
import { TurnosComponent } from './operaciones/consultas/turnos/turnos.component';
import { OperacionesComponent } from './operaciones/consultas/operaciones/operaciones.component';
import { CarnidalidadmpPropertiesComponent } from './ticket-recaudaciones/configuracion/carnidalidadmp/carnidalidadmp-properties.component';
import { ReglasPagoComponent } from './ticket-recaudaciones/configuracion/reglas-pago/reglas-pago.component';
import { RestriccionesComponent } from './restricciones/restricciones/restricciones.component';
import { TipoCambioComponent } from './operaciones/consultas/tipocambio/tipocambio.component';
import {UsuarioSucursalComponent} from './restricciones/usuario-sucursal/usuario-sucursal.component';
import {ArqueoComponent} from './operaciones/consultas/arqueo/arqueo.component';


const routes: Routes = [
  {
    path: 'operaciones/consultas',
    children: [
      { path: 'operaciones', component: OperacionesComponent, data: { title: 'Operacion' } },
      { path: 'operaciones/:fi', component: OperacionesComponent, data: { title: 'Operacion' } },
      { path: 'journal', component: JournalComponent, data: { title: 'Journal' } },
      { path: 'journal/:fi', component: JournalComponent, data: { title: 'Journal' } },
      { path: 'turnos', component: TurnosComponent, data: { title: 'Turnos' } },
      { path: 'turnos/:fi', component: TurnosComponent, data: { title: 'Turnos' } },
      { path: 'tipocambio', component: TipoCambioComponent, data: { title: 'TipoCambio' } },
      { path: 'arqueo', component: ArqueoComponent, data: { title: 'Arqueo' } },
      { path: 'arqueo/:fi', component: ArqueoComponent, data: { title: 'Arqueo' } }
    ]
  },
  {
    path: 'ticketrecaudacion/configuracion',
    children: [
      { path: 'cardinalidad', component: CarnidalidadmpPropertiesComponent, data: { title: 'Cardinalidad' } },
      { path: 'cardinalidad/new', component: CarnidalidadmpPropertiesComponent, data: { title: 'Cardinalidad' } },
      { path: 'reglasPago', component: ReglasPagoComponent, data: { title: 'Reglas de Pago' } }
    ]
  },
  {
    path: 'restricciones',
    children: [
      { path: 'restricciones', component: RestriccionesComponent, data: { title: 'Restricciones' } },
      { path: 'usuarios-sucursal', component: UsuarioSucursalComponent, data: { title: 'Usuarios-Sucursal' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralRoutingModule { }
