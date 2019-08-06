import {Component, OnInit} from '@angular/core';
import {VoucherExport, VoucherSelect} from './model-cuentasContables';
import {CuentaContableService} from './cuentas-contables.service'
import {NgbDateCustomParserFormatter} from 'app/pipes/date-format.pipe';
import swal from 'sweetalert2';
import {NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import {MatDialog} from '@angular/material';
import {AsignacionCuentasContablesComponent} from './asignacion-cuentas-contables/asignacion-cuentas-contables.component';
import {FormControl} from '@angular/forms';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Component({
  selector: 'app-cuentas-contables',
  templateUrl: './cuentas-contables.component.html',
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
  ]
})
export class CuentasContablesComponent implements OnInit {
  fechaIni: NgbDateStruct;

  datosVoucher: VoucherSelect;
  exportarVou: VoucherExport;

  dataVoucher = [];
  dataFilterVoucher = [];

  controlFilter = new FormControl();

  nuevo = false;

  constructor(
    private cuentasContablesServices: CuentaContableService,
    private formatoFecha: NgbDateCustomParserFormatter,
    private configDataPicker: NgbDatepickerConfig,
    public dialog: MatDialog,
  ) {
    this.datosVoucher = new VoucherSelect('', '', '');
    this.exportarVou = new VoucherExport('', '', '');
  }

  ngOnInit() {
    const currentDate = new Date();
    this.configDataPicker.maxDate = {year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate()};
    this.configDataPicker.outsideDays = 'hidden';

    this.controlFilter.valueChanges.pipe().subscribe(value => {
      if (value) {
        console.log(value);
        value = value.toString().toLowerCase();
        this.dataFilterVoucher = this.dataVoucher.filter((item) => item.cuentaContable.toString().toLowerCase().indexOf(value) !== -1);
      } else {
        console.log(value);
        this.dataFilterVoucher = this.dataVoucher;
      }
    });
  }

  buscar() {
    if (this.fechaIni) {
      this.cuentasContablesServices.getVoucher(this.formatoFechaString()).subscribe((response: any) => {
        if (response.code !== '0') {
          swal('Voucher Contable', 'Disculpe las molestias contactese con El Administrador :\n' + response.description, 'error');
          $('#loading').css('display', 'none');
        } else {
          this.dataVoucher = response.voucher;
          this.dataFilterVoucher = this.dataVoucher;
        }
      });
    } else {
      swal('Voucher Contable', 'Por favor, ingresar una fecha para realizar la busqueda', 'warning');
    }
  }

  exportarXLSX() {
    const ws = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.sheet_add_json(ws, this.dataVoucher, {origin: 'A1'});

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Voucher');

    ws['!cols'] = [{width: 18}, {width: 18}, {width: 18}, {width: 18}, {width: 18},
      {width: 25}, {width: 25}, {width: 18}, {width: 18}, {width: 18}, {width: 18}];

    const workbook: XLSX.WorkBook = {Sheets: {'Voucher': ws}, SheetNames: ['Voucher']};
    const excelBuffer: any = XLSX.write(workbook, {bookType: 'xlsx', type: 'array', cellDates: true, cellStyles: true});

    this.saveAsExcelFile(excelBuffer, 'Voucher' + this.datosVoucher.fechacons);


    this.buscar();
    swal('Operaciones', 'Ha sido correcta la exportación de operaciones :', 'success');
    $('#loading').css('display', 'none');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  formatoFechaString(): string {
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

  exportar() {
    this.exportarVou.fechacons = this.datosVoucher.fechacons;
    this.cuentasContablesServices.getExportVoucher(this.exportarVou).subscribe((response: any) => {
      if (response.code !== '0') {
        swal('Exportar', 'Disculpe las molestias contactese con El Administrador :\n' + response.description, 'error');
        $('#loading').css('display', 'none');
      } else {
        swal('Voucher', 'Exportado con Exito', 'success');
      }
    });
  }

  openAsignacion() {
    this.dialog.open(AsignacionCuentasContablesComponent, {width: '1000px', height: '750px'});
  }
}
