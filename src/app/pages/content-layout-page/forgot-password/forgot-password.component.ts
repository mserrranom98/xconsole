import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ForgotService } from '../services/forgot.service';
import { ChangePass } from '../models/usuario';
import { NgModule } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import { Response } from '@angular/http/src/static_response';
import { ForgotPass } from '../../../models/desktop';
import { VARGLOBAL } from '../../../services/login-pass.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  providers: [ForgotService],
  styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent {
  public change: ChangePass;
  public forgotPass: ForgotPass;
  public userAccount: string;

  @ViewChild('fp') forogtPasswordForm: NgForm;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private forgotService: ForgotService,
    private modalService: NgbModal) {
    this.change = new ChangePass('', '', [{ 'argument': '', 'value': '' }, { 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }]);
    this.forgotPass = new ForgotPass('', [{'argument': '', 'value': ''}]);
  }

  onSubmit() {
    /* this.forgotPass.serviceName = 'UPDATE_USER_PASSWORD';
    const res = JSON.parse(localStorage.getItem('response'));
    this.forgotPass.userToken = res.userToken;
    this.forgotPass.serviceArguments[0].argument = 'user';
    this.forgotPass.serviceArguments[0].value = res.displayName;
    this.forgotPass.serviceArguments[1].argument = 'old';
    this.forgotPass.serviceArguments[2].argument = 'new';

    this.forgotService.change(this.forgotPass).subscribe(
        response => {
          if (response.message === 'OK') {
            // Redireccionar a la página del menú
            this.router.navigate(['/changelog']);
          } else {
            // Mostrar mensaje de error
            swal('Cambio de Password Invalido', '', 'error');
          }
        },
        error => {
          console.log(<any>error);
        }
      ) */

      // Forgot Password
      this.forgotPass.serviceName = 'FORGOT_PASS';
      this.forgotPass.serviceArguments[0].argument = 'user';
      this.forgotPass.serviceArguments[0].value = this.userAccount;
      this.forgotService.forgot(this.forgotPass).subscribe(
        response => {
          swal('Successful!', '', 'success');
          this.router.navigate(['/login']);
        },
        error => {
          console.log(<any>error);
        }
      );
  }

  // On login link click
  onLogin() {
    this.router.navigate([''], { relativeTo: this.route.parent });
  }

  // On registration link click
  onRegister() {
    this.router.navigate(['register'], { relativeTo: this.route.parent });
  }
}
