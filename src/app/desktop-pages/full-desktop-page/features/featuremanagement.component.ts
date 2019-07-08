import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { GetActionTables, NameStatus, GetActionUpdate } from '../../../models/desktop';
import { GetActionService } from '../../../services/getAction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VARGLOBAL } from '../../../services/login-pass.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-featuremanagement',
  templateUrl: './featuremanagement.component.html'
})
export class FeaturemanagementComponent implements OnInit {

  @Output() datos = new EventEmitter();

  public arg: GetActionTables;
  public nameStatus: NameStatus;
  public fields: string;
  public values: string;
  public argUpdate: GetActionUpdate;

  public data: any[];
  rows = [];
  temp = [];
  @ViewChild(DatatableComponent) tbl: DatatableComponent;
  columns = [];

  constructor(
    private getAction: GetActionService,
    private route: ActivatedRoute,
    private router: Router,
    public translate: TranslateService
  ) {
    this.arg = new GetActionTables('', '', '', '', [{ 'argument': '', 'value': '' }]);
    this.nameStatus = new NameStatus(0, '', true);
    this.argUpdate = new GetActionUpdate('', '', '', '', [{ 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' },
    { 'argument': '', 'value': 0 },
    { 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }]);
  }

  ngOnInit() {
    // Directories
    this.arg.serviceName = 'GET_TABLE';
    this.arg.userToken = VARGLOBAL.userToken;
    this.arg.sessionUUID = VARGLOBAL.sessionUUID;
    this.arg.jsessionID = VARGLOBAL.jsessionID
    this.arg.serviceArguments[0].argument = 'table';
    this.arg.serviceArguments[0].value = 'FEATURES';
    this.getAction.tables(this.arg).subscribe(
      (response:any) => {
        this.data = response.features;
        this.temp = [...this.data];
        this.rows = this.data;
      },
      error => {
        console.log(<any>error);
      }
    )
  }

  onSubmit(event) {
    this.datos.emit(JSON.stringify(this.data[event]));
  }

  onChange(data) {
    this.nameStatus.id = data['ID'];
    this.nameStatus.enabled = data['ENABLED'];

    this.onSave();
    this.argUpdate.serviceName = 'UPDATE_DATA';
    this.argUpdate.userToken = VARGLOBAL.userToken;
    this.argUpdate.sessionUUID = VARGLOBAL.sessionUUID;
    this.argUpdate.jsessionID = VARGLOBAL.jsessionID
    this.argUpdate.serviceArguments[0].argument = 'user';
    this.argUpdate.serviceArguments[0].value = VARGLOBAL.user;
    this.argUpdate.serviceArguments[1].argument = 'table_name';
    this.argUpdate.serviceArguments[1].value = 'USR$FEATURES';
    this.argUpdate.serviceArguments[2].argument = 'id';
    this.argUpdate.serviceArguments[2].value = data['ID'];
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
          this.router.navigate(['/features'], { relativeTo: this.route.parent });
        }
      },
      error => {
        console.log(<any>error);
      }
    )
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
    ;
    this.fields = this.fields.replace(',undefined', '');
    this.values = this.values.replace(',undefined', '');
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

        // filter our data
        const temp = this.temp.filter(function (d) {
            return d.NAME.toLowerCase().indexOf(val) !== -1 || !val;
        });

        // update the rows
        this.rows = temp;
        // Whenever the filter changes, always go back to the first page
        this.tbl.offset = 0;
}
}
