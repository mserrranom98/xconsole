import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ContentPagesRoutingModule } from './content-pages-routing.module';

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterComponent } from './register/register.component';
import { ExpiredPasswordComponent } from './expired-password/expired-password.component';


@NgModule({
    imports: [
        CommonModule,
        ContentPagesRoutingModule,
        FormsModule
    ],
    declarations: [
        ExpiredPasswordComponent,
        ForgotPasswordComponent,
        RegisterComponent
    ],
})
export class ContentPagesModule { }
