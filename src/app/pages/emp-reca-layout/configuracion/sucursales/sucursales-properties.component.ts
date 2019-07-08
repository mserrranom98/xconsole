import { Component, OnInit, ViewChild, Input } from '@angular/core';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SucIU, RexSelect } from '../../../pages-models/model-emp-rec';
import { EmpRexsService } from '../../../pages-services/serv-emp-rec/emp-rexs.service';
import { SucursalesService } from '../../../pages-services/serv-emp-rec/sucursales.service';
import { UtilsService } from '../../../pages-services/serv-utils/utils.service';
import { GetUtils } from '../../../pages-models/model-utils';
import { SucursalesComponent, VAR_SUC } from './sucursales.component';

@Component({
  selector: 'app-sucursales-properties',
  templateUrl: './sucursales-properties.component.html',
  styles: []
})

export class SucursalesPropertiesComponent implements OnInit {
  @ViewChild('f') f: NgForm;
  divEnabled = false;
  sucIU: SucIU;
  listEmpRex: any[];
  rexSelect: RexSelect;
  rows = [];
  limites = [];
  editing = {};
  lim: {
    'medioPago': string,
    'monto': string,
  }
  divLim = false;
  disabled = false;
  msjRex = '';
  msjLim = '';
  medioPago: GetUtils;
  listMP = [];
  closeResult = '';
  gestion = '';

  constructor(
    private empRexsService: EmpRexsService,
    private sucursalesService: SucursalesService,
    private utilsService: UtilsService,
    private router: Router,
    private modalService: NgbModal
  ) {
    this.sucIU = new SucIU('', '', '', '', '', {
      'email': '', montosLimites: [
        { medioPago: '', monto: '' },
      ], 'referencias': '', 'responsable': ''
    });

    this.rexSelect = new RexSelect('', '');
    this.lim = { medioPago: '', monto: '' };
    this.medioPago = new GetUtils('', '');
  }

  ngOnInit() {
    if (this.router.url === '/er/configuracion/sucursal/new') {
      this.divEnabled = true;
      this.gestion = 'new';
      this.sucIU.rex = VAR_SUC.rex;
    } else {
      this.divEnabled = false;
      this.gestion = 'edit';
    }
    this.buscar();
  }

  buscar() {
    // Empresas Rex
    this.empRexsService.getRex(this.rexSelect).subscribe(
      (response:any) => {
        this.listEmpRex = response.rexs;
      }
    )

    // Medios de Pago
    this.utilsService.getMedioPago(this.medioPago).subscribe(
      (response:any) => {
        this.listMP = response.rows;
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
  }

  recibirDatos(event) {
    if (event !== null) {
      this.divEnabled = true;
      this.disabled = true;
      // tslint:disable-next-line:prefer-const
      let obj = JSON.parse(event);
      this.sucIU.rex = obj['rex'];
      this.sucIU.sucursal = obj['sucursal'];
      this.sucIU.descripcion = obj['descripcion'];
      this.sucIU.properties = obj['properties'];
      this.rows = obj['properties'];
      this.limites = this.rows['montosLimites'];
    } else {
      this.divEnabled = true;
    }
  }

  editar(rowIndex) {
    const obj = this.limites[rowIndex];
  }

  nuevo() {
    this.divLim = true;
    this.lim = { medioPago: '', monto: '' };
  }

  updateValue(event, cell, rowIndex) {
    this.editing[rowIndex + '-' + cell] = false;
    this.limites[rowIndex][cell] = event.target.value;
    this.rows = [...this.limites];
  }

  onEliminar(rowIndex) {
    this.limites.splice(rowIndex, 1);
    this.rows['montosLimites'] = [...this.limites];
    this.limites = this.rows['montosLimites'];
  }

  addLim() {
    const medio = JSON.stringify(this.lim.medioPago).replace(/['"]+/g, '');

    if (this.lim.medioPago === '' || this.lim.monto === '') {
      this.msjLim = 'Verifique Información';
    } else {
      this.msjLim = '';
    }

    if (this.msjLim === '') {
      let add = 'OK'
      for (let i = 0; i < this.limites.length; i++) {
        if (medio === this.limites[i].medioPago) {
          swal('Límite', 'Medio de pago ya existe', 'error');
          add = 'NOK';
        }
      }
      if (add === 'OK') {
        this.limites.push(this.lim);
        this.rows['montosLimites'] = [...this.limites];
        this.limites = this.rows['montosLimites'];
        this.lim = { medioPago: '', monto: '' };
        this.divLim = false;
      }
    }
  }

  cancel() {
    this.limpiar();
  }

  onVolver() {
    this.divEnabled = false;
    VAR_SUC.rex = this.sucIU.rex;
    this.router.navigate(['/er/configuracion/sucursal']);
  }

  guardar() {
    VAR_SUC.rex = this.sucIU.rex;
    if (this.rows['montosLimites'] !== undefined) {
      this.sucIU.properties.montosLimites = this.rows['montosLimites'];
    }
    if (this.gestion === 'new') {
      console.log(JSON.stringify(this.sucIU));
      this.sucursalesService.insertSuc(this.sucIU).subscribe(
        (response:any) => {
          console.log(JSON.stringify(response));
          if (response.code === '0') {
            swal('Sucursales', 'Registro guardado con Exito', 'success');
            this.limpiar();
          } else {
            swal('Sucursales', response.description, 'error');
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    } else {
      console.log(JSON.stringify(this.sucIU));
      this.sucursalesService.updateSuc(this.sucIU).subscribe(
        (response:any) => {
          console.log(JSON.stringify(response));
          if (response.code === '0') {
            swal('Sucursales', 'Registro Actualizado con Exito', 'success');
            this.limpiar();
          } else {
            swal('Sucursales', response.description, 'error');
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }

  }

  validar(): boolean {
    if (this.sucIU.rex === '') {
      this.msjRex = 'Empresa Invalida';
      return false;
    }
    return true;
  }

  limpiar() {
    this.lim = { medioPago: '', monto: '' };
    this.divLim = false;
    this.msjRex = '';
    this.divEnabled = false;
    this.router.navigate(['/er/configuracion/sucursal']);
  }

  open(content) {
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
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

}
