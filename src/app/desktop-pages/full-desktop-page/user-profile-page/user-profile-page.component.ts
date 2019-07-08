import { Component, OnInit, ViewChild } from '@angular/core';
import { VARGLOBAL, LoginPassService } from '../../../services/login-pass.service';
import { GetActionService } from '../../../services/getAction.service';
import { Usuario, GetActionTables, GetTablesUnion, ChangePass } from '../../../models/desktop';
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.css']
})
export class UserProfilePageComponent implements OnInit {

  currentPage = 'About';
  public users: Usuario;
  public arg: GetActionTables;
  public tbl: GetTablesUnion;
  public argChange: ChangePass;
  institutionItems = [];
  profileItems = [];
  pagesItems = [];
  nombre: string;
  data: any;
  directory_type: string;
  pass: boolean;
  image: boolean;
  paramPass = [];
  msjPass = '';
  msjCPass = '';
  cPass: string;
  @ViewChild('f') forogtPasswordForm: NgForm;

  constructor(
    private getAction: GetActionService,
    private passService: LoginPassService,
  ) {
    this.arg = new GetActionTables('', '', '', '', [{ 'argument': '', 'value': '' }]);
    this.tbl = new GetTablesUnion('', '', '', '', [{ 'argument': '', 'value': '' }, { 'argument': '', 'value': '' }]);
    this.users = new Usuario(0, '', '', '', '', '', '', '', '', 0, '', true, '');
    this.argChange = new ChangePass('', '', '', '', [{ 'argument': '', 'value': '' }, { 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }]);
    this.data = {};
    this.data.image = '';
    this.pass = false;
    this.image = false;
    this.msjCPass = '';
  }

