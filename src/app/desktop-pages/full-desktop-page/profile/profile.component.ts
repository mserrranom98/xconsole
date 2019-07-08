import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import {
  Profiles, GetActionTables, GetActionInsert, GetActionUpdate, GetTablesUnion, DropTablesUnion,
  GetMenuPages,
  IUPrfpages
} from '../../../models/desktop';
import { GetActionService } from '../../../services/getAction.service';
import { VARGLOBAL } from '../../../services/login-pass.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})

export class ProfileComponent implements OnInit {
  @ViewChild(DatatableComponent) tblList: DatatableComponent;
  @ViewChild(DatatableComponent) tblListI: DatatableComponent;
  @ViewChild('myTable') tblg: any;
  public profile: Profiles;
  public opcEnabled = 'true';
  public divEnabled = false;
  public fields: string;
  public values: string;
  public lastId: number;
  public arg: GetActionTables;
  public menu: GetMenuPages;
  public iuPrfPag: IUPrfpages;
  public argInsert: GetActionInsert;
  public argUpdate: GetActionUpdate;
  public tbl: GetTablesUnion;
  public drp: DropTablesUnion;
  data = [];
  rows = [];
  // opc = new Object();
  selectPrf = new Object();
  idPrf = '';
  selectedItems = [];

  constructor(
    private getAction: GetActionService,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService
  ) {
    this.profile = new Profiles(0, '', '', true);
    this.arg = new GetActionTables('', '', '', '', [{ 'argument': '', 'value': '' }]);
    this.menu = new GetMenuPages('', '', '', '', [{ 'argument': '', 'value': '' }]);
    this.profile.created_date = '0';
    this.argInsert = new GetActionInsert('', '', '', '', [{ 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }]);
    this.argUpdate = new GetActionUpdate('', '', '', '', [{ 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' },
    { 'argument': '', 'value': 0 },
    { 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }]);
    this.tbl = new GetTablesUnion('', '', '', '', [{ 'argument': '', 'value': '' }, { 'argument': '', 'value': '' }]);
    this.drp = new DropTablesUnion('', '', '', '', [{ 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }, { 'argument': '', 'value': '' }]);
    this.iuPrfPag = new IUPrfpages('', '', '', '', [{ 'argument': '', 'value': '' }, { 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }, { 'argument': '', 'value': '' }, { 'argument': '', 'value': '' }]);
  }

  ngOnInit() {

    if (this.router.url === '/profiles/new') {
      this.divEnabled = true;
      this.idPrf = '';
      this.onTables();
    } else {
      this.divEnabled = false;
    }

  }

  onTables() {
    this.menu.serviceName = 'MENU';
    this.menu.userToken = VARGLOBAL.userToken;
    this.menu.sessionUUID = VARGLOBAL.sessionUUID;
    this.menu.jsessionID = VARGLOBAL.jsessionID;
    this.menu.serviceArguments[0].argument = 'profile';
    this.menu.serviceArguments[0].value = this.profile.id.toString();
    this.getAction.menuPages(this.menu).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          this.data = response.pages;
          this.rows = this.data;
        }
      },
      error => {
        console.log(<any>error);
      }
    );

  }

  onChange(event, row) {
    const s = this.selectedItems.length;
    if (s > 0) {
      for (let i = 0; i < s; i++) {
        if (this.selectedItems[i].pag === row['idPagina']) {
          this.selectedItems.splice(i, 1);
        }
      }
    }
    if (row['submenu'] === undefined) { row['submenu'] = ''; }
    this.selectPrf = {
      pag: row['idPagina'],
      sec: row['section'],
      sub: row['submenu'],
      sts: event
    };
    this.selectedItems.push(this.selectPrf);
  }

  savePerPag(idPrf) {

    this.iuPrfPag.serviceName = 'INSERT_PRF_PAG';
    this.iuPrfPag.userToken = VARGLOBAL.userToken;
    this.iuPrfPag.sessionUUID = VARGLOBAL.sessionUUID;
    this.iuPrfPag.jsessionID = VARGLOBAL.jsessionID;
    this.iuPrfPag.serviceArguments[0].argument = 'profile';
    this.iuPrfPag.serviceArguments[0].value = idPrf;
    this.iuPrfPag.serviceArguments[1].argument = 'page';
    this.iuPrfPag.serviceArguments[2].argument = 'section';
    this.iuPrfPag.serviceArguments[3].argument = 'submenu';
    this.iuPrfPag.serviceArguments[4].argument = 'enabled';

    const s = this.selectedItems.length;
    if (s > 0) {
      for (let i = 0; i < s; i++) {
        this.iuPrfPag.serviceArguments[1].value = this.selectedItems[i].pag;
        this.iuPrfPag.serviceArguments[2].value = this.selectedItems[i].sec;
        this.iuPrfPag.serviceArguments[3].value = this.selectedItems[i].sub;
        this.iuPrfPag.serviceArguments[4].value = this.selectedItems[i].sts;
        this.getAction.actPrfPag(this.iuPrfPag).subscribe(
          (response:any) => {
            if (response.messageCode !== '0') {
              swal('Error!', 'No se actualizó el registro. Verifique Información!', 'error');
            } else {
              this.iuPrfPag = new IUPrfpages('', '', '', '', [{ 'argument': '', 'value': '' }, { 'argument': '', 'value': '' },
              { 'argument': '', 'value': '' }, { 'argument': '', 'value': '' }, { 'argument': '', 'value': '' }]);
            }
          },
          error => {
            console.log(<any>error);
          }
        );
      }
    }
  }

  onSubmit() {
    this.onSave();
    if (this.router.url === '/profiles/new') {
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
    for (const propiedad in this.profile) {
      let valor = this.profile[propiedad];
      const prop = propiedad;
      if (valor !== '' && prop !== 'id') {
        this.fields = propiedad + ',' + this.fields;
        this.values = this.profile[propiedad] + ',' + this.values;
      }
      valor = '';
    }
    
    this.fields = this.fields.replace(',undefined', '');
    this.values = this.values.replace(',undefined', '');
  }

  getArgInsert() {
    this.argInsert.serviceName = 'INSERT_DATA';
    this.argInsert.userToken = VARGLOBAL.userToken;
    this.argInsert.sessionUUID = VARGLOBAL.sessionUUID;
    this.argInsert.jsessionID = VARGLOBAL.jsessionID;
    this.argInsert.serviceArguments[0].argument = 'user';
    this.argInsert.serviceArguments[0].value = VARGLOBAL.user;
    this.argInsert.serviceArguments[1].argument = 'table_name';
    this.argInsert.serviceArguments[2].argument = 'fields';
    this.argInsert.serviceArguments[3].argument = 'values';
  }

  onNew() {
    // New features
    this.getArgInsert();
    this.argInsert.serviceArguments[1].value = 'USR$PROFILE';
    this.argInsert.serviceArguments[2].value = this.fields;
    this.argInsert.serviceArguments[3].value = this.values;
    this.getAction.doInsert(this.argInsert).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          this.lastId = response.lastId;
          this.savePerPag(this.lastId);
          /*for (let i = 0; i < this.selectedItems.length; i++) {
            this.argInsert.serviceArguments[1].value = 'USR$PROFILE_PAGES';
            this.argInsert.serviceArguments[2].value = 'profile_id,page_id,enabled'
            this.argInsert.serviceArguments[3].value = this.lastId + ',' + this.selectedItems[i].id + ',' + 'true';
            this.getAction.doInsert(this.argInsert).subscribe(
              res => { },
              error => {
                console.log(<any>error);
              }
            )
          }*/
          this.divEnabled = false;
          this.router.navigate(['/profiles']);
          this.limpiar();
          swal('Successful!', '', 'success');
        } else {
          swal('Error!', 'Unregistered profile. Verify information!', 'error');
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
    );
  }

  limpiar() {
    this.profile = new Profiles(0, '', '', true);
    this.fields = '';
    this.values = '';
    this.selectedItems = [];
    this.argInsert = new GetActionInsert('', '', '', '', [{ 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }]);
    this.argUpdate = new GetActionUpdate('', '', '', '', [{ 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }, { 'argument': '', 'value': 0 },
    { 'argument': '', 'value': '' }, { 'argument': '', 'value': '' }]);
  }

  recibirDatos(event) {
    if (event !== null) {
      this.divEnabled = true;
      // tslint:disable-next-line:prefer-const
      let obj = JSON.parse(event);
      this.profile.id = obj['ID'];
      this.idPrf = this.profile.id.toString();
      this.profile.name = obj['NAME'];
      this.profile.enabled = obj['ENABLED'];
      // this.ProfilesSelect();
      this.onTables();
    } else {
      this.divEnabled = false;
    }
  }

  onUpdate() {
    // Edit User
    this.argUpdate.serviceName = 'UPDATE_DATA';
    this.argUpdate.userToken = VARGLOBAL.userToken;
    this.argUpdate.sessionUUID = VARGLOBAL.sessionUUID;
    this.argUpdate.jsessionID = VARGLOBAL.jsessionID;
    this.argUpdate.serviceArguments[0].argument = 'user';
    this.argUpdate.serviceArguments[0].value = VARGLOBAL.user;
    this.argUpdate.serviceArguments[1].argument = 'table_name';
    this.argUpdate.serviceArguments[1].value = 'USR$PROFILE';
    this.argUpdate.serviceArguments[2].argument = 'id';
    this.argUpdate.serviceArguments[2].value = this.profile.id;
    this.argUpdate.serviceArguments[3].argument = 'fields';
    this.argUpdate.serviceArguments[3].value = this.fields;
    this.argUpdate.serviceArguments[4].argument = 'values';
    this.argUpdate.serviceArguments[4].value = this.values;
    this.getAction.doUpdate(this.argUpdate).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          this.savePerPag(this.profile.id);
          this.divEnabled = false;
          this.router.navigate(['/profiles']);
          this.limpiar();
          swal('Successful!', '', 'success');
        } else {
          swal('Error!', 'Profile not updated. Verify information!', 'error');
          this.limpiar();
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  ProfilesSelect() {
    // Features Selected
    this.tbl.serviceName = 'GET_TABLE_UNION';
    this.tbl.userToken = VARGLOBAL.userToken;
    this.tbl.sessionUUID = VARGLOBAL.sessionUUID;
    this.tbl.jsessionID = VARGLOBAL.jsessionID;
    this.tbl.serviceArguments[0].argument = 'table';
    this.tbl.serviceArguments[0].value = 'PROFILE_PAGES';
    this.tbl.serviceArguments[1].argument = 'id';
    this.tbl.serviceArguments[1].value = this.profile.id.toString();
    this.getAction.tablesUnion(this.tbl).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          const dir = response.unions.length;
          for (let i = 0; i < dir; i++) {
            const opc: Object = {
              id: response.unions[i].idUnion,
              itemName: response.unions[i].name
            };
            this.selectedItems[i] = opc;
          }
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

}
