import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListasComponent } from './configuracion/listas/listas.component';
import { ListasDetalleComponent } from './configuracion/listas/listas-detalle.component';
import { MetaListasComponent } from './configuracion/meta-listas/meta-listas.component';
import { MetaListasItemsComponent } from './configuracion/meta-listas/meta-listas-items.component';
import { InstrumentosComponent } from './configuracion/instrumentos/instrumentos.components';

const routes: Routes = [
  {
    path: 'configuracion',
    children: [
      {path: 'list', component: ListasComponent, data: {title: 'Listas'}},
      {path: 'listas', component: ListasDetalleComponent, data: {title: 'Listas Detalle'}},
      {path: 'meta-listas', component: MetaListasComponent, data: {title: 'Meta Listas'}},
      {path: 'instrumentos', component: InstrumentosComponent, data: {title: 'Instrumentos'}}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpServRecaRoutingModule { }
