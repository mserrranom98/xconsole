import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { TerIU, RexSelect, SucSelect } from '../../../pages-models/model-emp-rec';

import { EmpRexsService } from '../../../pages-services/serv-emp-rec/emp-rexs.service';
import { SucursalesService } from '../../../pages-services/serv-emp-rec/sucursales.service';
import { TerminalesService } from '../../../pages-services/serv-emp-rec/terminales.service';
import { UtilsService } from '../../../pages-services/serv-utils/utils.service';
import { GetUtils } from '../../../pages-models/model-utils';
import { VAR_TER } from './terminales.component';

@Component({
  selector: 'app-terminales-properties',
  templateUrl: './terminales-properties.component.html',
  styles: []
})
export class TerminalesPropertiesComponent implements OnInit {
  @ViewChild('f') f: NgForm;
  divEnabled = false;
  disabled = false;
  terIU: TerIU;
  rexSelect: RexSelect;
  sucSelect: SucSelect;
  rows = [];
  montos = [];
  autorizacion = [];
  listEmpRex: any[];
  listSucursal: any[];
  divMon = false;
  divAut = false;
  mon: {
    'medioPago': string,
    'monto': string,
  };
  aut: {
    'medioPago': string,
    'monto': string,
  };
  editingMon = {};
  editingAut = {};
  msjMon = '';
  msjAut = '';

  medioPago: GetUtils;
  listMP = [];
  constructor(
    private empRexsService: EmpRexsService,
    private sucursalesService: SucursalesService,
    private terminalesService: TerminalesService,
    private utilsService: UtilsService,
    private router: Router
  ) {
    this.terIU = new TerIU('', '', '', '', '', '', '', '', '', '', {
      'cajero': '', 'referencias': '',
      autorizacionLimites: [{ medioPago: '', monto: '' }], montosLimites: [{ medioPago: '', monto: '' }]
    });
    this.rexSelect = new RexSelect('', '');
    this.sucSelect = new SucSelect('', '', '');
    this.medioPago = new GetUtils('', '');
  }

