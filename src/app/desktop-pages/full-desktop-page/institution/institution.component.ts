import { Component, OnInit } from '@angular/core';
import { Institution, GetActionInsert, GetActionUpdate } from '../../../models/desktop';
import { GetActionService } from '../../../services/getAction.service';
import { Router, ActivatedRoute } from '@angular/router';
import { VARGLOBAL } from '../../../services/login-pass.service';
import swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-institution',
  templateUrl: './institution.component.html'
})
export class InstitutionComponent implements OnInit {
  public inst: Institution;
  public divEnabled = false;
  public opcEnabled = 'true';
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
    this.divEnabled = false;
    this.inst = new Institution(0, '', '', '', '', '', '', '', '', '', '', '', '', '', true);
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
    if (this.router.url === '/institutions/new') {
      this.divEnabled = true;
    } else {
      this.divEnabled = false;
    }
  }

  recibirDatos(event) {
    if (event !== null) {
      this.divEnabled = true;
      const obj = JSON.parse(event);
      this.inst.id = obj['id'];
      this.inst.name = obj['name'];
      this.inst.code = obj.code;
      this.inst.branch = obj.branch;
      this.inst.industry = obj.industry;
      this.inst.country = obj.country;
      this.inst.city = obj.city;
      this.inst.district = obj.district;
      this.inst.address = obj.address;
      this.inst.phone = obj.phone;
      this.inst.fax = obj.fax;
      this.inst.mail = obj.mail;
      this.inst.contact = obj.contact;
      this.inst.certificate = obj.certificate;
      this.inst.enabled = obj['enabled'];
      this.opcEnabled = obj['enabled'];
    } else {
      this.divEnabled = false;
    }
  }

  onCancel() {
    this.divEnabled = false;
  }

  onSubmit() {
    this.onSave();
    if (this.router.url === '/institutions/new') {
      this.onNew();
      this.divEnabled = true;
    } else {
      this.onUpdate();
      this.divEnabled = false;
    }
  }

  onSave() {
    // Campos y valores que se guardaran en la tabla de Usuarios
    // tslint:disable-next-line:forin
    for (const propiedad in this.inst) {
      const valor = this.inst[propiedad];
      const prop = propiedad;
      if (valor == null) {
        this.fields = this.fields;
        this.values = this.values;
      } else if (valor !== '' && prop !== 'id') {
        this.fields = propiedad + ',' + this.fields;
        this.values = this.inst[propiedad] + ',' + this.values;
      }
    }
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
    this.argInsert.serviceArguments[1].value = 'USR$INSTITUTION';
    this.argInsert.serviceArguments[2].argument = 'fields';
    this.argInsert.serviceArguments[2].value = this.fields;
    this.argInsert.serviceArguments[3].argument = 'values';
    this.argInsert.serviceArguments[3].value = this.values;
    this.getAction.doInsert(this.argInsert).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          this.lastId = response.lastId;
          this.divEnabled = false;
          this.router.navigate(['/institutions'], { relativeTo: this.route.parent });
          this.clean();
          swal('Successful!', '', 'success');
        } else {
          swal('Error!', 'Unregistered institution. Verify information!', 'error');
          // this.clean();
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
    this.argUpdate.serviceArguments[1].value = 'USR$INSTITUTION';
    this.argUpdate.serviceArguments[2].argument = 'id';
    this.argUpdate.serviceArguments[2].value = this.inst.id;
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
          this.router.navigate(['/institutions']);
        } else {
          swal('Error!', 'Institution not updated. Verify information!', 'error');
          // this.clean();
        }
      },
      error => {
        console.log(<any>error);
      }
    )
  }

  clean() {
    this.fields = '';
    this.values = '';
    this.inst = new Institution(0, '', '', '', '', '', '', '', '', '', '', '', '', '', true);
    this.argUpdate = new GetActionUpdate('', '', '', '', [{ 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }, { 'argument': '', 'value': 0 },
    { 'argument': '', 'value': '' }, { 'argument': '', 'value': '' }]);
    this.argInsert = new GetActionInsert('', '', '', '', [{ 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }]);
  }
}