  ngOnInit() {
    // Horizontal Timeline js for user timeline
    $.getScript('./assets/js/vertical-timeline.js');
    this.onGetUser();
    // Parametros de la Clave
    this.arg.serviceName = 'GET_TABLE';
    this.arg.userToken = VARGLOBAL.userToken;
    this.arg.sessionUUID = VARGLOBAL.sessionUUID;
    this.arg.jsessionID = VARGLOBAL.jsessionID
    this.arg.serviceArguments[0].argument = 'table';
    this.arg.serviceArguments[0].value = 'PARAMETERS';
    this.getAction.tables(this.arg).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          const dir = response.paramPass.length;
          for (let i = 0; i < dir; i++) {
            const opc: Object = {
              minChain: response.paramPass[i].minChain,
              maxChain: response.paramPass[i].maxChain,
              maxNumber: response.paramPass[i].maxNumber,
              minNumber: response.paramPass[i].minNumber,
              minSpecial: response.paramPass[i].minSpecial,
              maxSpecial: response.paramPass[i].maxSpecial,
              minAplha: response.paramPass[i].minAplha,
              maxAplha: response.paramPass[i].maxAplha
            }
            this.paramPass[i] = opc;
          }
        }
      },
      error => {
        console.log(<any>error);
      }
    )
  }

  onGetUser() {
    // Información del Usuario
    this.arg.serviceName = 'GET_USER_INFO';
    this.arg.userToken = VARGLOBAL.userToken;
    this.arg.sessionUUID = VARGLOBAL.sessionUUID;
    this.arg.jsessionID = VARGLOBAL.jsessionID
    this.arg.serviceArguments[0].argument = 'user';
    this.arg.serviceArguments[0].value = VARGLOBAL.user;
    this.getAction.tables(this.arg).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          // Tomar datos necesarios para mostrar en la pantalla
          this.data.image = response.userData.avatar;
          this.users.first_name = response.userData.first_name;
          this.users.last_name = response.userData.last_name;
          this.nombre = response.userData.first_name + ' ' + response.userData.last_name;
          this.users.display_name = response.userData.display_name;
          this.users.email = response.userData.email;
          this.directory_type = response.userData.directory_type;
          this.onInfo(response.userData.id_user);
        }
      },
      error => {
        console.log(<any>error);
      }
    )
  }

  getarg() {
    this.tbl.serviceName = 'GET_TABLE_UNION';
    this.tbl.userToken = VARGLOBAL.userToken;
    this.tbl.sessionUUID = VARGLOBAL.sessionUUID;
    this.tbl.jsessionID = VARGLOBAL.jsessionID
    this.tbl.serviceArguments[0].argument = 'table';
    this.tbl.serviceArguments[1].argument = 'id';
  }

  onInfo(id: number) {
    this.getarg();

    // Instituciones
    this.tbl.serviceArguments[0].value = 'USER_INSTITUTIONS';
    this.tbl.serviceArguments[1].value = id.toString();
    this.getAction.tablesUnion(this.tbl).subscribe(
      (resInt:any) => {
        if (resInt.messageCode === '0') {
          this.institutionItems = resInt.unions;
        }
      },
      error => {
        console.log(<any>error);
      }
    )

    // Profile
    this.tbl.serviceArguments[0].value = 'USER_PROFILES';
    this.tbl.serviceArguments[1].value = id.toString();
    this.getAction.tablesUnion(this.tbl).subscribe(
      (resPrf:any) => {
        if (resPrf.messageCode === '0') {
          this.profileItems = resPrf.unions;
          // Páginas
          for (let i = 0; i < this.profileItems.length; i++) {
            this.tbl.serviceArguments[0].value = 'PROFILE_PAGES';
            this.tbl.serviceArguments[1].value = resPrf.unions[i].idUnion;
            this.getAction.tablesUnion(this.tbl).subscribe(
              (resPag:any) => {
                if (resPag.messageCode === '0') {
                  this.pagesItems = resPag.unions;
                }
              },
              error => {
                console.log(<any>error);
              }
            )
          }
        }
      },
      error => {
        console.log(<any>error);
      }
    )


  }
  showPage(page: string) {
    this.currentPage = page;
  }

  open(change: string) {
    if (change === 'pass') {
      this.image = false;
      this.pass = true;
    } else {
      this.image = true;
      this.pass = false;
    }
  }

  onChange() {
    this.msjPass = '';
    this.validPass();
    if (this.validPass() === true) {
      // Llamar al servicio UPDATE_USER_PASSWORD
      this.argChange.serviceName = 'UPDATE_USER_PASSWORD';
      this.argChange.userToken = VARGLOBAL.userToken;
      this.argChange.sessionUUID = VARGLOBAL.sessionUUID;
      this.argChange.jsessionID = VARGLOBAL.jsessionID
      this.argChange.serviceArguments[0].argument = 'user';
      this.argChange.serviceArguments[0].value = VARGLOBAL.user;
      this.argChange.serviceArguments[1].argument = 'old';
      this.argChange.serviceArguments[1].value = this.cPass;
      this.argChange.serviceArguments[2].argument = 'new';
      this.argChange.serviceArguments[2].value = this.users.credential;
      this.passService.doUpdateUserPassword(this.argChange).subscribe(
        (response:any) => {
          if (response.messageCode === '0') {
            swal('Successful!', '', 'success');
            this.pass = false;
          } else {
            swal('Error!', 'Password not updated. Verify information!', 'error');
            this.pass = true;
          }
        },
        error => {
          console.log(<any>error);
        }
      )

    }

  }

  validPass(): boolean {
    let expAplha = 0;
    let expNumeric = 0;
    let expSpecial = 0;
    const chain = this.users.credential.length;
    for (let x = 0; x < chain; x++) {
      if (this.users.credential[x].search(/[0-9]/) === 0) {
        expNumeric = expNumeric + 1;
      }
      if (this.users.credential[x].search(/[a-zA-Z]/) === 0) {
        expAplha = expAplha + 1;
      }
      if (this.users.credential[x].search(/[!#$%&^.~*_-]/) === 0) {
        expSpecial = expSpecial + 1;
      }
    }

    // Parameters Password
    // if (this.users.display_name !== 'admin') {
    if (chain < this.paramPass[0].minChain || chain > this.paramPass[0].maxChain) {
      this.msjPass = 'Please enter a valid password!';
      return false;
    } else if (expNumeric < this.paramPass[0].minNumber || expNumeric > this.paramPass[0].maxNumber) {
      this.msjPass = 'Please enter a valid password!';
      return false;
    } else if (expAplha < this.paramPass[0].minAplha || expNumeric > this.paramPass[0].maxAplha) {
      this.msjPass = 'Please enter a valid password!';
      return false;
    } else if (expSpecial < this.paramPass[0].minSpecial || expSpecial > this.paramPass[0].maxSpecial) {
      this.msjPass = 'Please enter a valid password!';
      return false;
    }
    // }

    if (this.cPass === '') {
      this.msjCPass = 'Please enter a valid password!';
      return false;
    }
    return true;
  }
  onCancel() {
    this.pass = false;
    this.image = false;
  }
}
