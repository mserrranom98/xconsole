import {Component, OnInit} from '@angular/core';
import {OperacionesService} from '../../../../pages-services/serv-general/operaciones.service';
import swal from 'sweetalert2';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material';
import {FolioOperacionesComponent} from './folio-operaciones/folio-operaciones.component';
import {EmpresasService} from '../../../../../shared/services/empresas/empresas.service';

@Component({
  selector: 'app-operaciones',
  templateUrl: './operaciones.component.html'
})

export class OperacionesComponent implements OnInit {

  operaciones = [];

  noDataText = 'No hay datos que mostrar';

  constructor(
    private route: ActivatedRoute,
    private operacionesService: OperacionesService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['fi'] != null && params['fi'] !== 'undefined') {
        $('.page-loading').css({'z-index': '999', 'opacity': '1'});
        const filterOpe = JSON.parse(params['fi']);
        this.getOperaciones(filterOpe);
      } else {
        const filterOpe = [{
          startDate: this.formatoFechaString('00:00:00'),
          endDate: this.formatoFechaString('23:59:59'),
          rex: '',
          eps: '',
          terminalList: [],
          sucursalList: [],
          tipoList: [],
          estadoList: [],
          instrumentoList: [],
          mpList: [],
          contexto: [],
          userName: '',
          peticion: '',
          moneda: ''
        }];
        this.getOperaciones(filterOpe[0]);
      }
    });
  }

  getOperaciones(filter) {
    this.operacionesService.getOperaciones(filter).subscribe((response: any) => {
      if (response.code !== '0') {
        swal('Operaciones', 'Disculpe las molestias contactese con El Administrador :\n' + response.description, 'error');
        console.log(response);
        $('#loading').css('display', 'none');
        $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
      } else {
        console.log(response);
        this.agregarGrupo(response.operaciones);
        $('.page-loading').css({'z-index': '-1', 'opacity': '0'});
      }
    }, error => {
      console.log(error);
    });
  }

  agregarGrupo(response) {
    this.operaciones = [];
    for (const operacion of response) {
      const operacionArray = {
        operacion: operacion.operacion,
        rexGlosa: operacion.rex,
        sucursalGlosa: operacion.sucursal,
        terminalGlosa: operacion.terminal,
        usuario: operacion.usuario,
        turno: operacion.turno,
        fechaRegistro: operacion.registro,
        fechaRecaudacion: operacion.recaudacion,
        monto: operacion.monto,
        tipoGlosa: operacion.tipo,
        estadoGlosa: operacion.estado,
        folio: operacion.folio,
        detalle: operacion.detalle,
        moneda: operacion.moneda,
        conversion: operacion.conversion,
        total: operacion.total,
        grupo: operacion.rex + '|' + operacion.sucursal + '|' + operacion.terminal
      };

      this.operaciones.push(operacionArray);
    }
  }

  openDetalle(event): any {
    if (!event.data.key) {
      const data = {
        operacion: event.data.operacion,
        turno: event.data.turno,
        usuario: event.data.usuario,
        tipoGlosa: event.data.tipoGlosa,
        folio: event.data.folio,
        userName: '',
        peticion: ''
      };
      this.dialog.open(FolioOperacionesComponent, {width: '700px', height: 'auto', maxHeight: '750px', data: data});
    }
  }

  /** (MS) - Cambia las comas por puntos de las columnas tipo currency
   * @param cellInfo Contiene los atributos y metodos de dxi-column */
  onEditorPreparing(cellInfo) {
    return cellInfo.valueText !== '' ? cellInfo.valueText.toString().replace(/,/g, '.') : '';
  }

  /** (MS) - Cambia las comas por puntos de las columnas tipo grupo
   * @param cellInfo Contiene los atributos y metodos de dxi-column */
  onEditorPreparingGroup(cellInfo) {
    const arraySplit = cellInfo.valueText.split('|');
    return `
      <label style="width: 80%">
        <div class="row">
          <div class="col">
            <label style="font-weight: bold">Rex:  </label>
            <label>` + arraySplit[0] + `</label>
          </div>
          <div class="col">
            <label style="font-weight: bold;padding-right: 5%">Sucursal:</label><label>` + arraySplit[1] + `</label>
          </div>
          <div class="col">
            <label style="font-weight: bold;padding-right: 5%">Terminal:</label>
            <label>` + arraySplit[2] + `</label>
          </div>
          <div class="col">
            <label style="font-weight: bold;padding-right: 5%"></label>
            <label></label>
          </div>
        </div>
      </label>
    `;
  }

  /** (RB) - Cambia el formato del detalle o moneda
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

  /** (RB) - Diseña el formato que tendra el archivo Excel
   * @param options Recibe los datos de linea por linea */
  customizeExcelCell(options) {
    const gridCell = options.gridCell;
    if (!gridCell) {
      return;
    }

    if (gridCell.rowType === 'header') {
      options.backgroundColor = '#66badf';
    }

    if (gridCell.rowType === 'group') {
      if (gridCell.groupIndex === 0) {
        options.backgroundColor = '#b2dcef';
      }

      if (gridCell.column.dataField === 'grupo') {
        const arraySplit = gridCell.value.split('|');
        options.value = ' Rex: ' + arraySplit[0] + '               ' + 'Sucursal: ' + arraySplit[1] + '               ' + 'Terminal: ' + arraySplit[2];
      }

    }

    if (gridCell.rowType === 'data') {
      if (gridCell.column.dataField === 'detalle') {
        const arraySplit = gridCell.value.split('|');
        let returnText = '';
        for (const string of arraySplit) {
          if (string !== ' ') {
            returnText = returnText + '\n' + string.trim();
          }
        }

        const valor = returnText;

        options.value = `${valor}`;
        options.font.bold = false;
      }
    }
  }

  /** (MS) - Devuelve un string fecha actual con el formato YYYY-MM-dd hh:mm:ss
   * @return fecha */
  formatoFechaString(hora: string): String {
    const date = new Date();
    const fecha = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    };
    let dd = fecha.day.toString();
    let mm = fecha.month.toString();

    if (fecha.day < 10) {
      dd = '0' + fecha.day;
    }
    if (fecha.month < 10) {
      mm = '0' + fecha.month;
    }

    return fecha.year + '-' + mm + '-' + dd + ' ' + hora;
  }
}
