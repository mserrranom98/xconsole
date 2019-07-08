import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExpiredService } from './expired-service';
import { ChangePass, VARGLOBAL } from './expired-user';
import { NgModule } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import { Response } from '@angular/http/src/static_response';

@Component({
  selector: 'app-expired-password',
  templateUrl: './expired-password.component.html',
  providers: [ExpiredService],
  styleUrls: ['./expired-password.component.css']
})

export class ExpiredPasswordComponent {
  public change: ChangePass;  
  public userAccount: string;
  public Usuario: string;
  public claveActual: string;
  public claveNueva: string;
  @ViewChild('fp') forogtPasswordForm: NgForm;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private expiredService: ExpiredService,
    private modalService: NgbModal) {
    this.change = new ChangePass('', '','','', [{ 'argument': '', 'value': '' }, { 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' },{ 'argument': '', 'value': '' }]);   
     this.Usuario = ''; 
  }

  onSubmit() {
    this.change.serviceName = 'UPDATE_USER_PASSWORD';
    const res = JSON.parse(localStorage.getItem('response'));
    this.change.userToken = VARGLOBAL.userToken;
    this.change.jsessionID = VARGLOBAL.jsessionID;
    this.change.sessionUUID = VARGLOBAL.sessionUUID;
    this.change.serviceArguments[0].argument = 'user';
    this.change.serviceArguments[0].value = this.Usuario;
    this.change.serviceArguments[1].argument = 'old';
    this.change.serviceArguments[1].value = this.claveActual;
    this.change.serviceArguments[2].argument = 'new';
    this.change.serviceArguments[2].value = this.claveNueva;
    this.change.serviceArguments[3].argument = 'directoryName';
    this.change.serviceArguments[3].value = 'ECUBAS';
     console.log(JSON.stringify(this.change)); 

    this.expiredService.change(this.change).subscribe(
        
      (response:any) => {
        console.log(JSON.stringify(response));
          if (response.message === 'OK') {
            // Redireccionar a la página del menú
            this.router.navigate(['/changelog']);
          } else {
            // Mostrar mensaje de error
            swal('Cambio de Password Invalido', response.message, 'error');
          }
        },
        error => {
          console.log(<any>error);
        }
      )      
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
