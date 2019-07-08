import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetActionService } from '../../../services/getAction.service';
import swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { NameStatus, GetActionInsert, GetActionUpdate } from '../../../models/desktop';
import { VARGLOBAL } from '../../../services/login-pass.service';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html'
})
export class FeaturesComponent implements OnInit {
  public nameStatus: NameStatus;
  public opcEnabled = 'true';
  public divEnabled = false;
  public argInsert: GetActionInsert;
  public argUpdate: GetActionUpdate;
  public fields: string;
  public values: string;
  public lastId: number;

  constructor(
    private getAction: GetActionService,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService
  ) {
    this.nameStatus = new NameStatus(0, '', true);
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

  ngOnInit() {
    if (this.router.url === '/features/new') {
      this.divEnabled = true;
    } else {
      this.divEnabled = false;
    }
  }

  onSubmit() {
    this.onSave();
    if (this.router.url === '/features/new') {
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
    // Campos y valores que se guardaran en la tabla de Usuarios
    // tslint:disable-next-line:forin
    for (const propiedad in this.nameStatus) {
      let valor = this.nameStatus[propiedad];
      const prop = propiedad;
      if (valor !== '' && prop !== 'id') {
        this.fields = propiedad + ',' + this.fields;
        this.values = this.nameStatus[propiedad] + ',' + this.values;
      }
      valor = '';
    }
    ;
    this.fields = this.fields.replace(',undefined', '');
    this.values = this.values.replace(',undefined', '');
  }

  onNew() {
    // New features
    this.argInsert.serviceName = 'INSERT_DATA';
    this.argInsert.userToken = VARGLOBAL.userToken;
    this.argInsert.sessionUUID = VARGLOBAL.sessionUUID;
    this.argInsert.jsessionID = VARGLOBAL.jsessionID
    this.argInsert.serviceArguments[0].argument = 'user';
    this.argInsert.serviceArguments[0].value = VARGLOBAL.user
    this.argInsert.serviceArguments[1].argument = 'table_name';
    this.argInsert.serviceArguments[1].value = 'USR$FEATURES';
    this.argInsert.serviceArguments[2].argument = 'fields';
    this.argInsert.serviceArguments[2].value = this.fields;
    this.argInsert.serviceArguments[3].argument = 'values';
    this.argInsert.serviceArguments[3].value = this.values;
    this.getAction.doInsert(this.argInsert).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          this.lastId = response.lastId;
          this.divEnabled = false;
          this.router.navigate(['/features'], { relativeTo: this.route.parent });
          this.nameStatus = new NameStatus(0, '', true);
          this.clean();
          swal('Successful!', '', 'success');
        } else {
          swal('Error!', 'Unregistered features. Verify information!', 'error');
          this.argInsert = new GetActionInsert('', '', '', '', [{ 'argument': '', 'value': '' },
          { 'argument': '', 'value': '' },
          { 'argument': '', 'value': '' },
          { 'argument': '', 'value': '' }]);
          this.fields = '';
          this.values = '';
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
    this.argUpdate.serviceArguments[1].value = 'USR$FEATURES';
    this.argUpdate.serviceArguments[2].argument = 'id';
    this.argUpdate.serviceArguments[2].value = this.nameStatus.id;
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
          this.router.navigate(['/features']);
        } else {
          swal('Error!', 'Features not updated. Verify information!', 'error');
          this.argUpdate = new GetActionUpdate('', '', '', '', [{ 'argument': '', 'value': '' },
          { 'argument': '', 'value': '' }, { 'argument': '', 'value': 0 },
          { 'argument': '', 'value': '' }, { 'argument': '', 'value': '' }]);
          this.fields = '';
          this.values = '';
        }
      },
      error => {
        console.log(<any>error);
      }
    )
  }

  clean() {
    this.nameStatus = new NameStatus(0, '', true);
    this.fields = '';
    this.values = '';
  }

  recibirDatos(event) {
    if (event !== null) {
      this.divEnabled = true;
      // tslint:disable-next-line:prefer-const
      let obj = JSON.parse(event);
      this.nameStatus.id = obj['ID'];
      this.nameStatus.name = obj['NAME'];
      this.nameStatus.enabled = obj['ENABLED'];
      this.opcEnabled = obj['ENABLED'];
    } else {
      this.divEnabled = false;
    }
  }
}
