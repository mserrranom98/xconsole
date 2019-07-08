import { Component, OnInit, ViewChild } from '@angular/core';
import {
  Usuario, GetActionTables, GetActionInsert, GetActionUpdate,
  NameStatus, GetTablesUnion, DropTablesUnion, GenPass, UpdateAvatar
} from '../../../models/desktop';
import { NgForm } from '@angular/forms';
import { GetActionService } from '../../../services/getAction.service';
import { Router, ActivatedRoute } from '@angular/router';
import { VARGLOBAL } from '../../../services/login-pass.service';
import swal from 'sweetalert2';
import { NgbPopover, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as CryptoJS from 'crypto-js';
import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  closeResult: string;
  public users: Usuario;
  public opcEnabled = '';
  public opcSelect = '';
  public list = new Array();
  public opcDirectories = '';
  public opcInstitutions = '';
  public password: string;
  public lastId: number;
  public divEnabled = false;
  public fields: string;
  public values: string;
  public arg: GetActionTables;
  public argInsert: GetActionInsert;
  public argUpdate: GetActionUpdate;
  public argUpdateAvatar: UpdateAvatar;
  public tbl: GetTablesUnion;
  public drp: DropTablesUnion;
  public genPass: GenPass;
  public msjPass: string;
  public msjPrf: string;
  public msjInst: string;
  public msjDir: string;
  dropdownList = [];
  dropdownInst = [];
  selectedItems = [];
  instItems = [];
  contPrf = 0;
  dropdownSettings = {};
  instSettings = {};
  public verSeleccion = '';
  public viewG: boolean;
  prueba: string;

  data: any;
  cropperSettings: CropperSettings;
  private fileReader: FileReader;
  private base64Encoded: string;
  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;

  @ViewChild('f') userForm: NgForm;
  @ViewChild('x') public popover: NgbPopover;

  constructor(
    private getAction: GetActionService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    public translate: TranslateService
  ) {
    this.limpiar();
    this.msjPass = '';
    this.msjPrf = '';
    this.msjInst = '';
    this.viewG = false;
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.croppedWidth = 100;
    this.cropperSettings.croppedHeight = 100;
    this.cropperSettings.canvasWidth = 150;
    this.cropperSettings.canvasHeight = 150;
    this.cropperSettings.noFileInput = true;
    this.data = {};
    this.data.image = '';
  }

  ngOnInit() {
    this.onTables();
    this.data.image = '';
    if (this.router.url === '/users/new') {
      this.divEnabled = true;
      this.viewG = false;
    } else {
      this.viewG = true;
    }

    this.dropdownSettings = {
      singleSelection: false,
      text: 'Seleccione...',
      selectAllText: 'Seleccione todos',
      unSelectAllText: 'Deseleccione todos',
      enableSearchFilter: true,
      classes: 'myclass custom-class'
    };

    this.instSettings = {
      singleSelection: false,
      text: 'Seleccione...',
      selectAllText: 'Seleccione todos',
      unSelectAllText: 'Deseleccione todos',
      enableSearchFilter: true,
      classes: 'myclass custom-class'
    };
  }

  onTables() {
    // Directories
    this.arg.serviceName = 'GET_TABLE';
    this.arg.userToken = VARGLOBAL.userToken;
    this.arg.sessionUUID = VARGLOBAL.sessionUUID;
    this.arg.jsessionID = VARGLOBAL.jsessionID
    this.arg.serviceArguments[0].argument = 'table';
    this.arg.serviceArguments[0].value = 'DIRECTORIES';
    this.getAction.tables(this.arg).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          const dir = response.directories.length;
          for (let i = 0; i < dir; i++) {
            const opc: Object = {
              id: response.directories[i].ID,
              value: response.directories[i].DIRECTORY_NAME
            }
            this.list[i] = opc;
          }
        }
      },
      error => {
        console.log(<any>error);
      }
    )

    // Profiles
    this.arg.serviceArguments[0].value = 'PROFILES';
    this.getAction.tables(this.arg).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          this.dropdownList = response.profiles;
          const dir = response.profiles.length;
          for (let i = 0; i < dir; i++) {
            const opc: Object = {
              id: response.profiles[i].ID,
              itemName: response.profiles[i].NAME
            }
            this.dropdownList[i] = opc;
          }
        }
      },
      error => {
        console.log(<any>error);
      }
    )

    // Institutions
    this.arg.serviceArguments[0].value = 'INSTITUTION';
    this.getAction.tables(this.arg).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          this.dropdownInst = response.institutions;
          const dir = response.institutions.length;
          for (let i = 0; i < dir; i++) {
            const opc: Object = {
              id: response.institutions[i].id,
              itemName: response.institutions[i].name
            }
            this.dropdownInst[i] = opc;
          }
        }
      },
      error => {
        console.log(<any>error);
      }
    )
  }

  onSubmit() {
    this.msjPass = '';
    this.onValid();
    if (this.onValid() === true) {
      if (this.router.url === '/users/new') {
        this.onSave();
        this.onNew();
        this.divEnabled = true;
      } else {
        this.onSaveUpdate();
        this.onUpdate();
      }
    }
  }

  onCancel() {
    this.divEnabled = false;
  }

  onDirectories(event: Event) {
    this.verSeleccion = event.target['options']
    [event.target['options'].selectedIndex].text;
  }

  onValid(): boolean {
    // Directories
    const dir = this.users.directories_id;
    if (dir === 0) {
      this.msjDir = 'Please enter a valid directories!';
      return false;
    }

        // Profile Required
        this.msjPrf = '';
        if (this.selectedItems.length < 1) {
          this.msjPrf = 'Please select a valid Profiles!';
          return false;
        }

        // Institutions Required
        this.msjInst = '';
        if (this.instItems.length < 1) {
          this.msjInst = 'Please select a valid Institutions!';
          return false;
        }

    return true;
  }

  onSave() {
    // tslint:disable-next-line:forin
    for (const propiedad in this.users) {
      let valor = this.users[propiedad];
      const prop = propiedad;
      if (prop === 'credential') {
        this.fields = propiedad + ',' + this.fields;
        this.values = '0' + ',' + this.values;
      }
      if (valor !== '' && prop !== 'id' && prop !== 'directories_name') {
        this.fields = propiedad + ',' + this.fields;
        this.values = this.users[propiedad] + ',' + this.values;
      }
      valor = '';
    }
    this.fields = this.fields.replace(',undefined', '');
    this.values = this.values.replace(',undefined', '');
  }

  onSaveUpdate() {
    // tslint:disable-next-line:forin
    for (const propiedad in this.users) {
      let valor = this.users[propiedad];
      const prop = propiedad;
      if (valor !== '' && prop !== 'id' && prop !== 'directories_name' && prop !== 'credential') {
        this.fields = propiedad + ',' + this.fields;
        this.values = this.users[propiedad] + ',' + this.values;
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
    this.argInsert.jsessionID = VARGLOBAL.jsessionID
    this.argInsert.serviceArguments[0].argument = 'user';
    this.argInsert.serviceArguments[0].value = VARGLOBAL.user;
    this.argInsert.serviceArguments[1].argument = 'table_name';
    this.argInsert.serviceArguments[2].argument = 'fields';
    this.argInsert.serviceArguments[3].argument = 'values';
  }

  getArgUpdate() {
    this.argUpdate.userToken = VARGLOBAL.userToken;
    this.argUpdate.sessionUUID = VARGLOBAL.sessionUUID;
    this.argUpdate.jsessionID = VARGLOBAL.jsessionID
    this.argUpdate.serviceArguments[0].argument = 'user';
    this.argUpdate.serviceArguments[0].value = VARGLOBAL.user;
    this.argUpdate.serviceArguments[1].argument = 'table_name';
    this.argUpdate.serviceArguments[1].value = 'USR$USERS';
    this.argUpdate.serviceArguments[2].argument = 'id';
    this.argUpdate.serviceArguments[3].argument = 'fields';
    this.argUpdate.serviceArguments[4].argument = 'values';
  }

  onNew() {
    // New User
    this.getArgInsert();
    this.argInsert.serviceArguments[1].value = 'USR$USERS';
    this.argInsert.serviceArguments[2].value = this.fields;
    this.argInsert.serviceArguments[3].value = this.values;
    this.getAction.doInsert(this.argInsert).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          this.onGenerate();
          this.lastId = response.lastId;
          this.argUpdateAvatar.serviceName = 'UPDATE_AVATAR';
          this.argUpdateAvatar.userToken = VARGLOBAL.userToken;
          this.argUpdateAvatar.sessionUUID = VARGLOBAL.sessionUUID;
          this.argUpdateAvatar.jsessionID = VARGLOBAL.jsessionID
          this.argUpdateAvatar.serviceArguments[0].argument = 'id';
          this.argUpdateAvatar.serviceArguments[0].value = this.lastId.toString();
          this.argUpdateAvatar.serviceArguments[1].argument = 'avatar';
          this.argUpdateAvatar.serviceArguments[1].value = this.data.image;
          this.getAction.tablesUnion(this.argUpdateAvatar).subscribe(
            resA => {
            },
            error => {
              console.log(<any>error);
            }
          )
          for (let i = 0; i < this.selectedItems.length; i++) {
            this.argInsert.serviceArguments[1].value = 'USR$USER_PROFILE';
            this.argInsert.serviceArguments[2].value = 'profile_id,user_id'
            this.argInsert.serviceArguments[3].value = this.selectedItems[i].id + ',' + this.lastId;
            this.getAction.doInsert(this.argInsert).subscribe(
              res => {
              },
              error => {
                console.log(<any>error);
              }
            )
          }
          for (let i = 0; i < this.instItems.length; i++) {
            this.argInsert.serviceArguments[1].value = 'USR$INSTITUTION_USERS';
            this.argInsert.serviceArguments[2].value = 'institution_id,user_id'
            this.argInsert.serviceArguments[3].value = this.instItems[i].id + ',' + this.lastId;
            this.getAction.doInsert(this.argInsert).subscribe(
              res => {
              },
              error => {
                console.log(<any>error);
              }
            )
          }
          swal({
            title: 'Successful!',
            type: 'success',
            confirmButtonColor: '#0CC27E',
            cancelButtonColor: '#FF586B',
            confirmButtonText: 'OK'
          }).then(function (isConfirm) {
            if (isConfirm) { }
          }).catch(swal.noop);
          this.divEnabled = false;
          this.limpiar();
        }
      },
      error => {
        console.log(<any>error);
      }
    )
  }

  onUpdate() {
    // Edit User
    this.getArgInsert();
    this.getArgUpdate();
    this.argUpdate.serviceName = 'UPDATE_DATA';
    this.argUpdate.serviceArguments[2].value = this.users.id;
    this.argUpdate.serviceArguments[3].value = this.fields;
    this.argUpdate.serviceArguments[4].value = this.values;
    this.getAction.doUpdate(this.argUpdate).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          this.argUpdateAvatar.serviceName = 'UPDATE_AVATAR';
          this.argUpdateAvatar.userToken = VARGLOBAL.userToken;
          this.argUpdateAvatar.sessionUUID = VARGLOBAL.sessionUUID;
          this.argUpdateAvatar.jsessionID = VARGLOBAL.jsessionID
          this.argUpdateAvatar.serviceArguments[0].argument = 'id';
          this.argUpdateAvatar.serviceArguments[0].value = this.users.id.toString();
          this.argUpdateAvatar.serviceArguments[1].argument = 'avatar';
          this.argUpdateAvatar.serviceArguments[1].value = this.data.image;
          this.getAction.tablesUnion(this.argUpdateAvatar).subscribe(
            resA => { },
            error => {
              console.log(<any>error);
            }
          )
          this.dropDep();
          for (let i = 0; i < this.selectedItems.length; i++) {
            this.argInsert.serviceArguments[1].value = 'USR$USER_PROFILE';
            this.argInsert.serviceArguments[2].value = 'profile_id,user_id'
            this.argInsert.serviceArguments[3].value = this.selectedItems[i].id + ',' + this.users.id;
            this.getAction.doInsert(this.argInsert).subscribe(
              res => { },
              error => {
                console.log(<any>error);
              }
            )
          }
          for (let i = 0; i < this.instItems.length; i++) {
            this.argInsert.serviceArguments[1].value = 'USR$INSTITUTION_USERS';
            this.argInsert.serviceArguments[2].value = 'institution_id,user_id'
            this.argInsert.serviceArguments[3].value = this.instItems[i].id + ',' + this.users.id;
            this.getAction.doInsert(this.argInsert).subscribe(
              res => { },
              error => {
                console.log(<any>error);
              }
            )
          }
          swal({
            title: 'Successful!',
            type: 'success',
            confirmButtonColor: '#0CC27E',
            cancelButtonColor: '#FF586B',
            confirmButtonText: 'OK'
          }).then(function (isConfirm) {
            if (isConfirm) { }
          }).catch(swal.noop);
          this.divEnabled = false;
          this.limpiar();
        } else {
          swal('Error!', 'User not updated. Verify information!', 'error');
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
    this.users = new Usuario(0, '', '', '', '', '', '', '', '', 0, '', true, '');
    this.arg = new GetActionTables('', '', '', '', [{ 'argument': '', 'value': '' }]);
    this.argInsert = new GetActionInsert('', '', '', '', [{ 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }, { 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }]);
    this.argUpdate = new GetActionUpdate('', '', '', '', [{ 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }, { 'argument': '', 'value': 0 },
    { 'argument': '', 'value': '' }, { 'argument': '', 'value': '' }]);
    this.users.created_date = '0';
    this.tbl = new GetTablesUnion('', '', '', '', [{ 'argument': '', 'value': '' }, { 'argument': '', 'value': '' }]);
    this.argUpdateAvatar = new UpdateAvatar('', '', '', '', [{ 'argument': '', 'value': '' }, { 'argument': '', 'value': '' }]);
    this.drp = new DropTablesUnion('', '', '', '', [{ 'argument': '', 'value': '' },
    { 'argument': '', 'value': '' }, { 'argument': '', 'value': '' }]);
    this.genPass = new GenPass('', '', '', '', [{ 'argument': '', 'value': '' }]);
    this.fields = '';
    this.values = '';
    this.password = '';
    this.selectedItems = [];
    this.instItems = [];
    this.data = {};
    this.data.image = '';
  }

  recibirDatos(event) {
    if (event !== null) {
      this.divEnabled = true;
      // tslint:disable-next-line:prefer-const
      let obj = JSON.parse(event);
      this.data.image = '';
      this.users.id = obj['ID'];
      this.lastId = obj['ID'];
      this.users.first_name = obj['FIRST_NAME'];
      this.users.last_name = obj['LAST_NAME'];
      this.users.display_name = obj['DISPLAY_NAME'];
      this.users.email = obj['EMAIL'];
      this.users.job_title = obj['JOB_TITLE'];
      this.users.directories_id = obj['DIRECTORIES_ID'];
      this.opcDirectories = obj['DIRECTORIES_ID'];
      this.users.directories_name = obj['DIRECTORIES_NAME'];
      this.users.enabled = obj['ENABLED'];
      this.data.image = obj['AVATAR'];
      this.DepSelect();
    } else {
      this.divEnabled = false;
    }
  }

  dropDep() {
    this.drp.serviceName = 'DELETE_DATA_UNION';
    this.drp.userToken = VARGLOBAL.userToken;
    this.drp.sessionUUID = VARGLOBAL.sessionUUID;
    this.drp.jsessionID = VARGLOBAL.jsessionID
    this.drp.serviceArguments[0].argument = 'table_name';

    // User Profile
    this.drp.serviceArguments[0].value = 'USR$USER_PROFILE'
    this.drp.serviceArguments[1].argument = 'filter';
    this.drp.serviceArguments[1].value = 'user_id';
    this.drp.serviceArguments[2].argument = 'id';
    this.drp.serviceArguments[2].value = this.users.id.toString();
    this.getAction.dropTablesUnion(this.drp).subscribe(
      response => {
      },
      error => {
        console.log(<any>error);
      }
    )

    // User Institutions
    this.drp.serviceArguments[0].value = 'USR$INSTITUTION_USERS'
    this.drp.serviceArguments[1].argument = 'filter';
    this.drp.serviceArguments[1].value = 'user_id';
    this.drp.serviceArguments[2].argument = 'id';
    this.drp.serviceArguments[2].value = this.users.id.toString();
    this.getAction.dropTablesUnion(this.drp).subscribe(
      (response:any) => {
      },
      error => {
        console.log(<any>error);
      }
    )
  }

  DepSelect() {
    this.tbl.serviceName = 'GET_TABLE_UNION';
    this.tbl.userToken = VARGLOBAL.userToken;
    this.tbl.sessionUUID = VARGLOBAL.sessionUUID;
    this.tbl.jsessionID = VARGLOBAL.jsessionID
    this.tbl.serviceArguments[0].argument = 'table';

    // Profiles Selected
    this.tbl.serviceArguments[0].value = 'USER_PROFILES';
    this.tbl.serviceArguments[1].argument = 'id';
    this.tbl.serviceArguments[1].value = this.users.id.toString();
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

    // Institution Selected
    this.tbl.serviceArguments[0].value = 'USER_INSTITUTIONS';
    this.tbl.serviceArguments[1].argument = 'id';
    this.tbl.serviceArguments[1].value = this.users.id.toString();
    this.getAction.tablesUnion(this.tbl).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          const dir = response.unions.length;
          for (let i = 0; i < dir; i++) {
            const opc: Object = {
              id: response.unions[i].idUnion,
              itemName: response.unions[i].name
            }
            this.instItems[i] = opc;
          }
        }
      },
      error => {
        console.log(<any>error);
      }
    )
  }

  onGenerate() {
    if (this.users.display_name !== '') {
      this.genPass.serviceName = 'GENERATE_PASS';
      this.genPass.userToken = VARGLOBAL.userToken;
      this.genPass.sessionUUID = VARGLOBAL.sessionUUID;
      this.genPass.jsessionID = VARGLOBAL.jsessionID
      this.genPass.serviceArguments[0].argument = 'user';
      this.genPass.serviceArguments[0].value = this.users.display_name;
      this.getAction.tables(this.genPass).subscribe(
        (response:any) => {
          if (response.messageCode === '0') {
            this.users.credential = response.userData.credential;
            this.fields = 'credential';
            this.values = this.users.credential;
            this.getArgUpdate();
            this.argUpdate.serviceName = 'UPDATE_PASS';
            this.argUpdate.serviceArguments[2].value = this.lastId;
            this.argUpdate.serviceArguments[3].value = 'credential';
            this.argUpdate.serviceArguments[4].value = this.users.credential;
            this.getAction.doUpdate(this.argUpdate).subscribe(
              (res:any) => {
                if (res.messageCode === '0') {
                  swal('Successful!', '', 'success');
                  this.limpiar();
                  this.divEnabled = false;
                } else {
                  swal('Error!', 'Password not updated. Verify information!', 'error');
                }

              },
              error => {
                console.log(<any>error);
              }
            )
            this.limpiar();
          }
        },
        error => {
          console.log(<any>error);
        }
      )
    }
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

  fileChangeListener($event) {
    this.data.image = '';
    const image: any = new Image();
    const file: File = $event.target.files[0];
    const myReader: FileReader = new FileReader();
    const that = this;
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);
    };

    myReader.readAsDataURL(file);
  }

}
