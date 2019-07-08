import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VARGLOBAL } from '../../../services/login-pass.service';
import { GetActionService } from '../../../services/getAction.service';
import swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { NameStatus, GetActionInsert, GetActionUpdate, GetActionTables, Section, GetActionSection } from '../../../models/desktop';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html'
})
export class SectionsComponent implements OnInit {
  // public valueSection: NameStatus;
  public valueSection: Section;
  public opcEnabled = 'true';
  divEnabled = false;

  public arg: GetActionTables;
  public postSec: GetActionSection;
  nivel = '';
  deploy = 1;
  submenu = '';
  public list = new Array();
  disubmenu = false;
  icon = 'ft-chevron-right';
  closeResult = '';
  existe = false;
  opc = new Object();
  listI = [];
  disNivel = false;
  msj = '';
  constructor(
    private getAction: GetActionService,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private modalService: NgbModal,
  ) {
    this.valueSection = new Section('', '', '', '', '');
    this.arg = new GetActionTables('', '', '', '', [{ 'argument': '', 'value': '' }]);
    this.postSec = new GetActionSection('', '', '', '', [
      { 'argument': '', 'value': '' }, { 'argument': '', 'value': '' },
      { 'argument': '', 'value': '' }, { 'argument': '', 'value': '' },
      { 'argument': '', 'value': '' }, { 'argument': '', 'value': '' },
      { 'argument': '', 'value': '' }, { 'argument': '', 'value': '' }]);
  }

  ngOnInit() {
    if (this.router.url === '/sections/new') {
      this.divEnabled = true;
      this.disNivel = false;
    } else {
      this.divEnabled = false;
      this.disNivel = true;
    }

    this.arg.serviceName = 'GET_TABLE';
    this.arg.userToken = VARGLOBAL.userToken;
    this.arg.sessionUUID = VARGLOBAL.sessionUUID;
    this.arg.jsessionID = VARGLOBAL.jsessionID
    this.arg.serviceArguments[0].argument = 'table';
    this.arg.serviceArguments[0].value = 'SECTIONS';
    this.opc = {};
    this.getAction.tables(this.arg).subscribe(
      (response:any) => {
        if (response.messageCode === '0') {
          const dir = response.sections.length;
          for (let i = 0; i < dir; i++) {
            if (response.sections[i].nivel === 'I') {
              this.listI[i] = response.sections[i];
            }
          }
          this.listI = this.listI.filter(function (n) { return n !== null });

          for (let j = 0; j < this.listI.length; j++) {
            this.opc = {
              id: this.listI[j].id,
              value: this.listI[j].section
            }
            this.list[j] = this.opc;
          }
        }
      },
      error => {
        console.log(<any>error);
      }
    )
  }

  onSubmit() {
    // this.onSave();
    if (this.router.url === '/sections/new') {
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

  parametros() {
    this.postSec.serviceName = 'POST_SECTIONS';
    this.postSec.userToken = VARGLOBAL.userToken;
    this.postSec.sessionUUID = VARGLOBAL.sessionUUID;
    this.postSec.jsessionID = VARGLOBAL.jsessionID
    this.postSec.serviceArguments[0].argument = 'id';
    this.postSec.serviceArguments[1].argument = 'name';
    this.postSec.serviceArguments[1].value = this.valueSection.name;
    this.postSec.serviceArguments[2].argument = 'icon';
    this.postSec.serviceArguments[2].value = this.icon;
    this.postSec.serviceArguments[3].argument = 'enabled';
    this.postSec.serviceArguments[3].value = this.opcEnabled;
    this.postSec.serviceArguments[4].argument = 'nivel';
    this.postSec.serviceArguments[4].value = this.valueSection.nivel;
    this.postSec.serviceArguments[5].argument = 'smenu';
    this.postSec.serviceArguments[5].value = this.valueSection.smenu;
    this.postSec.serviceArguments[6].argument = 'order';
    this.postSec.serviceArguments[6].value = this.deploy.toString();
    this.postSec.serviceArguments[7].argument = 'gestion';
  }

  onNew() {
    this.parametros();
    this.validar();
    if (this.validar() === true) {
      this.postSec.serviceArguments[7].value = 'NEW';
      this.getAction.conSection(this.postSec).subscribe(
        (response:any) => {
          if (response.mesage === 'OK') {
            this.divEnabled = false;
            this.clean();
            this.ngOnInit();
            this.router.navigate(['/sections'], { relativeTo: this.route.parent });
            swal('Successful!', 'Secction creado con Exito', 'success');
          } else {
            swal('Advertencia!', 'Sección ya Existe. Verifique Información', 'warning');
          }
        },
        error => {
          console.log(<any>error);
        }
      )
    }

  }


  onUpdate() {
    this.parametros();
    this.validar();
    if (this.validar() === true) {
      this.postSec.serviceArguments[0].value = this.valueSection.id;
      this.postSec.serviceArguments[7].value = 'UPDATE';
      this.getAction.conSection(this.postSec).subscribe(
        (response:any) => {
          if (response.mesage === 'OK') {
            this.divEnabled = false;
            this.router.navigate(['/sections'], { relativeTo: this.route.parent });
            this.clean();
            swal('Successful!', 'Secction actualizado con Exito', 'success');
          } else {
            swal('Advertencia!', 'Sección ya Existe. Verifique Información', 'warning');
          }
        },
        error => {
          console.log(<any>error);
        }
      )
    }
  }

  validar(): boolean {
    this.msj = '';
    if (this.valueSection.nivel === 'II' && this.valueSection.smenu === '') {
      this.msj = 'Debe indicar Sub Menú (Nivel I). Verifique Información.'
      return false;
    }
    return true;
  }

  clean() {
    this.valueSection = new Section('', '', '', '', '');
    this.postSec = new GetActionSection('', '', '', '', [
      { 'argument': '', 'value': '' }, { 'argument': '', 'value': '' },
      { 'argument': '', 'value': '' }, { 'argument': '', 'value': '' },
      { 'argument': '', 'value': '' }, { 'argument': '', 'value': '' },
      { 'argument': '', 'value': '' }, { 'argument': '', 'value': '' }]);
    this.nivel = '';
    this.deploy = 1;
    this.submenu = '';
  }

  recibirDatos(event) {

    if (event !== null) {
      this.divEnabled = true;
      // tslint:disable-next-line:prefer-const
      let obj = JSON.parse(event);
      this.valueSection.id = obj['id'];
      this.valueSection.name = obj['section'];
      this.valueSection.enabled = obj['enabled'];
      this.opcEnabled = obj['enabled'];
      this.valueSection.nivel = obj['nivel'];
      this.nivel = obj['nivel'];
      this.valueSection.smenu = obj['smenu']
      this.submenu = obj['smenu']
      this.onChange();
    } else {
      this.divEnabled = false;
    }
  }

  onChange() {
    if (this.nivel === 'I') {
      this.disubmenu = false;
      this.submenu = '';
    } else {
      this.disubmenu = true;
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

  selIcon(icon) {
    this.icon = icon;
  }
}
