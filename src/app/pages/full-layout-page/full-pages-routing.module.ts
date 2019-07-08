import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../shared/auth/auth-guard.service';
import { BitacoraComponent } from './bitacora/bitacora.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { TurnosAbiertosComponent } from './cierre-turno/turnos-abiertos.component';
import { GeneralModule } from '../general-layout/general.module';
import { RendicionComponent } from './otros/rendicion/rendicion.component';

const routes: Routes = [
  {
    path: '/auditoria',
    children: [
      {path: '', component: BitacoraComponent, data: {title: 'Bitacora'}},
    ]
  },
  {
    path: 'bitacora',
    component: BitacoraComponent
  },
  {
    path: 'notificaciones',
    component: NotificacionesComponent
  },
  { path: 'cierre-turno',
    component: TurnosAbiertosComponent
  },
  { path: 'cierre-turno/:fi/:fh/:rex/:rexD/:suc/:sucD/:ter/:terD',
    component: TurnosAbiertosComponent
  },
  { path: 'otros',
    children: [
      {path: 'rendicion', component: RendicionComponent, data: {title: 'Rendición'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule, GeneralModule],
})
export class FullPagesRoutingModule { }
