import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Pages, GetActionTables, GetActionInsert, GetActionUpdate, GetTablesUnion, DropTablesUnion } from '../../../models/desktop';
import { GetActionService } from '../../../services/getAction.service';
import { VARGLOBAL } from '../../../services/login-pass.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html'
})

export class PagesComponent implements OnInit {
  public pages: Pages;
  public opcEnabled = 'true';
  public opcExternal = 'false';
  public opcSection = '';
  public verSeleccion = '';
  public msjDeploy: string;
  public msjName: string;
  public list = new Array();
  public divEnabled = false;
  public fields: string;
  public values: string;
  public lastId: number;
  public arg: GetActionTables;
  public argInsert: GetActionInsert;
  public argUpdate: GetActionUpdate;
  public tbl: GetTablesUnion;
  public drp: DropTablesUnion;
  closeResult: string;
  nivel = '';
  disNivel = false;

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  @ViewChild('f') loginForm: NgForm;
  constructor(
    private getAction: GetActionService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    public translate: TranslateService
  ) {
    this.pages = new Pages(0, '', '', '', '', '', '', '', true, 0, true, '');
    this.arg = new GetActionTables('', '', '', '', [{ 'argument': '', 'value': '' }]);
    this.argInsert = new GetActionInsert('', '', '', '', [{ 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }, { 'argument': '', 'value': '' }, { 'argument': '', 'value': '' }]);
    this.argUpdate = new GetActionUpdate('', '', '', '', [{ 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }, { 'argument': '', 'value': 0 }, { 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }]);
    this.tbl = new GetTablesUnion('', '', '', '', [{ 'argument': '', 'value': '' }, { 'argument': '', 'value': '' }]);
    this.drp = new DropTablesUnion('', '', '', '', [{ 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }, { 'argument': '', 'value': '' }]);
    this.msjDeploy = '';
    this.msjName = '';
    this.divEnabled = false;
  }

  ngOnInit() {
    this.onTables();
    if (this.router.url === '/page/new') {
      this.divEnabled = true;
      this.pages.icon = 'ft-chevron-right';
    } else {
      this.divEnabled = false;
    }

    this.dropdownSettings = {
      singleSelection: false,
      text: 'Seleccione...',
      selectAllText: 'Seleccione todos',
      unSelectAllText: 'Deseleccione todos',
      enableSearchFilter: true,
      classes: 'myclass custom-class'
    };
  }

  onCancel() {
    this.divEnabled = false;
  }

