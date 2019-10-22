import {Component, OnInit} from '@angular/core';
import {NgbDateParserFormatter, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateCustomParserFormatter} from '../../../../../pipes/date-format.pipe';
import {EmpRexsService} from '../../../../pages-services/serv-emp-rec/emp-rexs.service';
import {SucursalesService} from '../../../../pages-services/serv-emp-rec/sucursales.service';
import {TurnosService} from '../../../../pages-services/serv-general/turnos.service';
import swal from 'sweetalert2';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {MatDialog} from '@angular/material';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
  ]
})
export class TurnosComponent implements OnInit {
  turnoData = [];

  listTurno = true;

  busqueda: any;

  noDataText = 'No hay datos que mostrar';

  constructor(
    private route: ActivatedRoute,
    private turnosService: TurnosService,
    public dialog: MatDialog,
  ) {
    this.route.params.subscribe(params => {
      if (params['fi'] != null && params['fi'] !== 'undefined') {
        $('.page-loading').css({'z-index': '999', 'opacity': '1'});
        const filterTur = JSON.parse(params['fi']);
        this.getTurnos(filterTur);
      }
    });

    $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
  }

  ngOnInit() {
  }

  getTurnos(filter) {
    this.turnosService.getTurnos(filter).subscribe((response: any) => {
      if (response.code === '0') {
        this.turnoData = response.aturnos;
        console.log(this.turnoData)
      } else {
        swal('Turnos', response.description + '. Verifique Servidor Netswitch', 'error');
      }
    }, error => {
      console.log(error);
    });
  }

  openDetalle(event) {
    if (!event.data.key) {
      this.listTurno = false;
      this.busqueda = {
        usuario: event.data.usuario,
        turno: event.data.turno
      };
    }
  }

  /** (MS) - Cambia las comas por puntos de las columnas tipo estado
   * @param cellInfo Contiene los atributos y metodos de dxi-column */
  onEditorPreparingEstado(cellInfo) {
    if (cellInfo.valueText === 'S') {
      return 'Abierto';
    } else {
      return 'Cerrado';
    }
  }

  mostrarLista(event) {
    this.listTurno = event;
  }

  /** (MS) - Cambia las comas por puntos de las columnas tipo currency
   * @param cellInfo Contiene los atributos y metodos de dxi-column */
  onEditorPreparing(cellInfo) {
    const montoPositivo = cellInfo.valueText.replace(/-/g, '');
    return montoPositivo.replace(/,/g, '.');
  }

  /** (RB) - Cambia el formato de apertura, total y cierre
   * @param cellInfo Contiene los atributos y metodos de dxi-column */
  onEditorPreparingDetalle(cellInfo) {
    const arraySplit = cellInfo.valueText.split('|');
    let returnText = '';
    for (const string of arraySplit) {
      if (string !== ' ') {
        returnText = returnText + '<br/>' + string.trim();
      }
    }
    return returnText.substring(5);
  }
}