  ngOnInit() {
    if (this.router.url === '/er/configuracion/terminal/new') {
      this.divEnabled = true;
      this.terIU.rex = VAR_TER.rex;
      this.sucSelect.rex = VAR_TER.rex;
      this.terIU.sucursal = VAR_TER.suc;
      this.sucursal();
    } else {
      this.divEnabled = false;
    }

    // Empresa(REX)
    this.empRexsService.getRex().subscribe(
      (response: any) => {
        this.listEmpRex = response.rexs;
      }
    )

    // Medios de Pago
    this.utilsService.getMedioPago().subscribe(
      (response: any) => {
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
      this.terIU.rex = obj['rex'];
      this.rexSelect = obj['rex'];
      this.sucSelect.rex = obj['rex'];
      this.sucursal();
      this.rexSelect = obj['rex'];
      this.terIU.rex = obj['rex'];
      this.terIU.sucursal = obj['sucursal'];
      this.terIU.terminal = obj['terminal'];
      this.terIU.saf = obj['saf'];
      this.terIU.ubicacion = obj['ubicacion'];
      this.terIU.bloqueado = obj['bloqueado'];
      this.terIU.descripcion = obj['descripcion'];
      this.terIU.numeroCaja = obj['numeroCaja'];
      this.terIU.properties = obj['properties'];
      this.rows = obj['properties'];
      this.montos = this.rows['montosLimites'];
      this.autorizacion = this.rows['autorizacionLimites'];
    } else {
      this.divEnabled = true;
    }
  }

  sucursal() {
    this.listSucursal = [];
    this.sucursalesService.getSuc(this.sucSelect.rex).subscribe(
      (response: any) => {
        this.listSucursal = response.sucursales;
      }
    )
  }

  nuevoAutorizacion() {
    this.divAut = true;
    this.aut = { medioPago: '', monto: '' };
  }

  cancelAutorizacion() {
    this.divAut = false;
    this.aut = { medioPago: '', monto: '' };
  }

  nuevoMonto() {
    this.divMon = true;
    this.mon = { medioPago: '', monto: '' };
  }

  cancelMonto() {
    this.divMon = false;
    this.mon = { medioPago: '', monto: '' };
  }

  updateMonValue(event, cell, rowIndex) {
    this.editingMon[rowIndex + '-' + cell] = false;
    this.montos[rowIndex][cell] = event.target.value;
    this.rows = [...this.montos];
  }

  updateAutValue(event, cell, rowIndex) {
    this.editingAut[rowIndex + '-' + cell] = false;
    this.autorizacion[rowIndex][cell] = event.target.value;
    this.rows = [...this.autorizacion];
  }

  onEliminar(rowIndex) {
    this.montos.splice(rowIndex, 1);
    this.rows['montosLimites'] = [...this.montos];
    this.montos = this.rows['montosLimites'];
  }

  onEliminarAut(rowIndex) {
    this.autorizacion.splice(rowIndex, 1);
    this.rows['autorizacionLimites'] = [...this.autorizacion];
    this.autorizacion = this.rows['autorizacionLimites'];
  }

  addMon() {
    const medio = JSON.stringify(this.mon.medioPago).replace(/['"]+/g, '');
    if (this.mon.medioPago === '' || this.mon.monto === '') {
      this.msjMon = 'Verifique Información';
    } else {
      this.msjMon = '';
    }

    if (this.msjMon === '') {
    let add = 'OK'
      for (let i = 0; i < this.montos.length; i++) {
        if (medio === this.montos[i].medioPago) {
          swal('Límite', 'Medio de pago ya existe', 'error');
          add = 'NOK';
        }
      }
      if (add === 'OK') {
        this.montos.push(this.mon);
        this.rows['montosLimites'] = [...this.montos];
        this.montos = this.rows['montosLimites'];
        this.mon = { medioPago: '', monto: '' };
        this.divMon = false;
        this.terIU.properties.montosLimites = this.rows['montosLimites']
      }
    }
  }

  addAut() {
    const medio = JSON.stringify(this.aut.medioPago).replace(/['"]+/g, '');
    if (this.aut.medioPago === '' || this.aut.monto === '') {
      this.msjAut = 'Verifique Información';
    } else {
      this.msjAut = '';
    }

    if (this.msjAut === '') {
      let add = 'OK'
      for (let i = 0; i < this.autorizacion.length; i++) {
        if (medio === this.autorizacion[i].medioPago) {
          swal('Límite', 'Medio de pago ya existe', 'error');
          add = 'NOK';
        }
      }
      if (add === 'OK') {
        this.autorizacion.push(this.aut);
        this.rows['autorizacionLimites'] = [...this.autorizacion];
        this.autorizacion = this.rows['autorizacionLimites'];
        this.aut = { medioPago: '', monto: '' };
        this.divAut = false;
        this.terIU.properties.autorizacionLimites = this.rows['autorizacionLimites']
      }
    }
  }

  guardar() {
    VAR_TER.rex = this.terIU.rex;
    VAR_TER.suc = this.terIU.sucursal;
    this.terminalesService.updateTer(this.terIU).subscribe(
      (response: any) => {
        if (response.code === '0') {
          swal('Terminales', 'Registro Actualizado con Exito', 'success');
          this.limpiar();
        } else {
          swal('Terminales', response.description, 'error');
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )
  }

  limpiar() {
    this.mon = { medioPago: '', monto: '' };
    this.aut = { medioPago: '', monto: '' };
    this.divMon = false;
    this.divAut = false;
    this.divEnabled = false;
    this.router.navigate(['/er/configuracion/terminal']);
  }

  onVolver() {
    this.divMon = false;
    this.divAut = false;
    this.divEnabled = false;
    VAR_TER.rex = this.terIU.rex;
    VAR_TER.suc = this.terIU.sucursal;
    this.router.navigate(['/er/configuracion/terminal']);
  }

}
