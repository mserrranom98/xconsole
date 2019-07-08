import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JournalComponent } from './operaciones/consultas/journal/journal.component';
import { TurnosComponent } from './operaciones/consultas/turnos/turnos.component';
import { TurnosMontosComponent } from './operaciones/consultas/turnos/turnos-montos.component';
import { OperacionesComponent } from './operaciones/consultas/operaciones/operaciones.component';
import { CarnidalidadmpPropertiesComponent } from './ticket-recaudaciones/configuracion/carnidalidadmp/carnidalidadmp-properties.component';
import { ReglasPagoComponent } from './ticket-recaudaciones/configuracion/reglas-pago/reglas-pago.component';
import { RestriccionesComponent } from './restricciones/restricciones/restricciones.component';
import { TipoCambiocomponent } from './operaciones/consultas/tipocambio/tipocambio.component';


const routes: Routes = [
  {
    path: 'operaciones/consultas',
    children: [
      { path: 'operaciones', component: OperacionesComponent, data: { title: 'Operacion' } },
      { path: 'journal', component: JournalComponent, data: { title: 'Journal' } },
      { path: 'turnos', component: TurnosComponent, data: { title: 'Turnos' } },
      { path: 'turnos/:fi/:fh/:rex/:rexD/:suc/:sucD', component: TurnosComponent, data: { title: 'Turnos' } },
      { path: 'turnos/Montos', component: TurnosMontosComponent, data: { title: 'Turno Montos' } },
      { path: 'tipocambio', component: TipoCambiocomponent, data: { title: 'TipoCambio' } }
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
      { path: 'restricciones', component: RestriccionesComponent, data: { title: 'Restricciones' } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralRoutingModule { }
