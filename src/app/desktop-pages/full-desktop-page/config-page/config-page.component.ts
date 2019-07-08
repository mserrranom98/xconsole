import { Component, OnInit, ViewChild } from '@angular/core';
import { GetActionTables, GetActionFeatures, GetActionInsert, NameStatus, GetActionUpdate, GetFeatures } from '../../../models/desktop';
import { NgForm } from '@angular/forms';
import { GetActionService } from '../../../services/getAction.service';
import { Router, ActivatedRoute } from '@angular/router';
import { VARGLOBAL } from '../../../services/login-pass.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-config-page',
  templateUrl: './config-page.component.html'
})
export class ConfigPageComponent implements OnInit {
  public arg: GetActionTables;
  public getActFeatures: GetActionFeatures;
  public getFeatures: GetFeatures;
  public nameStatus: NameStatus;
  public argUpdate: GetActionUpdate;
  public listPage = new Array();
  public opcPage = '';
  public listProfiles = new Array();
  public opcProfiles = '';
  public listFeatures = new Array();
  public opcFeatures = '';
  public data: any[];
  public argInsert: GetActionInsert;
  public fields: string;
  public values: string;

  @ViewChild('f') userForm: NgForm;
  constructor(
    private getAction: GetActionService,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService
  ) {
    this.arg = new GetActionTables('', '', '', '', [{ 'argument': '', 'value': '' }]);
    this.getActFeatures = new GetActionFeatures('', '', '', '', [{ 'argument': '', 'value': '' }, { 'argument': '', 'value': '' }]);
    this.getFeatures = new GetFeatures('', '', '', '', [{ 'argument': '', 'value': '' }]);
    this.argInsert = new GetActionInsert('', '', '', '', [{ 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }]);
    this.nameStatus = new NameStatus(0, '', true);
    this.argUpdate = new GetActionUpdate('', '', '', '', [{ 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' },
    { 'argument': '', 'value': 0 },
    { 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }]);

  }

  ngOnInit() {
    this.onTables();
  }

  onTables() {
    // Profiles
    this.arg.serviceName = 'GET_TABLE';
    this.arg.userToken = VARGLOBAL.userToken;
    this.arg.sessionUUID = VARGLOBAL.sessionUUID;
    this.arg.jsessionID = VARGLOBAL.jsessionID;
    this.arg.serviceArguments[0].argument = 'table';
    this.arg.serviceArguments[0].value = 'PROFILES';
    this.getAction.tables(this.arg).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          const dir = response.profiles.length;
          for (let i = 0; i < dir; i++) {
            const opc: Object = {
              id: response.profiles[i].ID,
              value: response.profiles[i].NAME
            };
            this.listProfiles[i] = opc;
          }
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  onPages() {
    // Pages
    this.data = [];
    this.listFeatures = [];
    this.arg.serviceName = 'AUTH_PAGES_MENU';
    this.arg.userToken = VARGLOBAL.userToken;
    this.arg.sessionUUID = VARGLOBAL.sessionUUID;
    this.arg.jsessionID = VARGLOBAL.jsessionID;
    this.arg.serviceArguments[0].argument = 'profile';
    this.arg.serviceArguments[0].value = this.opcProfiles;
    this.getAction.tables(this.arg).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          const dir = response.routeInfo.length;
          for (let i = 0; i < dir; i++) {
            const opc: Object = {
              id: response.routeInfo[i].id,
              value: response.routeInfo[i].title
            };
            this.listPage[i] = opc;
          }
        }

      },
      error => {
        console.log(<any>error);
      }
    );
  }

  onFeatures() {
    this.data = [];
    this.listFeatures = [];
    this.getFeatures.serviceName = 'AUTH_FEATURES';
    this.getFeatures.userToken = VARGLOBAL.userToken;
    this.getFeatures.sessionUUID = VARGLOBAL.sessionUUID;
    this.getFeatures.jsessionID = VARGLOBAL.jsessionID;
    this.getFeatures.serviceArguments[0].argument = 'page';
    this.getFeatures.serviceArguments[0].value = this.opcPage;
    this.getAction.list(this.getFeatures).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          const dir = response.features.length;
          if (dir > 0) {
            for (let i = 0; i < dir; i++) {
              const opc: Object = {
                id: response.features[i].id,
                value: response.features[i].name
              };
              this.listFeatures[i] = opc;
            }
          } else {
            this.listFeatures = [];
          }
        }
      },
      error => {
        console.log(<any>error);
      }
    );
    this.onProfilePages();
  }

  onProfilePages() {
    this.getActFeatures.serviceName = 'AUTH_PRO_PAG_FEA';
    this.getActFeatures.userToken = VARGLOBAL.userToken;
    this.getActFeatures.sessionUUID = VARGLOBAL.sessionUUID;
    this.getActFeatures.jsessionID = VARGLOBAL.jsessionID;
    this.getActFeatures.serviceArguments[0].argument = 'page';
    this.getActFeatures.serviceArguments[0].value = this.opcPage;
    this.getActFeatures.serviceArguments[1].argument = 'profile';
    this.getActFeatures.serviceArguments[1].value = this.opcProfiles;
    this.getAction.listFeatures(this.getActFeatures).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          if (response.features.length > 0) {
            this.data = response.features;
          } else {
            this.data = [];
          }
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  onSubmit() {
    this.values = this.opcProfiles + ',' + this.opcPage + ',' + this.opcFeatures + ',' + 'true';
    this.argInsert.serviceName = 'INSERT_DATA';
    this.argInsert.userToken = VARGLOBAL.userToken;
    this.argInsert.sessionUUID = VARGLOBAL.sessionUUID;
    this.argInsert.jsessionID = VARGLOBAL.jsessionID;
    this.argInsert.serviceArguments[0].argument = 'user';
    this.argInsert.serviceArguments[0].value = VARGLOBAL.user;
    this.argInsert.serviceArguments[1].argument = 'table_name';
    this.argInsert.serviceArguments[1].value = 'USR$PROFILE_PAGE_FEATURE';
    this.argInsert.serviceArguments[2].argument = 'fields';
    this.argInsert.serviceArguments[2].value = 'profile_id,pages_id,feature_id,enabled';
    this.argInsert.serviceArguments[3].argument = 'values';
    this.argInsert.serviceArguments[3].value = this.values;
    this.getAction.doInsert(this.argInsert).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          this.onProfilePages();
          this.onFeatures();
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  onChange(data) {
    this.nameStatus.id = data['id'];
    this.nameStatus.enabled = data['enabled'];

    this.onSave();
    this.argUpdate.serviceName = 'UPDATE_DATA';
    this.argUpdate.userToken = VARGLOBAL.userToken;
    this.argUpdate.sessionUUID = VARGLOBAL.sessionUUID;
    this.argUpdate.jsessionID = VARGLOBAL.jsessionID;
    this.argUpdate.serviceArguments[0].argument = 'user';
    this.argUpdate.serviceArguments[0].value = VARGLOBAL.user;
    this.argUpdate.serviceArguments[1].argument = 'table_name';
    this.argUpdate.serviceArguments[1].value = 'USR$PROFILE_PAGE_FEATURE';
    this.argUpdate.serviceArguments[2].argument = 'id';
    this.argUpdate.serviceArguments[2].value = data['id'];
    this.argUpdate.serviceArguments[3].argument = 'fields';
    this.argUpdate.serviceArguments[3].value = this.fields;
    this.argUpdate.serviceArguments[4].argument = 'values';
    this.argUpdate.serviceArguments[4].value = this.values;
    this.getAction.doUpdate(this.argUpdate).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          this.ngOnInit();
          this.fields = '';
          this.values = '';
          this.router.navigate(['/config'], { relativeTo: this.route.parent });
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  onSave() {
    // Campos y valores que se guardaran en la tabla de Usuarios
    // tslint:disable-next-line:forin
    for (const propiedad in this.nameStatus) {
      let valor = this.nameStatus[propiedad];
      const prop = propiedad;
      if (valor !== '' && prop !== 'id' && prop === 'enabled') {
        if (valor === 'true') {
          this.nameStatus[propiedad] = false;
        } else {
          this.nameStatus[propiedad] = true;
        }
        this.fields = propiedad + ',' + this.fields;
        this.values = this.nameStatus[propiedad] + ',' + this.values;
      }
      valor = '';
    }
    
    this.fields = this.fields.replace(',undefined', '');
    this.values = this.values.replace(',undefined', '');
  }
}
