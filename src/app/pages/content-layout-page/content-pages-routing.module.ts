import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterComponent } from './register/register.component';
import { ExpiredPasswordComponent } from './expired-password/expired-password.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'expiredpassword',
        component: ExpiredPasswordComponent,
        data: {
          title: 'Expired Password '
        }
      },
      {
        path: 'forgotpassword',
        component: ForgotPasswordComponent,
        data: {
          title: 'Forgot Password '
        }
      },
      {
        path: 'register',
        component: RegisterComponent,
        data: {
          title: 'Register'
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContentPagesRoutingModule { }
