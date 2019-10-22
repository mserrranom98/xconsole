import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { CardinalidadI } from '../../../../pages-models/model-general';
import { RexSelect } from '../../../../pages-models/model-emp-rec';
import { GetUtils } from '../../../../pages-models/model-utils';
import { EmpRexsService } from '../../../../pages-services/serv-emp-rec/emp-rexs.service';
import { CardinalidadmpService } from '../../../../pages-services/serv-general/cardinalidadmp.service';
import { UtilsService } from '../../../../pages-services/serv-utils/utils.service';

@Component({
  selector: 'app-carnidalidadmp-properties',
  templateUrl: './carnidalidadmp-properties.component.html',
  styles: []
})
export class CarnidalidadmpPropertiesComponent implements OnInit {

  divEnabled = false;
  cardinalidadI: CardinalidadI;
  rexSelect: RexSelect;
  listEps: any[];
  utils: GetUtils;
  medioPago = [];
  msj = '';

  constructor(
    private router: Router,
    private empRexsService: EmpRexsService,
    private cardinalidadmpService: CardinalidadmpService,
    private utilsService: UtilsService
  ) {
    this.cardinalidadI = new CardinalidadI('', '', '', '', '', '', '');
    this.rexSelect = new RexSelect('', '');
    this.utils = new GetUtils('', '');
  }

  ngOnInit() {
    if (this.router.url === '/general/ticketrecaudacion/configuracion/cardinalidad/new') {
      this.divEnabled = true;
    } else {
      this.divEnabled = false;
    }

    // Empresas EPS
    this.utilsService.getEmpEps().subscribe(
      (response: any) => {
        const dir = response.rowCount;
        if (dir > 0) {
          this.listEps = response.rows;
        }
      },
      error => {
        console.log('Error: ' + JSON.stringify(error));
      }
    )

    // Medios de Pago
    this.utilsService.getMedioPago().subscribe(
      (response: any) => {
        this.medioPago = response.rows
      }
    )
    $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
  }

  guardar() {
    this.validar();
    if (this.validar() === true) {
      this.cardinalidadmpService.cardInsert(this.cardinalidadI).subscribe(
        (response:any) => {
          if (response.code === '0') {
            swal('Cardinalidad', 'Registro Exitoso', 'success');
            this.divEnabled = false;
            this.router.navigate(['/general/ticketrecaudacion/configuracion/cardinalidad']);
          } else {
            swal('Cardinalidad', response.description, 'error');
          }
        },
        error => {
          console.log('Error: ' + JSON.stringify(error));
        }
      )
    }
  }

  onVolver() {
    this.cardinalidadI = new CardinalidadI('', '', '', '', '', '', '');
    this.divEnabled = false;
    this.router.navigate(['/general/ticketrecaudacion/configuracion/cardinalidad']);
  }

  validar(): boolean {

    if (this.cardinalidadI.medioPago2 !== '' && this.cardinalidadI.cardinalidadMedioPago2 === '') {
      this.msj = 'Medio de Pago 2. Verifique Información';
      return false;
    } else if (this.cardinalidadI.medioPago2 === '' && this.cardinalidadI.cardinalidadMedioPago2 !== '') {
      this.msj = 'Medio de Pago 2. Verifique Información';
      return false;
    } else {
      this.msj = '';
    }
    return true;
  }


}
