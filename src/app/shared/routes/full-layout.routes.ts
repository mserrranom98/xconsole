import { Routes, RouterModule } from '@angular/router';

// Route for content layout with sidebar, navbar and footer
export const Full_ROUTES: Routes = [
  {
    path: 'home',
    loadChildren: './home/home.module#HomeModule'
  },
  {
    path: 'pages',
    loadChildren: 'app/pages/full-layout-page/full-pages.module#FullPagesModule'
  },
  {
    path: '',
    loadChildren: 'app/desktop-pages/full-desktop-page/full-desktop.module#FullDesktopPagesModule'
  },
  {
    path: 'general',
    loadChildren: 'app/pages/general-layout/general.module#GeneralModule'
  },
  {
    path: 'er',
    loadChildren: 'app/pages/emp-reca-layout/emprecaudadora.module#EmpRecaudadoraModule'
  },
  {
    path: 'esr',
    loadChildren: 'app/pages/emp-serv-reca-layaout/empserv.module#EmpServRecaModule'
  },
  {
    path:'informes',
    loadChildren:'app/pages/informes/informes.module#InformesModule'
  }
  
];
