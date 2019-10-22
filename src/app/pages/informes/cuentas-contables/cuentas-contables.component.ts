import {Component, OnInit} from '@angular/core';
import {CuentaContableService} from './cuentas-contables.service'
import {NgbDateCustomParserFormatter} from 'app/pipes/date-format.pipe';
import swal from 'sweetalert2';
import {NgbDateParserFormatter, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';
import {MatDialog} from '@angular/material';
import {AsignacionCuentasContablesComponent} from './asignacion-cuentas-contables/asignacion-cuentas-contables.component';

@Component({
  selector: 'app-cuentas-contables',
  templateUrl: './cuentas-contables.component.html',
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
  ]
})
export class CuentasContablesComponent implements OnInit {

  fechaIni: any;

  dataVoucher = [];

  tipoCuenta = [
    {
      value: 'Debe',
      id: 'D'
    },
    {
      value: 'Haber',
      id: 'H'
    }
  ];

  constructor(
    private cuentasContablesServices: CuentaContableService,
    private formatoFecha: NgbDateCustomParserFormatter,
    private configDataPicker: NgbDatepickerConfig,
    public dialog: MatDialog,
  ) {
    /** (MS) - Recupera la fecha actual del sistema y se almacena en la variable fechaIni */
    const date = new Date();
    this.fechaIni = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    };

    this.buscar();
  }

  ngOnInit() {
    /** (MS) - Recupera la fecha actual del sistema y bloquea las fechas posteriores a esta en el campo de fecha */
    const currentDate = new Date();
    this.configDataPicker.maxDate = {year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate()};
    this.configDataPicker.outsideDays = 'hidden';
  }

  /** (MS) - Recupera los datos del voucher contable y se almacenan en al variable dataVoucher
   * @method getVoucher Metodo que se conecta con el RSUMB */
  buscar() {
    const fechaVoucher = this.formatoFechaString();
    this.cuentasContablesServices.getVoucher(fechaVoucher).subscribe((response: any) => {
      if (response.code !== '0') {
        $('.page-loading').css({ 'z-index': '-1', 'opacity': '0' });
        swal('Voucher Contable', 'Disculpe las molestias contactese con El Administrador :\n' + response.description, 'error');
      } else {
        this.dataVoucher = response.voucher;
        $('.page-loading').css({ 'z-index': '-1', 'opacity': '0' });
      }
    });
  }

  /** (MS) - Convierte la variable fechaIni en el formato fecha YYYYMMdd
   * @return fecha */
  formatoFechaString(): String {
    let dd = this.fechaIni.day.toString();
    let mm = this.fechaIni.month.toString();

    if (this.fechaIni.day < 10) {
      dd = '0' + this.fechaIni.day;
    }
    if (this.fechaIni.month < 10) {
      mm = '0' + this.fechaIni.month;
    }

    return this.fechaIni.year + mm + dd;
  }

  /** (MS) - Abre el componente tipo dialogo AsignacionCuentasContables */
  openAsignacion() {
    this.dialog.open(AsignacionCuentasContablesComponent, {width: '1000px', height: '750px'});
  }

  /** (MS) - Cambia los valores null por Sin definir
   * @param cellInfo Contiene los atributos y metodos de dxi-column */
  onEditorPreparingCC(cellInfo) {
    if (cellInfo.valueText === '') {
      return 'Sin definir';
    } else {
      return cellInfo.valueText;
    }
  }

  /** (MS) - Cambia las comas por puntos de las columnas tipo currency
   * @param cellInfo Contiene los atributos y metodos de dxi-column */
  onEditorPreparing(cellInfo) {
    const montoPositivo = cellInfo.valueText.replace(/-/g, '');
    const formatCurrency = new Intl.NumberFormat().format(Number(montoPositivo));
    return formatCurrency.toString().replace(/,/g, '.');
  }
}