  onTables() {
    // Section
    this.list = [];
    this.arg.serviceName = 'GET_TABLE';
    this.arg.userToken = VARGLOBAL.userToken;
    this.arg.sessionUUID = VARGLOBAL.sessionUUID;
    this.arg.jsessionID = VARGLOBAL.jsessionID
    this.arg.serviceArguments[0].argument = 'table';
    this.arg.serviceArguments[0].value = 'SECTIONS';
    this.getAction.tables(this.arg).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          // this.list = response.sections;
          const dir = response.sections.length;
          for (let i = 0; i < dir; i++) {
            const opc: Object = {
              id: response.sections[i].id,
              value: response.sections[i].section,
              desc: response.sections[i].descSmenu
            }
            this.list[i] = opc;
          }
        }
      },
      error => {
        console.log(<any>error);
      }
    )

    // Features
    this.arg.serviceArguments[0].value = 'FEATURES';
    this.getAction.tables(this.arg).subscribe(
      (response:any) => {
        this.dropdownList = response.features;
        // tslint:disable-next-line:no-var-keyword
        // tslint:disable-next-line:prefer-const
        const dir = response.features.length;
        for (let i = 0; i < dir; i++) {
          const opc: Object = {
            id: response.features[i].ID,
            itemName: response.features[i].NAME
          }
          this.dropdownList[i] = opc;
        }
      },
      error => {
        console.log(<any>error);
      }
    )

  }

  onSubmit() {
    this.validaciones();
    if (this.validaciones() === true) {
      this.onSave();
      if (this.router.url === '/page/new') {
        this.onNew();
        this.divEnabled = true;
      } else {
        this.onUpdate();
        this.divEnabled = false;
      }
    }

  }

  validaciones(): boolean {
    // Deploy no debe ser cero
    if (this.pages.deploy !== 0) {
      this.msjDeploy = '';
    } else {
      this.msjDeploy = 'Please enter a valid deploy!';
      return false;
    };

    // Name puede estar en blanco si es una section principal
    if ((this.pages.name === '' && this.pages.section !== '') || (this.pages.name !== '' && this.pages.section === '')) {
      this.msjName = '';
    } else if (this.pages.name === '' && this.pages.section === '') {
      this.msjName = 'Please enter a valid name!';
      return false;
    }

    // Class has-sub para indicar que es una section con sub menu
    if (this.pages.name === '' && this.pages.section !== '') {
      this.pages.clas = 'has-sub';
    }

    return true;

  }

  onSave() {
    // Campos y valores que se guardaran en la tabla de Usuarios
    // tslint:disable-next-line:forin
    for (const propiedad in this.pages) {
      let valor = this.pages[propiedad];
      const prop = propiedad;
      if (prop !== 'id') {
        this.fields = propiedad + ',' + this.fields;
        this.values = this.pages[propiedad] + ',' + this.values;
      }
      valor = '';
    }
    ;
    this.fields = this.fields.replace(',undefined', '');
    this.values = this.values.replace(',undefined', '');
  }

  getArgInsert() {
    this.argInsert.serviceName = 'INSERT_DATA';
    this.argInsert.userToken = VARGLOBAL.userToken;
    this.argInsert.sessionUUID = VARGLOBAL.sessionUUID;
    this.argInsert.jsessionID = VARGLOBAL.jsessionID
    this.argInsert.serviceArguments[0].argument = 'user';
    this.argInsert.serviceArguments[0].value = VARGLOBAL.user;
    this.argInsert.serviceArguments[1].argument = 'table_name';
  }

  onNew() {
    // New Page
    this.getArgInsert();
    this.argInsert.serviceArguments[1].value = 'USR$PAGES';
    this.argInsert.serviceArguments[2].argument = 'fields';
    this.argInsert.serviceArguments[2].value = this.fields;
    this.argInsert.serviceArguments[3].argument = 'values';
    this.argInsert.serviceArguments[3].value = this.values;
    this.getAction.doInsert(this.argInsert).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          this.lastId = response.lastId;
          if (this.selectedItems.length > 0) {
            for (let i = 0; i < this.selectedItems.length; i++) {
              this.argInsert.serviceArguments[1].value = 'USR$PAGES_FEATURE';
              this.argInsert.serviceArguments[2].value = 'feature_id,pages_id,enabled'
              this.argInsert.serviceArguments[3].value = this.selectedItems[i].id + ',' + this.lastId + ',' + 'true';
              this.getAction.doInsert(this.argInsert).subscribe(
                res => { },
                error => {
                  console.log(<any>error);
                }
              )
            }
          }
          this.divEnabled = false;
          this.router.navigate(['/page']);
          this.limpiar();
          swal('Successful!', '', 'success');
        } else {
          swal('Error!', 'Unregistered Page. Verify information!', 'error');
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
    this.argUpdate.serviceArguments[1].value = 'USR$PAGES';
    this.argUpdate.serviceArguments[2].argument = 'id';
    this.argUpdate.serviceArguments[2].value = this.pages.id;
    this.argUpdate.serviceArguments[3].argument = 'fields';
    this.argUpdate.serviceArguments[3].value = this.fields;
    this.argUpdate.serviceArguments[4].argument = 'values';
    this.argUpdate.serviceArguments[4].value = this.values;
    this.getAction.doUpdate(this.argUpdate).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          // Actualización de Pages/Features
          this.dropFeatures();
          for (let i = 0; i < this.selectedItems.length; i++) {
            this.getArgInsert();
            this.argInsert.serviceArguments[1].value = 'USR$PAGES_FEATURE';
            this.argInsert.serviceArguments[2].argument = 'fields';
            this.argInsert.serviceArguments[2].value = 'pages_id,feature_id,enabled'
            this.argInsert.serviceArguments[3].argument = 'values';
            this.argInsert.serviceArguments[3].value = this.pages.id + ',' + this.selectedItems[i].id + ',' + 'true';
            this.getAction.doInsert(this.argInsert).subscribe(
              res => { },
              error => {
                console.log(<any>error);
              }
            )
          }

          this.divEnabled = false;
          this.limpiar();
          swal('Successful!', '', 'success');
          this.router.navigate(['/page'], { relativeTo: this.route.parent });
        } else {
          swal('Error!', 'Page not updated. Verify information!', 'error');
          this.argInsert = new GetActionInsert('', '', '', '', [{ 'argument': '', 'value': '' },
          { 'argument': '', 'value': '' },
          { 'argument': '', 'value': '' },
          { 'argument': '', 'value': '' }]);
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

  limpiar() {
    this.pages = new Pages(0, '', '', '', '', '', '', '', true, 0, true, '');
    this.fields = '';
    this.values = '';
    this.onTables();
    this.selectedItems = [];
  }

  recibirDatos(event) {
    if (event !== null) {
      this.divEnabled = true;
      // tslint:disable-next-line:prefer-const
      let obj = JSON.parse(event);
      this.pages.id = obj['PAGE_ID'];
      this.pages.section = obj['SECTION'];
      this.opcSection = obj['SECTION'];
      this.pages.name = obj['PAGE_NAME'];
      this.pages.description = obj['PAGE_DESCRIPTION'];
      this.pages.icon = obj['PAGE_ICON'];
      this.pages.clas = obj['CSSCLASS'];
      this.pages.badge = obj['BADGE'];
      this.pages.badgeclass = obj['BADGECLASS'];
      this.pages.externalLink = obj['EXTERNALLINK'];
      this.pages.deploy = obj['PAGE_DEPLOY'];
      this.pages.enabled = obj['ENABLED'];
      this.pages.submenu = obj['SUBMENU'];
      this.FeaturesSelect();
    } else {
      this.divEnabled = false;
    }
  }

  FeaturesSelect() {
    // Features Selected
    this.tbl.serviceName = 'GET_TABLE_UNION';
    this.tbl.userToken = VARGLOBAL.userToken;
    this.tbl.sessionUUID = VARGLOBAL.sessionUUID;
    this.tbl.jsessionID = VARGLOBAL.jsessionID
    this.tbl.serviceArguments[0].argument = 'table';
    this.tbl.serviceArguments[0].value = 'PAGES_FEATURE';
    this.tbl.serviceArguments[1].argument = 'id';
    this.tbl.serviceArguments[1].value = this.pages.id.toString();
    this.getAction.tablesUnion(this.tbl).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          const dir = response.unions.length;
          for (let i = 0; i < dir; i++) {
            const opc: Object = {
              id: response.unions[i].idUnion,
              itemName: response.unions[i].name
            }
            this.selectedItems[i] = opc;
          }
        }
      },
      error => {
        console.log(<any>error);
      }
    )
  }

  dropFeatures() {
    this.drp.serviceName = 'DELETE_DATA_UNION';
    this.drp.userToken = VARGLOBAL.userToken;
    this.drp.sessionUUID = VARGLOBAL.sessionUUID;
    this.drp.jsessionID = VARGLOBAL.jsessionID
    this.drp.serviceArguments[0].argument = 'table_name';
    this.drp.serviceArguments[0].value = 'USR$PAGES_FEATURE'
    this.drp.serviceArguments[1].argument = 'filter';
    this.drp.serviceArguments[1].value = 'pages_id';
    this.drp.serviceArguments[2].argument = 'id';
    this.drp.serviceArguments[2].value = this.pages.id.toString();
    this.getAction.dropTablesUnion(this.drp).subscribe(
      response => { },
      error => {
        console.log(<any>error);
      }
    )
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // This function is used in open
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  selIcon(icon) {
    this.pages.icon = icon;
  }

  onChange() {
    if (this.nivel === 'I') {
      this.disNivel = true;
      this.opcSection = '';
      this.pages.section = '';
    } else {
      this.disNivel = false;
      this.pages.clas = 'has-sub';
    }
  }
}
