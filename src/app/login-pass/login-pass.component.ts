import {Component, ViewChild, OnInit, Injectable} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';

import {Login, Perfiles, PageMenu} from '../models/usuario';
import {TranslateService} from '@ngx-translate/core';
import {LoginPassService, VARGLOBAL} from '../services/login-pass.service';

// rb2208
import * as CryptoJS from 'crypto-js';
import {GetActionService} from '../services/getAction.service';
import {MenuService} from '../services/menu.service';
import swal from 'sweetalert2';
import {HttpClient, HttpResponse, HttpHeaders, HttpRequest} from '@angular/common/http';

@Component({
  selector: 'app-login-pass',
  templateUrl: './login-pass.component.html',
  providers: [LoginPassService],
  styleUrls: ['./login-pass.components.css']
})
export class LoginPassComponent implements OnInit {

  public usuario: Login;
  public perfil: Perfiles[];
  public opcionSeleccionado = '0';
  public verSeleccion = '';
  public msj: string;
  public next: boolean;
  public ocultar: boolean;
  public usrLocal: any[];
  public remove: boolean;
  public done: boolean;
  directory = true;
  listDir = [];

  @ViewChild('f') loginForm: NgForm;
  @ViewChild('fp') perfilForm: NgForm;
  public pages: PageMenu;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private loginPassService: LoginPassService,
              private getActionService: GetActionService,
              private menu: MenuService,
              public _http: HttpClient,
              public translate: TranslateService
  ) {
    this.usuario = new Login('', '', '');
    this.pages = new PageMenu('', '', '', '', [{'argument': '', 'value': ''}]);
    this.next = false;
    this.msj = '';
    this.ocultar = false;
    this.usrLocal = [];
    this.remove = false;
    this.done = false;
  }

  onUser(valor) {
    // Usuario seleccionado para ingresar
    this.ocultar = true;
    this.usuario.userName = valor;
    this.onChange();
  }

  onAcount() {
    this.ocultar = true;
  }

  onRemove(account) {
    // Eliminar cuenta de usuario
    if (account === '') {
      this.remove = true;
      this.done = true;
    } else {
      // eliminar del local storage
      let pos: number;
      pos = this.usrLocal.indexOf(account);
      this.usrLocal.splice(pos, 1)
      localStorage.removeItem('local');
      localStorage.setItem('local', JSON.stringify(this.usrLocal));
    }
    this.ngOnInit();
  }

  ngOnInit(): void {
    // Lista de usuario alojados en el localStorage
    this.usrLocal = JSON.parse(localStorage.getItem('local'));
    if (this.usrLocal === null || this.usrLocal.length === 0) {
      this.ocultar = true;
    } else {
      this.ocultar = false;
    }

    // Directorios
    this.getActionService.getDirectories().subscribe((response: any) => {
        if (response) {
          const dir = response.directories.length;
          if (dir > 0) {
            for (let i = 0; i < dir; i++) {
              const opc = {
                id: response.directories[i].ID,
                name: response.directories[i].DIRECTORY_NAME,
              };
              this.listDir[i] = opc;
            }
            // Para requerimiento de QA se habilito solo ECUBAS
            // this.usuario.directoryName = this.listDir[0].name;
          }
        } else {
          swal('Error de acceso', 'Problemas para acceder al XPortal, por favor contactarse con el Administrador :\n', 'error');
          $('#loading').css('display', 'none');
        }
      }
    );
  }

  onDone() {
    // Finalizar pantalla para elimianr cuentas de usuarios
    if (this.remove === false) {
      this.remove = true;
      this.done = false;
    } else {
      this.remove = false;
      this.done = false;
    }
  }

  onLogin() {
    // Login de Usuario
    // rb2208
    this.ecnrypt(this.usuario.userPassword);
    this.loginPassService.cosultar(this.usuario).subscribe((response: any) => {
        if (response.isAuth === true) {
          this.next = true;
          this.msj = '';
          VARGLOBAL.userToken = response.userToken;
          VARGLOBAL.sessionUUID = response.sessionUUID;
          VARGLOBAL.user = response.displayName;
          VARGLOBAL.jsessionID = response.jsessionID;
          VARGLOBAL.directory = this.usuario.directoryName;

          this.onRecordar();
          /*if (VARGLOBAL.user === 'admin') {
            this.next = false;
            this.router.navigate(['home'], { relativeTo: this.route.parent });
          } else {
            this.perfil = response.userProfiles;
          }*/
          this.perfil = response.userProfiles;
        } else {
          this.msj = response.message;
          this.usuario.userPassword = '';
          this.usuario.directoryName = '';
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  onChange() {
    /*if (this.usuario.userName === 'admin') {
      this.usuario.directoryName = 'INTERNO';
      this.directory = false;
    } else {
      this.directory = true;
      this.usuario.directoryName = '';
    }*/
  }

  ecnrypt(valor: any) {
    const key = CryptoJS.enc.Utf8.parse('3647321396536435');
    const iv = CryptoJS.enc.Utf8.parse('3647321396536435');

    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(valor), key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

    this.usuario.userPassword = encrypted.toString();
  }

  onSubmit() {
    // Si indica perfil valido ingrsa a la aplicación
    this.verSeleccion = this.opcionSeleccionado;
    if (this.verSeleccion === '0') {
      this.msj = 'Perfil Incorrecto';
    } else {
      this.msj = '';
      VARGLOBAL.perfil = this.verSeleccion;

      this.pages.serviceName = 'AUTH_PAGES_MENU';
      this.pages.userToken = VARGLOBAL.userToken;
      this.pages.sessionUUID = VARGLOBAL.sessionUUID;
      this.pages.jsessionID = VARGLOBAL.jsessionID;
      this.pages.serviceArguments[0].argument = 'profile';
      this.pages.serviceArguments[0].value = VARGLOBAL.perfil;
      this.menu.cosultar(this.pages).subscribe(
        (result: any) => {
          const l = result.routeInfo.length;
          if (l === 0) {
            swal('Advertencia', 'El Perfil ' + VARGLOBAL.perfil + ', no tiene Menú asociado.', 'error');
          } else {
            this.router.navigate(['home'], {relativeTo: this.route.parent});
          }
        },
        error => {
          console.log(<any>error);
        }
      );
    }
  }

  // On Forgot password link click
  onForgotPassword() {
    this.router.navigate(['/pages/forgotpassword'], {relativeTo: this.route.parent});
  }

  // On registration link click
  onRegister() {
    this.router.navigate(['/pages/register'], {relativeTo: this.route.parent});
  }

  onRecordar() {
    // Recordar cada usuario que ingresa a la aplicación
    if (this.usrLocal !== null) {
      let local = '';
      for (let i = 0; i < this.usrLocal.length; i++) {
        if (this.usrLocal[i] === this.usuario.userName) {
          local = 'NOK';
        }
      }
      if (local !== 'NOK') {
        this.usrLocal.push(this.usuario.userName);
        localStorage.setItem('local', JSON.stringify(this.usrLocal));
      }
    } else {
      this.usrLocal = [this.usuario.userName];
      localStorage.setItem('local', JSON.stringify(this.usrLocal));
      localStorage.setItem('filterType', '');
    }
  }

  onCancel(gest) {
    if (gest === 'perfil') {
      this.usuario.userPassword = '';
      this.next = false;
      this.clean();
    } else {
      this.usuario.userPassword = '';
      this.usuario.userName = '';
      this.ocultar = false;
      this.clean();
    }
    this.msj = '';
  }

  clean() {
    VARGLOBAL.userToken = '';
    VARGLOBAL.sessionUUID = '';
    VARGLOBAL.user = '';
    VARGLOBAL.jsessionID = '';
    VARGLOBAL.perfil = '';
  }
}
