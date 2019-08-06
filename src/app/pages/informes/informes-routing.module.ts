import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArqueoComponent } from './caja/arqueo/arqueo.component';
import { CuentasContablesComponent } from './cuentas-contables/cuentas-contables.component'

const routes: Routes = [
  {
    path: 'caja',
    children: [
      {
        path: 'arqueo',
        component: ArqueoComponent,
        data: { title: 'Arqueo' }
      }
    ]
  },
  {
    path: 'cuentas-contables',
    component: CuentasContablesComponent,
    data: { title: 'Cuentas Contables' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformesRoutingModule { }
