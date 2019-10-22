import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FolioOperacionesComponent} from '../../operaciones/folio-operaciones/folio-operaciones.component';
import {MatDialog} from '@angular/material';
import {TurnosService} from '../../../../../pages-services/serv-general/turnos.service';

@Component({
  selector: 'app-turno-ope',
  templateUrl: './turno-ope.component.html'
})
export class TurnoOpeComponent implements OnInit {

  operaciones = [];

  @Input() busqueda: any;
  @Output() view = new EventEmitter<boolean>();

  constructor(
    private turnosService: TurnosService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getOperacionesTurno(this.busqueda);
  }

  getOperacionesTurno(data) {
    this.turnosService.getTurnosDetalle(data).subscribe((response: any) => {
      if (response.code === '0') {
        console.log(response);
        this.operaciones = response.rows;
      } else {
        console.log(response);
      }
    }, error => {
      console.log(error);
    });
  }

  openDetalle(event): any {
    if (!event.data.key) {
      const data = {
        operacion: event.data.operacion,
        turno: this.busqueda.turno,
        usuario: this.busqueda.usuario,
        tipoGlosa: event.data.tipoGlosa,
        userName: '',
        peticion: ''
      };
      this.dialog.open(FolioOperacionesComponent, {width: '700px', height: 'auto', maxHeight: '750px', data: data});
    }
  }

  /** (MS) - Cambia las comas por puntos de las columnas tipo currency
   * @param cellInfo Contiene los atributos y metodos de dxi-column */
  onEditorPreparing(cellInfo) {
    const montoPositivo = cellInfo.valueText.replace(/-/g, '');
    const formatCurrency = new Intl.NumberFormat().format(Number(montoPositivo));
    return formatCurrency.toString().replace(/,/g, '.');
  }

  volver() {
    this.view.emit(true);
  }

}
