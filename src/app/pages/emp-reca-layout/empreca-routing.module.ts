import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpresasrexComponent } from './configuracion/empresasrex/empresasrex.component';
import { SucursalesPropertiesComponent } from './configuracion/sucursales/sucursales-properties.component';
import { TerminalesPropertiesComponent } from './configuracion/terminales/terminales-properties.component';

const routes: Routes = [
  {
    path: 'configuracion',
    children: [
      {path: 'empresasrex', component: EmpresasrexComponent, data: {title: 'Empresas(REX)'}},
      {path: 'sucursal', component: SucursalesPropertiesComponent, data: {title: 'Sucursales'}},
      {path: 'sucursal/new', component: SucursalesPropertiesComponent, data: {title: 'Sucursal'}},
      {path: 'terminal', component: TerminalesPropertiesComponent, data: {title: 'Sucursales'}},
      {path: 'terminal/new', component: TerminalesPropertiesComponent, data: {title: 'Sucursal'}},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpRecaRoutingModule { }
