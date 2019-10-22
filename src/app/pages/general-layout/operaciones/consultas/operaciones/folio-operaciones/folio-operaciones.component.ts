import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {OperacionesService} from '../../../../../pages-services/serv-general/operaciones.service';
import swal from 'sweetalert2';
import {DetalleOperacionesComponent} from '../detalle-operaciones/detalle-operaciones.component';

@Component({
  selector: 'app-folio-operaciones',
  templateUrl: './folio-operaciones.component.html'
})
export class FolioOperacionesComponent implements OnInit {

  folio = {
    tipoglosa: '',
    folio: ''
  };

  operaciones = [];

  constructor(
    private operacionesService: OperacionesService,
    public dialogRef: MatDialogRef<FolioOperacionesComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
  ) {
    this.folio.folio = data.folio;
    this.folio.tipoglosa = data.tipoGlosa;

    this.getOperacionDetalle(data);
  }

  ngOnInit() {
  }

  getOperacionDetalle(folio) {
    this.operacionesService.getOperacionesII(folio).subscribe((response: any) => {
      if (response.code === '0') {
        const datao = [];
        for (let i = 0; i < response.rowCount; i++) {
          let detDesc = ''
          if (response.rows[i].detalle === '-1') {
            detDesc = '(FALTANTE)';
          } else if (response.rows[i].detalle === '-2') {
            detDesc = '(SOBRANTE)';
          } else if (response.rows[i].detalle === '-3') {
            detDesc = '(POSITIVO)';
          } else if (response.rows[i].detalle === '-4') {
            detDesc = '(NEGATIVO)';
          } else {
            detDesc = '';
          }

          const opc = {
            calidadGlosa: response.rows[i].calidadGlosa,
            detalle: response.rows[i].detalle,
            instrumento: response.rows[i].instrumento,
            instrumentoGlosa: response.rows[i].instrumentoGlosa + ' ' + detDesc,
            monto: response.rows[i].monto
          };
          datao.push(opc);
        }
        this.operaciones = datao;
      } else {
        swal('Operaciones', 'Disculpe las molestias contactese con El Administrador :\n' + response.description, 'error');
        $('#loading').css('display', 'none');
      }
    });
  }

  openDetalle(event) {
    console.log(event);
    const data = {
      usuario: this.data.usuario,
      turno: this.data.turno,
      operacion: this.data.operacion,
      detalle: event.data.detalle,
      instrumento: event.data.instrumento,
      instrumentoGlosa: event.data.instrumentoGlosa,
      userName: '',
      peticion: ''
    };

    this.dialog.open(DetalleOperacionesComponent, {width: '500px', height: 'auto', maxHeight: '750px', data: data});
  }

  /** (MS) - Cambia las comas por puntos de las columnas tipo currency
   * @param cellInfo Contiene los atributos y metodos de dxi-column */
  onEditorPreparing(cellInfo) {
    const montoPositivo = cellInfo.valueText.replace(/-/g, '');
    const formatCurrency = new Intl.NumberFormat().format(Number(montoPositivo));
    return formatCurrency.toString().replace(/,/g, '.');
  }

  /** (MS) - Cerrar el componente tipo dialogo */
  cerrar() {
    this.dialogRef.close();
  }

}
