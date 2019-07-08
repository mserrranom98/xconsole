import { Component, OnInit, ViewChild } from '@angular/core';
import { Directories, GetActionTables, GetActionInsert, GetActionUpdate } from '../../../models/desktop';
import { NgForm } from '@angular/forms';
import { GetActionService } from '../../../services/getAction.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { VARGLOBAL } from '../../../services/login-pass.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-directories',
  templateUrl: './directories.component.html'
})
export class DirectoriesComponent implements OnInit {
  public dir: Directories;
  public opcEnabled = '';
  public arg: GetActionTables;
  public argInsert: GetActionInsert;
  public argUpdate: GetActionUpdate;
  public fields: string;
  public values: string;
  public lastId: number;
  public divEnabled = false;

  @ViewChild('f') userForm: NgForm;
  constructor(
    private getAction: GetActionService,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService
  ) {
    this.dir = new Directories(0, '', '', '', '', '', 0, '', '', '', '', '', '');
    this.arg = new GetActionTables('', '', '', '', [{ 'argument': '', 'value': '' }]);
    this.argInsert = new GetActionInsert('', '', '', '', [{ 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }]);
    this.argUpdate = new GetActionUpdate('', '', '', '', [{ 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' },
    { 'argument': '', 'value': 0 },
    { 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }]);
    this.opcEnabled = 'true';
    this.dir.enabled = this.opcEnabled;
  }

  ngOnInit() {
    if (this.router.url === '/directories/new') {
      this.divEnabled = true;
    } else {
      this.divEnabled = false;
    }
  }

  onSubmit() {
    this.onSave();
    if (this.router.url === '/directories/new') {
      this.onNew();
      this.divEnabled = true;
    } else {
      this.onUpdate();
      this.divEnabled = false;
    }
  }

  onCancel() {
    this.divEnabled = false;
  }

  onSave() {
    if (this.router.url === '/directories/new') {
      this.dir.created_date = '0';
    }

    // Campos y valores que se guardaran en la tabla de Usuarios
    // tslint:disable-next-line:forin
    for (const propiedad in this.dir) {
      let valor = this.dir[propiedad];
      const prop = propiedad;
      if (valor !== '' && prop !== 'id') {
        this.fields = propiedad + ',' + this.fields;
        this.values = this.dir[propiedad] + ',' + this.values;
      }
      valor = '';
    }
    this.fields = this.fields.replace(',undefined', '');
    this.values = this.values.replace(',undefined', '');
  }

  onNew() {
    // New User
    this.argInsert.serviceName = 'INSERT_DATA';
    this.argInsert.userToken = VARGLOBAL.userToken;
    this.argInsert.sessionUUID = VARGLOBAL.sessionUUID;
    this.argInsert.jsessionID = VARGLOBAL.jsessionID
    this.argInsert.serviceArguments[0].argument = 'user';
    this.argInsert.serviceArguments[0].value = VARGLOBAL.user;
    this.argInsert.serviceArguments[1].argument = 'table_name';
    this.argInsert.serviceArguments[1].value = 'USR$DIRECTORIES';
    this.argInsert.serviceArguments[2].argument = 'fields';
    this.argInsert.serviceArguments[2].value = this.fields;
    this.argInsert.serviceArguments[3].argument = 'values';
    this.argInsert.serviceArguments[3].value = this.values;
    this.getAction.doInsert(this.argInsert).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          this.lastId = response.lastId;
          this.divEnabled = false;
          this.router.navigate(['/directories']);
          this.clean();
          swal('Successful!', '', 'success');
        }
      },
      error => {
        console.log(<any>error);
      }
    )
  }

  onUpdate() {
    // Edit User
    this.argUpdate.serviceName = 'UPDATE_DATA';
    this.argUpdate.userToken = VARGLOBAL.userToken;
    this.argUpdate.sessionUUID = VARGLOBAL.sessionUUID;
    this.argUpdate.jsessionID = VARGLOBAL.jsessionID
    this.argUpdate.serviceArguments[0].argument = 'user';
    this.argUpdate.serviceArguments[0].value = VARGLOBAL.user;
    this.argUpdate.serviceArguments[1].argument = 'table_name';
    this.argUpdate.serviceArguments[1].value = 'USR$DIRECTORIES';
    this.argUpdate.serviceArguments[2].argument = 'id';
    this.argUpdate.serviceArguments[2].value = this.dir.id;
    this.argUpdate.serviceArguments[3].argument = 'fields';
    this.argUpdate.serviceArguments[3].value = this.fields;
    this.argUpdate.serviceArguments[4].argument = 'values';
    this.argUpdate.serviceArguments[4].value = this.values;
    this.getAction.doUpdate(this.argUpdate).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          this.divEnabled = false;
          this.clean();
          swal('Successful!', '', 'success');
          this.router.navigate(['/directories']);
        }
      },
      error => {
        console.log(<any>error);
      }
    )
  }

  clean() {
    this.dir = new Directories(0, '', '', '', '', '', 0, '', '', '', '', '', '');
    this.fields = '';
    this.values = '';
    this.argInsert = new GetActionInsert('', '', '', '', [{ 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }]);
    this.argUpdate = new GetActionUpdate('', '', '', '', [{ 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' },
    { 'argument': '', 'value': 0 },
    { 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }]);
  }

  recibirDatos(event) {
    if (event !== null) {
      this.divEnabled = true;
      // tslint:disable-next-line:prefer-const
      let obj = JSON.parse(event);
      this.dir.id = obj['ID'];
      this.dir.directory_name = obj['DIRECTORY_NAME'];
      this.dir.description = obj['DESCRIPTION'];
      this.dir.imp_class = obj['IMP_CLASS'];
      this.dir.directory_type = obj['DIRECTORY_TYPE'];
      this.dir.port = obj['PORT'];
      this.dir.url = obj['URL'];
      this.dir.certificate = obj['CERTIFICATE'];
      this.dir.authentication = obj['AUTHENTICATION'];
      this.dir.dnUser = obj['DNUSER'];
      this.dir.dnGroups = obj['DNGROUPS'];
      this.dir.enabled = obj['ENABLED'];
      this.opcEnabled = obj['ENABLED'];
    } else {
      this.divEnabled = false;
    }
  }
}
